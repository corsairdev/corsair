import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parmaEndpointSchemas } from './index';

const docsRoot = resolve(__dirname, '../../docs/plugins/parma');

test.each(['overview.mdx', 'api.mdx'])(
	'%s examples supply valid input for every documented call',
	(file) => {
		const text = readFileSync(resolve(docsRoot, file), 'utf8');
		const calls = [
			...text.matchAll(
				/await (?:tenant|corsair)\.parma\.api\.([\w.]+)\((\{[^;]*?\})\);/gs,
			),
		];
		expect(calls.length).toBe(file === 'api.mdx' ? 22 : 2);
		for (const [, path, json] of calls) {
			const schema =
				parmaEndpointSchemas[path as keyof typeof parmaEndpointSchemas];
			expect(schema).toBeDefined();
			// Generated snippets use TS object literals, not JSON. Parse their
			// limited literal syntax without executing documentation content.
			const normalized = json!
				.replace(/([{,]\s*)([\w]+)\s*:/g, '$1"$2":')
				.replace(/'([^']*)'/g, '"$1"')
				.replace(/,\s*([}\]])/g, '$1');
			expect(schema.input.safeParse(JSON.parse(normalized)).success).toBe(true);
		}
	},
);

test('OAuth setup uses an application-managed access token, not a Hub client credential flow', () => {
	const text = readFileSync(resolve(docsRoot, 'overview.mdx'), 'utf8');
	const oauth = text.match(/<Tab title="OAuth 2\.0">([\s\S]*?)<\/Tab>/)?.[1];
	expect(oauth).toBeDefined();
	expect(oauth).toContain("authType: 'oauth_2'");
	expect(oauth).toContain('PARMA_ACCESS_TOKEN');
	expect(oauth).toContain('set_access_token');
	expect(oauth).toMatch(/refresh/i);
	expect(oauth).not.toMatch(/enter the \*\*client ID\*\*/);
});
