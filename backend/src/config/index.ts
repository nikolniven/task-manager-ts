import express, { Application } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) throw new Error('Frontend URL is missing');

const configureMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: [CLIENT_URL],
      credentials: true,
    }),
  );

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

export default configureMiddleware;
