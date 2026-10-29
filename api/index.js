require('reflect-metadata');
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');
const { json, urlencoded } = require('express');
const { AppModule } = require('../apps/api/dist/src/app.module.js');

let cachedServer = null;

async function bootstrapServer() {
  if (!cachedServer) {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      bodyParser: false,
    });

    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.init();
    cachedServer = server;
  }
  return cachedServer;
}

module.exports = async function handler(req, res) {
  if (req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  }
  const server = await bootstrapServer();
  return server(req, res);
};
