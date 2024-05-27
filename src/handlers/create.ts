import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

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

	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	if (!emailPattern.test(body.email)) {
		throw new HTTPException(401);
	}

	// let userToken = body.token;
	// const token_stmt = `SELECT email FROM users WHERE token = $1`;
	// const token_values = [userToken];
	// let token_email;

	// try {
	// 	const res = await c.env.DB.prepare.query(token_stmt, token_values);
	// 	token_email = res.rows[0].email;
	// } catch (e) {
	// 	throw new HTTPException(500);
	// }
	// if (token_email !== body.email) {
	// 	throw new HTTPException(401);
	// }
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
