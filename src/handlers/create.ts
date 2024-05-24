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
		throw new HTTPException(401);
	}
	//Maybe add some way of token verification later on
	const emailPattern = /^[a-zA-Z]+\d{2}[a-zA-Z]{3}\d{1,3}@iiitkottayam\.ac\.in$/;
	if (!emailPattern.test(body.email)) {
		throw new HTTPException(401);
	}
	const stmt = `INSERT INTO users (email, token, keyHash, aes256Bit, salt) VALUES ($1, $2, $3, $4, $5)`;
	const values = [body.email, body.token, body.keyHash, body.aes256Bit, body.salt];
	try {
		await c.env.DB.prepare.query(stmt, values);
	} catch (e) {
		throw new HTTPException(500);
	}
	return c.json({
		status: 'success',
	});
}
