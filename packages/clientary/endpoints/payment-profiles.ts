import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import type { ClientaryPaymentProfile } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryPaymentProfileSchema,
} from './types';

/**
 * List payment profiles belonging to a client.
 *
 * API: GET /api/v2/clients/:client_id/payment_profiles
 * Docs: https://www.clientary.com/api/payment_profiles
 */
export const listForClient: ClientaryEndpoints['paymentProfilesListForClient'] =
	async (ctx, input) => {
		const { apiKey, domain } = await getClientaryCredentials(ctx);

		const response = await makeClientaryRequest<
			z.infer<
				typeof ClientaryEndpointOutputSchemas.paymentProfilesListForClient
			>
		>(`clients/${input.client_id}/payment_profiles`, apiKey, domain, {
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		const parsed =
			ClientaryEndpointOutputSchemas.paymentProfilesListForClient.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'clientary.paymentProfiles.listForClient',
			{ client_id: input.client_id },
			'completed',
		);
		return parsed;
	};

/**
 * Create a payment profile for a client using Stripe details.
 *
 * API: POST /api/v2/clients/:client_id/payment_profiles
 * Docs: https://www.clientary.com/api/payment_profiles
 */
export const create: ClientaryEndpoints['paymentProfilesCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { client_id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryPaymentProfile>(
		`clients/${client_id}/payment_profiles`,
		apiKey,
		domain,
		{ method: 'POST', body: { payment_profile: { ...fields } } },
	);

	const parsed = ClientaryPaymentProfileSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.paymentProfiles.create',
		{ client_id },
		'completed',
	);
	return parsed;
};

/**
 * Delete a payment profile.
 *
 * API: DELETE /api/v2/clients/:client_id/payment_profiles/:id
 * Docs: https://www.clientary.com/api/payment_profiles
 */
export const remove: ClientaryEndpoints['paymentProfilesDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { client_id, id } = input;

	await makeClientaryRequest<unknown>(
		`clients/${client_id}/payment_profiles/${id}`,
		apiKey,
		domain,
		{ method: 'DELETE' },
	);

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id,
	});

	await logEventFromContext(
		ctx,
		'clientary.paymentProfiles.delete',
		{ client_id, id },
		'completed',
	);
	return result;
};
