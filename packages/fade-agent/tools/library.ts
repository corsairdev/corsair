import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fadeGet, fadePost } from '../client.js';

export const list_library_assets = tool(
	async () => {
		const result = await fadeGet<unknown>('/library/assets');
		return JSON.stringify(result, null, 2);
	},
	{
		name: 'list_library_assets',
		description: 'List all media assets in the Fade project library.',
		schema: z.object({}),
	},
);

export const download_videos = tool(
	async ({ query, maxResults }) => {
		const result = await fadePost('/library/download', { query, maxResults });
		return JSON.stringify(result);
	},
	{
		name: 'download_videos',
		description:
			'Download videos from YouTube matching a search query. Returns assetId(s) or a job_id if async.',
		schema: z.object({
			query: z.string().describe('YouTube search query (5–8 words)'),
			maxResults: z.number().int().default(1),
		}),
	},
);

export const check_job_status = tool(
	async ({ jobId }) => {
		const result = await fadeGet<unknown>(`/jobs/${jobId}`);
		return JSON.stringify(result);
	},
	{
		name: 'check_job_status',
		description:
			'Check the status of a background job (download, TTS, image gen, indexing). Returns progress and assetId when done.',
		schema: z.object({ jobId: z.string() }),
	},
);

export const cancel_job = tool(
	async ({ jobId }) => {
		const result = await fadePost(`/jobs/${jobId}/cancel`, {});
		return JSON.stringify(result);
	},
	{
		name: 'cancel_job',
		description: 'Cancel a running or queued background job.',
		schema: z.object({ jobId: z.string() }),
	},
);

export const stop_indexing = tool(
	async ({ assetId }) => {
		const result = await fadePost(`/library/cancel-index/${assetId}`, {});
		return JSON.stringify(result);
	},
	{
		name: 'stop_indexing',
		description: 'Stop Vision+Whisper semantic indexing for a specific asset.',
		schema: z.object({ assetId: z.string() }),
	},
);

export const LIBRARY_TOOLS = [
	list_library_assets,
	download_videos,
	check_job_status,
	cancel_job,
	stop_indexing,
];
