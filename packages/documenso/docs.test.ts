import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// MDX reads a bare `{...}` in prose as a JavaScript expression, so a route like
// GET /document/{documentId} outside a code span breaks the generated page.
function proseOutsideCode(mdx: string): string[] {
	const withoutFences = mdx.replace(/^```[\s\S]*?^```/gm, '');
	return withoutFences.split('\n').map((line) => line.replace(/`[^`]*`/g, ''));
}

describe('generated Documenso API docs', () => {
	it('has no bare braces in prose', () => {
		const mdx = readFileSync(
			join(__dirname, '../../docs/plugins/documenso/api.mdx'),
			'utf8',
		);
		const offending = proseOutsideCode(mdx).filter((line) => /[{}]/.test(line));
		expect(offending).toEqual([]);
	});
});
