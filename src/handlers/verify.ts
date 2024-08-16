import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import secret from 'lib/secret';
async function createJWT(email: string) {
	const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
	const token = await sign({ sub: email, exp }, secret);
	return token;
}

export default async function verify(c: Context<{ Bindings: Env }>) {
	let body;
	let email: string, otp: string;
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
	let stmt = 'SELECT * FROM users WHERE email = ?';
	let values = [email];
	let results;
	try {
		({ results } = await c.env.DB.prepare(stmt).bind(values).all());
	} catch (e) {
		throw new HTTPException(500);
	}
	if (results.length === 0 || results[0].otp !== otp) {
		throw new HTTPException(401);
	}
	const token = await createJWT(email);
	stmt = 'UPDATE users SET verified = 1 WHERE email = ?';
	values = [email]
	try {
		await c.env.DB.prepare(stmt).bind(values).run();
	} catch (e) {
		throw new HTTPException(500);
	}

	return c.json({
		token,
	});
}
