import fastify from 'fastify';
import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify';

import { responseTime } from './plugins/responseTime';
import { registerRoutes } from './routes';

import { APP_HOST, APP_PORT } from '~/config';

const serverOptions: FastifyServerOptions = {
  logger: false,
  ignoreTrailingSlash: true,
  maxParamLength: 1024,
  bodyLimit: 1024 * 1024 * 16,
};

export const startServer = async (decorators: Record<string, unknown> = {}): Promise<FastifyInstance> => {
  const server = fastify(serverOptions);

  // Register Plugins
  server.register(responseTime);

  // Register Routes
  server.register(registerRoutes);

  // Register Decorators
  for (const [key, decorator] of Object.entries(decorators)) {
    server.decorate(key, decorator);
  }

  server.addHook('onRequest', async (req: FastifyRequest, res: FastifyReply) => {
    for (const [key, decorator] of Object.entries(decorators)) {
      // @ts-ignore
      req[key] = decorator;
    }
  });

  server.addHook('onResponse', async (req: FastifyRequest, res: FastifyReply) => {
    // console.log('[x-res-time]', res.getHeader('X-Response-Time'), res.getHeader('X-Elapsed-Time'), res.elapsedTime);
  });

  try {
    await server.listen({ host: APP_HOST, port: APP_PORT });
    console.log(`[fastify] server listening on http://${APP_HOST}:${APP_PORT}`);
  } catch (error) {
    console.error(error);
    // process.exit(1);
  }

  return server;
};
