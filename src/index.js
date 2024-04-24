/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { storeOTP, getStoredOTP } from './database';

function sendOTP(email, otp) {
  // send OTP to email
}

async function registerHandler(request) {
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return new Response('Content-Type must be application/json', {
      status: 400,
    });
  }

  let json;
  try {
    json = await request.json();
  } catch (e) {
    return new Response(null, { status: 400 });
  }
  if (!json.email) {
    return new Response({ status: 400 });
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@iiitkottayam.ac.in$/;
  if (!emailRegex.test(json.email)) {
    return new Response('Please use a iiitkottayam.ac.in email', { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  storeOTP(json.email, otp);
  sendOTP(json.email, otp);

  return new Response(null, { status: 200 });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    switch (pathname) {
      case '/auth/register':
        return registerHandler(request);
        break;
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
