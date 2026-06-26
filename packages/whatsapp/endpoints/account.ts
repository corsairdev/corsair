import { logEventFromContext } from 'corsair/core';
import type { WhatsappEndpoints } from '../index';
import { makeWhatsappRequest } from '../client';
import { resolvePhoneNumberId } from './messages';
import type { WhatsappEndpointOutputs } from './types';

export const getPhoneNumber: WhatsappEndpoints['phoneNumbersGet'] = async (
	ctx,
	input,
) => {
	const phoneNumberId = await resolvePhoneNumberId(ctx, input.phoneNumberId);
	const result = await makeWhatsappRequest<
		WhatsappEndpointOutputs['phoneNumbersGet']
	>(phoneNumberId, ctx.key, {
		query: {
			fields:
				'display_phone_number,verified_name,quality_rating,code_verification_status,platform_type,throughput',
		},
	});

	await ctx.db.phoneNumbers.upsertByEntityId(result.id, {
		...result,
		id: result.id,
		createdAt: new Date(),
	});
	await logEventFromContext(
		ctx,
		'whatsapp.phoneNumbers.get',
		{ phoneNumberId },
		'completed',
	);
	return result;
};

export const getBusinessProfile: WhatsappEndpoints['businessProfilesGet'] =
	async (ctx, input) => {
		const phoneNumberId = await resolvePhoneNumberId(ctx, input.phoneNumberId);
		const result = await makeWhatsappRequest<
			WhatsappEndpointOutputs['businessProfilesGet']
		>(`${phoneNumberId}/whatsapp_business_profile`, ctx.key, {
			query: {
				fields:
					'about,address,description,email,profile_picture_url,websites,vertical',
			},
		});

		const profile = result.data[0];
		if (profile) {
			await ctx.db.businessProfiles.upsertByEntityId(phoneNumberId, {
				...profile,
				id: phoneNumberId,
				phoneNumberId,
				createdAt: new Date(),
			});
		}
		await logEventFromContext(
			ctx,
			'whatsapp.businessProfiles.get',
			{ phoneNumberId },
			'completed',
		);
		return result;
	};

export const listPhoneNumbers: WhatsappEndpoints['phoneNumbersList'] = async (
	ctx,
	input,
) => {
	const { resolveBusinessAccountId } = await import('./message-templates');
	const businessAccountId = await resolveBusinessAccountId(
		ctx,
		input.businessAccountId,
	);

	const result = await makeWhatsappRequest<
		WhatsappEndpointOutputs['phoneNumbersList']
	>(`${businessAccountId}/phone_numbers`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'whatsapp.phoneNumbers.list',
		{ businessAccountId },
		'completed',
	);
	return result;
};
