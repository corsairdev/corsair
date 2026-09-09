import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fadeGet, fadePatch } from '../client.js';

export const set_clip_volume = tool(
	async ({ clipId, volume }) => {
		const v = Math.max(0, Math.min(2, volume));
		const result = await fadePatch(`/clips/${clipId}/volume`, { volume: v });
		return `Volume set to ${v} on clip ${clipId.slice(0, 8)}.`;
	},
	{
		name: 'set_clip_volume',
		description:
			'Set audio volume of a clip. 0=silent, 1=original, 2=200% boost.',
		schema: z.object({
			clipId: z.string(),
			volume: z.number().min(0).max(2),
		}),
	},
);

export const mute_clip = tool(
	async ({ clipId, mute }) => {
		const result = await fadePatch(`/clips/${clipId}/volume`, { mute });
		return `Clip ${clipId.slice(0, 8)} ${mute ? 'muted' : 'unmuted'}.`;
	},
	{
		name: 'mute_clip',
		description:
			'Mute or unmute a clip audio. Non-destructive — volume is preserved.',
		schema: z.object({
			clipId: z.string(),
			mute: z.boolean().default(true),
		}),
	},
);

export const get_clip_volume = tool(
	async ({ clipId }) => {
		const result = await fadeGet<{ volume: number; mute: boolean }>(
			`/clips/${clipId}/volume`,
		);
		return `Clip ${clipId.slice(0, 8)}: volume=${result.volume}, muted=${result.mute}`;
	},
	{
		name: 'get_clip_volume',
		description: 'Get the current volume and mute state of a clip.',
		schema: z.object({ clipId: z.string() }),
	},
);

export const AUDIO_TOOLS = [set_clip_volume, mute_clip, get_clip_volume];
