import {
  createPost,
  deletePost,
  changePost,
  getPosts,
} from '../controllers/blog';
import { Router } from 'express';

const blogRouter = Router();
export default blogRouter;

blogRouter.get('/', getPosts);
blogRouter.post('/', createPost);
blogRouter.delete('/:id', deletePost);
blogRouter.patch('/:id', changePost);
