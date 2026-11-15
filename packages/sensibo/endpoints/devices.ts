import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeSensiboRequest } from '../client';
import type { SensiboContext } from '../context';
import { SensiboPodEntity } from '../schema/database';
import type { ListDevicesInput, ListDevicesResponse } from './types';
import { ListDevicesInputSchema, ListDevicesResponseSchema } from './types';

export const listDevices: CorsairEndpoint<
	SensiboContext,
	ListDevicesInput,
	ListDevicesResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('sensibo', 'api_key');
	}

	const parsed = ListDevicesInputSchema.parse(input ?? {});
	const body = await makeSensiboRequest<unknown>(ctx.key, {
		fields: parsed.fields,
	});
	const result = ListDevicesResponseSchema.parse(body);
	await storePods(ctx, result.result);
	await logEventFromContext(ctx, 'sensibo.devices.list', {}, 'completed');
	return result;
};

function podRow(item: unknown): SensiboPodEntity | undefined {
	if (!item || typeof item !== 'object') return undefined;
	const record = item as { id?: unknown; room?: unknown };
	const room = record.room;
	const roomName =
		room &&
		typeof room === 'object' &&
		typeof (room as { name?: unknown }).name === 'string'
			? (room as { name: string }).name
			: undefined;
	const parsed = SensiboPodEntity.safeParse({ id: record.id, roomName });
	return parsed.success ? parsed.data : undefined;
}

async function storePods(ctx: SensiboContext, pods: unknown[]): Promise<void> {
	if (!ctx.db?.pods) return;
	for (const item of pods) {
		const row = podRow(item);
		if (!row) continue;
		try {
			await ctx.db.pods.upsertByEntityId(row.id, row);
		} catch {
			console.warn('Failed to save Sensibo pod');
		}
	}
}

export const Devices = { list: listDevices };
