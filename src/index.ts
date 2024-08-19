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
app.post('/auth/create', create);
app.post('/auth/issueToken', issueToken); // are you sure??
/*

app.post('/auth/refresh', refresh);
app.post('/auth/access', access);
app.post('/getVault', getVault);
app.post('/updateVault', updateVault);
*/

app.get('/', (c: Context<{ Bindings: Env }>) => {
	return c.json({
		status: 'healthy',
	});
});

export default app;
