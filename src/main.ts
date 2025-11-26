import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // -------- SECURITY --------
  // Helmet
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      if (
        origin &&
        (origin.startsWith('http://localhost') ||
          origin.startsWith('http://127.0.0.1'))
      ) {
        callback(null, true);
      } else if (
        origin === undefined ||
        origin === process.env.PRODUCTION_URL
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  // Cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET));
  //Logs
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // Validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
