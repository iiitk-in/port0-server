import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { decode, sign, verify } from 'hono/jwt';

export default async function login(c: Context) {
	let body;
	try {
		body = await c.req.json();
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!body.email || !body.token || !body.password) {
		throw new HTTPException(401, { message: 'Missing required fields' });
	}

	const secret = c.env.SECRET;
	const token = body.token;
	let decodedPayload;
	try {
		decodedPayload = await verify(token, secret);
	} catch (e) {
		throw new HTTPException(401, { message: 'Invalid token' });
	}

	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	if (!emailPattern.test(body.email)) {
		throw new HTTPException(401, { message: 'Invalid email' });
	}

	const stmt = `SELECT * FROM port0_prod WHERE email = $1`;

	let result;
	try {
		result = await c.env.DB.prepare(stmt).bind(body.email).run();
	} catch (e: any) {
		throw new HTTPException(500, { message: e.message });
	}

	if (!result) {
		throw new HTTPException(401, { message: 'Invalid email or token' });
	}

	if (result.results[0].keyHash != body.password) {
		throw new HTTPException(401, { message: `Incorrect password` });
	}

	return c.json({
		status: 'Login Successfull',
		aes256Bit: result.results[0].aes256Bit,
		salt: result.results[0].salt,
	});
}
