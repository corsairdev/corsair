import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS } from './client';
import { Formats, Jobs, Operations, Tasks, Users } from './endpoints';
import { CloudConvertEndpointInputSchemas as Inputs } from './endpoints/types';
import type { CloudConvertContext } from './index';
import { cloudConvertEndpointSchemas, cloudconvert } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeCloudConvertRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeCloudConvertRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
type Ctx = Parameters<typeof Tasks.list>[0];

const storedExportCredentials = {
	exportGcsProjectId: 'project-123',
	exportGcsClientEmail: 'worker@project-123.iam.gserviceaccount.com',
	exportGcsPrivateKey: 'fixture-private-key',
	exportS3AccessKeyId: 'fixture-access-key',
	exportS3SecretAccessKey: 'fixture-secret-key',
	exportS3SessionToken: 'fixture-session-token',
};

function buildCtx(
	credentialOverrides: Partial<
		Record<keyof typeof storedExportCredentials, string | null>
	> = {},
	syncTimeoutMs = DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
): Ctx {
	const credentials = { ...storedExportCredentials, ...credentialOverrides };
	const ctx: CloudConvertContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('fixture-account'),
		key: 'fixture-api-key',
		options: { syncTimeoutMs },
		keys: {
			get_dek: () => Promise.resolve('fixture-dek'),
			issue_new_dek: () => Promise.resolve('fixture-dek'),
			get_api_key: () => Promise.resolve('fixture-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
			get_export_gcs_project_id: () =>
				Promise.resolve(credentials.exportGcsProjectId),
			set_export_gcs_project_id: () => Promise.resolve(),
			get_export_gcs_client_email: () =>
				Promise.resolve(credentials.exportGcsClientEmail),
			set_export_gcs_client_email: () => Promise.resolve(),
			get_export_gcs_private_key: () =>
				Promise.resolve(credentials.exportGcsPrivateKey),
			set_export_gcs_private_key: () => Promise.resolve(),
			get_export_s3_access_key_id: () =>
				Promise.resolve(credentials.exportS3AccessKeyId),
			set_export_s3_access_key_id: () => Promise.resolve(),
			get_export_s3_secret_access_key: () =>
				Promise.resolve(credentials.exportS3SecretAccessKey),
			set_export_s3_secret_access_key: () => Promise.resolve(),
			get_export_s3_session_token: () =>
				Promise.resolve(credentials.exportS3SessionToken),
			set_export_s3_session_token: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

const jobResponse = {
	data: {
		id: 'job-123',
		status: 'processing',
		created_at: '2026-10-01T12:00:00Z',
		tasks: [
			{
				id: 'task-123',
				name: 'exported',
				operation: 'export/s3',
				status: 'waiting',
				created_at: '2026-10-01T12:00:00Z',
			},
		],
	},
};

const taskResponse = {
	data: {
		id: 'task-123',
		job_id: 'job-123',
		name: 'convert',
		operation: 'convert',
		status: 'finished',
		created_at: '2026-10-01T12:00:00Z',
	},
};

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('jobs.create', () => {
	it('creates an asynchronous job with a generic task graph and optional tag', async () => {
		mockedRequest.mockResolvedValue(jobResponse);

		const result = await Jobs.create(ctx, {
			tasks: {
				'import-1': {
					operation: 'import/url',
					url: 'https://files.test/a.pdf',
				},
				convert_1: {
					operation: 'convert',
					input: 'import-1',
					output_format: 'pdf',
				},
			},
			tag: 'request-123',
		});

		expect(result).toEqual(jobResponse);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'POST',
			path: '/jobs',
			body: {
				tasks: {
					'import-1': {
						operation: 'import/url',
						url: 'https://files.test/a.pdf',
					},
					convert_1: {
						operation: 'convert',
						input: 'import-1',
						output_format: 'pdf',
					},
				},
				tag: 'request-123',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.jobs.create',
			{ taskCount: 2 },
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('request-123');
		expect(JSON.stringify(payload)).not.toContain('files.test');
	});
});

describe('jobs.createAndWait', () => {
	it('posts the documented body to the synchronous host', async () => {
		mockedRequest.mockResolvedValue(jobResponse);

		const result = await Jobs.createAndWait(ctx, {
			tasks: {
				import_file: {
					operation: 'import/url',
					url: 'https://files.test/a.pdf',
				},
				convert: {
					operation: 'convert',
					input: 'import_file',
					output_format: 'pdf',
				},
				export: { operation: 'export/url', input: 'convert' },
			},
			tag: 'request-123',
			redirect: false,
		});

		expect(result).toEqual(jobResponse);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'POST',
			path: '/jobs',
			host: 'sync',
			timeoutMs: DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
			body: {
				tasks: {
					import_file: {
						operation: 'import/url',
						url: 'https://files.test/a.pdf',
					},
					convert: {
						operation: 'convert',
						input: 'import_file',
						output_format: 'pdf',
					},
					export: { operation: 'export/url', input: 'convert' },
				},
				tag: 'request-123',
				redirect: false,
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.jobs.createAndWait',
			{ taskCount: 3 },
			'completed',
		);
	});
});

describe('jobs.get and jobs.wait', () => {
	it('gets a job with the JSON-safe redirect=false query', async () => {
		mockedRequest.mockResolvedValue(jobResponse);

		await Jobs.get(ctx, { jobId: 'job-123', redirect: false });

		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/jobs/job-123',
			query: { redirect: false },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.jobs.get',
			{},
			'completed',
		);
	});

	it('waits for a job on the synchronous host', async () => {
		mockedRequest.mockResolvedValue(jobResponse);

		await Jobs.wait(ctx, { jobId: 'job-123', redirect: false });

		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/jobs/job-123',
			host: 'sync',
			timeoutMs: DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
			query: { redirect: false },
		});
	});

	it('uses the configured timeout for synchronous waits', async () => {
		mockedRequest.mockResolvedValue(jobResponse);
		const customCtx = buildCtx({}, 75_000);

		await Jobs.wait(customCtx, { jobId: 'job-123', redirect: false });

		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/jobs/job-123',
			host: 'sync',
			timeoutMs: 75_000,
			query: { redirect: false },
		});
	});
});

describe('jobs.list', () => {
	it('sends documented filters, include and pagination and logs counts only', async () => {
		const response = {
			data: [jobResponse.data],
			links: {
				first: 'https://api.cloudconvert.com/v2/jobs?page=1',
				next: null,
			},
			meta: {
				current_page: 2,
				from: 2,
				path: 'https://api.cloudconvert.com/v2/jobs',
				per_page: 1,
				to: 2,
			},
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Jobs.list(ctx, {
			status: 'finished',
			tag: 'request-123',
			accessToken: 'token-456',
			include: ['tasks'],
			perPage: 1,
			page: 2,
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/jobs',
			query: {
				'filter[status]': 'finished',
				'filter[tag]': 'request-123',
				'filter[access_token]': 'token-456',
				include: 'tasks',
				per_page: 1,
				page: 2,
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.jobs.list',
			{ count: 1, page: 2 },
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('request-123');
		expect(JSON.stringify(payload)).not.toContain('token-456');
	});
});

describe('jobs.remove', () => {
	it('deletes a job and parses the documented empty 204 response', async () => {
		mockedRequest.mockResolvedValue(undefined);

		await expect(
			Jobs.remove(ctx, { jobId: 'job-123' }),
		).resolves.toBeUndefined();

		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'DELETE',
			path: '/jobs/job-123',
		});
	});
});

describe('tasks.createExportGoogleCloudStorage', () => {
	it('creates an export task through POST /jobs and redacts service credentials', async () => {
		const response = {
			data: {
				...jobResponse.data,
				tasks: [
					{
						id: 'task-123',
						name: 'exported',
						operation: 'export/google-cloud-storage',
						status: 'waiting',
						created_at: '2026-10-01T12:00:00Z',
					},
				],
			},
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Tasks.createExportGoogleCloudStorage(ctx, {
			exportTaskName: 'exported',
			sourceTasks: {
				imported: {
					operation: 'import/url',
					url: 'https://files.test/input.pdf',
				},
				converted: {
					operation: 'convert',
					input: 'imported',
					output_format: 'pdf',
				},
			},
			input: 'converted',
			bucket: 'fixture-bucket',
			file: 'output.pdf',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'POST',
			path: '/jobs',
			body: {
				tasks: {
					imported: {
						operation: 'import/url',
						url: 'https://files.test/input.pdf',
					},
					converted: {
						operation: 'convert',
						input: 'imported',
						output_format: 'pdf',
					},
					exported: {
						operation: 'export/google-cloud-storage',
						input: 'converted',
						project_id: 'project-123',
						bucket: 'fixture-bucket',
						client_email: 'worker@project-123.iam.gserviceaccount.com',
						private_key: 'fixture-private-key',
						file: 'output.pdf',
					},
				},
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.tasks.createExportGoogleCloudStorage',
			{ taskCount: 3 },
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('fixture-private-key');
		expect(JSON.stringify(payload)).not.toContain('worker@project-123');
		expect(JSON.stringify(payload)).not.toContain('fixture-bucket');
		expect(JSON.stringify(payload)).not.toContain('files.test');
	});

	it('requires saved export credentials and keeps them out of endpoint arguments', async () => {
		const missingKeyContext = buildCtx({ exportGcsPrivateKey: null });

		await expect(
			Tasks.createExportGoogleCloudStorage(missingKeyContext, {
				exportTaskName: 'exported',
				sourceTasks: {
					imported: {
						operation: 'import/url',
						url: 'https://files.test/input.pdf',
					},
				},
				input: 'imported',
				bucket: 'fixture-bucket',
			}),
		).rejects.toThrow('keys.set_export_gcs_private_key()');
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('tasks.createExportS3', () => {
	it('creates an export task through POST /jobs and redacts AWS credentials', async () => {
		mockedRequest.mockResolvedValue(jobResponse);

		const result = await Tasks.createExportS3(ctx, {
			exportTaskName: 'exported',
			sourceTasks: {
				converted: {
					operation: 'convert',
					input: 'imported',
					output_format: 'pdf',
				},
				imported: {
					operation: 'import/url',
					url: 'https://files.test/input.pdf',
				},
			},
			input: 'converted',
			bucket: 'fixture-bucket',
			region: 'eu-west-1',
			endpoint: 'https://s3.compat.test',
			key: 'exports/output.pdf',
			acl: 'bucket-owner-full-control',
			cacheControl: 'max-age=3600',
			contentDisposition: 'attachment',
			contentType: 'application/pdf',
			metadata: { source: 'fixture' },
			serverSideEncryption: 'aws:kms',
			tagging: { project: 'fixture' },
		});

		expect(result).toEqual(jobResponse);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'POST',
			path: '/jobs',
			body: {
				tasks: {
					converted: {
						operation: 'convert',
						input: 'imported',
						output_format: 'pdf',
					},
					imported: {
						operation: 'import/url',
						url: 'https://files.test/input.pdf',
					},
					exported: {
						operation: 'export/s3',
						input: 'converted',
						bucket: 'fixture-bucket',
						region: 'eu-west-1',
						access_key_id: 'fixture-access-key',
						secret_access_key: 'fixture-secret-key',
						endpoint: 'https://s3.compat.test',
						key: 'exports/output.pdf',
						session_token: 'fixture-session-token',
						acl: 'bucket-owner-full-control',
						cache_control: 'max-age=3600',
						content_disposition: 'attachment',
						content_type: 'application/pdf',
						metadata: { source: 'fixture' },
						server_side_encryption: 'aws:kms',
						tagging: { project: 'fixture' },
					},
				},
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.tasks.createExportS3',
			{ taskCount: 3 },
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('fixture-secret-key');
		expect(JSON.stringify(payload)).not.toContain('fixture-access-key');
		expect(JSON.stringify(payload)).not.toContain('fixture-bucket');
		expect(JSON.stringify(payload)).not.toContain('files.test');
	});

	it('rejects a missing input task before sending a request', async () => {
		await expect(
			Tasks.createExportS3(ctx, {
				exportTaskName: 'exported',
				sourceTasks: { imported: { operation: 'import/url' } },
				input: 'missing',
				bucket: 'fixture-bucket',
				region: 'eu-west-1',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('tasks.list', () => {
	it('sends documented filters and page parameters and logs counts only', async () => {
		const response = {
			data: [
				{
					id: 'task-123',
					job_id: 'job-123',
					operation: 'convert',
					status: 'finished',
					created_at: '2026-10-01T12:00:00Z',
					payload: { input_format: 'docx', output_format: 'pdf' },
					result: { files: [{ filename: 'output.pdf' }] },
				},
			],
			links: {
				first: 'https://api.cloudconvert.com/v2/tasks?page=1',
				next: null,
			},
			meta: {
				current_page: 2,
				from: 2,
				path: 'https://api.cloudconvert.com/v2/tasks',
				per_page: 1,
				to: 2,
			},
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Tasks.list(ctx, {
			jobId: 'job-123',
			status: 'finished',
			operation: 'convert',
			include: ['retries', 'depends_on_tasks'],
			perPage: 1,
			page: 2,
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/tasks',
			query: {
				'filter[job_id]': 'job-123',
				'filter[status]': 'finished',
				'filter[operation]': 'convert',
				include: 'retries,depends_on_tasks',
				per_page: 1,
				page: 2,
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.tasks.list',
			{ count: 1, page: 2 },
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('output.pdf');
		expect(JSON.stringify(payload)).not.toContain('docx');
	});

	it('rejects an invalid page size before sending a request', async () => {
		await expect(Tasks.list(ctx, { perPage: 1001 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('tasks.get', () => {
	it('includes retries, dependencies, payload and parent job when requested', async () => {
		const response = {
			data: {
				...taskResponse.data,
				depends_on_tasks: { imported: 'task-imported' },
				payload: { input_format: 'docx', output_format: 'pdf' },
				retries: [
					{
						id: 'task-retry',
						job_id: 'job-123',
						name: 'convert',
						operation: 'convert',
						status: 'finished',
						created_at: '2026-10-01T12:01:00Z',
					},
				],
				job: {
					id: 'job-123',
					status: 'finished',
					created_at: '2026-10-01T12:00:00Z',
				},
			},
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Tasks.get(ctx, {
			taskId: 'task-123',
			include: ['retries', 'depends_on_tasks', 'payload', 'job'],
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/tasks/task-123',
			query: { include: 'retries,depends_on_tasks,payload,job' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.tasks.get',
			{},
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('docx');
	});
});

describe('tasks.wait', () => {
	it('waits for a task on the synchronous host', async () => {
		mockedRequest.mockResolvedValue(taskResponse);

		const result = await Tasks.wait(ctx, { taskId: 'task-123' });

		expect(result).toEqual(taskResponse);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/tasks/task-123',
			host: 'sync',
			timeoutMs: DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
		});
	});
});

describe('tasks.cancel', () => {
	it('posts to the documented cancel action without a body', async () => {
		mockedRequest.mockResolvedValue(taskResponse);

		await Tasks.cancel(ctx, { taskId: 'task-123' });

		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'POST',
			path: '/tasks/task-123/cancel',
		});
	});
});

describe('tasks.retry', () => {
	it('posts to the documented retry action without a body', async () => {
		mockedRequest.mockResolvedValue(taskResponse);

		await Tasks.retry(ctx, { taskId: 'task-123' });

		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'POST',
			path: '/tasks/task-123/retry',
		});
	});
});

describe('tasks.remove', () => {
	it('deletes a task and parses the documented empty 204 response', async () => {
		mockedRequest.mockResolvedValue(undefined);

		await expect(
			Tasks.remove(ctx, { taskId: 'task-123' }),
		).resolves.toBeUndefined();

		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'DELETE',
			path: '/tasks/task-123',
		});
	});
});

describe('operations.list', () => {
	it('sends discovery filters and include values and logs a count only', async () => {
		const response = {
			data: [
				{
					operation: 'convert',
					input_format: 'docx',
					output_format: 'pdf',
					engine: 'office',
					credits: 1,
				},
			],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Operations.list(ctx, {
			operation: 'convert',
			inputFormat: 'docx',
			outputFormat: 'pdf',
			engine: 'office',
			engineVersion: '2.1',
			alternatives: true,
			include: ['options', 'options.details', 'engine_versions'],
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(undefined, {
			method: 'GET',
			path: '/operations',
			query: {
				'filter[operation]': 'convert',
				'filter[input_format]': 'docx',
				'filter[output_format]': 'pdf',
				'filter[engine]': 'office',
				'filter[engine_version]': '2.1',
				alternatives: true,
				include: 'options,options.details,engine_versions',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.operations.list',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects an empty operation filter before sending a request', async () => {
		await expect(Operations.list(ctx, { operation: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('formats.listSupported', () => {
	it('requests conversion formats with full documented option details', async () => {
		const response = {
			data: [
				{
					operation: 'convert',
					input_format: 'docx',
					output_format: 'pdf',
					engine: 'office',
					credits: 1,
					options: [{ name: 'quality', type: 'integer', min: 1, max: 100 }],
					engine_versions: [{ version: '2.1', default: true, latest: true }],
				},
			],
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Formats.listSupported(ctx, {});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(undefined, {
			method: 'GET',
			path: '/operations',
			query: {
				alternatives: true,
				include: 'options,options.details,engine_versions',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.formats.listSupported',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects extra discovery parameters in the empty-input schema', () => {
		expect(
			Inputs.formatsListSupported.safeParse({ format: 'pdf' }).success,
		).toBe(false);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('users.show', () => {
	it('reads the current user without logging account details', async () => {
		const response = {
			data: {
				id: 1,
				username: 'converter',
				email: 'converter@project.test',
				credits: 4434,
				created_at: '2026-10-01T12:00:00Z',
			},
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Users.show(ctx, {});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('fixture-api-key', {
			method: 'GET',
			path: '/users/me',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'cloudconvert.users.show',
			{},
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('converter@project.test');
		expect(JSON.stringify(payload)).not.toContain('4434');
	});

	it('rejects extra parameters in the no-input schema', () => {
		expect(Inputs.usersShow.safeParse({ id: 'user-123' }).success).toBe(false);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('CloudConvert plugin shape', () => {
	it('exposes the documented job and task routes plus the existing catalog operations', () => {
		const plugin = cloudconvert({});
		expect(plugin.endpoints?.jobs.create).toBeDefined();
		expect(plugin.endpoints?.jobs.createAndWait).toBeDefined();
		expect(plugin.endpoints?.jobs.get).toBeDefined();
		expect(plugin.endpoints?.jobs.wait).toBeDefined();
		expect(plugin.endpoints?.jobs.list).toBeDefined();
		expect(plugin.endpoints?.jobs.remove).toBeDefined();
		expect(
			plugin.endpoints?.tasks.createExportGoogleCloudStorage,
		).toBeDefined();
		expect(plugin.endpoints?.tasks.createExportS3).toBeDefined();
		expect(plugin.endpoints?.tasks.list).toBeDefined();
		expect(plugin.endpoints?.tasks.get).toBeDefined();
		expect(plugin.endpoints?.tasks.wait).toBeDefined();
		expect(plugin.endpoints?.tasks.cancel).toBeDefined();
		expect(plugin.endpoints?.tasks.retry).toBeDefined();
		expect(plugin.endpoints?.tasks.remove).toBeDefined();
		expect(plugin.endpoints?.operations.list).toBeDefined();
		expect(plugin.endpoints?.formats.listSupported).toBeDefined();
		expect(plugin.endpoints?.users.show).toBeDefined();
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(5);
		expect(Object.keys(plugin.endpoints?.jobs ?? {})).toHaveLength(6);
		expect(Object.keys(plugin.endpoints?.tasks ?? {})).toHaveLength(8);
		expect(Object.keys(plugin.endpoints?.operations ?? {})).toHaveLength(1);
		expect(Object.keys(plugin.endpoints?.formats ?? {})).toHaveLength(1);
		expect(Object.keys(plugin.endpoints?.users ?? {})).toHaveLength(1);
	});

	it('uses API-key auth, declares no webhook support, and registers schemas', () => {
		const plugin = cloudconvert({ authType: 'api_key' });
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig?.api_key?.account).toEqual([
			'export_gcs_project_id',
			'export_gcs_client_email',
			'export_gcs_private_key',
			'export_s3_access_key_id',
			'export_s3_secret_access_key',
			'export_s3_session_token',
		]);
		expect(plugin.options).toMatchObject({
			syncTimeoutMs: DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
		});
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(cloudConvertEndpointSchemas)).toHaveLength(17);
		for (const schema of Object.values(cloudConvertEndpointSchemas)) {
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
	});

	it('bounds the configured synchronous timeout', () => {
		expect(cloudconvert({ syncTimeoutMs: 30_000 }).options?.syncTimeoutMs).toBe(
			30_000,
		);
		expect(() => cloudconvert({ syncTimeoutMs: 0 })).toThrow(RangeError);
		expect(() => cloudconvert({ syncTimeoutMs: 600_001 })).toThrow(RangeError);
	});
});
