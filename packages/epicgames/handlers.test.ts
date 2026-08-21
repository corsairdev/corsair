/**
 * Handler-level unit tests: invoke every endpoint function with a mock
 * HTTP client so path construction, query/body assembly, and function
 * extraction are covered in CI (Greptile R2 / 5/5).
 */
import { logEventFromContext } from 'corsair/core';
import { makeEpicGamesRequest } from './client';
import * as Islands from './endpoints/islands';
import * as RemoteControl from './endpoints/remote-control';
import type { EpicGamesContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeEpicGamesRequest: jest.fn(),
}));

const mockRequest = makeEpicGamesRequest as jest.MockedFunction<
	typeof makeEpicGamesRequest
>;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function mockCtx(overrides: Partial<EpicGamesContext> = {}): EpicGamesContext {
	return {
		key: 'test-token',
		options: {
			remoteControlBaseUrl: 'http://127.0.0.1:30010',
			remoteControlBearer: true,
		},
		...overrides,
	} as EpicGamesContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
	mockRequest.mockResolvedValue({ ok: true });
});

describe('Epic Games island handlers (mocked HTTP)', () => {
	it('islands.list → GET /islands with size/after/before', async () => {
		mockRequest.mockResolvedValueOnce({ data: [], links: {}, meta: {} });
		await Islands.list(mockCtx(), { size: 5, after: 'cursor1' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/islands',
			'test-token',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ size: 5, after: 'cursor1' }),
				bearer: true, // token present
			}),
		);
		expect(mockLog).toHaveBeenCalled();
	});

	it('islands.get → GET /islands/{code}', async () => {
		await Islands.get(mockCtx(), { code: '1234-5678-9012' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/islands/1234-5678-9012',
			'test-token',
			expect.objectContaining({ method: 'GET', bearer: true }),
		);
	});

	it('islands.getMetricsByInterval → /metrics when interval omitted', async () => {
		await Islands.getMetricsByInterval(mockCtx(), { code: 'ABCD-0000' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/islands/ABCD-0000/metrics',
			'test-token',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('islands.getMetricsByInterval → /metrics/{interval} when set', async () => {
		await Islands.getMetricsByInterval(mockCtx(), {
			code: 'ABCD-0000',
			interval: 'hour',
			from: '2026-07-01T00:00:00.000Z',
			to: '2026-07-02T00:00:00.000Z',
			metrics: ['plays', 'peakCCU'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/islands/ABCD-0000/metrics/hour',
			'test-token',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({
					from: '2026-07-01T00:00:00.000Z',
					to: '2026-07-02T00:00:00.000Z',
					metrics: ['plays', 'peakCCU'],
				}),
			}),
		);
	});

	it('islands.getMetricsByInterval omits metrics filter on /metrics (no interval)', async () => {
		await Islands.getMetricsByInterval(mockCtx(), {
			code: 'ABCD-0000',
			metrics: 'plays',
		});
		const call = mockRequest.mock.calls.find(
			(c) => c[0] === '/islands/ABCD-0000/metrics',
		);
		expect(call?.[2]).toEqual(
			expect.objectContaining({
				query: expect.not.objectContaining({ metrics: expect.anything() }),
			}),
		);
	});

	it('islands.list without token does not send Bearer', async () => {
		await Islands.list(mockCtx({ key: '' }), { size: 1 });
		expect(mockRequest).toHaveBeenCalledWith(
			'/islands',
			'',
			expect.objectContaining({ bearer: false }),
		);
	});

	const metricCases: Array<{
		fn: (
			ctx: EpicGamesContext,
			input: { code: string; interval?: 'day' },
		) => Promise<unknown>;
		segment: string;
	}> = [
		{ fn: Islands.getPlays, segment: 'plays' },
		{ fn: Islands.getUniquePlayers, segment: 'unique-players' },
		{ fn: Islands.getMinutesPlayed, segment: 'minutes-played' },
		{
			fn: Islands.getAvgMinutesPerPlayer,
			segment: 'average-minutes-per-player',
		},
		{ fn: Islands.getPeakCcu, segment: 'peak-ccu' },
		{ fn: Islands.getFavorites, segment: 'favorites' },
		{ fn: Islands.getRecommendations, segment: 'recommendations' },
		{ fn: Islands.getRetention, segment: 'retention' },
	];

	for (const { fn, segment } of metricCases) {
		it(`island metric ${segment} → /metrics/day/${segment}`, async () => {
			mockRequest.mockResolvedValueOnce({ intervals: [] });
			await fn(mockCtx(), { code: 'CODE-1', interval: 'day' });
			expect(mockRequest).toHaveBeenCalledWith(
				`/islands/CODE-1/metrics/day/${segment}`,
				'test-token',
				expect.objectContaining({ method: 'GET', bearer: true }),
			);
		});
	}
});

describe('Epic Games remote-control handlers (mocked HTTP)', () => {
	it('initiateSession → PUT /remote/control/session', async () => {
		await RemoteControl.initiateSession(mockCtx(), {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/control/session',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				baseUrl: 'http://127.0.0.1:30010',
			}),
		);
	});

	it('batch → PUT /remote/batch with Requests body', async () => {
		await RemoteControl.batch(mockCtx(), {
			requests: [{ RequestId: 1, URL: '/remote/info', Verb: 'GET' }],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/batch',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: {
					Requests: [{ RequestId: 1, URL: '/remote/info', Verb: 'GET' }],
				},
			}),
		);
	});

	it('corsPreflight → OPTIONS /remote', async () => {
		await RemoteControl.corsPreflight(mockCtx(), {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote',
			'test-token',
			expect.objectContaining({ method: 'OPTIONS' }),
		);
	});

	it('getPreset → GET /remote/preset/{name}', async () => {
		await RemoteControl.getPreset(mockCtx(), { presetName: 'MyPreset' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset',
			'test-token',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('getPresetMetadata → GET .../metadata', async () => {
		await RemoteControl.getPresetMetadata(mockCtx(), {
			presetName: 'MyPreset',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset/metadata',
			'test-token',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('getPresetMetadataKey → GET .../metadata/{key}', async () => {
		await RemoteControl.getPresetMetadataKey(mockCtx(), {
			presetName: 'MyPreset',
			key: 'author',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset/metadata/author',
			'test-token',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('putPresetMetadataKey → PUT .../metadata/{key}', async () => {
		await RemoteControl.putPresetMetadataKey(mockCtx(), {
			presetName: 'MyPreset',
			key: 'author',
			value: 'dev',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset/metadata/author',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: { Value: 'dev' },
			}),
		);
	});

	it('deletePresetMetadataKey → DELETE .../metadata/{key}', async () => {
		await RemoteControl.deletePresetMetadataKey(mockCtx(), {
			presetName: 'MyPreset',
			key: 'author',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset/metadata/author',
			'test-token',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('getPresetProperty → GET .../property/{name}', async () => {
		await RemoteControl.getPresetProperty(mockCtx(), {
			presetName: 'MyPreset',
			propertyName: 'Location',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset/property/Location',
			'test-token',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('updatePresetProperty → PUT .../property/{name}', async () => {
		await RemoteControl.updatePresetProperty(mockCtx(), {
			presetName: 'MyPreset',
			propertyName: 'Location',
			value: { X: 1, Y: 2, Z: 3 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset/property/Location',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: { PropertyValue: { X: 1, Y: 2, Z: 3 } },
			}),
		);
	});

	it('invokePresetFunction → PUT .../function/{name}', async () => {
		await RemoteControl.invokePresetFunction(mockCtx(), {
			presetName: 'MyPreset',
			functionName: 'DoSomething',
			parameters: { a: 1 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/MyPreset/function/DoSomething',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: { Parameters: { a: 1 } },
			}),
		);
	});

	it('describeObject → PUT /remote/object/describe', async () => {
		await RemoteControl.describeObject(mockCtx(), {
			objectPath: '/Game/Map.Map:PersistentLevel.Actor',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/object/describe',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: { objectPath: '/Game/Map.Map:PersistentLevel.Actor' },
			}),
		);
	});

	it('callObjectFunction → PUT /remote/object/call', async () => {
		await RemoteControl.callObjectFunction(mockCtx(), {
			objectPath: '/Game/A',
			functionName: 'SetActorLocation',
			parameters: { NewLocation: { X: 0 } },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/object/call',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: expect.objectContaining({
					objectPath: '/Game/A',
					functionName: 'SetActorLocation',
				}),
			}),
		);
	});

	it('putObjectProperty → PUT /remote/object/property (nested propertyValue)', async () => {
		await RemoteControl.putObjectProperty(mockCtx(), {
			objectPath: '/Game/A',
			access: 'WRITE_ACCESS',
			propertyName: 'bHidden',
			propertyValue: { bHidden: true },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/object/property',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: {
					objectPath: '/Game/A',
					access: 'WRITE_ACCESS',
					propertyName: 'bHidden',
					propertyValue: { bHidden: true },
				},
			}),
		);
	});

	it('putObjectProperty keeps propertyValue nested (no top-level flatten)', async () => {
		await RemoteControl.putObjectProperty(mockCtx(), {
			objectPath: '/Game/A',
			access: 'WRITE_TRANSACTION_ACCESS',
			propertyValue: { objectPath: '/spoofed', bHidden: true },
		});
		const call = mockRequest.mock.calls.find(
			(c) => c[0] === '/remote/object/property',
		);
		const body = (
			call?.[2] as {
				body: {
					objectPath: string;
					access: string;
					propertyValue: Record<string, unknown>;
				};
			}
		).body;
		expect(body.objectPath).toBe('/Game/A');
		expect(body.access).toBe('WRITE_TRANSACTION_ACCESS');
		expect(body.propertyValue).toEqual({
			objectPath: '/spoofed',
			bHidden: true,
		});
		expect(body).not.toHaveProperty('bHidden');
	});

	it('getObjectThumbnail → PUT /remote/object/thumbnail', async () => {
		await RemoteControl.getObjectThumbnail(mockCtx(), {
			objectPath: '/Game/Asset.Asset',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/object/thumbnail',
			'test-token',
			expect.objectContaining({ method: 'PUT' }),
		);
	});

	it('listBlueprintCallableFunctions filters Functions key (not raw describe)', async () => {
		const funcs = [{ Name: 'Jump' }, { Name: 'Crouch' }];
		mockRequest.mockResolvedValueOnce({
			Name: 'MyActor',
			Properties: [{ Name: 'bHidden' }],
			Functions: funcs,
		});
		const result = await RemoteControl.listBlueprintCallableFunctions(
			mockCtx(),
			{ objectPath: '/Game/A' },
		);
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/object/describe',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: { objectPath: '/Game/A' },
			}),
		);
		expect(result).toEqual({
			objectPath: '/Game/A',
			functions: funcs,
			count: 2,
		});
		// Must not leak the full describe payload
		expect(result).not.toHaveProperty('Name');
		expect(result).not.toHaveProperty('Properties');
	});

	it('listBlueprintCallableFunctions accepts lowercase functions key', async () => {
		mockRequest.mockResolvedValueOnce({
			functions: [{ Name: 'Fire' }],
		});
		const result = await RemoteControl.listBlueprintCallableFunctions(
			mockCtx(),
			{ objectPath: '/Game/B' },
		);
		expect(result).toEqual({
			objectPath: '/Game/B',
			functions: [{ Name: 'Fire' }],
			count: 1,
		});
	});

	it('listBlueprintCallableFunctions reads nested Class.CallableFunctions', async () => {
		mockRequest.mockResolvedValueOnce({
			Class: { CallableFunctions: [{ Name: 'Reload' }] },
		});
		const result = await RemoteControl.listBlueprintCallableFunctions(
			mockCtx(),
			{ objectPath: '/Game/C' },
		);
		expect(result).toEqual({
			objectPath: '/Game/C',
			functions: [{ Name: 'Reload' }],
			count: 1,
		});
	});

	it('listBlueprintCallableFunctions returns empty list when no function keys', async () => {
		mockRequest.mockResolvedValueOnce({ Name: 'EmptyActor', Properties: [] });
		const result = await RemoteControl.listBlueprintCallableFunctions(
			mockCtx(),
			{ objectPath: '/Game/D' },
		);
		expect(result).toEqual({
			objectPath: '/Game/D',
			functions: [],
			count: 0,
		});
	});

	it('waitForObjectEvent → PUT /remote/object/event (UE PascalCase body)', async () => {
		await RemoteControl.waitForObjectEvent(mockCtx(), {
			objectPath: '/Game/A',
			eventType: 'ObjectPropertyChanged',
			propertyName: 'StaticMesh',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/object/event',
			'test-token',
			expect.objectContaining({
				method: 'PUT',
				body: {
					EventType: 'ObjectPropertyChanged',
					ObjectPath: '/Game/A',
					PropertyName: 'StaticMesh',
				},
			}),
		);
	});

	it('remote opts default bearer to false', async () => {
		await RemoteControl.getPreset(
			mockCtx({ options: { remoteControlBaseUrl: 'http://127.0.0.1:30010' } }),
			{ presetName: 'P' },
		);
		expect(mockRequest).toHaveBeenCalledWith(
			'/remote/preset/P',
			'test-token',
			expect.objectContaining({ bearer: false }),
		);
	});
});
