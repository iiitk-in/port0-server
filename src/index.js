/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { registerHandler } from './endpoints/register';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    switch (pathname) {
      case '/auth/register':
        return registerHandler(request);
      case '/auth/login':
        loginHandler(request);
        break;
      default:
        return new Response('Not Found', { status: 404 });
    }

    const { success } = await env.IP_Rate.limit({ key: pathname });
    if (!success) {
      return new Response(`429 Failure - rate limit exceeded for ${pathname}`, {
        status: 429,
      });
    }
  },
};
