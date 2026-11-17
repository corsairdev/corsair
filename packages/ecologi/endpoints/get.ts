import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { ecologiGet } from '../client';
import type { EcologiContext } from '../context';
import { EcologiImpactEntity, EcologiTotalEntity } from '../schema/database';
import type { ImpactResponse, TotalResponse, UsernameInput } from './types';
import { UsernameInputSchema } from './types';

// The reporting bodies are untrusted provider JSON, so they stay `unknown`
// and each field is checked before it is read.
function numberAt(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

function record(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: undefined;
}

async function read(
	username: string,
	path: string,
): Promise<Record<string, unknown>> {
	const body = await ecologiGet<unknown>(
		`/users/${encodeURIComponent(username)}/${path}`,
	);
	const row = record(body);
	if (!row) throw new Error('Ecologi response was not an object');
	return row;
}

async function save(
	ctx: EcologiContext,
	entity: 'trees' | 'carbonOffsets' | 'carbonRemovals' | 'habitats',
	row: EcologiTotalEntity,
	event: string,
): Promise<void> {
	const table = ctx.db?.[entity];
	if (table) {
		try {
			await table.upsertByEntityId(row.id, row);
		} catch {
			console.warn('Failed to save Ecologi total');
		}
	}
	await logEventFromContext(ctx, event, { count: 1 }, 'completed');
}

function totalEndpoint(
	entity: 'trees' | 'carbonOffsets' | 'carbonRemovals' | 'habitats',
	path: string,
	event: string,
): CorsairEndpoint<EcologiContext, UsernameInput, TotalResponse> {
	return async (ctx, input) => {
		const parsed = UsernameInputSchema.parse(input ?? {});
		const body = await read(parsed.username, path);
		const row = EcologiTotalEntity.safeParse({
			id: parsed.username,
			total: numberAt(body.total),
			pending: numberAt(body.pending),
		});
		if (!row.success) {
			throw new Error('Ecologi total response was missing total or pending');
		}
		await save(ctx, entity, row.data, event);
		return { total: row.data };
	};
}

export const getTrees = totalEndpoint('trees', 'trees', 'ecologi.trees.get');
export const getCarbonOffset = totalEndpoint(
	'carbonOffsets',
	'carbon-offset',
	'ecologi.carbonOffsets.get',
);
export const getCarbonRemoval = totalEndpoint(
	'carbonRemovals',
	'carbon-removal',
	'ecologi.carbonRemovals.get',
);
export const getHabitat = totalEndpoint(
	'habitats',
	'habitat-restoration',
	'ecologi.habitats.get',
);

export const getImpact: CorsairEndpoint<
	EcologiContext,
	UsernameInput,
	ImpactResponse
> = async (ctx, input) => {
	const parsed = UsernameInputSchema.parse(input ?? {});
	const body = await read(parsed.username, 'impact');
	const pending = record(body.pending);
	const row = EcologiImpactEntity.safeParse({
		id: parsed.username,
		trees: numberAt(body.trees),
		carbonOffset: numberAt(body.carbonOffset),
		carbonRemoval: numberAt(body.carbonRemoval),
		habitatRestoration: numberAt(body.habitatRestoration),
		pendingTrees: numberAt(pending?.trees),
		pendingCarbonOffset: numberAt(pending?.carbonOffset),
		pendingCarbonRemoval: numberAt(pending?.carbonRemoval),
		pendingHabitatRestoration: numberAt(pending?.habitatRestoration),
	});
	if (!row.success) {
		throw new Error('Ecologi impact response was missing a documented total');
	}
	if (ctx.db?.impacts) {
		try {
			await ctx.db.impacts.upsertByEntityId(row.data.id, row.data);
		} catch {
			console.warn('Failed to save Ecologi impact');
		}
	}
	await logEventFromContext(
		ctx,
		'ecologi.impacts.get',
		{ count: 1 },
		'completed',
	);
	return { impact: row.data };
};
