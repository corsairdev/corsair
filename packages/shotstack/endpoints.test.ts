import {
	Assets,
	Generations,
	Media,
	Renders,
	Sources,
	Templates,
	Uploads,
} from './endpoints';
import {
	ASSET_ID,
	assetReady,
	assetsByRender,
	editNotFound,
	generationDone,
	generationModels,
	generationQuote,
	probeResponse,
	renderDone,
	renderFailed,
	renderQueued,
	sourceList,
	sourceQueued,
	sourceReady,
	templateCreated,
	templateData,
	templateList,
	transferQueued,
	uploadCreated,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing per operation', () => {
	it('renders.create returns the queued envelope', async () => {
		respond(renderQueued, 201);

		const result = await invoke(Renders.create, {
			timeline: {
				tracks: [
					{
						clips: [
							{ asset: { type: 'title', text: 'Hi' }, start: 0, length: 3 },
						],
					},
				],
			},
			output: { format: 'mp4', resolution: 'sd' },
		});
		expect(result).toMatchObject({
			success: true,
			response: {
				id: renderQueued.response.id,
				message: 'Render Successfully Queued',
			},
		});
	});

	it('renders.get returns the render with its status and url', async () => {
		respond(renderDone);

		const result = await invoke(Renders.get, { id: renderDone.response.id });
		expect(result).toMatchObject({
			response: { status: 'done', url: renderDone.response.url, duration: 8.5 },
		});
	});

	it('renders.get keeps a failed status with its error message', async () => {
		respond(renderFailed);

		const result = await invoke(Renders.get, { id: renderFailed.response.id });
		expect(result).toMatchObject({
			response: { status: 'failed', error: renderFailed.response.error },
		});
	});

	it('templates.list returns the templates array', async () => {
		respond(templateList);

		const result = await invoke(Templates.list, {});
		expect(result).toMatchObject({
			response: {
				owner: templateList.response.owner,
				templates: [
					{ id: templateList.response.templates[0]?.id, name: 'My template' },
				],
			},
		});
	});

	it('templates.get returns the saved edit', async () => {
		respond(templateData);

		const result = await invoke(Templates.get, {
			id: templateData.response.id,
		});
		expect(result).toMatchObject({
			response: {
				name: 'My template',
				template: { output: { format: 'mp4', resolution: 'sd' } },
			},
		});
	});

	it('templates.create and update return the template id', async () => {
		respond(templateCreated);
		const created = await invoke(Templates.create, {
			name: 'My template',
			template: {
				timeline: {
					tracks: [
						{
							clips: [
								{ asset: { type: 'title', text: 'Hi' }, start: 0, length: 3 },
							],
						},
					],
				},
				output: { format: 'mp4', resolution: 'sd' },
			},
		});
		expect(created).toMatchObject({
			response: { id: templateCreated.response.id },
		});

		respond(templateCreated);
		const updated = await invoke(Templates.update, {
			id: templateCreated.response.id,
			name: 'Renamed',
		});
		expect(updated).toMatchObject({
			response: { id: templateCreated.response.id },
		});
	});

	it('templates.delete turns the empty 204 into {}', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await invoke(Templates.remove, {
			id: templateData.response.id,
		});
		expect(result).toEqual({});
	});

	it('templates.render returns the queued render', async () => {
		respond(renderQueued, 201);

		const result = await invoke(Templates.render, {
			id: templateData.response.id,
		});
		expect(result).toMatchObject({
			response: { id: renderQueued.response.id },
		});
	});

	it('generations.create and get return the bare generation', async () => {
		respond(generationDone);
		const created = await invoke(Generations.create, {
			asset: { type: 'image', prompt: 'A lighthouse' },
		});
		expect(created).toMatchObject({
			id: generationDone.id,
			status: 'done',
			url: generationDone.url,
		});

		respond(generationDone);
		const read = await invoke(Generations.get, { id: generationDone.id });
		expect(read).toMatchObject({ status: 'done' });
	});

	it('generations.quote returns credits and ceiling', async () => {
		respond(generationQuote);

		const result = await invoke(Generations.quote, {
			asset: { type: 'image', prompt: 'A lighthouse' },
		});
		expect(result).toEqual({ credits: 0.6038, ceiling: false });
	});

	it('generations.listModels returns the models array and getModel one model', async () => {
		respond(generationModels);
		const list = await invoke(Generations.listModels, {});
		expect(list).toMatchObject({
			models: [{ model: generationModels.models[0]?.model, type: 'video' }],
		});

		respond(generationModels.models[0]);
		const one = await invoke(Generations.getModel, {
			id: generationModels.models[0]?.model,
		});
		expect(one).toMatchObject({ model: generationModels.models[0]?.model });
	});

	it('media.probe returns the FFprobe metadata', async () => {
		respond(probeResponse);

		const result = await invoke(Media.probe, {
			url: 'https://example.com/a.mp4',
		});
		expect(result).toMatchObject({
			response: {
				width: 1920,
				height: 1080,
				duration: 30,
				fps: 25,
				type: 'video',
			},
		});
	});

	it('sources.fetch unwraps the queued source id', async () => {
		respond(sourceQueued, 201);

		const result = await invoke(Sources.fetch, {
			url: 'https://example.com/video.mp4',
		});
		expect(result).toEqual({ id: sourceQueued.data.id, type: 'source' });
	});

	it('sources.list unwraps the attributes of each source', async () => {
		respond(sourceList);

		const result = await invoke(Sources.list, {});
		expect(result).toMatchObject({
			sources: [{ id: sourceReady.data.attributes.id, status: 'ready' }],
		});
	});

	it('sources.get unwraps the source attributes', async () => {
		respond(sourceReady);

		const result = await invoke(Sources.get, { id: sourceQueued.data.id });
		expect(result).toMatchObject({
			id: sourceQueued.data.id,
			status: 'ready',
			width: 1920,
		});
	});

	it('sources.delete turns the empty 204 into {}', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await invoke(Sources.remove, { id: sourceQueued.data.id });
		expect(result).toEqual({});
	});

	it('uploads.create unwraps the signed url', async () => {
		respond(uploadCreated);

		const result = await invoke(Uploads.create, {});
		expect(result).toMatchObject({
			id: uploadCreated.data.attributes.id,
			url: uploadCreated.data.attributes.url,
			expires: uploadCreated.data.attributes.expires,
		});
	});

	it('assets.get unwraps the asset attributes with its CDN url', async () => {
		respond(assetReady);

		const result = await invoke(Assets.get, { id: ASSET_ID });
		expect(result).toMatchObject({
			id: ASSET_ID,
			status: 'ready',
			url: assetReady.data.attributes.url,
		});
	});

	it('assets.getByRenderId unwraps the asset array', async () => {
		respond(assetsByRender);

		const result = await invoke(Assets.getByRenderId, {
			id: renderDone.response.id,
		});
		expect(result).toMatchObject({
			assets: [{ id: ASSET_ID, renderId: renderDone.response.id }],
		});
	});

	it('assets.transfer unwraps the transfer status', async () => {
		respond(transferQueued);

		const result = await invoke(Assets.transfer, {
			url: 'https://example.com/a.mp4',
			id: '018e8937-5015-75ee-aab6-03f214981133',
			destinations: [{ provider: 'shotstack' }],
		});
		expect(result).toMatchObject({
			status: 'queued',
			owner: transferQueued.data.attributes.owner,
		});
	});

	it('assets.delete turns the empty 204 into {}', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await invoke(Assets.remove, { id: ASSET_ID });
		expect(result).toEqual({});
	});
});

describe('rejections', () => {
	it('rejects a wrong-shaped payload: an edit envelope whose response is a string', async () => {
		respond({ success: true, message: 'OK', response: 'not an object' });

		const error = await captureError(invoke(Renders.get, { id: 'x' }));
		expect(error).toHaveProperty('name', 'ZodError');
	});

	it('rejects a malformed known field: a status outside the documented enum', async () => {
		respond({
			...renderDone,
			response: { ...renderDone.response, status: 'finished' },
		});

		const error = await captureError(invoke(Renders.get, { id: 'x' }));
		expect(error).toHaveProperty('name', 'ZodError');
	});

	it('treats a 2xx body with success:false as a failure, not data', async () => {
		respond(editNotFound, 200);

		const error = await captureError(invoke(Renders.get, { id: 'x' }));
		expect(error).toHaveProperty('name', 'ZodError');
	});

	it('rejects an output that needs resolution or size for a non-mp3 format', async () => {
		respond(renderQueued, 201);

		const error = await captureError(
			invoke(Renders.create, {
				timeline: {
					tracks: [
						{
							clips: [
								{ asset: { type: 'title', text: 'Hi' }, start: 0, length: 3 },
							],
						},
					],
				},
				output: { format: 'mp4' },
			}),
		);
		expect(error).toHaveProperty('name', 'ZodError');
	});

	it('allows an mp3 output with no resolution or size', async () => {
		respond(renderQueued, 201);

		await expect(
			invoke(Renders.create, {
				timeline: {
					tracks: [
						{
							clips: [
								{ asset: { type: 'title', text: 'Hi' }, start: 0, length: 3 },
							],
						},
					],
				},
				output: { format: 'mp3' },
			}),
		).resolves.toBeDefined();
	});

	it('rejects merged without data on renders.get', async () => {
		const error = await captureError(
			invoke(Renders.get, { id: 'x', merged: true }),
		);
		expect(error).toHaveProperty('name', 'ZodError');
	});

	it('rejects a malformed json:api body instead of reading an empty page', async () => {
		respond({});
		const error = await captureError(invoke(Sources.get, { id: 'x' }));
		expect(error).toHaveProperty('name', 'ShotstackAPIError');
	});
});
