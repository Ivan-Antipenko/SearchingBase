import { Request, Response, NextFunction } from 'express';
import { setHashPass, checkPass, checkUser } from '../utils/utils';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const AuthorizationError = require('../errors/AuthorizationError');

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const hash = await setHashPass(password);
    await User.create({ name, email, password: hash });
    res.send('Пользователь создан');
  } catch (err: any) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Не валидные данные '));
    } else {
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await checkUser(email);
    if (!user) {
      next(new AuthorizationError('Неправильные почта или пароль'));
    }
    if (user) {
      const matched = await checkPass(user, password);
      if (!matched) {
        next(new AuthorizationError('Неправильные почта или пароль'));
      } else {
        const id = String(user._id);
        const token = jwt.sign({ _id: id }, 'secret', {
          expiresIn: '7d',
        });
        res.send({ token });
      }
    }
  } catch (err) {
    next(err);
  }
};
