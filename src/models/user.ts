import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (v: string) => isEmail(v),
    message: 'Не валидный email',
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 2,
  },
});

export default mongoose.model<IUser>('User', userSchema);
