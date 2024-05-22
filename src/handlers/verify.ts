import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jwt from '@tsndr/cloudflare-worker-jwt';

async function createJWT(email: string) {
	const token = await jwt.sign({ email }, 'secret');
	return token;
}

export default async function verify(c: Context) {
	let body;
	let email: string | undefined, otp: string;
	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	const otpPattern = /^\d{6}$/;
	try {
		body = await c.req.json();
		email = body.email;
		otp = body.otp;
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!otp || !otpPattern.test(otp) || !email || !emailPattern.test(email)) {
		throw new HTTPException(401);
	}

	return c.json({
		status: 'success',
		data: {
			token: await createJWT(email),
		},
	});
}
