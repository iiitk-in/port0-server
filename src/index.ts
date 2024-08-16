import { Context, Hono } from 'hono';
import register from './handlers/register';
import verify from './handlers/verify';
import create from './handlers/create';
import issueToken from './handlers/issueToken';
import { cors } from 'hono/cors';

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
app.get('/', (c: Context<{ Bindings: Env }>) => {
	return c.json({
		status: 'healthy',
	});
});

export default app;
