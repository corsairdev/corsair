import type { z } from 'zod';
import { makeMinerstatRequest } from '../client';
import type { MinerstatContext } from '../index';
import * as schemas from './types';

export async function coins_list(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.coins_listInput>,
): Promise<z.output<typeof schemas.coins_listOutput>> {
	const input = schemas.coins_listInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/coins',
		query: input,
	});
	return schemas.coins_listOutput.parse(raw);
}

export async function coins_get(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.coins_getInput>,
): Promise<z.output<typeof schemas.coins_getOutput>> {
	const input = schemas.coins_getInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/coins/{slug}',
		path: { slug: input.slug },
	});
	return schemas.coins_getOutput.parse(raw);
}

export async function coins_history(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.coins_historyInput>,
): Promise<z.output<typeof schemas.coins_historyOutput>> {
	const input = schemas.coins_historyInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/coins/{slug}/history',
		path: { slug: input.slug },
		query: { limit: input.limit, offset: input.offset },
	});
	return schemas.coins_historyOutput.parse(raw);
}

export async function hardware_list(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.hardware_listInput>,
): Promise<z.output<typeof schemas.hardware_listOutput>> {
	const input = schemas.hardware_listInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/hardware',
		query: input,
	});
	return schemas.hardware_listOutput.parse(raw);
}

export async function hardware_get(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.hardware_getInput>,
): Promise<z.output<typeof schemas.hardware_getOutput>> {
	const input = schemas.hardware_getInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/hardware/{slug}',
		path: { slug: input.slug },
	});
	return schemas.hardware_getOutput.parse(raw);
}

export async function algorithms_list(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.algorithms_listInput>,
): Promise<z.output<typeof schemas.algorithms_listOutput>> {
	const input = schemas.algorithms_listInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/algorithms',
		query: input,
	});
	return schemas.algorithms_listOutput.parse(raw);
}

export async function algorithms_get(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.algorithms_getInput>,
): Promise<z.output<typeof schemas.algorithms_getOutput>> {
	const input = schemas.algorithms_getInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/algorithms/{slug}',
		path: { slug: input.slug },
	});
	return schemas.algorithms_getOutput.parse(raw);
}

export async function pools_list(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.pools_listInput>,
): Promise<z.output<typeof schemas.pools_listOutput>> {
	const input = schemas.pools_listInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/pools',
		query: input,
	});
	return schemas.pools_listOutput.parse(raw);
}

export async function pools_get(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.pools_getInput>,
): Promise<z.output<typeof schemas.pools_getOutput>> {
	const input = schemas.pools_getInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/pools/{slug}',
		path: { slug: input.slug },
	});
	return schemas.pools_getOutput.parse(raw);
}

export async function profitability_rank(
	ctx: MinerstatContext,
	args: z.input<typeof schemas.profitability_rankInput>,
): Promise<z.output<typeof schemas.profitability_rankOutput>> {
	const input = schemas.profitability_rankInput.parse(args);
	const raw = await makeMinerstatRequest(ctx.key, {
		method: 'GET',
		url: '/v3/profitability',
		query: input,
	});
	return schemas.profitability_rankOutput.parse(raw);
}
