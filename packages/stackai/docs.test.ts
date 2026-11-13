import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as ts from 'typescript';

describe('StackAI documentation', () => {
	it('has a syntactically valid start example with the documented input key', () => {
		const overview = readFileSync(
			resolve(__dirname, '../../docs/plugins/stackai/overview.mdx'),
			'utf8',
		);
		const example = overview.match(
			/\*\*Start a project run\*\*\s+```ts\n([\s\S]*?)\n```/,
		)?.[1];
		expect(example).toBeDefined();
		const result = ts.transpileModule(example!, {
			compilerOptions: { target: ts.ScriptTarget.ESNext },
			reportDiagnostics: true,
		});
		expect(result.diagnostics).toEqual([]);
		expect(example).toContain("input: { example_input: 'Hello' }");
		expect(overview).toContain(
			'Replace `example_input` with a node ID from your project',
		);
	});
});
