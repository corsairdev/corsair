import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

const SNIPPET = {
	_id: 'snip-1',
	name: 'Sales intro',
	title: 'Quick question, {{first name}}',
};

const PAGE = { results: [SNIPPET], hasNext: false };

const TAG = { _id: 'tag-1', name: 'Sales' };

const TAG_PAGE = { results: [TAG], hasNext: false };

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax snippets endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('snippets.list sends GET /v1/snippets with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.snippets.list(ctx, {
			search: 'folder:"Sales"',
			limit: 20,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippets', {
			method: 'GET',
			query: {
				search: 'folder:"Sales"',
				isInline: undefined,
				deletedOnly: undefined,
				archivedOnly: undefined,
				sort: undefined,
				sortAscending: undefined,
				expand: undefined,
				limit: 20,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(PAGE);
	});

	it('snippets.get parses the expanded snippetId id object', async () => {
		// With `expand=snippetId` the provider returns the id as an expanded
		// `{ _id, tagId }` object; the read must not fail the output check
		// after Mixmax answers successfully.
		request.mockResolvedValue({
			_id: { _id: 'snip-1', tagId: 'tag-1' },
			name: 'Expanded template',
		});
		const result = await endpoints.snippets.get(ctx, {
			id: 'snip-1',
			expand: 'snippetId',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippets/snip-1', {
			method: 'GET',
			query: {
				includeDeleted: undefined,
				expand: 'snippetId',
				fields: undefined,
			},
		});
		expect(result).toEqual({
			_id: { _id: 'snip-1', tagId: 'tag-1' },
			name: 'Expanded template',
		});
	});

	it('snippets.get sends GET /v1/snippets/:id and rejects unsafe ids', async () => {
		request.mockResolvedValue(SNIPPET);
		const result = await endpoints.snippets.get(ctx, {
			id: 'snip-1',
			fields: 'name,title',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippets/snip-1', {
			method: 'GET',
			query: {
				includeDeleted: undefined,
				expand: undefined,
				fields: 'name,title',
			},
		});
		expect(result).toEqual(SNIPPET);

		await expect(
			endpoints.snippets.get(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).toHaveBeenCalledTimes(1);
	});

	it('snippets.update patches /v1/snippets/:id without the id in the body', async () => {
		request.mockResolvedValue(SNIPPET);
		const result = await endpoints.snippets.update(ctx, {
			id: 'snip-1',
			title: 'Quick question, {{first name}}',
			source: '<p>Hi {{first name}},</p>',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippets/snip-1', {
			method: 'PATCH',
			query: { expand: undefined },
			body: {
				title: 'Quick question, {{first name}}',
				source: '<p>Hi {{first name}},</p>',
			},
		});
		expect(result).toEqual(SNIPPET);
	});

	it('snippets.delete sends DELETE /v1/snippets/:id with the archive flag', async () => {
		const result = await endpoints.snippets.delete(ctx, {
			id: 'snip-1',
			archive: true,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippets/snip-1', {
			method: 'DELETE',
			query: { archive: true },
		});
		expect(result).toBeUndefined();
	});

	it('snippets.send posts /v1/snippets/:id/send with recipients and variables', async () => {
		const result = await endpoints.snippets.send(ctx, {
			id: 'snip-1',
			to: [{ email: 'ada@example.com', name: 'Ada Lovelace' }],
			variables: { company: 'Analytical Engines' },
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippets/snip-1/send', {
			method: 'POST',
			body: {
				to: [{ email: 'ada@example.com', name: 'Ada Lovelace' }],
				variables: { company: 'Analytical Engines' },
			},
		});
		expect(result).toBeUndefined();
	});

	it('snippetTags.list sends GET /v1/snippettags with documented query params', async () => {
		request.mockResolvedValue(TAG_PAGE);
		const result = await endpoints.snippetTags.list(ctx, {
			expand: 'count',
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippettags', {
			method: 'GET',
			query: {
				search: undefined,
				isInline: undefined,
				sort: undefined,
				sortAscending: undefined,
				expand: 'count',
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(TAG_PAGE);
	});

	it('snippetTags.create posts the folder name and reads isInline from the query', async () => {
		request.mockResolvedValue(TAG);
		const result = await endpoints.snippetTags.create(ctx, {
			name: 'Sales',
			isInline: true,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippettags', {
			method: 'POST',
			query: { isInline: true },
			body: { name: 'Sales', options: undefined },
		});
		expect(result).toEqual(TAG);
	});

	it('snippetTags.get sends GET /v1/snippettags/:id with the expand query', async () => {
		request.mockResolvedValue(TAG);
		const result = await endpoints.snippetTags.get(ctx, {
			id: 'tag-1',
			expand: 'count',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippettags/tag-1', {
			method: 'GET',
			query: { expand: 'count' },
		});
		expect(result).toEqual(TAG);
	});

	it('snippetTags.update patches /v1/snippettags/:id with the new name', async () => {
		request.mockResolvedValue(TAG);
		const result = await endpoints.snippetTags.update(ctx, {
			id: 'tag-1',
			name: 'Sales 2026',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippettags/tag-1', {
			method: 'PATCH',
			body: { name: 'Sales 2026', options: undefined },
		});
		expect(result).toEqual(TAG);
	});

	it('snippetTags.delete sends DELETE /v1/snippettags/:id', async () => {
		const result = await endpoints.snippetTags.delete(ctx, {
			id: 'tag-1',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/snippettags/tag-1', {
			method: 'DELETE',
		});
		expect(result).toBeUndefined();
	});

	it('snippetTags.listSnippets sends GET /v1/snippettags/:id/snippets', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.snippetTags.listSnippets(ctx, {
			id: 'tag-1',
			sort: 'name',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/snippettags/tag-1/snippets',
			{
				method: 'GET',
				query: {
					search: undefined,
					sort: 'name',
					sortAscending: undefined,
					expand: undefined,
					limit: undefined,
					next: undefined,
					previous: undefined,
				},
			},
		);
		expect(result).toEqual(PAGE);
	});

	it('snippetTags.addSnippets posts /v1/snippettags/:id/snippets with the move body', async () => {
		request.mockResolvedValue(SNIPPET);
		const result = await endpoints.snippetTags.addSnippets(ctx, {
			id: 'tag-1',
			_id: 'snip-1',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/snippettags/tag-1/snippets',
			{
				method: 'POST',
				body: { _id: 'snip-1' },
			},
		);
		expect(result).toEqual(SNIPPET);
	});

	it('rejects missing path ids before any request', async () => {
		// unknown: deliberately invalid input shapes to prove the schema
		// boundary rejects them before transport.
		await expect(endpoints.snippets.get(ctx, {} as never)).rejects.toThrow();
		await expect(endpoints.snippets.delete(ctx, {} as never)).rejects.toThrow();
		await expect(endpoints.snippetTags.get(ctx, {} as never)).rejects.toThrow();
		await expect(
			endpoints.snippetTags.delete(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.snippetTags.listSnippets(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.snippetTags.addSnippets(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('snippets.send requires recipients before any request', async () => {
		// unknown: deliberately invalid input shapes to prove the schema
		// boundary rejects them before transport.
		await expect(endpoints.snippets.send(ctx, {} as never)).rejects.toThrow();
		await expect(
			endpoints.snippets.send(ctx, { id: 'snip-1' } as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
