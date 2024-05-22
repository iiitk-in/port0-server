// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('worker', () => {
	it('responds with 404 on index (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(404);
	});

	it('rejects incorrect accounts', async () => {
		let response = await SELF.fetch('http://example.com/auth/register', {
			method: 'POST',
			body: JSON.stringify({ email: 'notanemail', password: 'password' }),
		});
		expect(response.status).toBe(400);
		response = await SELF.fetch('http://example.com/auth/register', {
			method: 'POST',
			body: JSON.stringify({ email: 'real@gmail.com', password: 'password' }),
		});
		expect(response.status).toBe(400);
	});
});
