import type { PlacidEndpoints } from '..';
import { cursorParam, segment } from '../client';
import { call, callDelete } from './call';
import { downloadAsFile } from './download';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export const list: PlacidEndpoints['fontsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fonts.list',
			input: Inputs.fontsList,
			output: Outputs.fontsList,
		},
		input,
		({ include_legacy, cursor }) => ({
			method: 'GET',
			path: '/fonts',
			query: {
				// Placid treats any truthy value as on, so 1 is enough.
				include_legacy: include_legacy ? 1 : undefined,
				cursor: cursor === undefined ? undefined : cursorParam(cursor),
			},
		}),
		{
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const get: PlacidEndpoints['fontsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fonts.get',
			input: Inputs.fontsGet,
			output: Outputs.fontsGet,
		},
		input,
		({ uuid, include_legacy }) => ({
			method: 'GET',
			path: `/fonts/${segment(uuid)}`,
			query: include_legacy ? { include_legacy: 1 } : undefined,
		}),
		{
			log: (_, result) => ({ uuid: result.uuid }),
		},
	);

export const create: PlacidEndpoints['fontsCreate'] = async (ctx, rawInput) => {
	const parsed = Inputs.fontsCreate.parse(rawInput ?? {});
	const file = await downloadAsFile(
		parsed.file_url,
		parsed.filename,
		'font.ttf',
	);

	return await call(
		ctx,
		{
			event: 'fonts.create',
			input: Inputs.fontsCreate,
			output: Outputs.fontsCreate,
		},
		parsed,
		() => ({
			method: 'POST',
			path: '/fonts',
			formData: {
				file,
				...(parsed.title === undefined ? {} : { title: parsed.title }),
				// The API requires a truthy value on every upload.
				terms_accepted: 1,
			},
		}),
		{
			log: (_, result) => ({ uuid: result.uuid }),
		},
	);
};

export const update: PlacidEndpoints['fontsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fonts.update',
			input: Inputs.fontsUpdate,
			output: Outputs.fontsUpdate,
		},
		input,
		({ uuid, title }) => ({
			method: 'PATCH',
			path: `/fonts/${segment(uuid)}`,
			body: { title },
		}),
		{
			log: ({ uuid }) => ({ uuid }),
		},
	);

export const remove: PlacidEndpoints['fontsDelete'] = (ctx, input) =>
	callDelete(
		ctx,
		{
			event: 'fonts.delete',
			input: Inputs.fontsDelete,
			output: Outputs.fontsDelete,
		},
		input,
		({ uuid, force }) => ({
			method: 'DELETE',
			path: `/fonts/${segment(uuid)}`,
			query: force ? { force: 1 } : undefined,
		}),
		({ uuid }) => ({ success: true as const, uuid }),
		({ uuid }) => ({ uuid }),
	);
