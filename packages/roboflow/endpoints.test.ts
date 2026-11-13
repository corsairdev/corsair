import { logEventFromContext } from 'corsair/core';
import { Inference, Platform } from './endpoints';
import type { ProjectGetResponse, VersionGetResponse } from './endpoints/types';
import {
	AUTHENTICATED,
	BAD_KEY,
	IMAGE_DUPLICATE,
	IMAGE_UPLOADED,
	INFERENCE,
	INFERENCE_CLASSIFICATION,
	MODELS,
	PROJECT,
	PROJECT_CREATED,
	UNATTENDED,
	VERSION,
	WORKSPACE,
} from './test-fixtures';
import { invoke, lastRequest, respond, testContext } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('Unexpected unmocked fetch'));
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('reports authenticated when a workspace comes back', async () => {
		respond(fetchMock, AUTHENTICATED);

		const result = (await invoke(Platform.account, {})) as {
			authenticated?: boolean;
			workspace?: string | null;
		};

		expect(lastRequest(fetchMock).path).toBe('/');
		expect(result.authenticated).toBe(true);
		expect(result.workspace).toBe('my-workspace');
	});

	it('reports not authenticated when the 200 carries no workspace', async () => {
		respond(fetchMock, UNATTENDED);

		const result = (await invoke(Platform.account, {})) as {
			authenticated?: boolean;
			workspace?: string | null;
		};

		// The route answers 200 either way, so the workspace is the only signal.
		expect(result.authenticated).toBe(false);
		expect(result.workspace ?? null).toBeNull();
		// The instructions still come back, which is the trap: they read like a
		// success message.
		expect((result as { instructions?: string }).instructions).toContain(
			'Retrieve your API Key',
		);
	});

	it('logs whether the key worked', async () => {
		respond(fetchMock, AUTHENTICATED);

		await invoke(Platform.account, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'roboflow.account.get',
			{ authenticated: true, workspace: 'my-workspace' },
			'completed',
		);
	});
});

describe('workspace.get', () => {
	it('reads the workspace and its projects', async () => {
		respond(fetchMock, WORKSPACE);

		const result = (await invoke(Platform.workspace, {
			workspace: 'roboflow',
		})) as {
			workspace?: { name?: string; projects?: { id?: string }[] };
		};

		expect(lastRequest(fetchMock).path).toBe('/roboflow');
		expect(result.workspace?.name).toBe('Roboflow');
		expect(result.workspace?.projects?.[0]?.id).toBe(
			'roboflow/chess-sample-4ckfl',
		);
	});

	it('percent-encodes the slug', async () => {
		respond(fetchMock, WORKSPACE);

		await invoke(Platform.workspace, { workspace: 'my space' });

		expect(lastRequest(fetchMock).path).toBe('/my%20space');
	});
});

describe('project.get', () => {
	it('reads the project with its versions, newest first', async () => {
		respond(fetchMock, PROJECT);

		const result = (await invoke(Platform.project, {
			workspace: 'roboflow',
			project: 'chess-sample-4ckfl',
		})) as ProjectGetResponse;

		expect(lastRequest(fetchMock).path).toBe('/roboflow/chess-sample-4ckfl');
		expect(result.project?.images).toBe(12);
		expect(result.project?.unannotated).toBe(3);
		expect(result.versions).toHaveLength(1);
	});

	it('logs the image and version counts', async () => {
		respond(fetchMock, PROJECT);

		await invoke(Platform.project, {
			workspace: 'roboflow',
			project: 'chess-sample-4ckfl',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'roboflow.project.get',
			{ images: 12, unannotated: 3, versions: 1 },
			'completed',
		);
	});
});

describe('project.create', () => {
	it('posts the name, type and annotation group', async () => {
		respond(fetchMock, PROJECT_CREATED);

		const result = (await invoke(Platform.create, {
			workspace: 'roboflow',
			name: 'Sharks Dataset',
			type: 'object-detection',
			annotation: 'sharks',
			license: 'Private',
		})) as { id?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/roboflow/projects');
		expect(request.bodyRecord).toMatchObject({
			name: 'Sharks Dataset',
			type: 'object-detection',
			annotation: 'sharks',
			license: 'Private',
		});
		expect(result.id).toBe('roboflow/sharks-dataset-abc12');
	});

	it('accepts anomaly-detection as a type', async () => {
		respond(fetchMock, PROJECT_CREATED);

		await invoke(Platform.create, {
			workspace: 'ws',
			name: 'Defects',
			type: 'anomaly-detection',
			annotation: 'defects',
		});

		expect(lastRequest(fetchMock).bodyRecord?.type).toBe('anomaly-detection');
	});

	it('rejects a type the spec does not allow', async () => {
		await expect(
			invoke(Platform.create, {
				workspace: 'ws',
				name: 'x',
				type: 'ocr',
				annotation: 'y',
			}),
		).rejects.toThrow();
	});

	it('rejects a create with no annotation group', async () => {
		await expect(
			invoke(Platform.create, {
				workspace: 'ws',
				name: 'x',
				type: 'object-detection',
			}),
		).rejects.toThrow();
	});

	it('rejects a name over the documented 256 characters', async () => {
		await expect(
			invoke(Platform.create, {
				workspace: 'ws',
				name: 'x'.repeat(257),
				type: 'object-detection',
				annotation: 'y',
			}),
		).rejects.toThrow();
	});

	it('rejects a license the spec does not allow', async () => {
		await expect(
			invoke(Platform.create, {
				workspace: 'ws',
				name: 'x',
				type: 'object-detection',
				annotation: 'y',
				license: 'GPL',
			}),
		).rejects.toThrow();
	});
});

describe('project.delete', () => {
	it('deletes by workspace and project', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Platform.remove, {
			workspace: 'roboflow',
			project: 'chess-sample-4ckfl',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/roboflow/chess-sample-4ckfl');
	});
});

describe('version.get', () => {
	it('reads the version with its splits and preprocessing', async () => {
		respond(fetchMock, VERSION);

		const result = (await invoke(Platform.version, {
			workspace: 'roboflow',
			project: 'chess-sample-4ckfl',
			version: 3,
		})) as VersionGetResponse;

		expect(lastRequest(fetchMock).path).toBe('/roboflow/chess-sample-4ckfl/3');
		expect(result.version?.id).toBe('roboflow/chess-sample-4ckfl/3');
		expect(result.version?.preprocessing).toBeDefined();
	});

	it('rejects a non-integer version', async () => {
		await expect(
			invoke(Platform.version, {
				workspace: 'w',
				project: 'p',
				version: 1.5,
			}),
		).rejects.toThrow();
	});
});

describe('version.delete', () => {
	it('deletes the version by number', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Platform.deleteVersion, {
			workspace: 'roboflow',
			project: 'chess-sample-4ckfl',
			version: 3,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/roboflow/chess-sample-4ckfl/3');
	});
});

describe('models.list', () => {
	it('lists models and their metrics', async () => {
		respond(fetchMock, MODELS);

		const result = (await invoke(Platform.models, {
			workspace: 'roboflow',
			project: 'chess-sample-4ckfl',
		})) as {
			url?: string;
			train?: { status?: string };
			metrics?: { map50?: number };
		}[];

		expect(lastRequest(fetchMock).path).toBe(
			'/roboflow/chess-sample-4ckfl/models',
		);
		expect(result).toHaveLength(2);
		// url is the model ID infer takes.
		expect(result[0]?.url).toBe('chess-sample-4ckfl/3');
		expect(result[0]?.metrics?.map50).toBe(92.4);
	});

	it('logs how many finished training', async () => {
		respond(fetchMock, MODELS);

		await invoke(Platform.models, { workspace: 'w', project: 'p' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'roboflow.models.list',
			{ models: 2, finished: 1 },
			'completed',
		);
	});

	it('passes a NAS run group', async () => {
		respond(fetchMock, MODELS);

		await invoke(Platform.models, {
			workspace: 'w',
			project: 'p',
			group: 'nas-1',
		});

		expect(lastRequest(fetchMock).query.group).toBe('nas-1');
	});
});

describe('images.upload', () => {
	it('uploads by URL to the project ID route', async () => {
		respond(fetchMock, AUTHENTICATED);
		respond(fetchMock, IMAGE_UPLOADED);

		const result = (await invoke(Platform.upload, {
			project: 'my-workspace/chess-sample-4ckfl',
			image: 'https://x.com/a.jpg',
			batch: 'batch-1',
			tag: ['chess'],
		})) as { id?: string; success?: boolean };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/dataset/chess-sample-4ckfl/upload');
		expect(request.body).toBeUndefined();
		expect(request.query.image).toBe('https://x.com/a.jpg');
		expect(request.query).toMatchObject({ batch: 'batch-1', tag: 'chess' });
		expect(result.id).toBe('YbNIgavTIk2xOOmJsHv5');
	});

	it('uses the dataset route for a project slug', async () => {
		respond(fetchMock, IMAGE_UPLOADED);
		await invoke(Platform.upload, {
			project: 'my project',
			image: 'https://x.com/a.jpg',
		});
		expect(lastRequest(fetchMock).path).toBe('/dataset/my%20project/upload');
	});

	it('uploads base64 as the raw form body', async () => {
		respond(fetchMock, IMAGE_UPLOADED);
		await invoke(Platform.upload, {
			project: 'p',
			image: 'data:image/png;base64,aGVsbG8=',
		});
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new URL(url).searchParams.has('image')).toBe(false);
		expect(init.body).toBe('data:image/png;base64,aGVsbG8=');
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
	});

	it('reports a duplicate as a success, not a failure', async () => {
		respond(fetchMock, IMAGE_DUPLICATE);

		const result = (await invoke(Platform.upload, {
			project: 'chess',
			image: 'https://x.com/a.jpg',
		})) as { duplicate?: boolean; id?: string };

		expect(result.duplicate).toBe(true);
		// The existing image's id still comes back.
		expect(result.id).toBeDefined();
	});

	it('checks a workspace/project ID against the key before uploading', async () => {
		respond(fetchMock, AUTHENTICATED);
		respond(fetchMock, IMAGE_UPLOADED);

		await invoke(Platform.upload, {
			project: 'my-workspace/photos',
			image: 'https://x.com/a.jpg',
		});

		expect(fetchMock).toHaveBeenCalledTimes(2);
		const [rootUrl] = fetchMock.mock.calls[0] as [string];
		expect(new URL(rootUrl).pathname).toBe('/');
		expect(lastRequest(fetchMock).path).toBe('/dataset/photos/upload');
	});

	it('refuses a workspace the key does not belong to, without uploading', async () => {
		respond(fetchMock, AUTHENTICATED);

		await expect(
			invoke(Platform.upload, {
				project: 'other-workspace/photos',
				image: 'https://x.com/a.jpg',
			}),
		).rejects.toThrow(/other-workspace/);
		// Only the workspace check went out; no upload.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('refuses a workspace/project ID when the key names no workspace', async () => {
		respond(fetchMock, UNATTENDED);

		await expect(
			invoke(Platform.upload, {
				project: 'my-workspace/photos',
				image: 'https://x.com/a.jpg',
			}),
		).rejects.toThrow();
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('refuses a project ID with more than two segments, without a request', async () => {
		await expect(
			invoke(Platform.upload, {
				project: 'a/b/c',
				image: 'https://x.com/a.jpg',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty image', async () => {
		await expect(
			invoke(Platform.upload, { project: 'p', image: '' }),
		).rejects.toThrow();
	});
});

describe('infer', () => {
	it('runs a model on the inference host', async () => {
		respond(fetchMock, INFERENCE);

		const result = (await invoke(Inference.infer, {
			modelId: 'chess-sample-4ckfl/3',
			image: 'https://x.com/a.jpg',
		})) as { predictions?: { class?: string }[]; count?: number };

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://serverless.roboflow.com');
		expect(request.path).toBe('/chess-sample-4ckfl/3');
		expect(request.method).toBe('POST');
		expect(request.query.image).toBe('https://x.com/a.jpg');
		// No request body: every input is a query parameter.
		expect(request.body).toBeUndefined();
		expect(result.predictions).toHaveLength(2);
	});

	it('sends image_type=base64 for a data URI', async () => {
		respond(fetchMock, INFERENCE);

		await invoke(Inference.infer, {
			modelId: 'p/1',
			image: 'data:image/jpeg;base64,/9j/4AAQ',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new URL(url).searchParams.get('image_type')).toBe('base64');
		expect(new URL(url).searchParams.has('image')).toBe(false);
		expect(init.body).toBe('data:image/jpeg;base64,/9j/4AAQ');
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
	});

	it('omits image_type for a plain URL', async () => {
		respond(fetchMock, INFERENCE);

		await invoke(Inference.infer, {
			modelId: 'p/1',
			image: 'https://x.com/a.jpg',
		});

		expect(lastRequest(fetchMock).query.image_type).toBeUndefined();
	});

	it('passes the thresholds', async () => {
		respond(fetchMock, INFERENCE);

		await invoke(Inference.infer, {
			modelId: 'p/1',
			image: 'https://x.com/a.jpg',
			confidence: 0.5,
			overlap: 0.3,
			maxDetections: 10,
		});

		const query = lastRequest(fetchMock).query;
		expect(query.confidence).toBe('0.5');
		expect(query.overlap).toBe('0.3');
		expect(query.max_detections).toBe('10');
	});

	it('handles a classification answer, whose predictions are class scores', async () => {
		respond(fetchMock, INFERENCE_CLASSIFICATION);

		const result = (await invoke(Inference.infer, {
			modelId: 'p/1',
			image: 'https://x.com/cat.jpg',
		})) as { predictions?: { class?: string; confidence?: number }[] };

		expect(result.predictions?.[0]?.class).toBe('cat');
		expect(result.predictions?.[0]?.confidence).toBe(0.98);
	});

	it('accepts multi-label predictions keyed by class', async () => {
		respond(fetchMock, {
			image: { width: 224, height: 224 },
			predictions: { cat: { confidence: 0.98 } },
			predicted_classes: ['cat'],
		});
		await expect(
			invoke(Inference.infer, {
				modelId: 'p/1',
				image: 'https://x.com/cat.jpg',
			}),
		).resolves.toMatchObject({ predictions: { cat: { confidence: 0.98 } } });
		expect(mockLog).toHaveBeenLastCalledWith(
			expect.anything(),
			'roboflow.infer',
			{ modelId: 'p/1', predictions: 1 },
			'completed',
		);
	});

	it('accepts a semantic segmentation prediction object', async () => {
		respond(fetchMock, {
			image: { width: 224, height: 224 },
			predictions: {
				segmentation_mask: 'aGVsbG8=',
				class_map: { '0': 'background' },
				confidence_mask: 'bWFzaw==',
			},
		});
		await expect(
			invoke(Inference.infer, {
				modelId: 'p/1',
				image: 'https://x.com/cat.jpg',
			}),
		).resolves.toHaveProperty('predictions.segmentation_mask', 'aGVsbG8=');
	});

	it('rejects a model ID with no project/version separator', async () => {
		await expect(
			invoke(Inference.infer, {
				modelId: 'no-slash',
				image: 'https://x.com/a.jpg',
			}),
		).rejects.toThrow(/project\/version/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a confidence outside 0-1', async () => {
		await expect(
			invoke(Inference.infer, {
				modelId: 'p/1',
				image: 'https://x.com/a.jpg',
				confidence: 1.5,
			}),
		).rejects.toThrow();
	});

	it('logs the model and prediction count, never the image', async () => {
		respond(fetchMock, INFERENCE);

		await invoke(Inference.infer, {
			modelId: 'p/1',
			image: 'data:image/jpeg;base64,SECRETIMAGEBYTES',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'roboflow.infer',
			{ modelId: 'p/1', predictions: 2 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'SECRETIMAGEBYTES',
		);
	});

	it('surfaces an inference auth failure', async () => {
		respond(fetchMock, { status: 401, message: 'Unauthorized api_key' }, 401);

		await expect(
			invoke(Inference.infer, {
				modelId: 'p/1',
				image: 'https://x.com/a.jpg',
			}),
		).rejects.toThrow('Unauthorized api_key');
	});
});

describe('error propagation', () => {
	it('surfaces a bad key with its hint', async () => {
		respond(fetchMock, BAD_KEY, 401);

		await expect(
			invoke(Platform.workspace, { workspace: 'roboflow' }),
		).rejects.toThrow('Roboflow Dashboard');
	});
});

describe('review regressions', () => {
	it('rejects invalid encryption before an upload', async () => {
		const ctx = { ...testContext(), encryptDataAtRest: true, kek: '' };
		respond(fetchMock, IMAGE_UPLOADED);
		await expect(
			Platform.upload(ctx as never, {
				project: 'p',
				image: 'https://example.com/a.jpg',
			}),
		).rejects.toThrow('encryptDataAtRest requires kek');
		expect(fetchMock).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});
	it('sends each upload tag separately', async () => {
		respond(fetchMock, IMAGE_UPLOADED);
		await invoke(Platform.upload, {
			project: 'p',
			image: 'https://example.com/a.jpg',
			tag: ['chess', 'pieces'],
		});
		expect(
			new URL(fetchMock.mock.calls[0][0]).searchParams.getAll('tag'),
		).toEqual(['chess', 'pieces']);
	});
	it('rejects an unsuccessful upload before completion logging', async () => {
		respond(fetchMock, { success: false });
		await expect(
			invoke(Platform.upload, {
				project: 'p',
				image: 'https://example.com/a.jpg',
			}),
		).rejects.toThrow('Roboflow rejected the image upload');
		expect(mockLog).not.toHaveBeenCalled();
	});
	it('accepts an unsuccessful upload marked as a duplicate', async () => {
		respond(fetchMock, { success: false, duplicate: true });
		await expect(
			invoke(Platform.upload, {
				project: 'p',
				image: 'https://example.com/a.jpg',
			}),
		).resolves.toMatchObject({ duplicate: true });
	});
	it.each(['upload', 'infer'])(
		'allows two minutes for %s',
		async (operation) => {
			const timeout = jest.spyOn(AbortSignal, 'timeout');
			try {
				respond(fetchMock, operation === 'upload' ? IMAGE_UPLOADED : INFERENCE);
				await invoke(
					operation === 'upload' ? Platform.upload : Inference.infer,
					operation === 'upload'
						? { project: 'p', image: 'https://example.com/a.jpg' }
						: { modelId: 'p/1', image: 'https://example.com/a.jpg' },
				);
				expect(timeout).toHaveBeenCalledWith(120_000);
			} finally {
				timeout.mockRestore();
			}
		},
	);
});
