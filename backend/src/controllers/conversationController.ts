import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import User from '../models/User';
import { sendMessageSchema } from '../validators/messageSchemas';

export const getOrCreateConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipientId } = req.body;

    if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
      res.status(400).json({
        error: { message: 'Invalid recipient ID' },
      });
      return;
    }

    const currentUserId = req.user!._id.toString();

    if (recipientId === currentUserId) {
      res.status(400).json({
        error: { message: 'Cannot start a conversation with yourself' },
      });
      return;
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404).json({
        error: { message: 'Recipient not found' },
      });
      return;
    }

    // Build atomic unique participantsKey (e.g. "<idA>_<idB>")
    const participantsKey = [currentUserId, recipientId].sort().join('_');

    // Atomic find-and-modify upsert to prevent duplicate conversations under race conditions
    const conversation = await Conversation.findOneAndUpdate(
      { participantsKey },
      {
        $setOnInsert: {
          participants: [req.user!._id, recipient._id],
          participantsKey,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )
      .populate('participants', '-password')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: '-password' },
      });

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const listMyConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const conversations = await Conversation.find({
      participants: req.user!._id,
    })
      .sort({ updatedAt: -1 })
      .populate('participants', '-password')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: '-password' },
      });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: { message: 'Invalid conversation ID format' },
      });
      return;
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      res.status(404).json({
        error: { message: 'Conversation not found' },
      });
      return;
    }

    // Strict authorization: user must be in participants
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user!._id.toString()
    );

    if (!isParticipant) {
      res.status(403).json({
        error: { message: 'Access denied to this conversation' },
      });
      return;
    }

    // Pagination: default 50 newest messages, capped at 100
    const rawLimit = parseInt(req.query.limit as string, 10);
    const limit = isNaN(rawLimit) ? 50 : Math.min(Math.max(1, rawLimit), 100);

    const filter: Record<string, any> = { conversation: id };

    if (req.query.before) {
      const beforeDate = new Date(req.query.before as string);
      if (isNaN(beforeDate.getTime())) {
        res.status(400).json({
          error: { message: 'Invalid before date format. Must be an ISO date string.' },
        });
        return;
      }
      filter.createdAt = { $lt: beforeDate };
    }

    // Fetch newest-first internally, then reverse so client receives ascending chronological order
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', '-password');

    const chronologicalMessages = messages.reverse();

    res.status(200).json(chronologicalMessages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: { message: 'Invalid conversation ID format' },
      });
      return;
    }

    const validatedData = sendMessageSchema.parse(req.body);

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      res.status(404).json({
        error: { message: 'Conversation not found' },
      });
      return;
    }

    // Strict authorization: user must be in participants
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user!._id.toString()
    );

    if (!isParticipant) {
      res.status(403).json({
        error: { message: 'Access denied to this conversation' },
      });
      return;
    }

    const message = await Message.create({
      conversation: id,
      sender: req.user!._id,
      content: validatedData.content,
    });

    conversation.lastMessage = message._id as any;
    conversation.updatedAt = new Date();
    await conversation.save();

    await message.populate('sender', '-password');

    res.status(201).json(message);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: {
          message: error.errors[0]?.message || 'Validation failed',
          details: error.errors,
        },
      });
      return;
    }
    next(error);
  }
};
