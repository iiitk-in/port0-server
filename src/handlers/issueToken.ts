import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import secret from 'lib/secret';

// ????
export default async function issueToken(c: Context<{ Bindings: Env }>) {
	let body;
	try {
		body = await c.req.json();
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!body.email) {
		throw new HTTPException(401, { message: 'Missing required fields' });
	}

	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	if (!emailPattern.test(body.email)) {
		throw new HTTPException(401, { message: 'Invalid email address' });
	}
	const stmt = 'SELECT keyHash FROM users WHERE email = ?';
	let results;
	try {
		({ results } = await c.env.DB.prepare(stmt).bind(body.email).all());
	} catch (e) {
		throw new HTTPException(500);
	}
	if (results.length === 0 || results[0] !== body.password) {
		throw new HTTPException(401);
	}
	const token = await sign({ email: body.email }, secret);
	return c.json({
		token: token,
	});
}
