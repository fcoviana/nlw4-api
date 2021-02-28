import 'reflect-metadata';
import express, { NextFunction, Response} from 'express';
import 'express-async-errors';
import createConnection from './database';
import router from './routes';
import { AppError } from './utils/errors/AppErrors';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, _, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      error: err.error,
      message: err.message,
    });
  }

  return response.status(500).json({
    error: 'InternalServerError',
    message: 'Error interno',
  });
});

export default app;
