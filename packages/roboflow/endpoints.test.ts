import { logEventFromContext } from 'corsair/core';
import { Inference, Platform } from './endpoints';
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
		})) as {
			project?: { images?: number; unannotated?: number; classes?: unknown };
			versions?: { id?: string }[];
		};

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
		})) as {
			version?: { id?: string; images?: number; preprocessing?: unknown };
		};

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
		respond(fetchMock, IMAGE_UPLOADED);

		const result = (await invoke(Platform.upload, {
			project: 'roboflow/chess-sample-4ckfl',
			image: 'https://x.com/a.jpg',
			batch: 'batch-1',
			tag: ['chess'],
		})) as { id?: string; success?: boolean };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/dataset/roboflow%2Fchess-sample-4ckfl/upload');
		expect(request.bodyRecord).toEqual({ image: 'https://x.com/a.jpg' });
		expect(request.query).toMatchObject({ batch: 'batch-1', tag: 'chess' });
		expect(result.id).toBe('YbNIgavTIk2xOOmJsHv5');
	});

	it('reports a duplicate as a success, not a failure', async () => {
		respond(fetchMock, IMAGE_DUPLICATE);

		const result = (await invoke(Platform.upload, {
			project: 'roboflow/chess',
			image: 'https://x.com/a.jpg',
		})) as { duplicate?: boolean; id?: string };

		expect(result.duplicate).toBe(true);
		// The existing image's id still comes back.
		expect(result.id).toBeDefined();
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

		expect(lastRequest(fetchMock).query.image_type).toBe('base64');
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
