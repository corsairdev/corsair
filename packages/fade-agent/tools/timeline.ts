import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fadeDelete, fadeGet, fadePatch, fadePost } from '../client.js';

export const get_timeline_state = tool(
	async () => {
		const state = await fadeGet<unknown>('/timeline/state');
		return JSON.stringify(state, null, 2);
	},
	{
		name: 'get_timeline_state',
		description:
			'Get the full current timeline state: all tracks, clips, fps, totalFrames, currentFrame.',
		schema: z.object({}),
	},
);

export const place_clip = tool(
	async ({ assetId, trackIndex, startFrame, duration }) => {
		const result = await fadePost('/clips/place', {
			assetId,
			trackIndex,
			startFrame,
			duration,
		});
		return JSON.stringify(result);
	},
	{
		name: 'place_clip',
		description:
			'Place a media asset onto the timeline. Returns the new clipId.',
		schema: z.object({
			assetId: z.string().describe('Asset ID from the library'),
			trackIndex: z.number().int().describe('Track index (0 = bottom)'),
			startFrame: z.number().int().describe('Frame to place the clip at'),
			duration: z
				.number()
				.int()
				.optional()
				.describe('Override duration in frames'),
		}),
	},
);

export const delete_clip = tool(
	async ({ clipId }) => {
		await fadeDelete(`/clips/${clipId}`);
		return `Clip ${clipId.slice(0, 8)} deleted.`;
	},
	{
		name: 'delete_clip',
		description: 'Delete a clip from the timeline by its clipId.',
		schema: z.object({ clipId: z.string() }),
	},
);

export const move_clip = tool(
	async ({ clipId, startFrame, trackIndex }) => {
		const result = await fadePatch(`/clips/${clipId}/move`, {
			startFrame,
			trackIndex,
		});
		return JSON.stringify(result);
	},
	{
		name: 'move_clip',
		description: 'Move a clip to a new startFrame and/or track index.',
		schema: z.object({
			clipId: z.string(),
			startFrame: z.number().int(),
			trackIndex: z.number().int().optional(),
		}),
	},
);

export const trim_clip = tool(
	async ({ clipId, side, frameDelta }) => {
		const result = await fadePatch(`/clips/${clipId}/trim`, {
			side,
			frameDelta,
		});
		return JSON.stringify(result);
	},
	{
		name: 'trim_clip',
		description:
			'Trim frames from the left or right side of a clip. frameDelta = frames to remove (positive).',
		schema: z.object({
			clipId: z.string(),
			side: z.enum(['left', 'right']),
			frameDelta: z.number().int().positive(),
		}),
	},
);

export const split_clip = tool(
	async ({ clipId, splitFrame }) => {
		const result = await fadePost('/clips/split', { clipId, splitFrame });
		return JSON.stringify(result);
	},
	{
		name: 'split_clip',
		description: 'Split a clip at splitFrame into two clips.',
		schema: z.object({
			clipId: z.string(),
			splitFrame: z.number().int(),
		}),
	},
);

export const add_track = tool(
	async ({ trackType, name }) => {
		const result = await fadePost('/timeline/tracks', {
			type: trackType,
			name,
		});
		return JSON.stringify(result);
	},
	{
		name: 'add_track',
		description: 'Add a new video or audio track to the timeline.',
		schema: z.object({
			trackType: z.enum(['video', 'audio']).default('video'),
			name: z.string().default(''),
		}),
	},
);

export const remove_track = tool(
	async ({ trackId }) => {
		await fadeDelete(`/timeline/tracks/${trackId}`);
		return `Track ${trackId.slice(0, 8)} removed.`;
	},
	{
		name: 'remove_track',
		description: 'Remove a track and all its clips from the timeline.',
		schema: z.object({ trackId: z.string() }),
	},
);

export const mute_track = tool(
	async ({ trackId, muted }) => {
		const result = await fadePatch(`/timeline/tracks/${trackId}/mute`, {
			muted,
		});
		return JSON.stringify(result);
	},
	{
		name: 'mute_track',
		description: 'Mute or unmute a track.',
		schema: z.object({
			trackId: z.string(),
			muted: z.boolean().default(true),
		}),
	},
);

export const undo = tool(
	async () => {
		const result = await fadePost('/history/undo', {});
		return JSON.stringify(result);
	},
	{
		name: 'undo',
		description: 'Undo the last timeline action.',
		schema: z.object({}),
	},
);

export const redo = tool(
	async () => {
		const result = await fadePost('/history/redo', {});
		return JSON.stringify(result);
	},
	{
		name: 'redo',
		description: 'Redo the last undone timeline action.',
		schema: z.object({}),
	},
);

export const TIMELINE_TOOLS = [
	get_timeline_state,
	place_clip,
	delete_clip,
	move_clip,
	trim_clip,
	split_clip,
	add_track,
	remove_track,
	mute_track,
	undo,
	redo,
];
