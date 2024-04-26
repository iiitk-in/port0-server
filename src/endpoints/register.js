import { storeOTP, getPassword } from '../database';

function sendOTP(email, otp) {
  // Send OTP to email
}

export default async function registerHandler(request) {
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
  if (await getPassword(json.email)) {
    return new Response(null, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  if (!storeOTP(json.email, otp).success) {
    return new Response(null, { status: 500 });
  }
  sendOTP(json.email, otp);

  return new Response(null, { status: 200 });
}
