import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fadeDelete, fadeGet, fadePatch, fadePost } from '../client.js';

export const get_library_assets = tool(
	async () => {
		const data = await fadeGet<unknown>('/library/assets/rich');
		return JSON.stringify(data, null, 2);
	},
	{
		name: 'get_library_assets',
		description:
			'Return ALL library assets with full metadata: assetId, filename, type, durationFrames, ' +
			'width, height, hasAudio, indexStatus, transcriptStatus, sceneChunks, transcript.',
		schema: z.object({}),
	},
);

export const get_playback_state = tool(
	async () => {
		const data = await fadeGet<unknown>('/playback/state');
		return JSON.stringify(data, null, 2);
	},
	{
		name: 'get_playback_state',
		description:
			'Return current playback state: frame, fps, totalFrames, playing.',
		schema: z.object({}),
	},
);

export const seek_to = tool(
	async ({ frame }) => {
		await fadePost('/playback/seek', { frame });
		return `Seeked to frame ${frame}.`;
	},
	{
		name: 'seek_to',
		description: 'Seek the timeline playhead to a specific frame number.',
		schema: z.object({ frame: z.number().int() }),
	},
);

export const reposition_clip = tool(
	async ({ clipId, newStartFrame }) => {
		const data = await fadeGet<{
			tracks: Array<{ clips: Array<{ clipId?: string; startFrame: number }> }>;
		}>('/timeline/state');
		let trackIndex = -1;
		for (let i = 0; i < data.tracks.length; i++) {
			if (data.tracks[i]!.clips.some((c) => c.clipId === clipId)) {
				trackIndex = i;
				break;
			}
		}
		if (trackIndex === -1) return `Clip ${clipId.slice(0, 8)} not found.`;
		const result = await fadePost('/timeline/move-clip', {
			clipId,
			startFrame: newStartFrame,
			trackIndex,
		});
		return `Repositioned clip ${clipId.slice(0, 8)} to frame ${newStartFrame} on track ${trackIndex}.`;
	},
	{
		name: 'reposition_clip',
		description:
			'Slide a clip to a new start frame on its CURRENT track (no track change).',
		schema: z.object({
			clipId: z.string(),
			newStartFrame: z.number().int().min(0),
		}),
	},
);

export const get_selected_clips = tool(
	async () => {
		const tl = await fadeGet<{
			tracks: Array<{
				trackId?: string;
				clips: Array<Record<string, unknown>>;
			}>;
		}>('/timeline/state');
		const clips: unknown[] = [];
		tl.tracks.forEach((track, ti) => {
			const trackId = track.trackId ?? '';
			track.clips.forEach((clip) => {
				clips.push({
					clipId: clip['id'] ?? clip['clipId'] ?? '',
					trackId,
					trackIndex: ti,
					type: clip['type'] ?? '',
					name: clip['name'] ?? '',
					startFrame: clip['startFrame'] ?? 0,
					duration: clip['duration'] ?? 0,
				});
			});
		});
		return JSON.stringify(clips, null, 2);
	},
	{
		name: 'get_selected_clips',
		description:
			'Return a flat list of ALL clips across all tracks with clipId, trackIndex, type, startFrame, duration.',
		schema: z.object({}),
	},
);

export const update_clip = tool(
	async ({ clipId, params }) => {
		const TRANSFORM = new Set([
			'pos_x',
			'pos_y',
			'scale_x',
			'scale_y',
			'rotation',
			'opacity',
			'anchor_x',
			'anchor_y',
		]);
		const TIMING = new Set(['startFrame', 'duration']);
		const applied: string[] = [];

		for (const [key, val] of Object.entries(params)) {
			if (TRANSFORM.has(key)) {
				await fadePost(`/clips/${clipId}/params/${key}`, {
					value: Number(val),
				});
				applied.push(`${key}=${val}`);
			}
		}
		const timing = Object.fromEntries(
			Object.entries(params).filter(([k]) => TIMING.has(k)),
		);
		if (Object.keys(timing).length > 0) {
			await fadePost(`/clips/${clipId}/trim`, timing);
			applied.push(`timing=${JSON.stringify(timing)}`);
		}
		const style = Object.fromEntries(
			Object.entries(params).filter(
				([k]) => !TRANSFORM.has(k) && !TIMING.has(k),
			),
		);
		if (Object.keys(style).length > 0) {
			await fadePatch(`/clips/text/${clipId}`, { style });
			applied.push(`style=${JSON.stringify(style)}`);
		}
		return `update_clip ${clipId.slice(0, 8)}: ${applied.join(', ') || 'nothing changed'}`;
	},
	{
		name: 'update_clip',
		description:
			'Update any combination of clip properties in one call: transform (pos_x, pos_y, scale_x, scale_y, rotation, opacity), ' +
			'timing (startFrame, duration), text style (text, fontSize, bold, color...), shape style, webcomp params.',
		schema: z.object({
			clipId: z.string(),
			params: z.record(z.string(), z.unknown()),
		}),
	},
);

export const bulk_update_clips = tool(
	async ({ updates }) => {
		const lines: string[] = [];
		for (const op of updates) {
			const clipId = op['clipId'] as string | undefined;
			if (!clipId) {
				lines.push('SKIP: missing clipId');
				continue;
			}
			try {
				if ('param' in op) {
					await fadePost(`/clips/${clipId}/params/${op['param']}`, {
						value: op['value'],
					});
					lines.push(
						`OK ${clipId.slice(0, 8)} → ${op['param']}=${op['value']}`,
					);
				} else if ('style' in op) {
					await fadePatch(`/clips/text/${clipId}`, { style: op['style'] });
					lines.push(`OK ${clipId.slice(0, 8)} → style`);
				} else if ('startFrame' in op || 'duration' in op) {
					const body: Record<string, unknown> = {};
					if ('startFrame' in op) body['startFrame'] = op['startFrame'];
					if ('duration' in op) body['duration'] = op['duration'];
					await fadePost(`/clips/${clipId}/trim`, body);
					lines.push(`OK ${clipId.slice(0, 8)} → trim ${JSON.stringify(body)}`);
				} else {
					lines.push(`SKIP ${clipId.slice(0, 8)}: no recognised op keys`);
				}
			} catch (e) {
				lines.push(`ERR ${clipId.slice(0, 8)}: ${e}`);
			}
		}
		return lines.join('\n') || 'No updates performed.';
	},
	{
		name: 'bulk_update_clips',
		description:
			'Apply changes to multiple clips in one call. Each item: ' +
			'{ clipId, param, value } | { clipId, style: {...} } | { clipId, startFrame, duration }.',
		schema: z.object({
			updates: z.array(z.record(z.string(), z.unknown())),
		}),
	},
);

export const add_text_clip = tool(
	async ({ trackIndex, startFrame, duration, text, font, compId }) => {
		const result = await fadePost('/clips/text', {
			trackIndex,
			startFrame,
			duration,
			text,
			fontFamily: font ?? 'Arial',
			compId: compId ?? null,
		});
		return JSON.stringify(result, null, 2);
	},
	{
		name: 'add_text_clip',
		description: 'Add a text clip to the timeline.',
		schema: z.object({
			trackIndex: z.number().int(),
			startFrame: z.number().int(),
			duration: z.number().int(),
			text: z.string(),
			font: z.string().default('Arial'),
			compId: z.string().nullable().optional(),
		}),
	},
);

export const find_free_overlay_track = tool(
	async ({ startFrame, endFrame }) => {
		const data = await fadeGet<{
			tracks: Array<{
				trackId?: string;
				type?: string;
				clips: Array<{ startFrame: number; duration: number; type?: string }>;
			}>;
		}>('/timeline/state');
		const videoTracks = data.tracks
			.map((t, i) => ({ i, t }))
			.filter(({ t }) => (t.type ?? 'video') !== 'audio');

		if (videoTracks.length === 0) {
			const newTrack = await fadePost<{ trackId: string }>(
				'/timeline/add-track',
				{ type: 'video', name: 'Overlay' },
			);
			return JSON.stringify({
				track_index: 0,
				track_id: newTrack.trackId,
				created: true,
			});
		}

		const occupied = new Set<number>();
		for (const { i, t } of videoTracks) {
			for (const clip of t.clips) {
				const clipEnd = clip.startFrame + clip.duration - 1;
				if (
					clip.startFrame <= endFrame &&
					startFrame <= clipEnd &&
					clip.type !== 'adjustment'
				) {
					occupied.add(i);
				}
			}
		}

		if (occupied.size === 0) {
			const last = videoTracks.at(-1)!;
			return JSON.stringify({
				track_index: last.i,
				track_id: last.t.trackId,
				created: false,
			});
		}

		const maxOccupied = Math.max(...occupied);
		const free = videoTracks.find(
			({ i }) => i > maxOccupied && !occupied.has(i),
		);
		if (free) {
			return JSON.stringify({
				track_index: free.i,
				track_id: free.t.trackId,
				created: false,
			});
		}

		const newTrack = await fadePost<{ trackId: string }>(
			'/timeline/add-track',
			{ type: 'video', name: 'Overlay' },
		);
		return JSON.stringify({
			track_index: data.tracks.length,
			track_id: newTrack.trackId,
			created: true,
		});
	},
	{
		name: 'find_free_overlay_track',
		description:
			'Find (or create) the highest-index track that renders ABOVE all clips in the given frame range. ' +
			'Always call before placing text, titles, or overlays.',
		schema: z.object({
			startFrame: z.number().int(),
			endFrame: z.number().int(),
		}),
	},
);

export const remove_track_at_index = tool(
	async ({ trackIndex }) => {
		const result = await fadeDelete(`/timeline/track-by-index/${trackIndex}`);
		return JSON.stringify(result);
	},
	{
		name: 'remove_track_at_index',
		description: 'Remove a track and all its clips by its zero-based index.',
		schema: z.object({ trackIndex: z.number().int().min(0) }),
	},
);

export const get_effects_catalog = tool(
	async () => {
		const data = await fadeGet<unknown>('/effects/catalog');
		return JSON.stringify(data, null, 2);
	},
	{
		name: 'get_effects_catalog',
		description:
			'Return all available visual effects and their parameter schemas.',
		schema: z.object({}),
	},
);

export const add_effect = tool(
	async ({ clipId, effectType }) => {
		const result = await fadePost<{ effectId?: string }>(
			`/clips/${clipId}/effects`,
			{ effectType },
		);
		return `Added effect '${effectType}' to clip ${clipId.slice(0, 8)}. effectId: ${result.effectId}`;
	},
	{
		name: 'add_effect',
		description:
			'Add a visual effect to a clip. Use get_effects_catalog() to see valid effectType values.',
		schema: z.object({
			clipId: z.string(),
			effectType: z.string(),
		}),
	},
);

export const remove_effect = tool(
	async ({ clipId, effectId }) => {
		await fadeDelete(`/clips/${clipId}/effects/${effectId}`);
		return `Removed effect ${effectId} from clip ${clipId.slice(0, 8)}.`;
	},
	{
		name: 'remove_effect',
		description: 'Remove a visual effect from a clip by effectId.',
		schema: z.object({ clipId: z.string(), effectId: z.string() }),
	},
);

export const set_effect_param = tool(
	async ({ clipId, effectId, params }) => {
		await fadePatch(`/clips/${clipId}/effects/${effectId}`, { params });
		return `Updated effect ${effectId} on clip ${clipId.slice(0, 8)}.`;
	},
	{
		name: 'set_effect_param',
		description: 'Update parameters of an existing effect on a clip.',
		schema: z.object({
			clipId: z.string(),
			effectId: z.string(),
			params: z.record(z.string(), z.unknown()),
		}),
	},
);

export const get_transitions_catalog = tool(
	async () => {
		const data = await fadeGet<unknown>('/transitions/catalog');
		return JSON.stringify(data, null, 2);
	},
	{
		name: 'get_transitions_catalog',
		description: 'Return all available transition types with typeId values.',
		schema: z.object({}),
	},
);

export const add_transition = tool(
	async ({ clipAId, clipBId, typeId, durationFrames }) => {
		await fadePost('/transitions', {
			typeId: typeId ?? 'dissolve',
			duration: durationFrames ?? 30,
			clipA_id: clipAId,
			clipB_id: clipBId,
		});
		return `Transition '${typeId}' (${durationFrames}f) added between ${clipAId.slice(0, 8)} → ${clipBId.slice(0, 8)}.`;
	},
	{
		name: 'add_transition',
		description:
			"Add a transition between two consecutive clips. typeId: 'dissolve', 'fade_black', 'wipe_left', 'wipe_right', 'zoom_in', 'slide_left'.",
		schema: z.object({
			clipAId: z.string(),
			clipBId: z.string(),
			typeId: z.string().default('dissolve'),
			durationFrames: z.number().int().default(30),
		}),
	},
);

export const add_transitions_between_all_clips = tool(
	async ({ typeId, durationFrames, trackIndex }) => {
		const tl = await fadeGet<{
			tracks: Array<{
				clips: Array<{
					clipId?: string;
					id?: string;
					startFrame: number;
					duration: number;
				}>;
			}>;
		}>('/timeline/state');
		let added = 0,
			skipped = 0;
		const errors: string[] = [];

		for (let ti = 0; ti < tl.tracks.length; ti++) {
			if (trackIndex !== undefined && trackIndex >= 0 && ti !== trackIndex)
				continue;
			const clips = [...tl.tracks[ti]!.clips].sort(
				(a, b) => a.startFrame - b.startFrame,
			);
			for (let i = 0; i < clips.length - 1; i++) {
				const a = clips[i]!,
					b = clips[i + 1]!;
				const aId = a.clipId ?? a.id ?? '';
				const bId = b.clipId ?? b.id ?? '';
				if (!aId || !bId) {
					errors.push(`track${ti}/clip${i}: missing clipId`);
					continue;
				}
				const gap = b.startFrame - (a.startFrame + a.duration);
				if (gap > 90) {
					skipped++;
					continue;
				}
				try {
					await fadePost('/transitions', {
						typeId,
						duration: durationFrames,
						clipA_id: aId,
						clipB_id: bId,
					});
					added++;
				} catch (e) {
					errors.push(`${aId.slice(0, 8)}: ${e}`);
				}
			}
		}
		let result = `Added ${added} '${typeId}' transitions (${durationFrames}f each)`;
		if (skipped) result += `, ${skipped} gaps skipped (>3s)`;
		if (errors.length) result += `\nErrors: ${errors.join('; ')}`;
		return result;
	},
	{
		name: 'add_transitions_between_all_clips',
		description:
			'Automatically add transitions between ALL consecutive clip pairs on a track.',
		schema: z.object({
			typeId: z.string().default('dissolve'),
			durationFrames: z.number().int().default(30),
			trackIndex: z.number().int().default(-1).describe('-1 = all tracks'),
		}),
	},
);

export const TIMELINE_EXTRA_TOOLS = [
	get_library_assets,
	get_playback_state,
	seek_to,
	reposition_clip,
	get_selected_clips,
	update_clip,
	bulk_update_clips,
	add_text_clip,
	find_free_overlay_track,
	remove_track_at_index,
	get_effects_catalog,
	add_effect,
	remove_effect,
	set_effect_param,
	get_transitions_catalog,
	add_transition,
	add_transitions_between_all_clips,
];
