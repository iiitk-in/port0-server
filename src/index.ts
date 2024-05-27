import { Context, Hono } from 'hono';
import register from './handlers/register';
import verify from './handlers/verify';
import create from 'handlers/create';
import { cors } from 'hono/cors';
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
	'*',
	cors({
		origin: '*',
		allowHeaders: ['Content-Type'],
	}),
);

app.post('/auth/register', register);
app.post('/auth/verify', verify);
app.post('/auth/create', create); // New route

export default app;
