import {
	buildQueryDataCacheKey,
	buildQueryDocumentCacheKey,
} from './cache-keys';
import type { AgentQLQueryDataInput, AgentQLQueryDocumentInput } from './types';

describe('AgentQL cache keys', () => {
	it('ignores query-data param key order', () => {
		const first: AgentQLQueryDataInput = {
			query: '{ title }',
			url: 'https://example.com',
			params: {
				wait_for: 1,
				mode: 'fast',
				is_screenshot_enabled: true,
			},
		};
		const reordered: AgentQLQueryDataInput = {
			query: '{ title }',
			url: 'https://example.com',
			params: {
				is_screenshot_enabled: true,
				mode: 'fast',
				wait_for: 1,
			},
		};

		expect(buildQueryDataCacheKey(first)).toBe(
			buildQueryDataCacheKey(reordered),
		);
	});

	it('ignores nested proxy key order', () => {
		const first: AgentQLQueryDataInput = {
			query: '{ title }',
			url: 'https://example.com',
			params: {
				mode: 'fast',
				proxy: {
					type: 'custom',
					url: 'http://proxy.example',
					username: 'user',
					password: 'pass',
				},
			},
		};
		const reordered: AgentQLQueryDataInput = {
			query: '{ title }',
			url: 'https://example.com',
			params: {
				mode: 'fast',
				proxy: {
					password: 'pass',
					username: 'user',
					url: 'http://proxy.example',
					type: 'custom',
				},
			},
		};

		expect(buildQueryDataCacheKey(first)).toBe(
			buildQueryDataCacheKey(reordered),
		);
	});

	it('changes the query-data key when param values change', () => {
		const first: AgentQLQueryDataInput = {
			query: '{ title }',
			url: 'https://example.com',
			params: { wait_for: 1 },
		};
		const changed: AgentQLQueryDataInput = {
			query: '{ title }',
			url: 'https://example.com',
			params: { wait_for: 2 },
		};

		expect(buildQueryDataCacheKey(first)).not.toBe(
			buildQueryDataCacheKey(changed),
		);
	});

	it('changes the query-document key when mode changes', () => {
		const first: AgentQLQueryDocumentInput = {
			file: new Blob(['document']),
			fileName: 'sample.pdf',
			query: '{ title }',
			params: { mode: 'fast' },
		};
		const changed: AgentQLQueryDocumentInput = {
			...first,
			params: { mode: 'standard' },
		};

		expect(buildQueryDocumentCacheKey(first, 'file-hash')).not.toBe(
			buildQueryDocumentCacheKey(changed, 'file-hash'),
		);
	});

	it('changes the query-document key when the file hash changes', () => {
		const input: AgentQLQueryDocumentInput = {
			file: new Blob(['document']),
			fileName: 'sample.pdf',
			query: '{ title }',
			params: { mode: 'fast' },
		};

		expect(buildQueryDocumentCacheKey(input, 'file-hash-a')).not.toBe(
			buildQueryDocumentCacheKey(input, 'file-hash-b'),
		);
	});
});
