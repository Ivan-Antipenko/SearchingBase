import { IUser } from '../models/user';
import User from '../models/user';

const bcrypt = require('bcryptjs');

export const setHashPass = (pass: string) => {
  return bcrypt.hash(pass, 3);
};

export const checkUser = (email: string) => {
  return User.findOne({ email }).select('+password');
};

export const checkPass = (user: IUser, pass: string) => {
  return bcrypt.compare(pass, user.password);
};
