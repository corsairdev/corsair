import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			corsair: resolve(__dirname, '__mocks__/corsair.ts'),
		},
	},
});
