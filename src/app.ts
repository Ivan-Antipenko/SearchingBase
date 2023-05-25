import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRouter';
import errorHandler from './middlewars/errorHandler';
import auth from './middlewars/auth';
import blogRouter from './routes/blogRouter';

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/testWork');

app.use(express.json());
app.use('/users', authRouter);
app.use(auth);
app.use('/posts', blogRouter);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
