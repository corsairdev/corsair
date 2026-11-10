import { logEventFromContext } from 'corsair/core';
import { Libraries, Transformations } from './endpoints';
import {
	LIBRARIES,
	LIBRARY,
	LIBRARY_VERSIONS,
	NOT_PUBLISHED,
	PUBLISH_TEST_FAILED,
	PUBLISHED,
	TRANSFORMATION,
	TRANSFORMATION_CONNECTED,
	TRANSFORMATION_VERSIONS,
	TRANSFORMATIONS,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('transformations.list', () => {
	it('reads the published transformations', async () => {
		respond(fetchMock, TRANSFORMATIONS);

		const result = (await invoke(Transformations.list, {})) as {
			transformations?: { id?: string; language?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/transformations');
		expect(result.transformations).toHaveLength(2);
		expect(result.transformations?.[0]?.language).toBe('javascript');
	});

	it('logs the count', async () => {
		respond(fetchMock, TRANSFORMATIONS);

		await invoke(Transformations.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rudderstacktransform.transformations.list',
			{ count: 2 },
			'completed',
		);
	});
});

describe('transformations.create', () => {
	it('creates an unpublished transformation by default', async () => {
		respond(fetchMock, TRANSFORMATION);

		const result = (await invoke(Transformations.create, {
			name: 'Get metadata',
			language: 'javascript',
			code: 'export function transformEvent(event) { return event; }',
		})) as { id?: string; versionId?: string; codeVersion?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/transformations');
		expect(request.method).toBe('POST');
		// publish is absent, which RudderStack reads as false.
		expect(request.query.publish).toBeUndefined();
		expect(request.bodyRecord).toMatchObject({
			name: 'Get metadata',
			language: 'javascript',
		});
		expect(result.id).toBe('2LnbcGgKON5BbHHuyYVesZ24uqu');
		// codeVersion is the string "1", as RudderStack sends it.
		expect(result.codeVersion).toBe('1');
	});

	it('sends publish=true as a query flag when asked', async () => {
		respond(fetchMock, TRANSFORMATION);

		await invoke(Transformations.create, {
			name: 'Live',
			language: 'javascript',
			publish: true,
		});

		expect(lastRequest(fetchMock).query.publish).toBe('true');
	});

	it('keeps destinationIds in the body', async () => {
		respond(fetchMock, TRANSFORMATION);

		await invoke(Transformations.create, {
			name: 'Live',
			language: 'pythonfaas',
			publish: true,
			destinationIds: ['dest-1', 'dest-2'],
		});

		expect(lastRequest(fetchMock).bodyRecord?.destinationIds).toEqual([
			'dest-1',
			'dest-2',
		]);
	});

	it('accepts pythonfaas as the language', async () => {
		respond(fetchMock, { ...TRANSFORMATION, language: 'pythonfaas' });

		await invoke(Transformations.create, {
			name: 'Python',
			language: 'pythonfaas',
		});

		expect(lastRequest(fetchMock).bodyRecord?.language).toBe('pythonfaas');
	});

	it('rejects a language RudderStack does not accept', async () => {
		await expect(
			invoke(Transformations.create, { name: 'x', language: 'typescript' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a create with no name', async () => {
		await expect(
			invoke(Transformations.create, { language: 'javascript' }),
		).rejects.toThrow();
	});

	it('logs the new ID and whether it was published', async () => {
		respond(fetchMock, TRANSFORMATION);

		await invoke(Transformations.create, {
			name: 'Live',
			language: 'javascript',
			publish: true,
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rudderstacktransform.transformations.create',
			{
				transformationId: '2LnbcGgKON5BbHHuyYVesZ24uqu',
				language: 'javascript',
				published: true,
			},
			'completed',
		);
	});
});

describe('transformations.get', () => {
	it('reads one transformation', async () => {
		respond(fetchMock, TRANSFORMATION);

		const result = (await invoke(Transformations.get, {
			id: '2LnbcGgKON5BbHHuyYVesZ24uqu',
		})) as { name?: string };

		expect(lastRequest(fetchMock).path).toBe(
			'/transformations/2LnbcGgKON5BbHHuyYVesZ24uqu',
		);
		expect(result.name).toBe('Get metadata');
	});

	it('percent-encodes the ID', async () => {
		respond(fetchMock, TRANSFORMATION);

		await invoke(Transformations.get, { id: 'a/b c' });

		expect(lastRequest(fetchMock).path).toBe('/transformations/a%2Fb%20c');
	});

	it('rejects an empty ID', async () => {
		await expect(invoke(Transformations.get, { id: '' })).rejects.toThrow();
	});
});

describe('transformations.update', () => {
	it('posts the new code and writes a revision', async () => {
		respond(fetchMock, TRANSFORMATION);

		const result = (await invoke(Transformations.update, {
			id: '2C8Vk2wj8qkofy00YzJbvJOGeqa',
			name: 'Updated transformation JS 2',
			description: 'Updated description',
			code: 'export function transformEvent(event) { return event; }\n',
		})) as { versionId?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/transformations/2C8Vk2wj8qkofy00YzJbvJOGeqa');
		expect(request.bodyRecord).toMatchObject({
			name: 'Updated transformation JS 2',
			description: 'Updated description',
		});
		expect(result.versionId).toBeDefined();
	});

	it('sends publish=true to make the revision live', async () => {
		respond(fetchMock, TRANSFORMATION);

		await invoke(Transformations.update, { id: 'x', publish: true });

		expect(lastRequest(fetchMock).query.publish).toBe('true');
	});
});

describe('transformations.delete', () => {
	it('deletes by ID with no body', async () => {
		// RudderStack answers a delete with a bare 200.
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Transformations.remove, { id: '2LyH0PQOBAJo7UgFXfDoMacGDPZ' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/transformations/2LyH0PQOBAJo7UgFXfDoMacGDPZ');
	});

	it('logs the deleted ID', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Transformations.remove, { id: 'abc' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rudderstacktransform.transformations.delete',
			{ transformationId: 'abc' },
			'completed',
		);
	});
});

describe('transformations.listVersions', () => {
	it('reads the capitalised TransformationVersions key', async () => {
		respond(fetchMock, TRANSFORMATION_VERSIONS);

		const result = (await invoke(Transformations.listVersions, {
			id: '2C8Vk2wj8qkofy00YzJbvJOGeqa',
		})) as { TransformationVersions?: { versionId?: string }[] };

		expect(lastRequest(fetchMock).path).toBe(
			'/transformations/2C8Vk2wj8qkofy00YzJbvJOGeqa/versions',
		);
		expect(result.TransformationVersions).toHaveLength(2);
	});

	it('passes count and orderBy', async () => {
		respond(fetchMock, TRANSFORMATION_VERSIONS);

		await invoke(Transformations.listVersions, {
			id: 'x',
			count: 2,
			orderBy: 'desc',
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			count: '2',
			orderBy: 'desc',
		});
	});

	it('rejects an orderBy other than asc or desc', async () => {
		await expect(
			invoke(Transformations.listVersions, { id: 'x', orderBy: 'newest' }),
		).rejects.toThrow();
	});
});

describe('transformations.getVersion', () => {
	it('reads one revision', async () => {
		respond(fetchMock, TRANSFORMATION);

		const result = (await invoke(Transformations.getVersion, {
			id: '2C8Vk2wj8qkofy00YzJbvJOGeqa',
			versionId: '2C8ifOCgRIpxgyF9voHIgUHFP4c',
		})) as { versionId?: string };

		expect(lastRequest(fetchMock).path).toBe(
			'/transformations/2C8Vk2wj8qkofy00YzJbvJOGeqa/versions/2C8ifOCgRIpxgyF9voHIgUHFP4c',
		);
		expect(result.versionId).toBeDefined();
	});
});

describe('transformations.connect', () => {
	it('posts the destinationId and returns the connection', async () => {
		respond(fetchMock, TRANSFORMATION_CONNECTED);

		const result = (await invoke(Transformations.connect, {
			id: '2C8Vk2wj8qkofy00YzJbvJOGeqa',
			destinationId: '2C8YtptB4KF2eL3KRi9mCFkY3BF',
		})) as { destinations?: { id?: string; enabled?: boolean }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(
			'/transformations/2C8Vk2wj8qkofy00YzJbvJOGeqa/connectToDestination',
		);
		expect(request.bodyRecord).toEqual({
			destinationId: '2C8YtptB4KF2eL3KRi9mCFkY3BF',
		});
		expect(result.destinations?.[0]?.enabled).toBe(true);
	});

	it('surfaces the documented 400 for an unpublished transformation', async () => {
		respond(fetchMock, NOT_PUBLISHED, 400);

		await expect(
			invoke(Transformations.connect, { id: 'x', destinationId: 'd' }),
		).rejects.toThrow('Transformation is not published');
	});

	it('logs the connection count', async () => {
		respond(fetchMock, TRANSFORMATION_CONNECTED);

		await invoke(Transformations.connect, { id: 'x', destinationId: 'd' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rudderstacktransform.transformations.connect',
			{ transformationId: '2LnbcGgKON5BbHHuyYVesZ24uqu', destinations: 1 },
			'completed',
		);
	});
});

describe('transformations.disconnect', () => {
	it('posts the destinationId to the disconnect route', async () => {
		respond(fetchMock, TRANSFORMATION);

		await invoke(Transformations.disconnect, {
			id: '2C8Vk2wj8qkofy00YzJbvJOGeqa',
			destinationId: '2C8YtptB4KF2eL3KRi9mCFkY3BF',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(
			'/transformations/2C8Vk2wj8qkofy00YzJbvJOGeqa/disconnectFromDestination',
		);
		expect(request.bodyRecord).toEqual({
			destinationId: '2C8YtptB4KF2eL3KRi9mCFkY3BF',
		});
	});
});

describe('libraries.create', () => {
	it('creates a library and returns its importName', async () => {
		respond(fetchMock, LIBRARY);

		const result = (await invoke(Libraries.create, {
			name: 'cool library',
			language: 'javascript',
			code: 'export function add(a,b) {return a+b; }',
			description: 'cool description',
		})) as { importName?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/libraries');
		expect(request.bodyRecord).toMatchObject({
			name: 'cool library',
			language: 'javascript',
		});
		// The import name is derived from the name and cannot be changed later.
		expect(result.importName).toBe('coolLibrary');
	});

	it('sends publish=true when asked', async () => {
		respond(fetchMock, LIBRARY);

		await invoke(Libraries.create, {
			name: 'x',
			language: 'javascript',
			code: 'code',
			publish: true,
		});

		expect(lastRequest(fetchMock).query.publish).toBe('true');
	});

	it('rejects a library with no code', async () => {
		await expect(
			invoke(Libraries.create, { name: 'x', language: 'javascript' }),
		).rejects.toThrow();
	});
});

describe('libraries.list', () => {
	it('reads the libraries', async () => {
		respond(fetchMock, LIBRARIES);

		const result = (await invoke(Libraries.list, {})) as {
			libraries?: { importName?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/libraries');
		expect(result.libraries).toHaveLength(2);
		expect(result.libraries?.[0]?.importName).toBe('getCube');
	});
});

describe('libraries.get', () => {
	it('reads one library', async () => {
		respond(fetchMock, LIBRARY);

		const result = (await invoke(Libraries.get, {
			id: '2DmDQHMNpAk1HvvWBK2SlWhmPS2',
		})) as { name?: string };

		expect(lastRequest(fetchMock).path).toBe(
			'/libraries/2DmDQHMNpAk1HvvWBK2SlWhmPS2',
		);
		expect(result.name).toBe('cool library');
	});
});

describe('libraries.listVersions', () => {
	it('reads the revisions and their published flags', async () => {
		respond(fetchMock, LIBRARY_VERSIONS);

		const result = (await invoke(Libraries.listVersions, {
			id: '1pT7933tHRBPlEMIZt5Zi3VIht1',
		})) as { libraryVersions?: { isPublished?: boolean }[] };

		expect(lastRequest(fetchMock).path).toBe(
			'/libraries/1pT7933tHRBPlEMIZt5Zi3VIht1/versions',
		);
		expect(result.libraryVersions?.[0]?.isPublished).toBe(false);
		expect(result.libraryVersions?.[1]?.isPublished).toBe(true);
	});

	it('logs how many revisions are published', async () => {
		respond(fetchMock, LIBRARY_VERSIONS);

		await invoke(Libraries.listVersions, { id: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rudderstacktransform.libraries.listVersions',
			{ count: 2, published: 1 },
			'completed',
		);
	});
});

describe('libraries.getVersion', () => {
	it('reads one library revision', async () => {
		respond(fetchMock, {
			...LIBRARY,
			versionId: '1pT8KDAD66mQxnaUQxJpNs9qLFn',
			isPublished: false,
		});

		const result = (await invoke(Libraries.getVersion, {
			id: '1pT7933tHRBPlEMIZt5Zi3VIht1',
			versionId: '1pT8KDAD66mQxnaUQxJpNs9qLFn',
		})) as { isPublished?: boolean };

		expect(lastRequest(fetchMock).path).toBe(
			'/libraries/1pT7933tHRBPlEMIZt5Zi3VIht1/versions/1pT8KDAD66mQxnaUQxJpNs9qLFn',
		);
		expect(result.isPublished).toBe(false);
	});
});

describe('libraries.update', () => {
	it('posts the code, language and description', async () => {
		respond(fetchMock, LIBRARY);

		await invoke(Libraries.update, {
			id: '2MTEP4IhlKLXYtnbOqAOx1kKcBd',
			code: 'export function sum(a, b) { return a + b; }',
			language: 'javascript',
			description: 'Updated library description',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/libraries/2MTEP4IhlKLXYtnbOqAOx1kKcBd');
		expect(request.bodyRecord).toMatchObject({
			code: 'export function sum(a, b) { return a + b; }',
			language: 'javascript',
		});
	});

	it('requires the language even though it cannot change', async () => {
		await expect(
			invoke(Libraries.update, { id: 'x', code: 'code' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends publish=true to make the revision live', async () => {
		respond(fetchMock, LIBRARY);

		await invoke(Libraries.update, {
			id: 'x',
			code: 'c',
			language: 'javascript',
			publish: true,
		});

		expect(lastRequest(fetchMock).query.publish).toBe('true');
	});
});

describe('libraries.delete', () => {
	it('deletes by ID', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Libraries.remove, { id: '2LyH0PQOBAJo7UgFXfDoMacGDPZ' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/libraries/2LyH0PQOBAJo7UgFXfDoMacGDPZ');
	});
});

describe('libraries.publish', () => {
	it('publishes transformation revisions with their test input', async () => {
		respond(fetchMock, PUBLISHED);

		const result = (await invoke(Libraries.publish, {
			transformations: [
				{
					versionId: '2MTC30bbSUANEeLb7TeknDbBeFy',
					testInput: [{ anonymousId: '8d872292709c6fbe', messageId: 'm1' }],
				},
			],
		})) as { published?: boolean };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/libraries/publish');
		expect(request.bodyRecord?.transformations).toHaveLength(1);
		expect(result.published).toBe(true);
	});

	it('publishes library revisions', async () => {
		respond(fetchMock, PUBLISHED);

		await invoke(Libraries.publish, {
			libraries: [{ versionId: '2MTDbAFBqzB7Wg8mWyWNBIk5DOU' }],
		});

		expect(lastRequest(fetchMock).bodyRecord?.libraries).toHaveLength(1);
	});

	it('publishes both kinds in one call', async () => {
		respond(fetchMock, PUBLISHED);

		await invoke(Libraries.publish, {
			transformations: [{ versionId: 't1' }],
			libraries: [{ versionId: 'l1' }],
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			transformations: [{ versionId: 't1' }],
			libraries: [{ versionId: 'l1' }],
		});
	});

	it('rejects a publish with neither array', async () => {
		await expect(invoke(Libraries.publish, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects two empty arrays', async () => {
		await expect(
			invoke(Libraries.publish, { transformations: [], libraries: [] }),
		).rejects.toThrow();
	});

	it('surfaces a failed server-side test run', async () => {
		respond(fetchMock, PUBLISH_TEST_FAILED, 400);

		await expect(
			invoke(Libraries.publish, { transformations: [{ versionId: 't1' }] }),
		).rejects.toThrow('threw an exception');
	});

	it('logs both counts and the result', async () => {
		respond(fetchMock, PUBLISHED);

		await invoke(Libraries.publish, {
			transformations: [{ versionId: 't1' }],
			libraries: [{ versionId: 'l1' }, { versionId: 'l2' }],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'rudderstacktransform.libraries.publish',
			{ transformations: 1, libraries: 2, published: true },
			'completed',
		);
	});
});

describe('region routing', () => {
	it('sends a call to the EU host when the plugin is configured for it', async () => {
		respond(fetchMock, TRANSFORMATIONS);

		await invoke(Transformations.list, {}, 'eu');

		expect(lastRequest(fetchMock).origin).toBe(
			'https://api.eu.rudderstack.com',
		);
	});

	it('stays on the US host by default', async () => {
		respond(fetchMock, TRANSFORMATIONS);

		await invoke(Transformations.list, {});

		expect(lastRequest(fetchMock).origin).toBe('https://api.rudderstack.com');
	});
});
