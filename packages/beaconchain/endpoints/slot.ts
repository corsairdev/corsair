import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV1Request,
	makeBeaconchainV2Request,
	requireBeaconchainKey,
	v1GetOptions,
	v2Body,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import {
	BeaconchainV1ResponseSchema,
	BeaconchainV2ResponseSchema,
	GetSlotAttestationsInputSchema,
	GetSlotAttesterSlashingsInputSchema,
	GetSlotInputSchema,
	GetSlotProposerSlashingsInputSchema,
	GetSlotVoluntaryExitsInputSchema,
} from './types';

export const getSlot: BeaconchainEndpoints['getSlot'] = async (ctx, input) => {
	const parsed = GetSlotInputSchema.parse(input);
	const res = await makeBeaconchainV2Request(
		'ethereum/slot',
		requireBeaconchainKey(ctx.key),
		{
			method: 'POST',
			body: v2Body(parsed, { slot: parsed.slotId }),
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.slot.get',
		{ slotId: String(parsed.slotId) },
		'completed',
	);
	return BeaconchainV2ResponseSchema.parse(res);
};

export const getSlotAttestations: BeaconchainEndpoints['getSlotAttestations'] =
	async (ctx, input) => {
		const parsed = GetSlotAttestationsInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`slot/${parsed.slotId}/attestations`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getAttestations',
			{ slotId: String(parsed.slotId) },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

export const getSlotAttesterSlashings: BeaconchainEndpoints['getSlotAttesterSlashings'] =
	async (ctx, input) => {
		const parsed = GetSlotAttesterSlashingsInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`slot/${parsed.slotId}/attesterslashings`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getAttesterSlashings',
			{ slotId: String(parsed.slotId) },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

export const getSlotProposerSlashings: BeaconchainEndpoints['getSlotProposerSlashings'] =
	async (ctx, input) => {
		const parsed = GetSlotProposerSlashingsInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`slot/${parsed.slotId}/proposerslashings`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getProposerSlashings',
			{ slotId: String(parsed.slotId) },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};

export const getSlotVoluntaryExits: BeaconchainEndpoints['getSlotVoluntaryExits'] =
	async (ctx, input) => {
		const parsed = GetSlotVoluntaryExitsInputSchema.parse(input);
		const res = await makeBeaconchainV1Request(
			`slot/${parsed.slotId}/voluntaryexits`,
			requireBeaconchainKey(ctx.key),
			v1GetOptions(parsed.chain),
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getVoluntaryExits',
			{ slotId: String(parsed.slotId) },
			'completed',
		);
		return BeaconchainV1ResponseSchema.parse(res);
	};
