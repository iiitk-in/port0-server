import { Hono } from 'hono';
import register from './handlers/register';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.post('/auth/register', register);

export default app;
