import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getSlot: BeaconchainEndpoints['getSlot'] = async (ctx, input) => {
	const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
		'ethereum/slot',
		ctx.key,
		{
			method: 'POST',
			body: {
				chain: 'mainnet',
				slot: input.slotId,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'beaconchain.slot.get',
		{ slotId: String(input.slotId) },
		'completed',
	);
	return res;
};

export const getSlotAttestations: BeaconchainEndpoints['getSlotAttestations'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/slot/attestation-duties',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					slot: input.slotId,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getAttestations',
			{ slotId: String(input.slotId) },
			'completed',
		);
		return res;
	};

export const getSlotAttesterSlashings: BeaconchainEndpoints['getSlotAttesterSlashings'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/slot/attester-slashings',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					slot: input.slotId,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getAttesterSlashings',
			{ slotId: String(input.slotId) },
			'completed',
		);
		return res;
	};

export const getSlotProposerSlashings: BeaconchainEndpoints['getSlotProposerSlashings'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/slot/proposer-slashings',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					slot: input.slotId,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getProposerSlashings',
			{ slotId: String(input.slotId) },
			'completed',
		);
		return res;
	};

export const getSlotVoluntaryExits: BeaconchainEndpoints['getSlotVoluntaryExits'] =
	async (ctx, input) => {
		const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
			'ethereum/slot/voluntary-exits',
			ctx.key,
			{
				method: 'POST',
				body: {
					chain: 'mainnet',
					slot: input.slotId,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getVoluntaryExits',
			{ slotId: String(input.slotId) },
			'completed',
		);
		return res;
	};
