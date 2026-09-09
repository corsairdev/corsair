/**
 * Publish tools — ported from Python backend/ai/publish_tools.py
 * Instead of direct YouTube API calls, this routes through the
 * @corsair-dev/phantombuster plugin to post/schedule via PhantomBuster agents.
 */
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fadePost } from '../client.js';

/** PhantomBuster API key injected at agent build time */
let _pbApiKey = process.env['PHANTOMBUSTER_API_KEY'] ?? '';

export function setPhantomBusterKey(key: string): void {
	_pbApiKey = key;
}

/** Launch a PhantomBuster agent by its agentId via the PhantomBuster REST API */
async function launchPhantomAgent(
	agentId: string,
	args: Record<string, unknown>,
): Promise<string> {
	const res = await fetch(
		'https://api.phantombuster.com/api/v2/agents/launch',
		{
			method: 'POST',
			headers: {
				'X-Phantombuster-Key': _pbApiKey,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: agentId, argument: args }),
		},
	);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PhantomBuster launch failed ${res.status}: ${text}`);
	}
	const data = (await res.json()) as { containerId?: string };
	return data.containerId ?? '';
}

export const post_media = tool(
	async ({
		platform,
		videoPath,
		title,
		description,
		tags,
		privacy,
		phantomAgentId,
	}) => {
		if (!_pbApiKey) {
			return 'No PhantomBuster API key set. Call setPhantomBusterKey() or set PHANTOMBUSTER_API_KEY env var.';
		}
		if (!phantomAgentId) {
			return 'No PhantomBuster agent ID provided. Pass the agentId of your YouTube upload phantom.';
		}

		// Upload file reference to PhantomBuster agent
		const containerId = await launchPhantomAgent(phantomAgentId, {
			videoPath,
			title,
			description,
			tags: tags
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean),
			privacy,
			platform,
		});

		return (
			`Launched PhantomBuster agent ${phantomAgentId}\n` +
			`Container ID: ${containerId}\n` +
			`Title: ${title} | Privacy: ${privacy}\n` +
			`PHANTOM_CONTAINER_ID:${containerId}`
		);
	},
	{
		name: 'post_media',
		description:
			'Publish a local video file to a social platform via a PhantomBuster agent. ' +
			'Requires a PhantomBuster API key and the agentId of a YouTube/social upload phantom.',
		schema: z.object({
			platform: z.string().default('youtube'),
			videoPath: z
				.string()
				.describe('Absolute path to the exported video file'),
			title: z.string().max(100),
			description: z.string().max(5000).default(''),
			tags: z.string().default('').describe('Comma-separated tags'),
			privacy: z.enum(['public', 'unlisted', 'private']).default('public'),
			phantomAgentId: z
				.string()
				.describe('PhantomBuster agent ID for the upload phantom'),
		}),
	},
);

export const post_to_platform = tool(
	async ({
		platform,
		format,
		title,
		description,
		tags,
		privacy,
		phantomAgentId,
	}) => {
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

		const fmt = format ?? 'mp4-1080';
		const [w, h] = FORMAT_DIMS[fmt] ?? [1920, 1080];
		const ext = FORMAT_EXT[fmt] ?? 'mp4';
		const safe = title
			.replace(/[^a-zA-Z0-9 _-]/g, '_')
			.slice(0, 40)
			.trim();
		const outputPath = `${safe || 'fade_export'}.${ext}`;

		// Step 1: start export
		const exportResult = await fadePost<{ jobId: string; total: number }>(
			'/export/start',
			{
				outputPath,
				width: w,
				height: h,
				fps: 30,
				codec: 'auto',
				videoBitrate: '8M',
				crf: 22,
				preset: 'medium',
				audioBitrate: '192k',
				audioSampleRate: 48000,
				audioChannels: 2,
				formatId: fmt,
			},
		);
		const { jobId, total } = exportResult;

		// Step 2: poll until done
		const maxWait = 10 * 60 * 1000;
		const started = Date.now();
		let finalPath = outputPath;

		while (Date.now() - started < maxWait) {
			const status = await fetch(
				`http://localhost:8000/export/status/${jobId}`,
			).then(
				(r) => r.json() as Promise<{ status: string; outputPath?: string }>,
			);

			if (status.status === 'done') {
				finalPath = status.outputPath ?? outputPath;
				break;
			}
			if (status.status === 'error' || status.status === 'cancelled') {
				return `Export ${status.status} before upload could start.`;
			}
			await new Promise((r) => setTimeout(r, 3000));
		}

		// Step 3: publish via PhantomBuster
		const publishResult = await post_media.invoke({
			platform,
			videoPath: finalPath,
			title,
			description,
			tags,
			privacy,
			phantomAgentId,
		});

		return `Export → ${finalPath} (${total} frames)\n\n${publishResult}`;
	},
	{
		name: 'post_to_platform',
		description:
			'One-step: export the current Fade timeline then publish to a social platform via PhantomBuster. ' +
			'Use when the user says "post to YouTube", "publish my video", "upload and share".',
		schema: z.object({
			platform: z.string().default('youtube'),
			format: z.string().default('mp4-1080'),
			title: z.string(),
			description: z.string().default(''),
			tags: z.string().default(''),
			privacy: z.enum(['public', 'unlisted', 'private']).default('public'),
			phantomAgentId: z
				.string()
				.describe('PhantomBuster agent ID for the upload phantom'),
		}),
	},
);

export const PUBLISH_TOOLS = [post_media, post_to_platform];
