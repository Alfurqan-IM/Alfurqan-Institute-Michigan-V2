// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
// import * as morgan from 'morgan';
// import * as express from 'express';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // 🔥 Access the underlying Express app instance
//   const expressApp = app.getHttpAdapter().getInstance();

//   // --------------------------------------------
//   // 1️⃣ RAW BODY MIDDLEWARE FOR DONORBOX WEBHOOKS
//   // --------------------------------------------
//   expressApp.use('/donorbox/webhook', express.raw({ type: '*/*' }));

//   // --------------------------------------------
//   // 2️⃣ ATTACH io INSTANCE TO req OBJECT
//   // --------------------------------------------
//   // NOTE: req.io must be typed in a custom Express declaration file
//   expressApp.use((req, res, next) => {
//     req.io = global['io']; // or wherever your io instance lives
//     next();
//   });

//   // --------------------------------------------
//   // Other existing middlewares
//   // --------------------------------------------
//   app.use(cookieParser(process.env.COOKIE_SECRET));

//   if (process.env.NODE_ENV !== 'production') {
//     app.use(morgan('dev'));
//   }

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   await app.listen(process.env.PORT ?? 3001);
// }
// bootstrap();

// mportant: Extend Express Request Type (required)
// Since you're adding req.io, TypeScript will complain unless you declare the field.
// Create a global type file:
// src/types/express.d.ts
// import { Server } from 'socket.io';

// declare module 'express-serve-static-core' {
//   interface Request {
//     io?: Server;
//   }
// }

// And include it in tsconfig.json:
// {
//   "compilerOptions": {
//     "typeRoots": ["./src/types", "./node_modules/@types"]
//   }
// }

// Notes

// Ensure your Socket.io instance is stored globally or injected into the bootstrap (I can fix that too if needed).

// Raw body parsing must be applied before any JSON middleware, and only to the webhook route — the placement above is correct.

// If you want, I can help you refactor this into a proper NestJS middleware class instead of using direct Express calls.
