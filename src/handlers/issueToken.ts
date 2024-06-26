import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';

export default async function issueToken(c: Context) {
	let body;
	try {
		body = await c.req.json();
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!body.email) {
		throw new HTTPException(401, { message: 'Missing required fields' });
	}
	const emailRegex = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	if (!emailRegex.test(body.email)) {
		throw new HTTPException(401, { message: 'Invalid email' });
	}
	const secret = c.env.SECRET;
	const token = await sign({ email: body.email }, secret);
	return c.json({
		token: token,
	});
}
