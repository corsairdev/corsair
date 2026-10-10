import {
	buildQueryDataCacheKey,
	buildQueryDocumentCacheKey,
} from './cache-keys';
import type { AgentQLQueryDataInput } from './types';

describe('AgentQL cache keys', () => {
	const dataInput: AgentQLQueryDataInput = {
		query: '{ products { name } }',
		url: 'https://example.com',
	};

	it('ignores the insertion order of query data params', () => {
		expect(
			buildQueryDataCacheKey({
				...dataInput,
				params: { mode: 'fast', wait_for: 1 },
			}),
		).toBe(
			buildQueryDataCacheKey({
				...dataInput,
				params: { wait_for: 1, mode: 'fast' },
			}),
		);
	});

	it('ignores the insertion order of nested proxy settings', () => {
		expect(
			buildQueryDataCacheKey({
				...dataInput,
				params: {
					proxy: {
						type: 'custom',
						url: 'http://proxy.example.com',
						username: 'user',
					},
				},
			}),
		).toBe(
			buildQueryDataCacheKey({
				...dataInput,
				params: {
					proxy: {
						username: 'user',
						url: 'http://proxy.example.com',
						type: 'custom',
					},
				},
			}),
		);
	});

	it('continues to omit undefined object properties', () => {
		expect(
			buildQueryDataCacheKey({
				...dataInput,
				params: { mode: 'fast', wait_for: undefined },
			}),
		).toBe(buildQueryDataCacheKey({ ...dataInput, params: { mode: 'fast' } }));
	});

	it.each<AgentQLQueryDataInput>([
		{ ...dataInput, query: '{ products { price } }' },
		{ ...dataInput, url: 'https://example.com/other' },
		{ ...dataInput, html: '<html>changed</html>' },
		{ ...dataInput, params: { mode: 'standard', wait_for: 1 } },
		{ ...dataInput, params: { mode: 'fast', wait_for: 2 } },
		{ ...dataInput, params: { mode: 'fast', wait_for: 1, proxy: null } },
	])('distinguishes different query data inputs: %j', (input) => {
		expect(buildQueryDataCacheKey(input)).not.toBe(
			buildQueryDataCacheKey({
				...dataInput,
				params: { mode: 'fast', wait_for: 1 },
			}),
		);
	});

	const documentInput = {
		file: new Blob(['document']),
		fileName: 'document.pdf',
		query: '{ title }',
		params: { mode: 'fast' as const },
	};

	it('uses document values independently of input property order', () => {
		expect(buildQueryDocumentCacheKey(documentInput, 'file-hash')).toBe(
			buildQueryDocumentCacheKey(
				{
					params: documentInput.params,
					query: documentInput.query,
					fileName: documentInput.fileName,
					file: documentInput.file,
				},
				'file-hash',
			),
		);
	});

	it('distinguishes document contents, names, queries and modes', () => {
		const key = buildQueryDocumentCacheKey(documentInput, 'file-hash');
		expect(buildQueryDocumentCacheKey(documentInput, 'other-hash')).not.toBe(
			key,
		);
		expect(
			buildQueryDocumentCacheKey(
				{ ...documentInput, fileName: 'other.pdf' },
				'file-hash',
			),
		).not.toBe(key);
		expect(
			buildQueryDocumentCacheKey(
				{ ...documentInput, query: '{ author }' },
				'file-hash',
			),
		).not.toBe(key);
		expect(
			buildQueryDocumentCacheKey(
				{ ...documentInput, params: { mode: 'standard' } },
				'file-hash',
			),
		).not.toBe(key);
	});
});
