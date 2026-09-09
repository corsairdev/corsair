import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fadeGet, fadePost } from '../client.js';

const FORMAT_DIMS: Record<string, [number, number]> = {
	'mp4-1080': [1920, 1080],
	'mp4-4k': [3840, 2160],
	'mp4-720': [1280, 720],
	shorts: [1080, 1920],
	reels: [1080, 1920],
	webm: [1920, 1080],
	gif: [854, 480],
};

const FORMAT_EXT: Record<string, string> = {
	'mp4-1080': 'mp4',
	'mp4-4k': 'mp4',
	'mp4-720': 'mp4',
	shorts: 'mp4',
	reels: 'mp4',
	webm: 'webm',
	gif: 'gif',
};

export const export_video = tool(
	async ({ format, fps, outputPath, preset, crf }) => {
		const fmt = format ?? 'mp4-1080';
		const [w, h] = FORMAT_DIMS[fmt] ?? [1920, 1080];
		const ext = FORMAT_EXT[fmt] ?? 'mp4';
		const out = outputPath || `fade_export.${ext}`;

		const result = await fadePost<{ jobId: string; total: number }>(
			'/export/start',
			{
				outputPath: out,
				width: w,
				height: h,
				fps: fps ?? 30,
				codec: 'auto',
				videoBitrate: '8M',
				crf: crf ?? 22,
				preset: preset ?? 'medium',
				audioBitrate: '192k',
				audioSampleRate: 48000,
				audioChannels: 2,
				formatId: fmt,
			},
		);

		return `Export started. jobId=${result.jobId} | ${fmt} ${w}x${h} | ${result.total} frames | output=${out}\nEXPORT_JOB_ID:${result.jobId}`;
	},
	{
		name: 'export_video',
		description:
			'Export the current Fade timeline to a video file. Format: mp4-1080, mp4-4k, mp4-720, shorts, reels, webm, gif.',
		schema: z.object({
			format: z.string().default('mp4-1080'),
			fps: z.number().default(30),
			outputPath: z.string().default(''),
			preset: z.string().default('medium'),
			crf: z.number().int().default(22),
		}),
	},
);

export const wait_for_export = tool(
	async ({ jobId, pollIntervalMs }) => {
		const interval = pollIntervalMs ?? 3000;
		const maxWait = 10 * 60 * 1000;
		const started = Date.now();

		while (Date.now() - started < maxWait) {
			const job = await fadeGet<{
				status: string;
				progress: number;
				outputPath?: string;
				error?: string;
			}>(`/export/status/${jobId}`);

			if (job.status === 'done') {
				return `Export complete!\nEXPORT_PATH:${job.outputPath ?? ''}`;
			}
			if (job.status === 'error') {
				return `Export failed: ${job.error ?? 'unknown error'}`;
			}
			if (job.status === 'cancelled') {
				return 'Export was cancelled.';
			}

			await new Promise((r) => setTimeout(r, interval));
		}
		return 'Export timed out after 10 minutes.';
	},
	{
		name: 'wait_for_export',
		description:
			'Poll an export job until it completes. Returns EXPORT_PATH:<path> on success.',
		schema: z.object({
			jobId: z.string(),
			pollIntervalMs: z.number().int().default(3000),
		}),
	},
);

export const EXPORT_TOOLS = [export_video, wait_for_export];
