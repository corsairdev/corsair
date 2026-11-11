import type { CloudConvertEndpoints } from '..';
import { call, joinList } from './call';
import {
	CloudConvertEndpointInputSchemas as Inputs,
	CloudConvertEndpointOutputSchemas as Outputs,
} from './types';

export const tasksCreateExportGoogleCloudStorage: CloudConvertEndpoints['tasksCreateExportGoogleCloudStorage'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'tasks.createExportGoogleCloudStorage',
				input: Inputs.tasksCreateExportGoogleCloudStorage,
				output: Outputs.tasksCreateExportGoogleCloudStorage,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/jobs',
				body: {
					tasks: {
						...parsed.sourceTasks,
						[parsed.exportTaskName]: {
							operation: 'export/google-cloud-storage',
							input: parsed.input,
							project_id: parsed.projectId,
							bucket: parsed.bucket,
							client_email: parsed.clientEmail,
							private_key: parsed.privateKey,
							...(parsed.file === undefined ? {} : { file: parsed.file }),
							...(parsed.filePrefix === undefined
								? {}
								: { file_prefix: parsed.filePrefix }),
						},
					},
				},
			}),
			{
				log: (parsed) => ({
					taskCount: Object.keys(parsed.sourceTasks).length + 1,
				}),
			},
		);

export const tasksCreateExportS3: CloudConvertEndpoints['tasksCreateExportS3'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'tasks.createExportS3',
				input: Inputs.tasksCreateExportS3,
				output: Outputs.tasksCreateExportS3,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/jobs',
				body: {
					tasks: {
						...parsed.sourceTasks,
						[parsed.exportTaskName]: {
							operation: 'export/s3',
							input: parsed.input,
							bucket: parsed.bucket,
							region: parsed.region,
							access_key_id: parsed.accessKeyId,
							secret_access_key: parsed.secretAccessKey,
							...(parsed.endpoint === undefined
								? {}
								: { endpoint: parsed.endpoint }),
							...(parsed.key === undefined ? {} : { key: parsed.key }),
							...(parsed.keyPrefix === undefined
								? {}
								: { key_prefix: parsed.keyPrefix }),
							...(parsed.sessionToken === undefined
								? {}
								: { session_token: parsed.sessionToken }),
							...(parsed.acl === undefined ? {} : { acl: parsed.acl }),
							...(parsed.cacheControl === undefined
								? {}
								: { cache_control: parsed.cacheControl }),
							...(parsed.contentDisposition === undefined
								? {}
								: { content_disposition: parsed.contentDisposition }),
							...(parsed.contentType === undefined
								? {}
								: { content_type: parsed.contentType }),
							...(parsed.metadata === undefined
								? {}
								: { metadata: parsed.metadata }),
							...(parsed.serverSideEncryption === undefined
								? {}
								: {
										server_side_encryption: parsed.serverSideEncryption,
									}),
							...(parsed.tagging === undefined
								? {}
								: { tagging: parsed.tagging }),
						},
					},
				},
			}),
			{
				log: (parsed) => ({
					taskCount: Object.keys(parsed.sourceTasks).length + 1,
				}),
			},
		);

export const tasksList: CloudConvertEndpoints['tasksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.list',
			input: Inputs.tasksList,
			output: Outputs.tasksList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/tasks',
			query: {
				'filter[job_id]': parsed.jobId,
				'filter[status]': parsed.status,
				'filter[operation]': parsed.operation,
				include: joinList(parsed.include),
				per_page: parsed.perPage,
				page: parsed.page,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				page: result.meta?.current_page,
			}),
		},
	);

export const tasksGet: CloudConvertEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.get',
			input: Inputs.tasksGet,
			output: Outputs.tasksGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/tasks/${encodeURIComponent(parsed.taskId)}`,
			query: { include: joinList(parsed.include) },
		}),
		{ log: () => ({}) },
	);

export const tasksWait: CloudConvertEndpoints['tasksWait'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.wait',
			input: Inputs.tasksWait,
			output: Outputs.tasksWait,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/tasks/${encodeURIComponent(parsed.taskId)}`,
			host: 'sync',
		}),
		{ log: () => ({}) },
	);

export const tasksCancel: CloudConvertEndpoints['tasksCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.cancel',
			input: Inputs.tasksCancel,
			output: Outputs.tasksCancel,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/tasks/${encodeURIComponent(parsed.taskId)}/cancel`,
		}),
		{ log: () => ({}) },
	);

export const tasksRetry: CloudConvertEndpoints['tasksRetry'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.retry',
			input: Inputs.tasksRetry,
			output: Outputs.tasksRetry,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/tasks/${encodeURIComponent(parsed.taskId)}/retry`,
		}),
		{ log: () => ({}) },
	);

export const tasksRemove: CloudConvertEndpoints['tasksRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.remove',
			input: Inputs.tasksRemove,
			output: Outputs.tasksRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/tasks/${encodeURIComponent(parsed.taskId)}`,
		}),
		{ log: () => ({}) },
	);
