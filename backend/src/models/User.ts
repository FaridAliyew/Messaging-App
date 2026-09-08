import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  password?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    displayName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function () {
  if (!this.displayName) {
    this.displayName = this.username;
  }

  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUserDocument>('User', userSchema);
export default User;
