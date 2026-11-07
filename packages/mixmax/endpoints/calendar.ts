import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const appointmentLinksList: MixmaxEndpoints['appointmentLinksList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['appointmentLinksList']
		>(ctx, '/v1/appointmentlinks', {
			method: 'GET',
			query: {
				name: input.name,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.appointmentLinks.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const appointmentLinksGetMe: MixmaxEndpoints['appointmentLinksGetMe'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['appointmentLinksGetMe']
		>(ctx, '/v1/appointmentlinks/me', { method: 'GET' });

		await logEventFromContext(
			ctx,
			'mixmax.appointmentLinks.getMe',
			{ ...input },
			'completed',
		);
		return result;
	};

export const appointmentLinksUpdateMe: MixmaxEndpoints['appointmentLinksUpdateMe'] =
	async (ctx, input) => {
		const { name } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['appointmentLinksUpdateMe']
		>(ctx, '/v1/appointmentlinks/me', {
			method: 'PATCH',
			body: {
				name,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.appointmentLinks.updateMe',
			{ ...input },
			'completed',
		);
		return result;
	};

export const meetingTypesList: MixmaxEndpoints['meetingTypesList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['meetingTypesList']
	>(ctx, '/v1/meetingtypes', {
		method: 'GET',
		query: {
			access: input.access,
			limit: input.limit,
			next: input.next,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.meetingTypes.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const meetingTypesCreate: MixmaxEndpoints['meetingTypesCreate'] = async (
	ctx,
	input,
) => {
	const { ...meetingType } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['meetingTypesCreate']
	>(ctx, '/v1/meetingtypes', {
		method: 'POST',
		body: meetingType,
	});

	await logEventFromContext(
		ctx,
		'mixmax.meetingTypes.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const meetingTypesGet: MixmaxEndpoints['meetingTypesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['meetingTypesGet']
	>(ctx, mixmaxPathParameter('/v1/meetingtypes/{id}', 'id', input.id), {
		method: 'GET',
		query: {
			expand: input.expand,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.meetingTypes.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const meetingTypesUpdate: MixmaxEndpoints['meetingTypesUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...update } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['meetingTypesUpdate']
	>(ctx, mixmaxPathParameter('/v1/meetingtypes/{id}', 'id', id), {
		method: 'PATCH',
		body: update,
	});

	await logEventFromContext(
		ctx,
		'mixmax.meetingTypes.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const meetingTypesDelete: MixmaxEndpoints['meetingTypesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['meetingTypesDelete']
	>(ctx, mixmaxPathParameter('/v1/meetingtypes/{id}', 'id', input.id), {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'mixmax.meetingTypes.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const meetingInvitesList: MixmaxEndpoints['meetingInvitesList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['meetingInvitesList']
	>(ctx, '/v1/meetinginvites', {
		method: 'GET',
		query: {
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.meetingInvites.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const meetingInvitesGet: MixmaxEndpoints['meetingInvitesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['meetingInvitesGet']
	>(ctx, mixmaxPathParameter('/v1/meetinginvites/{id}', 'id', input.id), {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.meetingInvites.get',
		{ ...input },
		'completed',
	);
	return result;
};
