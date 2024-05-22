// test/index.spec.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../src/lib/bcrypt';

describe('bcrypt', () => {
	it('hashes and verifies passwords', async () => {
		const password = 'password';
		const hashed = await hashPassword(password);
		expect(await verifyPassword(hashed, password)).toBe(true);
	});
});
