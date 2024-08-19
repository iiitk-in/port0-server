import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createJWT } from './verify';

/*
POST JSON /auth/refresh
{
    "email": "<...>@iiitkottayam.ac.in",
    "keyHash": "<key>"
}

Response:

{
    "reftoken": "<JWT>"
}
*/

export default async function refresh(c: Context<{ Bindings: Env }>) {
	let body;
	let email: string, keyHash: string;
	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	try {
		body = await c.req.json();
		email = body.email;
		keyHash = body.keyHash;
	} catch (e) {
		throw new HTTPException(400);
	}
	if (!emailPattern.test(email) || !keyHash) {
		throw new HTTPException(401);
	}
	let stmt = 'SELECT keyHash FROM users WHERE email = ?';
	let results;
	try {
		({ results } = await c.env.DB.prepare(stmt).bind(email).all());
	} catch (e) {
		throw new HTTPException(500);
	}
	if (results.length === 0 || results[0].keyHash !== keyHash) {
		throw new HTTPException(401);
	}
	const token = await createJWT(email, 60 * 30);
	stmt = 'UPDATE users SET token = ? WHERE email = ?';
	try {
		await c.env.DB.prepare(stmt).bind(email).run();
	} catch (e) {
		throw new HTTPException(500);
	}

	return c.json({
		status: 'success',
		token,
	});
}
