import { Hono } from 'hono';
import register from './handlers/register';
import verify from './handlers/verify';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.post('/auth/register', register);
app.post('/auth/verify', verify);

export default app;
