import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getSlot: BeaconchainEndpoints['getSlot'] = async (ctx, input) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		`slot/${input.slotId}`,
		ctx.key,
		{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`slot/${input.slotId}/attestations`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`slot/${input.slotId}/attester_slashings`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`slot/${input.slotId}/proposer_slashings`,
			ctx.key,
			{ method: 'GET' },
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
		const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
			`slot/${input.slotId}/voluntary_exits`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'beaconchain.slot.getVoluntaryExits',
			{ slotId: String(input.slotId) },
			'completed',
		);
		return res;
	};
