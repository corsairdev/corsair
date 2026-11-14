import {
	CloudConvertEndpointInputSchemas as Inputs,
	CloudConvertEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { CloudConvertSchema } from './schema';

const jobResponse = {
	data: {
		id: 'job-123',
		status: 'processing',
		created_at: '2026-10-01T12:00:00Z',
		tasks: [
			{
				id: 'task-123',
				name: 'export',
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
		payload: { input_format: 'docx', output_format: 'pdf' },
		depends_on_tasks: { imported: 'task-imported' },
		job: {
			id: 'job-123',
			status: 'finished',
			created_at: '2026-10-01T12:00:00Z',
		},
	},
};

const taskListResponse = {
	data: [
		{
			id: 'task-123',
			job_id: 'job-123',
			operation: 'convert',
			status: 'finished',
			created_at: '2026-10-01T12:00:00Z',
			result: { files: [{ filename: 'output.pdf' }] },
		},
	],
	links: { first: 'https://api.cloudconvert.com/v2/tasks?page=1', next: null },
	meta: {
		current_page: 1,
		from: 1,
		path: 'https://api.cloudconvert.com/v2/tasks',
		per_page: 100,
		to: 1,
	},
};

const operationResult = {
	operation: 'convert',
	input_format: 'docx',
	output_format: 'pdf',
	engine: 'office',
	credits: 1,
};

const operationListResponse = {
	data: [operationResult],
};

const userResponse = {
	data: {
		id: 1,
		username: 'converter',
		email: 'converter@project.test',
		credits: 4434,
		created_at: '2026-10-01T12:00:00Z',
	},
};

describe('CloudConvert schema', () => {
	it('declares a semver version and an empty entities map', () => {
		expect(CloudConvertSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(CloudConvertSchema.entities).toEqual({});
	});
});

describe('CloudConvert endpoint input and output schemas', () => {
	it('validates generic asynchronous and synchronous job creation payloads', () => {
		const createInput = {
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
		};

		expect(Inputs.jobsCreate.safeParse(createInput).success).toBe(true);
		expect(
			Inputs.jobsCreateAndWait.safeParse({ ...createInput, redirect: false })
				.success,
		).toBe(true);
		expect(
			Inputs.jobsCreateAndWait.safeParse({ ...createInput, redirect: true })
				.success,
		).toBe(false);
		expect(
			Inputs.jobsCreate.safeParse({
				tasks: { 'invalid task name': { operation: 'convert' } },
			}).success,
		).toBe(false);
		expect(
			Inputs.jobsCreate.safeParse({
				tasks: {},
				webhook_url: 'https://example.test',
			}).success,
		).toBe(false);
		expect(Inputs.jobsCreate.safeParse({ tasks: {} }).success).toBe(false);
		expect(
			Inputs.jobsCreate.safeParse({
				tasks: {
					export: {
						operation: 'export/s3',
						secret_access_key: 'must-not-be-an-argument',
					},
				},
			}).success,
		).toBe(false);

		const tooManyTasks = Object.fromEntries(
			Array.from({ length: 2001 }, (_, index) => [
				`task-${index}`,
				{ operation: 'convert' },
			]),
		);
		const maximumTasks = Object.fromEntries(
			Array.from({ length: 2000 }, (_, index) => [
				`task-${index}`,
				{ operation: 'convert' },
			]),
		);
		expect(Inputs.jobsCreate.safeParse({ tasks: maximumTasks }).success).toBe(
			true,
		);
		expect(Inputs.jobsCreate.safeParse({ tasks: tooManyTasks }).success).toBe(
			false,
		);

		expect(Outputs.jobsCreate.safeParse(jobResponse).success).toBe(true);
		expect(Outputs.jobsCreateAndWait.safeParse(jobResponse).success).toBe(true);
		expect(Outputs.jobsGet.safeParse(jobResponse).success).toBe(true);
		expect(Outputs.jobsWait.safeParse(jobResponse).success).toBe(true);
		expect(
			Outputs.jobsList.safeParse({
				data: [jobResponse.data],
				links: { first: 'https://api.cloudconvert.com/v2/jobs?page=1' },
				meta: {
					current_page: 1,
					path: 'https://api.cloudconvert.com/v2/jobs',
					per_page: 100,
				},
			}).success,
		).toBe(true);
		expect(Outputs.jobsRemove.safeParse(undefined).success).toBe(true);
	});

	it('validates job IDs, filters, include values and pagination bounds', () => {
		expect(
			Inputs.jobsGet.safeParse({ jobId: 'job-123', redirect: true }).success,
		).toBe(false);
		expect(Inputs.jobsWait.safeParse({ jobId: '' }).success).toBe(false);
		expect(
			Inputs.jobsList.safeParse({
				status: 'processing',
				tag: 'request-123',
				accessToken: 'token-456',
				include: ['tasks'],
				perPage: 1000,
				page: 1,
			}).success,
		).toBe(true);
		expect(Inputs.jobsList.safeParse({ status: 'waiting' }).success).toBe(
			false,
		);
		expect(Inputs.jobsList.safeParse({ include: ['payload'] }).success).toBe(
			false,
		);
		expect(Inputs.jobsList.safeParse({ perPage: 1001 }).success).toBe(false);
		expect(Inputs.jobsRemove.safeParse({ jobId: 'job-123' }).success).toBe(
			true,
		);
	});

	it('validates task get/wait/cancel/retry/remove inputs and included response fields', () => {
		expect(
			Inputs.tasksGet.safeParse({
				taskId: 'task-123',
				include: ['retries', 'depends_on_tasks', 'payload', 'job'],
			}).success,
		).toBe(true);
		expect(
			Inputs.tasksGet.safeParse({ taskId: 'task-123', include: ['job_id'] })
				.success,
		).toBe(false);
		for (const schema of [
			Inputs.tasksWait,
			Inputs.tasksCancel,
			Inputs.tasksRetry,
			Inputs.tasksRemove,
		]) {
			expect(schema.safeParse({ taskId: 'task-123' }).success).toBe(true);
			expect(schema.safeParse({ taskId: '' }).success).toBe(false);
		}
		expect(Outputs.tasksGet.safeParse(taskResponse).success).toBe(true);
		expect(Outputs.tasksWait.safeParse(taskResponse).success).toBe(true);
		expect(Outputs.tasksCancel.safeParse(taskResponse).success).toBe(true);
		expect(Outputs.tasksRetry.safeParse(taskResponse).success).toBe(true);
		expect(Outputs.tasksRemove.safeParse(undefined).success).toBe(true);
	});

	it('validates Google Cloud Storage export-job input and output', () => {
		const validInput = {
			exportTaskName: 'export',
			sourceTasks: {
				converted: { operation: 'convert', input: 'upload' },
				upload: {
					operation: 'import/url',
					url: 'https://files.test/input.pdf',
				},
			},
			input: 'converted',
			bucket: 'converted-files',
			filePrefix: 'converted/',
		};
		expect(
			Inputs.tasksCreateExportGoogleCloudStorage.safeParse(validInput).success,
		).toBe(true);
		expect(
			Inputs.tasksCreateExportGoogleCloudStorage.safeParse({
				...validInput,
				privateKey: 'must-not-be-an-argument',
			}).success,
		).toBe(false);
		expect(
			Inputs.tasksCreateExportGoogleCloudStorage.safeParse({
				exportTaskName: 'export',
				sourceTasks: { upload: { operation: 'import/url' } },
				input: 'missing',
				bucket: '',
			}).success,
		).toBe(false);
		expect(
			Outputs.tasksCreateExportGoogleCloudStorage.safeParse(jobResponse)
				.success,
		).toBe(true);
		expect(
			Outputs.tasksCreateExportGoogleCloudStorage.safeParse({
				data: { status: 'processing' },
			}).success,
		).toBe(false);
	});

	it('validates S3 export-job input and output', () => {
		const validInput = {
			exportTaskName: 'export',
			sourceTasks: { converted: { operation: 'convert' } },
			input: 'converted',
			bucket: 'converted-files',
			region: 'eu-west-1',
			acl: 'private',
			serverSideEncryption: 'AES256',
		};
		expect(Inputs.tasksCreateExportS3.safeParse(validInput).success).toBe(true);
		expect(
			Inputs.tasksCreateExportS3.safeParse({
				...validInput,
				secretAccessKey: 'must-not-be-an-argument',
			}).success,
		).toBe(false);
		expect(
			Inputs.tasksCreateExportS3.safeParse({
				exportTaskName: 'export',
				sourceTasks: { converted: { operation: 'convert' } },
				input: 'converted',
				bucket: 'converted-files',
				region: 'eu-west-1',
				key: 'output.pdf',
				keyPrefix: 'output/',
			}).success,
		).toBe(false);
		expect(Outputs.tasksCreateExportS3.safeParse(jobResponse).success).toBe(
			true,
		);
		expect(
			Outputs.tasksCreateExportS3.safeParse({ data: { id: 'job-123' } })
				.success,
		).toBe(false);
	});

	it('validates task-list filters and paginated output', () => {
		expect(
			Inputs.tasksList.safeParse({
				jobId: 'job-123',
				status: 'finished',
				operation: 'convert',
				include: ['retries'],
				perPage: 100,
				page: 1,
			}).success,
		).toBe(true);
		expect(Inputs.tasksList.safeParse({ perPage: 1001 }).success).toBe(false);
		expect(Outputs.tasksList.safeParse(taskListResponse).success).toBe(true);
		expect(
			Outputs.tasksList.safeParse({ data: [{ status: 'finished' }] }).success,
		).toBe(false);
	});

	it('validates operation discovery filters and output', () => {
		expect(
			Inputs.operationsList.safeParse({
				operation: 'convert',
				inputFormat: 'docx',
				outputFormat: 'pdf',
				engine: 'office',
				alternatives: true,
				include: ['options', 'options.details', 'engine_versions'],
			}).success,
		).toBe(true);
		expect(
			Inputs.operationsList.safeParse({ include: ['unsupported'] }).success,
		).toBe(false);
		expect(
			Outputs.operationsList.safeParse(operationListResponse).success,
		).toBe(true);
		expect(
			Outputs.operationsList.safeParse({
				data: [{ operation: 'convert', input_format: 'docx' }],
			}).success,
		).toBe(false);
	});

	it('validates supported-format discovery input and output', () => {
		expect(Inputs.formatsListSupported.safeParse({}).success).toBe(true);
		expect(
			Inputs.formatsListSupported.safeParse({ format: 'pdf' }).success,
		).toBe(false);
		expect(
			Outputs.formatsListSupported.safeParse({
				data: [
					{
						...operationResult,
						options: [{ name: 'quality', type: 'integer', min: 1, max: 100 }],
						engine_versions: [{ version: '2.1', default: true, latest: true }],
					},
				],
			}).success,
		).toBe(true);
		expect(
			Outputs.formatsListSupported.safeParse({ data: [{ engine: 'office' }] })
				.success,
		).toBe(false);
	});

	it('accepts operations from the live GET /operations response', () => {
		// Shapes taken from the public GET /v2/operations?alternatives=true&include=options,options.details,engine_versions
		// response (11-13): 31 operations return input_format null, 43 return output_format null,
		// 360 omit one of them, and option types include "input" and "array" beyond the documented six.
		const liveOperations = {
			data: [
				{
					operation: 'command',
					engine: 'ffmpeg',
					engine_versions: [{ version: '9.0.2', default: true, latest: true }],
					credits: 1,
					options: [],
				},
				{
					operation: 'watermark',
					input_format: null,
					output_format: 'pdf',
					engine: 'imagemagick',
					engine_versions: [{ version: '7.1.2', default: true, latest: true }],
					options: [],
					credits: 1,
				},
				{
					operation: 'convert',
					input_format: 'htm',
					output_format: 'pdf',
					engine: 'chrome',
					engine_versions: [],
					credits: 1,
					options: [
						{
							name: 'header_template',
							type: 'input',
							default: null,
							group: 'layout',
							advanced: true,
						},
					],
				},
				{
					operation: 'pdf/ocr',
					engine: 'ocrmypdf',
					engine_versions: [],
					credits: 1,
					options: [{ name: 'language', type: 'array', default: ['eng'] }],
				},
			],
		};
		expect(Outputs.operationsList.safeParse(liveOperations).success).toBe(true);
		expect(Outputs.formatsListSupported.safeParse(liveOperations).success).toBe(
			true,
		);
	});

	it('accepts depends_on_tasks as the live array of task objects', () => {
		// Live GET /v2/tasks/{id}?include=payload,job,depends_on_tasks (11-13), ids replaced.
		const liveTask = {
			data: {
				id: 'task-export',
				job_id: 'job-123',
				name: 'export_file',
				operation: 'export/url',
				status: 'finished',
				created_at: '2026-11-13T15:11:36+00:00',
				retries: [],
				payload: { operation: 'export/url', input: 'import_file' },
				depends_on_tasks: [
					{
						id: 'task-import',
						name: 'import_file',
						job_id: 'job-123',
						status: 'finished',
						credits: 0,
						code: null,
						message: null,
						percent: 100,
						operation: 'import/raw',
						result: { files: [{ filename: 'input.txt', size: 1 }] },
						created_at: '2026-11-13T15:11:36+00:00',
						started_at: '2026-11-13T15:11:36+00:00',
						ended_at: '2026-11-13T15:11:36+00:00',
						retry_of_task_id: null,
					},
				],
				job: {
					id: 'job-123',
					tag: 'corsair-plugin-test',
					status: 'finished',
					created_at: '2026-11-13T15:11:36+00:00',
				},
			},
		};
		expect(Outputs.tasksGet.safeParse(liveTask).success).toBe(true);
		expect(
			Outputs.tasksGet.safeParse({
				data: { ...liveTask.data, depends_on_tasks: [] },
			}).success,
		).toBe(true);
	});

	it('keeps parsing jobs and tasks when CloudConvert adds a status value', () => {
		const job = {
			data: {
				...jobResponse.data,
				status: 'queued',
				tasks: [{ ...jobResponse.data.tasks[0], status: 'paused' }],
			},
		};
		expect(Outputs.jobsGet.safeParse(job).success).toBe(true);
		expect(
			Outputs.tasksGet.safeParse({
				data: { ...taskResponse.data, status: 'paused' },
			}).success,
		).toBe(true);
	});

	it('validates the current-user input and output', () => {
		expect(Inputs.usersShow.safeParse({}).success).toBe(true);
		expect(Inputs.usersShow.safeParse({ id: 'user-123' }).success).toBe(false);
		expect(Outputs.usersShow.safeParse(userResponse).success).toBe(true);
		// Live GET /v2/users/me for an account created by email signup (11-13), trimmed.
		const liveUser = {
			data: {
				id: 1,
				username: null,
				email: 'converter@project.test',
				created_at: '2026-11-13T15:08:11+00:00',
				email_verified: true,
				credits: 10,
				paying: false,
				task_region: null,
				links: { self: 'https://api.cloudconvert.com/v2/users/1' },
			},
		};
		expect(Outputs.usersShow.safeParse(liveUser).success).toBe(true);
		expect(Outputs.usersShow.safeParse({ data: { id: 1 } }).success).toBe(
			false,
		);
	});
});
