import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fadePost } from '../client.js';

/** Gemini voices available in Fade TTS */
export const GEMINI_VOICES = [
	'Zephyr',
	'Puck',
	'Charon',
	'Kore',
	'Fenrir',
	'Leda',
	'Orus',
	'Aoede',
	'Callirrhoe',
	'Autonoe',
	'Enceladus',
	'Iapetus',
	'Umbriel',
	'Algieba',
	'Despina',
	'Erinome',
	'Algenib',
	'Rasalgethi',
	'Laomedeia',
	'Achernar',
	'Alnilam',
	'Schedar',
	'Gacrux',
	'Pulcherrima',
	'Achird',
	'Zubenelgenubi',
	'Vindemiatrix',
	'Sadachbia',
	'Sadaltager',
	'Sulafat',
] as const;

export const generate_tts = tool(
	async ({ text, voice, outputDir }) => {
		const result = await fadePost<{
			assetId?: string;
			jobId?: string;
			filepath?: string;
		}>('/audio/tts', {
			text,
			voice: voice ?? 'Kore',
			outputDir: outputDir ?? '',
		});
		if (result.assetId) {
			return `TTS generated. assetId=${result.assetId} | filepath=${result.filepath ?? ''}`;
		}
		return `TTS queued. job_id=${result.jobId ?? 'unknown'}`;
	},
	{
		name: 'generate_tts',
		description:
			'Generate a voiceover audio clip from text using Google Gemini TTS. ' +
			'Returns assetId when done, or job_id if queued. ' +
			`Available voices: ${GEMINI_VOICES.slice(0, 8).join(', ')} and more.`,
		schema: z.object({
			text: z.string().describe('The text to convert to speech'),
			voice: z.string().default('Kore').describe('Gemini TTS voice name'),
			outputDir: z
				.string()
				.default('')
				.describe('Output directory (empty = project folder)'),
		}),
	},
);

export const generate_image = tool(
	async ({ prompt, outputDir }) => {
		const result = await fadePost<{
			assetId?: string;
			jobId?: string;
			filepath?: string;
		}>('/library/generate-image', { prompt, outputDir: outputDir ?? '' });
		if (result.assetId) {
			return `Image generated. assetId=${result.assetId} | filepath=${result.filepath ?? ''}`;
		}
		return `Image generation queued. job_id=${result.jobId ?? 'unknown'}`;
	},
	{
		name: 'generate_image',
		description:
			'Generate an image using Gemini Imagen and add it to the library.',
		schema: z.object({
			prompt: z.string().describe('Detailed image generation prompt'),
			outputDir: z.string().default(''),
		}),
	},
);

export const download_video_url = tool(
	async ({ url, outputDir }) => {
		const result = await fadePost<{ assetId?: string; jobId?: string }>(
			'/library/download-url',
			{ url, outputDir: outputDir ?? '' },
		);
		if (result.assetId) return `Downloaded. assetId=${result.assetId}`;
		return `Download queued. job_id=${result.jobId ?? 'unknown'}`;
	},
	{
		name: 'download_video_url',
		description:
			'Download a video from a direct URL (YouTube, etc.) into the library.',
		schema: z.object({
			url: z.string().url(),
			outputDir: z.string().default(''),
		}),
	},
);

export const transcribe_asset = tool(
	async ({ assetId, language }) => {
		const result = await fadePost<{ jobId?: string; segments?: unknown[] }>(
			`/library/${assetId}/transcribe`,
			{ language: language ?? null },
		);
		if (result.segments) return JSON.stringify(result.segments, null, 2);
		return `Transcription queued. job_id=${result.jobId ?? 'unknown'}`;
	},
	{
		name: 'transcribe_asset',
		description:
			'Transcribe speech in a video/audio asset via Whisper. Returns segments or a job_id.',
		schema: z.object({
			assetId: z.string(),
			language: z
				.string()
				.nullable()
				.optional()
				.describe('ISO language code e.g. "en", null = auto-detect'),
		}),
	},
);

export const search_library = tool(
	async ({ query, topK }) => {
		const result = await fadePost<unknown>('/library/search', {
			query,
			topK: topK ?? 5,
		});
		return JSON.stringify(result, null, 2);
	},
	{
		name: 'search_library',
		description:
			'Semantic search across indexed library assets (Vision + Whisper transcripts).',
		schema: z.object({
			query: z.string(),
			topK: z.number().int().default(5),
		}),
	},
);

export const MEDIA_TOOLS = [
	generate_tts,
	generate_image,
	download_video_url,
	transcribe_asset,
	search_library,
];
