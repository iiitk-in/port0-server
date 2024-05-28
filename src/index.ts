import { Context, Hono } from 'hono';
import register from './handlers/register';
import verify from './handlers/verify';
import create from './handlers/create';
import issueToken from './handlers/issueToken';
import { cors } from 'hono/cors';
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Env = {
	DATABASE_URL: string;
	SECRET: string;
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
app.post('/auth/issueToken', issueToken); // New route
app.get('/', (c: Context) => {
	return c.json({
		status: 'Wohoo API Works!',
	});
}
);

export default app;
