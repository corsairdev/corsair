import type { TapfiliateEndpoints } from '..';
import { call } from './call';
import {
	ProgramsAddAffiliateInputSchema,
	ProgramsAddAffiliateResponseSchema,
	ProgramsAffiliateApprovalInputSchema,
	ProgramsAffiliateApprovalResponseSchema,
	ProgramsAffiliatesInputSchema,
	ProgramsAffiliatesResponseSchema,
	ProgramsGetAffiliateInputSchema,
	ProgramsGetAffiliateResponseSchema,
	ProgramsGetInputSchema,
	ProgramsGetResponseSchema,
	ProgramsListInputSchema,
	ProgramsListResponseSchema,
	ProgramsUpdateAffiliateInputSchema,
	ProgramsUpdateAffiliateResponseSchema,
} from './types';

export const list: TapfiliateEndpoints['programsList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'programs.list',
			input: ProgramsListInputSchema,
			output: ProgramsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/programs/',
			query: { page: parsed.page, asset_id: parsed.asset_id },
		}),
	);
};

export const get: TapfiliateEndpoints['programsGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'programs.get',
			input: ProgramsGetInputSchema,
			output: ProgramsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/programs/${parsed.programId}/`,
		}),
	);
};

export const affiliates: TapfiliateEndpoints['programsAffiliates'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'programs.affiliates',
			input: ProgramsAffiliatesInputSchema,
			output: ProgramsAffiliatesResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/programs/${parsed.programId}/affiliates/`,
			query: {
				page: parsed.page,
				source_id: parsed.source_id,
				email: parsed.email,
				parent_id: parsed.parent_id,
				group_id: parsed.group_id,
			},
		}),
	);
};

export const addAffiliate: TapfiliateEndpoints['programsAddAffiliate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'programs.addAffiliate',
			input: ProgramsAddAffiliateInputSchema,
			output: ProgramsAddAffiliateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/programs/${parsed.programId}/affiliates/`,
			body: {
				affiliate: { id: parsed.affiliateId },
				approved: parsed.approved,
				coupon: parsed.coupon,
			},
		}),
	);
};

export const getAffiliate: TapfiliateEndpoints['programsGetAffiliate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'programs.getAffiliate',
			input: ProgramsGetAffiliateInputSchema,
			output: ProgramsGetAffiliateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/programs/${parsed.programId}/affiliates/${parsed.affiliateId}/`,
		}),
	);
};

export const updateAffiliate: TapfiliateEndpoints['programsUpdateAffiliate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'programs.updateAffiliate',
				input: ProgramsUpdateAffiliateInputSchema,
				output: ProgramsUpdateAffiliateResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'PATCH',
				path: `/programs/${parsed.programId}/affiliates/${parsed.affiliateId}/`,
				// Only send the key when the caller named it, so omitting it keeps
				// the coupon and `null` removes it.
				body: parsed.coupon === undefined ? {} : { coupon: parsed.coupon },
			}),
		);
	};

export const approveAffiliate: TapfiliateEndpoints['programsApproveAffiliate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'programs.approveAffiliate',
				input: ProgramsAffiliateApprovalInputSchema,
				output: ProgramsAffiliateApprovalResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'PUT',
				path: `/programs/${parsed.programId}/affiliates/${parsed.affiliateId}/approved/`,
			}),
		);
	};

export const disapproveAffiliate: TapfiliateEndpoints['programsDisapproveAffiliate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'programs.disapproveAffiliate',
				input: ProgramsAffiliateApprovalInputSchema,
				output: ProgramsAffiliateApprovalResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'DELETE',
				path: `/programs/${parsed.programId}/affiliates/${parsed.affiliateId}/approved/`,
			}),
		);
	};
