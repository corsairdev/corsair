import { createCorsair } from '../core';
import {
	CorsairKekMissingError,
	resolveKekAtInit,
} from '../core/auth/errors/kek-missing';
import { createTestDatabase } from './setup-db';

describe('resolveKekAtInit', () => {
	it('returns trimmed KEK when database is configured', () => {
		expect(resolveKekAtInit('  test-kek  ', true)).toBe('test-kek');
	});

	it('throws CorsairKekMissingError when database is configured without KEK', () => {
		expect(() => resolveKekAtInit(undefined, true)).toThrow(
			CorsairKekMissingError,
		);
		expect(() => resolveKekAtInit('   ', true)).toThrow(
			/Corsair KEK is missing/,
		);
	});

	it('allows missing KEK when no database is configured', () => {
		expect(resolveKekAtInit(undefined, false)).toBe('');
	});
});

describe('createCorsair — KEK validation', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('throws at init when database is configured without KEK', () => {
		env = createTestDatabase();
		expect(() =>
			createCorsair({
				plugins: [],
				database: env.db,
			} as any),
		).toThrow(CorsairKekMissingError);
	});

	it('initializes when database and KEK are configured', () => {
		env = createTestDatabase();
		expect(() =>
			createCorsair({
				plugins: [],
				database: env.db,
				kek: 'test-kek',
			} as any),
		).not.toThrow();
	});
});
