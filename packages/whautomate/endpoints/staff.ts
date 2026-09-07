import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest, resolveApiHost } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getStaffs: WhautomateEndpoints['getStaffs'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.search !== undefined) query.search = input.search;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getStaffs']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		'/staffs',
		WhautomateEndpointOutputSchemas.getStaffs,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.staff.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getStaffById: WhautomateEndpoints['getStaffById'] = async (
	ctx,
	input,
) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getStaffById']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		`/staffs/${input.id}`,
		WhautomateEndpointOutputSchemas.getStaffById,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.staff.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getStaffAvailabilityBlocks: WhautomateEndpoints['getStaffAvailabilityBlocks'] =
	async (ctx, input) => {
		const { staffId, ...rest } = input;
		const query: Record<string, string | number | boolean | undefined> = {};
		if (rest.startDate !== undefined) query.startDate = rest.startDate;
		if (rest.endDate !== undefined) query.endDate = rest.endDate;

		const result = await makeWhautomateRequest<
			WhautomateEndpointOutputs['getStaffAvailabilityBlocks']
		>(
			await resolveApiHost(ctx),
			ctx.key,
			`/staffs/${staffId}/availabilityBlocks`,
			WhautomateEndpointOutputSchemas.getStaffAvailabilityBlocks,
			{
				method: 'GET',
				query,
			},
		);

		await logEventFromContext(
			ctx,
			'whautomate.staff.availability',
			{ ...input },
			'completed',
		);
		return result;
	};

export const Staff = {
	getStaffs,
	getStaffById,
	getStaffAvailabilityBlocks,
};
