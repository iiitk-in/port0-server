import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jwt from '@tsndr/cloudflare-worker-jwt';

interface Data {
	token: string;
	salt: string;
	keyHash: string;
	aes256Bit: string;
}

async function decodeJWT(token: string) {
	if ((await jwt.verify(token, 'secret')) === true) {
		return jwt.decode(token).payload?.aud;
	}
	return false;
}
async function saveToDB(data: Data, email: string, env: Env) {
	const info = await env.DB.prepare('UPDATE users SET salt = ?, keyHash = ?, aes256Bit = ? WHERE email = ?')
		.bind(data.salt, data.keyHash, data.aes256Bit, email)
		.run();
	return info.success;
}

export default async function create(c: Context) {
	let body;

	const data = {} as Data;

	try {
		body = await c.req.json();
		for (const key in data) {
			if (body[key].length === 0) {
				throw new HTTPException(400);
			}
			data[key as keyof Data] = body[key] as string;
		}
	} catch (e) {
		throw new HTTPException(400);
	}
	if ((await decodeJWT(data.token)) === false) {
		throw new HTTPException(401);
	}
	const email = (await decodeJWT(data.token)) as string;
	saveToDB(data, email, c.env);

	return c.json({
		status: 'success',
		data: null,
	});
}
