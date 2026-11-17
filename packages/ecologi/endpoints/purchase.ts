import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ecologiPurchase } from '../client';
import type { EcologiContext } from '../context';
import type {
	PurchaseCarbonInput,
	PurchaseCarbonRemovalInput,
	PurchaseHabitatInput,
	PurchaseLocalTreesInput,
	PurchaseResponse,
	PurchaseTreesInput,
} from './types';
import {
	PurchaseCarbonInputSchema,
	PurchaseCarbonRemovalInputSchema,
	PurchaseHabitatInputSchema,
	PurchaseLocalTreesInputSchema,
	PurchaseResponseSchema,
	PurchaseTreesInputSchema,
} from './types';

// Each purchase adds its own required fields (number, country, units) on top
// of the shared ones; they are already checked by that operation's zod schema.
type PurchaseFields = {
	idempotencyKey?: string;
	name?: string;
	test?: boolean;
	recipientEmail?: string;
} & Record<string, unknown>;

async function purchase(
	ctx: EcologiContext,
	path: string,
	event: string,
	fields: PurchaseFields,
): Promise<PurchaseResponse> {
	if (!ctx.key) {
		throw new AuthMissingError('ecologi', 'api_key');
	}
	const { idempotencyKey, ...body } = fields;
	// `unknown` until PurchaseResponseSchema parses it: untrusted provider JSON.
	const response = await ecologiPurchase<unknown>(
		ctx.key,
		path,
		body,
		idempotencyKey,
	);
	const result = PurchaseResponseSchema.parse(response);
	// The funded-by name and the recipient's email stay out of the event.
	await logEventFromContext(
		ctx,
		event,
		{ number: body.number, test: body.test === true },
		'completed',
	);
	return result;
}

export const purchaseTrees: CorsairEndpoint<
	EcologiContext,
	PurchaseTreesInput,
	PurchaseResponse
> = async (ctx, input) =>
	purchase(
		ctx,
		'/impact/trees',
		'ecologi.trees.purchase',
		PurchaseTreesInputSchema.parse(input),
	);

export const purchaseLocalTrees: CorsairEndpoint<
	EcologiContext,
	PurchaseLocalTreesInput,
	PurchaseResponse
> = async (ctx, input) =>
	purchase(
		ctx,
		'/impact/local-trees',
		'ecologi.trees.purchaseLocal',
		PurchaseLocalTreesInputSchema.parse(input),
	);

export const purchaseCarbonAvoidance: CorsairEndpoint<
	EcologiContext,
	PurchaseCarbonInput,
	PurchaseResponse
> = async (ctx, input) =>
	purchase(
		ctx,
		'/impact/carbon',
		'ecologi.carbonOffsets.purchase',
		PurchaseCarbonInputSchema.parse(input),
	);

export const purchaseCarbonRemoval: CorsairEndpoint<
	EcologiContext,
	PurchaseCarbonRemovalInput,
	PurchaseResponse
> = async (ctx, input) =>
	purchase(
		ctx,
		'/impact/carbon-removal',
		'ecologi.carbonRemovals.purchase',
		PurchaseCarbonRemovalInputSchema.parse(input),
	);

export const purchaseHabitat: CorsairEndpoint<
	EcologiContext,
	PurchaseHabitatInput,
	PurchaseResponse
> = async (ctx, input) =>
	purchase(
		ctx,
		'/impact/habitat-restoration',
		'ecologi.habitats.purchase',
		PurchaseHabitatInputSchema.parse(input),
	);
