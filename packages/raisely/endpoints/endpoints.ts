import type { RaiselyEndpoints } from '..';
import type { RaiselyQuery } from '../client';
import { segment } from '../client';
import { call, queryOf } from './call';
import { pagedShape, singleShape } from './shape';
import {
	RaiselyEndpointInputSchemas as Inputs,
	RaiselyEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The list query shared by every collection. Raisely reads `q` as the search
 * phrase, and `sort` only takes effect when `order` is also set.
 */
function listQuery(parsed: {
	limit?: number;
	offset?: number;
	q?: string;
	sort?: string;
	order?: 'asc' | 'desc';
	private?: boolean;
}): RaiselyQuery {
	return queryOf({
		limit: parsed.limit,
		offset: parsed.offset,
		q: parsed.q,
		sort: parsed.sort,
		// A sort without an order would be silently ignored, so the pair is sent
		// together or not at all.
		order: parsed.sort ? parsed.order : undefined,
		private: parsed.private,
	});
}

export const campaignsList: RaiselyEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/campaigns',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({
					path: parsed.path,
					mode: parsed.mode,
					status: parsed.status,
					pruneConfig: parsed.prune_config,
					includeTags: parsed.include_tags,
				}),
			},
		}),
		{
			shape: pagedShape('campaigns'),
			log: (_, result) => ({
				count: result.campaigns.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);

export const campaignsGet: RaiselyEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: Inputs.campaignsGet,
			output: Outputs.campaignsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/campaigns/${segment(parsed.campaign)}`,
			replayable: true,
			query: queryOf({ private: parsed.private }),
		}),
		{
			shape: singleShape('campaign'),
			log: (_, result) => ({ campaignUuid: result.campaign.uuid ?? '' }),
		},
	);

export const donationsList: RaiselyEndpoints['donationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'donations.list',
			input: Inputs.donationsList,
			output: Outputs.donationsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/donations',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({
					campaign: parsed.campaign,
					profile: parsed.profile,
					user: parsed.user,
					organisation: parsed.organisation,
					designation: parsed.designation,
					subscription: parsed.subscription,
					status: parsed.status,
					mode: parsed.mode,
					currency: parsed.currency,
					type: parsed.type,
					isSuspicious: parsed.is_suspicious,
				}),
			},
		}),
		{
			shape: pagedShape('donations'),
			log: (_, result) => ({
				count: result.donations.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);

export const donationsGet: RaiselyEndpoints['donationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'donations.get',
			input: Inputs.donationsGet,
			output: Outputs.donationsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/donations/${segment(parsed.donation_uuid)}`,
			replayable: true,
			query: queryOf({ private: parsed.private }),
		}),
		{
			shape: singleShape('donation'),
			log: (_, result) => ({ donationUuid: result.donation.uuid ?? '' }),
		},
	);

export const donationsCreate: RaiselyEndpoints['donationsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'donations.create',
			input: Inputs.donationsCreate,
			output: Outputs.donationsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/donations',
			replayable: false,
			// The create route takes its record under `data`, and names the
			// campaign, profile and designation `…Uuid` in the body.
			body: {
				data: queryOf({
					amount: parsed.amount,
					currency: parsed.currency,
					email: parsed.email,
					method: parsed.method,
					type: parsed.type,
					campaignUuid: parsed.campaign_uuid,
					profileUuid: parsed.profile_uuid,
					firstName: parsed.firstName,
					lastName: parsed.lastName,
					fullName: parsed.fullName,
					preferredName: parsed.preferredName,
					message: parsed.message,
					anonymous: parsed.anonymous,
					date: parsed.date,
					country: parsed.country,
					postcode: parsed.postcode,
					address1: parsed.address1,
					address2: parsed.address2,
					phoneNumber: parsed.phoneNumber,
					mode: parsed.mode,
					designation: parsed.designation,
					public: parsed.public,
					private: parsed.private,
				}),
			},
		}),
		{
			shape: singleShape('donation'),
			// The donor is personal data, so only the shape is logged.
			log: (_, result) => ({
				donationUuid: result.donation.uuid ?? '',
				amount: result.donation.amount ?? 0,
			}),
		},
	);

export const profilesList: RaiselyEndpoints['profilesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.list',
			input: Inputs.profilesList,
			output: Outputs.profilesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/profiles',
			replayable: true,
			query: {
				...listQuery(parsed),
				// `/profiles` requires this, and the schema makes it mandatory.
				campaign: parsed.campaign,
				...queryOf({
					rank: parsed.rank,
					rankDonors: parsed.rank_donors,
					rankActivityTotal: parsed.rank_activity_total,
					rankActivityTime: parsed.rank_activity_time,
				}),
			},
		}),
		{
			shape: pagedShape('profiles'),
			log: (_, result) => ({
				count: result.profiles.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);

export const profilesGet: RaiselyEndpoints['profilesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.get',
			input: Inputs.profilesGet,
			output: Outputs.profilesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/profiles/${segment(parsed.profile_path)}`,
			replayable: true,
			query: queryOf({ private: parsed.private }),
		}),
		{
			shape: singleShape('profile'),
			log: (_, result) => ({ profileUuid: result.profile.uuid ?? '' }),
		},
	);

export const profilesUpdate: RaiselyEndpoints['profilesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'profiles.update',
			input: Inputs.profilesUpdate,
			output: Outputs.profilesUpdate,
		},
		input,
		(parsed) => {
			// The path identifies the record, so it is not part of the body.
			const { profile_path: profilePath, ...rest } = parsed;
			return {
				method: 'PATCH',
				path: `/profiles/${segment(profilePath)}`,
				replayable: false,
				body: { data: queryOf(rest) },
			};
		},
		{
			shape: singleShape('profile'),
			log: (parsed, result) => ({
				profileUuid: result.profile.uuid ?? '',
				path: parsed.profile_path,
			}),
		},
	);

export const designationsList: RaiselyEndpoints['designationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'designations.list',
			input: Inputs.designationsList,
			output: Outputs.designationsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/designations',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({ campaign: parsed.campaign, status: parsed.status }),
			},
		}),
		{
			shape: pagedShape('designations'),
			log: (_, result) => ({
				count: result.designations.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);
