import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

function getRandomDigit() {
	const arr = new Uint8Array(1);
	crypto.getRandomValues(arr);
	return arr[0] % 10;
}
function sendOTP(email: string, otp: string) {
	// Send OTP to email
}

export default async function register(c: Context) {
	let body;
	let email: string | undefined;
	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	try {
		body = await c.req.json();
		email = body.email;
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!email || !emailPattern.test(email)) {
		throw new HTTPException(400);
	}
	const otp = Array.from({ length: 6 }, getRandomDigit).join('');
	sendOTP(email, otp);

	return c.json({
		status: 'success',
		data: null,
	});
}
