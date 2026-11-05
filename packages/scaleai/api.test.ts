import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { encodeScalePathSegment, makeScaleAiRequest } from './client';
import {
	Audits,
	Batches,
	Files,
	Projects,
	Quality,
	Studio,
	Tasks,
	Teams,
} from './endpoints';
import {
	ScaleAiEndpointInputSchemas,
	ScaleAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ScaleAiContext } from './index';
import { scaleAiEndpointSchemas, scaleai } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Fetch mock — captures the outgoing request so we can assert URL / method /
// headers / body without touching the real Scale API.
// ─────────────────────────────────────────────────────────────────────────────

type CapturedRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: string | undefined;
};

let captured: CapturedRequest | undefined;
let nextResponseBody: unknown = {};
let nextResponseStatus = 200;

const originalFetch = globalThis.fetch;

beforeEach(() => {
	captured = undefined;
	nextResponseBody = {};
	nextResponseStatus = 200;
	globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return new Response(JSON.stringify(nextResponseBody), {
			status: nextResponseStatus,
			statusText: `status ${nextResponseStatus}`,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as typeof fetch;
});

afterEach(() => {
	globalThis.fetch = originalFetch;
});

const ctx = {
	key: 'live_ScaleRocks',
	$getAccountId: async () => 'acct_test',
	database: undefined,
	endpoints: {},
} as unknown as ScaleAiContext;

// ─────────────────────────────────────────────────────────────────────────────
// Client / auth
// ─────────────────────────────────────────────────────────────────────────────

describe('makeScaleAiRequest', () => {
	it('targets the v1 base URL and uses HTTP Basic auth with a blank password', async () => {
		await makeScaleAiRequest('tasks', 'live_ScaleRocks', { method: 'GET' });

		expect(captured?.url).toBe('https://api.scale.com/v1/tasks');
		// base64('live_ScaleRocks:')
		expect(captured?.headers.authorization).toBe(
			'Basic bGl2ZV9TY2FsZVJvY2tzOg==',
		);
	});

	it('serializes JSON bodies for write requests', async () => {
		await makeScaleAiRequest('batches', 'k', {
			method: 'POST',
			body: { project: 'p', name: 'b' },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			project: 'p',
			name: 'b',
		});
	});

	it('appends array query params as repeated keys', async () => {
		await makeScaleAiRequest('tasks', 'k', {
			method: 'GET',
			query: { tags: ['a', 'b'], status: 'completed' },
		});

		expect(captured?.url).toContain('tags=a');
		expect(captured?.url).toContain('tags=b');
		expect(captured?.url).toContain('status=completed');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint request shape (path + method + payload)
// ─────────────────────────────────────────────────────────────────────────────

describe('endpoint request wiring', () => {
	it('getTask -> GET /task/{id}', async () => {
		nextResponseBody = { task_id: 't1', status: 'completed' };
		const res = await Tasks.getTask(ctx, { taskId: 't1' });

		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('https://api.scale.com/v1/task/t1');
		expect(res.task_id).toBe('t1');
	});

	it('listTasks -> GET /tasks with filters', async () => {
		nextResponseBody = { docs: [{ task_id: 't1' }], total: 1, has_more: false };
		const res = await Tasks.listTasks(ctx, { project: 'kittens', limit: 50 });

		expect(captured?.url).toContain('https://api.scale.com/v1/tasks?');
		expect(captured?.url).toContain('project=kittens');
		expect(captured?.url).toContain('limit=50');
		expect(res.docs).toHaveLength(1);
	});

	it('createImageAnnotationTask -> POST /task/imageannotation', async () => {
		nextResponseBody = { task_id: 't2', type: 'imageannotation' };
		await Tasks.createImageAnnotationTask(ctx, {
			project: 'kittens',
			attachment: 'https://example.com/cat.jpg',
			instruction: 'Box the cats',
			geometries: { box: { objects_to_annotate: ['cat'] } },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('https://api.scale.com/v1/task/imageannotation');
		expect(JSON.parse(captured?.body ?? '{}').attachment).toBe(
			'https://example.com/cat.jpg',
		);
	});

	it('addTaskTags -> PUT /task/{id}/tags with a raw array body', async () => {
		nextResponseBody = { task_id: 't1', tags: ['x', 'y'] };
		await Tasks.addTaskTags(ctx, { taskId: 't1', tags: ['x', 'y'] });

		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('https://api.scale.com/v1/task/t1/tags');
		expect(JSON.parse(captured?.body ?? 'null')).toEqual(['x', 'y']);
	});

	it('deleteTaskTags -> DELETE /task/{id}/tags', async () => {
		nextResponseBody = { task_id: 't1', tags: [] };
		await Tasks.deleteTaskTags(ctx, { taskId: 't1', tags: ['x'] });

		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('https://api.scale.com/v1/task/t1/tags');
	});

	it('deleteTaskUniqueId -> DELETE /task/{id}/unique_id', async () => {
		nextResponseBody = { task_id: 't1' };
		await Tasks.deleteTaskUniqueId(ctx, { taskId: 't1' });

		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('https://api.scale.com/v1/task/t1/unique_id');
	});

	it('setTaskMetadata -> POST /task/{id}/setMetadata with the metadata as body', async () => {
		nextResponseBody = { task_id: 't1', metadata: { a: 1 } };
		await Tasks.setTaskMetadata(ctx, { taskId: 't1', metadata: { a: 1 } });

		expect(captured?.url).toBe('https://api.scale.com/v1/task/t1/setMetadata');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({ a: 1 });
	});

	it('createBatch / finalizeBatch / getBatchStatus hit the batches routes', async () => {
		nextResponseBody = { name: 'b1' };
		await Batches.createBatch(ctx, { project: 'p', name: 'b1' });
		expect(captured?.url).toBe('https://api.scale.com/v1/batches');
		expect(captured?.method).toBe('POST');

		await Batches.finalizeBatch(ctx, { batchName: 'b1' });
		expect(captured?.url).toBe('https://api.scale.com/v1/batches/b1/finalize');

		nextResponseBody = {
			status: 'in_progress',
			tasks_pending: 2,
			tasks_completed: 1,
		};
		const status = await Batches.getBatchStatus(ctx, { batchName: 'b1' });
		expect(captured?.url).toBe('https://api.scale.com/v1/batches/b1/status');
		expect(status.tasks_pending).toBe(2);
	});

	it('setBatchPriorities -> POST /studio/batches/set_priorities with wrapped names', async () => {
		nextResponseBody = [{ name: 'b1' }, { name: 'b2' }];
		await Studio.setBatchPriorities(ctx, { batch_names: ['b1', 'b2'] });

		expect(captured?.url).toBe(
			'https://api.scale.com/v1/studio/batches/set_priorities',
		);
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			batches: [{ name: 'b1' }, { name: 'b2' }],
		});
	});

	it('addStudioAssignments -> POST /studio/assignments/add', async () => {
		nextResponseBody = { 'a@b.com': ['p1'] };
		await Studio.addStudioAssignments(ctx, {
			emails: ['a@b.com'],
			projects: ['p1'],
		});

		expect(captured?.url).toBe(
			'https://api.scale.com/v1/studio/assignments/add',
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Schema coverage — every declared endpoint has an input + output schema
// ─────────────────────────────────────────────────────────────────────────────

describe('schema coverage', () => {
	const schemaKeys = Object.keys(scaleAiEndpointSchemas);

	it('declares 40 endpoints', () => {
		expect(schemaKeys).toHaveLength(40);
	});

	it('every endpoint schema entry has an input and output schema', () => {
		const entries = scaleAiEndpointSchemas as Record<
			string,
			{ input?: unknown; output?: unknown }
		>;
		for (const key of schemaKeys) {
			expect(entries[key]?.input).toBeDefined();
			expect(entries[key]?.output).toBeDefined();
		}
	});

	it('input and output schema maps expose the same operation keys', () => {
		expect(Object.keys(ScaleAiEndpointInputSchemas).sort()).toEqual(
			Object.keys(ScaleAiEndpointOutputSchemas).sort(),
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Input validation
// ─────────────────────────────────────────────────────────────────────────────

describe('input schema validation', () => {
	it('accepts a valid listTasks filter and rejects an out-of-range limit', () => {
		expect(
			ScaleAiEndpointInputSchemas.listTasks.safeParse({
				project: 'p',
				status: 'completed',
				tags: ['t1'],
				limit: 100,
			}).success,
		).toBe(true);

		expect(
			ScaleAiEndpointInputSchemas.listTasks.safeParse({ limit: 500 }).success,
		).toBe(false);
	});

	it('requires attachment for segmentation tasks and labels array', () => {
		const ok =
			ScaleAiEndpointInputSchemas.createSegmentationAnnotationTask.safeParse({
				attachment: 'https://x/y.png',
				labels: ['road', 'sky'],
			});
		expect(ok.success).toBe(true);

		const bad =
			ScaleAiEndpointInputSchemas.createSegmentationAnnotationTask.safeParse({
				labels: ['road'],
			});
		expect(bad.success).toBe(false);
	});

	it('requires a non-empty tags list for addTaskTags', () => {
		expect(
			ScaleAiEndpointInputSchemas.addTaskTags.safeParse({
				taskId: 't1',
				tags: [],
			}).success,
		).toBe(false);
	});

	it('inviteTeamMember only allows known roles', () => {
		expect(
			ScaleAiEndpointInputSchemas.inviteTeamMember.safeParse({
				emails: ['a@b.com'],
				role: 'manager',
			}).success,
		).toBe(true);
		expect(
			ScaleAiEndpointInputSchemas.inviteTeamMember.safeParse({
				emails: ['a@b.com'],
				role: 'owner',
			}).success,
		).toBe(false);
	});

	it('getFixlessAudits requires task_id or id', () => {
		expect(
			ScaleAiEndpointInputSchemas.getFixlessAudits.safeParse({}).success,
		).toBe(false);
		expect(
			ScaleAiEndpointInputSchemas.getFixlessAudits.safeParse({ task_id: 't1' })
				.success,
		).toBe(true);
	});

	it('getQualityLabelers requires quality_task_ids or labeler_emails', () => {
		expect(
			ScaleAiEndpointInputSchemas.getQualityLabelers.safeParse({}).success,
		).toBe(false);
		expect(
			ScaleAiEndpointInputSchemas.getQualityLabelers.safeParse({
				labeler_emails: ['a@b.com'],
			}).success,
		).toBe(true);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Output validation
// ─────────────────────────────────────────────────────────────────────────────

describe('output schema validation', () => {
	it('parses a representative task object and keeps unknown fields', () => {
		const parsed = ScaleAiEndpointOutputSchemas.getTask.parse({
			task_id: '601ba74eec471ff9b01557cc',
			created_at: '2021-06-23T09:09:34.752Z',
			type: 'imageannotation',
			status: 'completed',
			params: { attachment: 'https://example.com/image.jpg' },
			response: { annotations: [] },
			some_future_field: true,
		});
		expect(parsed.task_id).toBe('601ba74eec471ff9b01557cc');
		expect((parsed as Record<string, unknown>).some_future_field).toBe(true);
	});

	it('parses the paginated list-tasks envelope', () => {
		const parsed = ScaleAiEndpointOutputSchemas.listTasks.parse({
			docs: [{ task_id: 't1' }],
			total: 220,
			limit: 100,
			has_more: true,
			next_token: 'abc',
		});
		expect(parsed.docs).toHaveLength(1);
		expect(parsed.has_more).toBe(true);
	});

	it('parses a batch-status response', () => {
		const parsed = ScaleAiEndpointOutputSchemas.getBatchStatus.parse({
			status: 'completed',
			tasks_pending: 0,
			tasks_completed: 10,
		});
		expect(parsed.tasks_completed).toBe(10);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Plugin wiring
// ─────────────────────────────────────────────────────────────────────────────

describe('scaleai() plugin', () => {
	it('exposes the plugin id, endpoint groups and matching meta', () => {
		const plugin = scaleai({ key: 'live_x' });
		expect(plugin.id).toBe('scaleai');
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'audits',
			'batches',
			'files',
			'projects',
			'quality',
			'studio',
			'tasks',
			'teams',
		]);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(scaleAiEndpointSchemas).sort(),
		);
	});

	it('keyBuilder returns the configured key and throws when none is available', async () => {
		const plugin = scaleai({ key: 'live_x' });
		const withKey = { authType: 'api_key' } as unknown as ScaleAiContext;
		await expect(
			plugin.keyBuilder?.(withKey as never, 'endpoint'),
		).resolves.toBe('live_x');

		const noKey = scaleai();
		const emptyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as unknown as ScaleAiContext;
		await expect(
			noKey.keyBuilder?.(emptyCtx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('every task-create endpoint has write risk and read endpoints are marked read', () => {
		const meta = scaleai().endpointMeta as Record<
			string,
			{ riskLevel: string } | undefined
		>;
		expect(meta['tasks.createImageAnnotationTask']?.riskLevel).toBe('write');
		expect(meta['tasks.getTask']?.riskLevel).toBe('read');
		expect(meta['batches.listBatches']?.riskLevel).toBe('read');
		expect(meta['studio.setBatchPriorities']?.riskLevel).toBe('write');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────────────────────────────────────

describe('error handling', () => {
	it('propagates a typed ApiError with the HTTP status preserved', async () => {
		nextResponseStatus = 401;
		nextResponseBody = { error: 'Unauthorized -- No valid API key provided.' };

		const err = await makeScaleAiRequest('teams', 'bad_key', {
			method: 'GET',
		}).catch((e) => e);

		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(401);
	});

	it('routes a 401 to AUTH_ERROR with no retries', async () => {
		nextResponseStatus = 401;
		nextResponseBody = { error: 'Unauthorized' };
		const err = (await makeScaleAiRequest('teams', 'bad', {
			method: 'GET',
		}).catch((e) => e)) as Error;

		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes a 409 conflict to the non-retryable handler', async () => {
		nextResponseStatus = 409;
		nextResponseBody = { error: 'unique_id already used for a different task' };
		const err = (await makeScaleAiRequest('task/imageannotation', 'k', {
			method: 'POST',
			body: { unique_id: 'dup' },
		}).catch((e) => e)) as Error;

		expect(errorHandlers.NOT_RETRYABLE_CLIENT_ERROR.match(err)).toBe(true);
	});

	it('RATE_LIMIT_ERROR matches Scale\'s "Too Many Requests" message', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
	});
});

describe('every exported operation maps to an official path', () => {
	const geometries = { box: { objects_to_annotate: ['cat'] } };

	it.each([
		[
			'createSegmentationAnnotationTask',
			() =>
				Tasks.createSegmentationAnnotationTask(ctx, {
					attachment: 'https://x/a.png',
					labels: ['road'],
				}),
			'POST',
			'/v1/task/segmentannotation',
		],
		[
			'createVideoAnnotationTask',
			() =>
				Tasks.createVideoAnnotationTask(ctx, {
					attachments: ['https://x/1.png'],
					geometries,
				}),
			'POST',
			'/v1/task/videoannotation',
		],
		[
			'createVideoPlaybackAnnotationTask',
			() =>
				Tasks.createVideoPlaybackAnnotationTask(ctx, {
					attachment: 'https://x/v.mp4',
					geometries,
				}),
			'POST',
			'/v1/task/videoplaybackannotation',
		],
		[
			'createLidarAnnotationTask',
			() => Tasks.createLidarAnnotationTask(ctx, { project: 'p' }),
			'POST',
			'/v1/task/lidarannotation',
		],
		[
			'createLidarSegmentationTask',
			() => Tasks.createLidarSegmentationTask(ctx, { project: 'p' }),
			'POST',
			'/v1/task/lidarsegmentation',
		],
		[
			'createNamedEntityRecognitionTask',
			() =>
				Tasks.createNamedEntityRecognitionTask(ctx, {
					text: 'hi',
					labels: ['PERSON'],
				}),
			'POST',
			'/v1/task/namedentityrecognition',
		],
		[
			'createTextCollectionTask',
			() =>
				Tasks.createTextCollectionTask(ctx, { fields: [{ field_id: 'a' }] }),
			'POST',
			'/v1/task/textcollection',
		],
		[
			'createDocumentTranscriptionTask',
			() =>
				Tasks.createDocumentTranscriptionTask(ctx, {
					attachment: 'https://x/d.pdf',
				}),
			'POST',
			'/v1/task/documenttranscription',
		],
		[
			'updateTaskUniqueId',
			() => Tasks.updateTaskUniqueId(ctx, { taskId: 't1', unique_id: 'u1' }),
			'POST',
			'/v1/task/t1/unique_id',
		],
		[
			'getTaskResponseUrl',
			() => Tasks.getTaskResponseUrl(ctx, { taskId: 't1', uuid: 'u-1' }),
			'GET',
			'/v1/task/t1/response_url/u-1',
		],
		[
			'sendTaskCallback',
			() => Tasks.sendTaskCallback(ctx, { taskId: 't1' }),
			'POST',
			'/v1/task/t1/send_callback',
		],
		[
			'getBatch',
			() => Batches.getBatch(ctx, { batchName: 'b1' }),
			'GET',
			'/v1/batches/b1',
		],
		[
			'listBatches',
			() => Batches.listBatches(ctx, { project: 'p', limit: 10 }),
			'GET',
			'/v1/batches?',
		],
		[
			'getProject',
			() => Projects.getProject(ctx, { name: 'kitten_labeling' }),
			'GET',
			'/v1/projects/kitten_labeling',
		],
		[
			'listProjects',
			() => Projects.listProjects(ctx, { archived: false }),
			'GET',
			'/v1/projects?archived=false',
		],
		[
			'setProjectParams',
			() =>
				Projects.setProjectParams(ctx, {
					project: 'p',
					instruction: 'label cats',
				}),
			'POST',
			'/v1/projects/p/setParams',
		],
		[
			'setProjectOntology',
			() =>
				Projects.setProjectOntology(ctx, { project: 'p', ontology: ['cat'] }),
			'POST',
			'/v1/projects/p/setOntology',
		],
		[
			'getAssets',
			() => Files.getAssets(ctx, { project: 'p', limit: 1 }),
			'GET',
			'/v1/files?',
		],
		[
			'importFile',
			() => Files.importFile(ctx, { file_url: 'https://x/a.png' }),
			'POST',
			'/v1/files/import',
		],
		['getTeams', () => Teams.getTeams(ctx, {}), 'GET', '/v1/teams'],
		[
			'inviteTeamMember',
			() =>
				Teams.inviteTeamMember(ctx, { emails: ['a@b.com'], role: 'member' }),
			'POST',
			'/v1/teams/invite',
		],
		[
			'getStudioAssignments',
			() => Studio.getStudioAssignments(ctx, {}),
			'GET',
			'/v1/studio/assignments',
		],
		[
			'removeStudioAssignments',
			() =>
				Studio.removeStudioAssignments(ctx, {
					emails: ['a@b.com'],
					projects: ['p'],
				}),
			'POST',
			'/v1/studio/assignments/remove',
		],
		[
			'getStudioBatches',
			() => Studio.getStudioBatches(ctx, {}),
			'GET',
			'/v1/studio/batches',
		],
		[
			'resetBatchPriorities',
			() => Studio.resetBatchPriorities(ctx, {}),
			'POST',
			'/v1/studio/batches/reset_priorities',
		],
		[
			'getFixlessAudits',
			() => Audits.getFixlessAudits(ctx, { task_id: 't1' }),
			'GET',
			'/v1/audits?',
		],
		[
			'getQualityLabelers',
			() => Quality.getQualityLabelers(ctx, { labeler_emails: ['a@b.com'] }),
			'GET',
			'/v1/quality/labelers?',
		],
	] as const)('%s hits %s %s', async (_name, run, method, path) => {
		nextResponseBody = {
			task_id: 't1',
			name: 'b1',
			docs: [],
			success: true,
		};
		await run();
		expect(captured?.method).toBe(method);
		expect(captured?.url).toContain(`https://api.scale.com${path}`);
	});

	it('uploadFile -> POST /files/upload', async () => {
		nextResponseBody = { attachment_url: 'scaledata://x' };
		await Files.uploadFile(ctx, {
			file_base64: Buffer.from('hi').toString('base64'),
			file_name: 'a.txt',
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('https://api.scale.com/v1/files/upload');
	});
});

describe('official contracts', () => {
	it('encodes path delimiters and rejects traversal', () => {
		expect(encodeScalePathSegment('a/b')).toBe('a%2Fb');
		expect(() => encodeScalePathSegment('..')).toThrow('Invalid path segment');
		expect(() => encodeScalePathSegment('.')).toThrow('Invalid path segment');
	});

	it('getTask encodes a slash in taskId', async () => {
		nextResponseBody = { task_id: 'x' };
		await Tasks.getTask(ctx, { taskId: 'a/b' });
		expect(captured?.url).toBe('https://api.scale.com/v1/task/a%2Fb');
	});

	it('accepts 5 tags and rejects 6', () => {
		expect(
			ScaleAiEndpointInputSchemas.createImageAnnotationTask.safeParse({
				attachment: 'https://x/a.png',
				geometries: { box: {} },
				tags: ['1', '2', '3', '4', '5'],
			}).success,
		).toBe(true);
		expect(
			ScaleAiEndpointInputSchemas.createImageAnnotationTask.safeParse({
				attachment: 'https://x/a.png',
				geometries: { box: {} },
				tags: ['1', '2', '3', '4', '5', '6'],
			}).success,
		).toBe(false);
	});

	it('requires video geometries and playback attachment', () => {
		expect(
			ScaleAiEndpointInputSchemas.createVideoAnnotationTask.safeParse({})
				.success,
		).toBe(false);
		expect(
			ScaleAiEndpointInputSchemas.createVideoPlaybackAnnotationTask.safeParse({
				geometries: { box: {} },
			}).success,
		).toBe(false);
	});

	it('accepts a decoded upload under 80 MB', () => {
		expect(
			ScaleAiEndpointInputSchemas.uploadFile.safeParse({
				file_base64: Buffer.from('ok').toString('base64'),
				file_name: 'ok.bin',
			}).success,
		).toBe(true);
		expect(
			ScaleAiEndpointInputSchemas.uploadFile.safeParse({
				file_base64: 'not-base64!!!',
				file_name: 'ok.bin',
			}).success,
		).toBe(false);
	});
});
