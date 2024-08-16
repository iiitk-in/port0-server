import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { decode, verify } from 'hono/jwt';
import secret from 'lib/secret';

// https://stackoverflow.com/a/45670960
const Data = {
	salt: '',
	keyHash: '',
	aes256Bit: '',
};

type Data = typeof Data;

async function decodeJWT(token: string) {
	if (await verify(token, secret)) {
		const sub = decode(token).payload?.sub;
		if (typeof sub === 'string') {
			return sub;
		}
	}
	return '';
}
async function saveToDB(email: string, data: Data, env: Env) {
	const info = await env.DB.prepare('UPDATE users SET salt = ?, keyHash = ?, aes256Bit = ? WHERE email = ?')
		.bind(data.salt, data.keyHash, data.aes256Bit, email)
		.run();
	return info.success;
}

export default async function create(c: Context<{ Bindings: Env }>) {
	const email = await decodeJWT(c.req.header('Authorization')?.split(' ')[1] || '');
	if (!email) {
		throw new HTTPException(401);
	}

	let body;

	const data = {} as Data;

	try {
		body = await c.req.json();
		let key: keyof Data;
		for (key in Data) {
			if (body[key].length === 0) {
				throw new HTTPException(400);
			}
			data[key] = body[key] as string;
		}
	} catch (e) {
		throw new HTTPException(400);
	}

	saveToDB(email, data, c.env);

	return c.json({
		status: 'success',
		data: null,
	});
}
