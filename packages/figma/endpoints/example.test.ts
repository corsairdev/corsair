import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('figma endpoints example scaffold', () => {
	it('does not keep the generator example file', () => {
		expect(existsSync(join(__dirname, 'example.ts'))).toBe(false);
	});

	it('wires usersGetCurrent from users.ts', () => {
		const src = readFileSync(join(__dirname, 'index.ts'), 'utf8');
		expect(src).toContain("from './users'");
		expect(src).toContain('getCurrent: UsersEndpoints.getCurrent');
		expect(src).not.toContain("from './example'");
	});
});
