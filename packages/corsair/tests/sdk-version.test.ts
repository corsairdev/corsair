import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CORSAIR_SDK_VERSION } from '../hub/sdk-version';

it('CORSAIR_SDK_VERSION matches package.json', () => {
	const pkg = JSON.parse(
		readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
	);
	expect(CORSAIR_SDK_VERSION).toBe(pkg.version);
});
