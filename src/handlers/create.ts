import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { decode, sign, verify } from 'hono/jwt';

export default async function create(c: Context) {
	let body;
	try {
		body = await c.req.json();
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!body.email || !body.token || !body.keyHash || !body.aes256Bit || !body.salt) {
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

	const stmt = `INSERT INTO port0_prod (email, token, keyHash, aes256Bit, salt) VALUES ($1, $2, $3, $4, $5)`;

	try {
		await c.env.DB.prepare(stmt).bind(body.email, body.token, body.keyHash, body.aes256Bit, body.salt).run();
	} catch (e: any) {
		throw new HTTPException(500, { message: e.message });
	}

	return c.json({
		status: 'success',
	});
}
