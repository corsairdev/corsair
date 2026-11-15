import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

export const list: GumroadEndpoints['mediaList'] = (ctx, input) =>
	call(ctx, 'mediaList', 'media.list', '/media', input);

export const create: GumroadEndpoints['mediaCreate'] = (ctx, input) =>
	call(ctx, 'mediaCreate', 'media.create', '/media', input, {
		method: 'POST',
		toForm: (parsed) =>
			formEntries({
				url: parsed.url,
				signed_blob_id: parsed.signed_blob_id,
				name: parsed.name,
			}),
	});

export const remove: GumroadEndpoints['mediaDelete'] = (ctx, input) =>
	call(
		ctx,
		'mediaDelete',
		'media.delete',
		`/media/${encodeURIComponent(input.id)}`,
		input,
		{ method: 'DELETE' },
	);
