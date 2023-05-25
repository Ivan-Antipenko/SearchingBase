import { NextFunction, Request, Response } from 'express';
import Blog from '../models/blog';
import User from '../models/user';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');
const NotFoundError = require('../errors/NotFoundError');

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page } = req.body;
    const posts = await Blog.find({})
      .sort({ createdAt: -1 })
      .skip(20 * (page - 1))
      .limit(20);
    if (posts.length === 0) {
      next(new NotFoundError('Записи не найдены'));
    } else {
      res.send(posts);
    }
  } catch (err: any) {
    next(err);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, file } = req.body;
    const author = req.user as JwtPayload;
    const id = new mongoose.Types.ObjectId(author._id);

    if (!message || !file) {
      next(new ValidationError('Не валидные данные'));
    }
    const user = await User.findOne({
      _id: id,
    });
    if (user) {
      await Blog.create({
        message: message,
        file: file,
        author: user._id,
      });
      res.send({ message: 'Пост добавлен' });
    } else {
      next(new NotFoundError('Пользователь не найден'));
    }
  } catch (err: any) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (post) {
      const user = req.user as JwtPayload;
      if (String(post.author) === user._id) {
        await post.deleteOne();
        res.send({ message: 'Пост удален' });
      } else {
        next(new AccessError('Вы не можете редактировать чужой блог'));
      }
    }
  } catch (err: any) {
    next(err);
  }
};

export const changePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, file } = req.body;
    const post = await Blog.findById(req.params);
    if (post) {
      const user = req.user as JwtPayload;
      if (String(post.author) === user._id) {
        post.updateOne({ message: message, file: file }, { new: true });
        res.send(post);
      }
    }
  } catch (err: any) {
    next(err);
  }
};
