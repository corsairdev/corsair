import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getStaffs: WhautomateEndpoints['getStaffs'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page) query.page = input.page;
	if (input.limit) query.limit = input.limit;
	if (input.search) query.search = input.search;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getStaffs']
	>(
		ctx.options.apiHost!,
		ctx.key,
		'/staff',
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
		ctx.options.apiHost!,
		ctx.key,
		`/staff/${input.id}`,
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
		if (rest.startDate) query.startDate = rest.startDate;
		if (rest.endDate) query.endDate = rest.endDate;

		const result = await makeWhautomateRequest<
			WhautomateEndpointOutputs['getStaffAvailabilityBlocks']
		>(
			ctx.options.apiHost!,
			ctx.key,
			`/staff/${staffId}/availability-blocks`,
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
