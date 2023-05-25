import mongoose, { Types } from 'mongoose';

export interface IBlog {
  message?: String;
  file?: {
    base64: String;
    filename: String;
  };
  author: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IBlog>({
  message: String,
  file: {
    base64: String,
    filename: String,
  },
  author: Types.ObjectId,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model<IBlog>('Blog', userSchema, 'Blog');
