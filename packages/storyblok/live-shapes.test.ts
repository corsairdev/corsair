import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { Assets, DatasourceEntries, Datasources, Tags } from './endpoints';
import type { UnknownJson } from './json';
import { liveBareAsset } from './test-fixtures';
import { lastRequest, respond, respondNoContent } from './test-helpers';

/**
 * Response shapes seen in a live run against a trial space (11-16). Storyblok
 * answers several updates and deletes with a bodyless 204, and the single
 * asset routes return the asset without a wrapper.
 */
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const SPACE_ID = 296608950365974;
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint
function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint(
		{
			key: 'storyblok-personal-token',
			options: { spaceId: SPACE_ID },
		} as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;
beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.mocked(logEventFromContext).mockClear();
});
afterEach(() => fetchMock.mockRestore());

describe('bare asset bodies', () => {
	it('wraps the asset that GET /assets/:id returns', async () => {
		respond(fetchMock, liveBareAsset);
		const result = await invoke(Assets.get, { asset_id: liveBareAsset.id });
		expect(result).toMatchObject({
			asset: { id: liveBareAsset.id, content_type: 'image/png' },
		});
	});

	it('wraps the asset that DELETE /assets/:id returns', async () => {
		respond(fetchMock, liveBareAsset);
		const result = await invoke(Assets.remove, { asset_id: liveBareAsset.id });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result).toMatchObject({ asset: { id: liveBareAsset.id } });
	});

	it('still accepts a wrapped asset', async () => {
		respond(fetchMock, { asset: liveBareAsset });
		const result = await invoke(Assets.get, { asset_id: liveBareAsset.id });
		expect(result).toMatchObject({ asset: { id: liveBareAsset.id } });
	});
});

describe('bodyless 204 answers', () => {
	it('assets.update returns the metadata it sent', async () => {
		respondNoContent(fetchMock);
		const result = await invoke(Assets.update, { asset_id: 900, alt: 'Logo' });
		expect(result).toEqual({ asset: { id: 900, alt: 'Logo' } });
	});

	it('tags.update returns the new name', async () => {
		respondNoContent(fetchMock);
		const result = await invoke(Tags.update, {
			tag_id: 'home',
			name: 'landing',
		});
		expect(result).toEqual({ tag: { name: 'landing' } });
	});

	it('tags.delete confirms the tag it deleted', async () => {
		respondNoContent(fetchMock);
		const result = await invoke(Tags.remove, { tag_id: 'home' });
		expect(result).toEqual({ id: 'home', deleted: true });
	});

	it('datasourceEntries.update returns the entry it sent', async () => {
		respondNoContent(fetchMock);
		const result = await invoke(DatasourceEntries.update, {
			datasource_entry_id: 888,
			datasource_id: 777,
			name: 'nl',
			value: 'v2',
		});
		expect(result).toEqual({
			datasource_entry: { id: 888, name: 'nl', value: 'v2' },
		});
	});

	it('datasourceEntries.delete confirms the entry it deleted', async () => {
		respondNoContent(fetchMock);
		const result = await invoke(DatasourceEntries.remove, {
			datasource_entry_id: 888,
		});
		expect(result).toEqual({ id: 888, deleted: true });
	});

	it('datasources.delete confirms the datasource it deleted', async () => {
		respondNoContent(fetchMock);
		const result = await invoke(Datasources.remove, { datasource_id: 777 });
		expect(result).toEqual({ id: 777, deleted: true });
	});
});

describe('review round on 9c8e96fb5', () => {
	it('does not read an empty JSON object as a 204', async () => {
		respond(fetchMock, {});
		// The body is validated as the record, not replaced by what was sent.
		expect(
			await invoke(Tags.update, { tag_id: 'home', name: 'landing' }),
		).toEqual({ tag: {} });
	});

	it('rejects a delete body that does not hold the record', async () => {
		respond(fetchMock, { unexpected: true });
		await expect(
			invoke(Datasources.remove, { datasource_id: 777 }),
		).rejects.toThrow(/unexpected body/);

		respond(fetchMock, { unexpected: true });
		await expect(
			invoke(DatasourceEntries.remove, { datasource_entry_id: 888 }),
		).rejects.toThrow(/unexpected body/);

		respond(fetchMock, { unexpected: true });
		await expect(invoke(Tags.remove, { tag_id: 'home' })).rejects.toThrow(
			/unexpected body/,
		);
	});

	it('accepts a delete body that holds the record', async () => {
		respond(fetchMock, { datasource: { id: 777, name: 'x' } });
		expect(await invoke(Datasources.remove, { datasource_id: 777 })).toEqual({
			id: 777,
			deleted: true,
		});
	});

	it('keeps a tag name out of both error URLs', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'Not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		const error = await invoke(Tags.remove, {
			tag_id: 'ann@example.com',
		}).catch(
			(caught: unknown) => caught, // unknown: rejection reason, narrowed below
		);
		expect(error).toBeInstanceOf(ApiError);
		const failure = error as ApiError;
		expect(failure.url).not.toContain('ann');
		expect(failure.request.url).not.toContain('ann');
		expect(failure.url).toContain('/tags/');
	});
});
