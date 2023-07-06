import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import makePlugin from 'fastify-plugin';

declare module 'fastify' {
  export interface FastifyRequest {
    // you must reference the interface and not the type
    [key: symbol]: [number, number];
  }
}

interface ResponseTimeOptions extends FastifyPluginOptions {
  timeSymbol?: string;
}

export const responseTime = makePlugin(async (server: FastifyInstance, options: ResponseTimeOptions = {}) => {
  const { timeSymbol } = options;
  const symbolStartTime = Symbol(timeSymbol ?? 'startTime');

  server.decorateRequest(symbolStartTime, null);

  server.addHook('onRequest', async (req, res) => {
    req[symbolStartTime] = process.hrtime();
  });

  server.addHook('onSend', async (req, res, payload) => {
    // calculate the duration, in nanoseconds
    const hrDuration = process.hrtime(req[symbolStartTime]);
    // convert it to milliseconds
    const duration = (hrDuration[0] * 1e3 + hrDuration[1] / 1e6).toFixed(3);
    // add the header to the response
    res.header('X-Response-Time', duration);
  });
});
