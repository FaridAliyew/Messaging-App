import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation {
  participants: Types.ObjectId[];
  participantsKey: string;
  lastMessage?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversationDocument extends IConversation, Document {}

const conversationSchema = new Schema<IConversationDocument>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    participantsKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 });

export const Conversation = model<IConversationDocument>(
  'Conversation',
  conversationSchema
);
export default Conversation;
