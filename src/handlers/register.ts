import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

function getRandomDigit() {
	const arr = new Uint8Array(1);
	crypto.getRandomValues(arr);
	return arr[0] % 10;
}
async function sendOTP(email: string, name: string, otp: string, env: Env) {
	const apiKey = env.BREVO_API_KEY;
	const data = {
		to: [{ email, name }],
		sender: { email: 'port0@iiitk.in' },
		templateId: 1,
		params: { name, digit1: otp[0], digit2: otp[1], digit3: otp[2], digit4: otp[3], digit5: otp[4], digit6: otp[5] },
		headers: { charset: 'iso-8859-1' },
	};
	const response = await fetch('https://api.brevo.com/v3/smtp/email', {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'api-key': apiKey,
			'content-type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new HTTPException(500);
	}
	return true;
}

export default async function register(c: Context<{ Bindings: Env }>) {
	let body;
	let email: string;
	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	try {
		body = await c.req.json();
		email = body.email.toString();
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!email || !emailPattern.test(email)) {
		throw new HTTPException(400);
	}
	const otp = Array.from({ length: 6 }, getRandomDigit).join('');
	let stmt = 'SELECT * FROM users WHERE email = ?';
	let results;
	try {
		({ results } = await c.env.DB.prepare(stmt).bind(email).all());
	} catch (e) {
		throw new HTTPException(500);
	}
	if (results.length > 0) {
		stmt = 'UPDATE users SET otp = ? WHERE email = ?';
	} else {
		stmt = `INSERT INTO users (email, otp) VALUES (?, ?)`;
	}
	try {
		await c.env.DB.prepare(stmt).bind(email, otp).run();
	} catch (e) {
		throw (new HTTPException(500), e);
	}

	await sendOTP(email, 'name', otp, c.env);

	return c.json({
		status: 'success',
	});
}
