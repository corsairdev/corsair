import type { TapfiliateEndpoints } from '..';
import { call, callDelete, isEmptyBody } from './call';
import {
	CommissionsApproveInputSchema,
	CommissionsApproveResponseSchema,
	CommissionsDisapproveInputSchema,
	CommissionsDisapproveResponseSchema,
	CommissionsGetInputSchema,
	CommissionsGetResponseSchema,
	CommissionsListInputSchema,
	CommissionsListResponseSchema,
	CommissionsUpdateInputSchema,
	CommissionsUpdateResponseSchema,
	ConversionsCreateInputSchema,
	ConversionsCreateResponseSchema,
	ConversionsGetInputSchema,
	ConversionsGetResponseSchema,
	ConversionsListInputSchema,
	ConversionsListResponseSchema,
	ConversionsRemoveInputSchema,
	ConversionsUpdateInputSchema,
	ConversionsUpdateResponseSchema,
} from './types';

export const conversionsList: TapfiliateEndpoints['conversionsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'conversions.list',
			input: ConversionsListInputSchema,
			output: ConversionsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/conversions/',
			query: {
				page: parsed.page,
				program_id: parsed.program_id,
				external_id: parsed.external_id,
				affiliate_id: parsed.affiliate_id,
				pending: parsed.pending,
				date_from: parsed.date_from,
				date_to: parsed.date_to,
				use_profile_timezone: parsed.use_profile_timezone,
			},
		}),
	);
};

export const conversionsGet: TapfiliateEndpoints['conversionsGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'conversions.get',
			input: ConversionsGetInputSchema,
			output: ConversionsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/conversions/${parsed.conversionId}/`,
		}),
	);
};

export const conversionsCreate: TapfiliateEndpoints['conversionsCreate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'conversions.create',
				input: ConversionsCreateInputSchema,
				output: ConversionsCreateResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/conversions/',
				body: {
					referral_code: parsed.referral_code,
					tracking_id: parsed.tracking_id,
					click_id: parsed.click_id,
					coupon: parsed.coupon,
					asset_id: parsed.asset_id,
					source_id: parsed.source_id,
					amount: parsed.amount,
					currency: parsed.currency,
					external_id: parsed.external_id,
					customer_id: parsed.customer_id,
					commissions: parsed.commissions,
					meta_data: parsed.meta_data,
				},
			}),
		);
	};

export const conversionsUpdate: TapfiliateEndpoints['conversionsUpdate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'conversions.update',
				input: ConversionsUpdateInputSchema,
				output: ConversionsUpdateResponseSchema,
			},
			input,
			(parsed) => {
				const {
					conversionId,
					recalculate_commissions,
					amount,
					external_id,
					meta_data,
				} = parsed;
				return {
					method: 'PATCH',
					path: `/conversions/${conversionId}/`,
					body: { amount, external_id, meta_data },
					// recalculate_commissions is a query flag, not a body field. The
					// docs say commissions change only when it travels as a query
					// value alongside a numeric amount.
					query: {
						recalculate_commissions:
							recalculate_commissions === undefined
								? undefined
								: recalculate_commissions,
					},
				};
			},
			{
				// The reference documents a 200 with no body; report the outcome then.
				shape: (raw, parsed) =>
					isEmptyBody(raw) ? { id: parsed.conversionId, updated: true } : raw,
			},
		);
	};

export const conversionsRemove: TapfiliateEndpoints['conversionsRemove'] =
	async (ctx, input) => {
		return callDelete(
			ctx,
			{ event: 'conversions.remove', input: ConversionsRemoveInputSchema },
			input,
			(parsed) => ({
				method: 'DELETE',
				path: `/conversions/${parsed.conversionId}/`,
			}),
		);
	};

export const commissionsList: TapfiliateEndpoints['commissionsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'commissions.list',
			input: CommissionsListInputSchema,
			output: CommissionsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/commissions/',
			query: {
				page: parsed.page,
				affiliate_id: parsed.affiliate_id,
				status: parsed.status,
				// The reference takes 1 or 0, not true or false.
				paid: parsed.paid === undefined ? undefined : parsed.paid ? 1 : 0,
			},
		}),
	);
};

export const commissionsGet: TapfiliateEndpoints['commissionsGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'commissions.get',
			input: CommissionsGetInputSchema,
			output: CommissionsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/commissions/${parsed.commissionId}/`,
		}),
	);
};

export const commissionsUpdate: TapfiliateEndpoints['commissionsUpdate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'commissions.update',
				input: CommissionsUpdateInputSchema,
				output: CommissionsUpdateResponseSchema,
			},
			input,
			(parsed) => {
				const { commissionId, ...changes } = parsed;
				return {
					method: 'PATCH',
					path: `/commissions/${commissionId}/`,
					body: changes,
				};
			},
		);
	};

export const commissionsApprove: TapfiliateEndpoints['commissionsApprove'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'commissions.approve',
				input: CommissionsApproveInputSchema,
				output: CommissionsApproveResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'PUT',
				path: `/commissions/${parsed.commissionId}/approved/`,
			}),
		);
	};

export const commissionsDisapprove: TapfiliateEndpoints['commissionsDisapprove'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'commissions.disapprove',
				input: CommissionsDisapproveInputSchema,
				output: CommissionsDisapproveResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'DELETE',
				path: `/commissions/${parsed.commissionId}/approved/`,
			}),
		);
	};
