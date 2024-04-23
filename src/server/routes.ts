import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';

const home = async (req: FastifyRequest, res: FastifyReply) => {
  return { statusCode: 200, message: 'i am the backend' };
};

const health = async (req: FastifyRequest, res: FastifyReply) => {
  return { statusCode: 200, message: 'healthy' };
};

export const registerRoutes = async (server: FastifyInstance, options: FastifyPluginOptions) => {
  server.get('/', home);
  server.get('/health', health);
};
