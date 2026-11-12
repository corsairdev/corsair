import type { ReferralrockEndpoints } from '..';
import { call, queryOf } from './call';
import { rewardResultShape, setShape, singleShape } from './shape';
import {
	ReferralrockEndpointInputSchemas as Inputs,
	ReferralrockEndpointOutputSchemas as Outputs,
} from './types';

export const programsList: ReferralrockEndpoints['programsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'programs.list',
			input: Inputs.programsList,
			output: Outputs.programsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/programs',
			replayable: true,
			query: queryOf({
				programId: parsed.program_id,
				offset: parsed.offset,
				count: parsed.count,
			}),
		}),
		{
			shape: setShape('programs'),
			log: (_, result) => ({
				count: result.programs.length,
				total: result.total ?? 0,
			}),
		},
	);

export const membersList: ReferralrockEndpoints['membersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.list',
			input: Inputs.membersList,
			output: Outputs.membersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/members',
			replayable: true,
			query: queryOf({
				programId: parsed.program_id,
				query: parsed.query,
				showDisabled: parsed.show_disabled,
				sort: parsed.sort,
				dateFrom: parsed.date_from,
				dateTo: parsed.date_to,
				offset: parsed.offset,
				count: parsed.count,
			}),
		}),
		{
			shape: setShape('members'),
			log: (_, result) => ({
				count: result.members.length,
				total: result.total ?? 0,
			}),
		},
	);

export const membersCreate: ReferralrockEndpoints['membersCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'members.create',
			input: Inputs.membersCreate,
			output: Outputs.membersCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/members',
			replayable: false,
			query: queryOf({ shouldSendEmail: parsed.should_send_email }),
			// The body is the member record itself, not a wrapper.
			body: queryOf({
				programId: parsed.program_id,
				firstName: parsed.first_name,
				lastName: parsed.last_name,
				email: parsed.email,
				referralCode: parsed.referral_code,
				phone: parsed.phone,
				externalIdentifier: parsed.external_identifier,
				dateOfBirth: parsed.date_of_birth,
				addressLine1: parsed.address_line1,
				addressLine2: parsed.address_line2,
				city: parsed.city,
				region: parsed.region,
				country: parsed.country,
				postalCode: parsed.postal_code,
			}),
		}),
		{
			shape: singleShape('member'),
			log: (_, result) => ({ memberId: result.member?.id ?? '' }),
		},
	);

export const referralsList: ReferralrockEndpoints['referralsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'referrals.list',
			input: Inputs.referralsList,
			output: Outputs.referralsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/referrals',
			replayable: true,
			query: queryOf({
				programId: parsed.program_id,
				memberId: parsed.member_id,
				status: parsed.status,
				sort: parsed.sort,
				dateFrom: parsed.date_from,
				dateTo: parsed.date_to,
				offset: parsed.offset,
				count: parsed.count,
			}),
		}),
		{
			shape: setShape('referrals'),
			log: (_, result) => ({
				count: result.referrals.length,
				total: result.total ?? 0,
			}),
		},
	);

export const referralsCreate: ReferralrockEndpoints['referralsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'referrals.create',
			input: Inputs.referralsCreate,
			output: Outputs.referralsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/referrals',
			replayable: false,
			body: queryOf({
				referralCode: parsed.referral_code,
				firstName: parsed.first_name,
				lastName: parsed.last_name,
				email: parsed.email,
				phoneNumber: parsed.phone_number,
				preferredContact: parsed.preferred_contact,
				externalIdentifier: parsed.external_identifier,
				amount: parsed.amount,
				companyName: parsed.company_name,
				note: parsed.note,
				publicNote: parsed.public_note,
				customOption1Name: parsed.custom_option1_name,
				customOption2Name: parsed.custom_option2_name,
				customText1Name: parsed.custom_text1_name,
				customText2Name: parsed.custom_text2_name,
				customText3Name: parsed.custom_text3_name,
				customOption1Value: parsed.custom_option1_value,
				customOption2Value: parsed.custom_option2_value,
				customText1Value: parsed.custom_text1_value,
				customText2Value: parsed.custom_text2_value,
				customText3Value: parsed.custom_text3_value,
			}),
		}),
		{
			shape: singleShape('referral'),
			log: (_, result) => ({ referralId: result.referral?.id ?? '' }),
		},
	);

export const rewardsList: ReferralrockEndpoints['rewardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rewards.list',
			input: Inputs.rewardsList,
			output: Outputs.rewardsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/rewards',
			replayable: true,
			query: queryOf({
				programId: parsed.program_id,
				memberId: parsed.member_id,
				query: parsed.query,
				status: parsed.status,
				sort: parsed.sort,
				dateFrom: parsed.date_from,
				dateTo: parsed.date_to,
				offset: parsed.offset,
				count: parsed.count,
			}),
		}),
		{
			shape: setShape('rewards'),
			log: (_, result) => ({
				count: result.rewards.length,
				total: result.total ?? 0,
			}),
		},
	);

export const rewardsCreate: ReferralrockEndpoints['rewardsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'rewards.create',
			input: Inputs.rewardsCreate,
			output: Outputs.rewardsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/rewards',
			replayable: false,
			// This route takes an **array** of reward infos, each with a
			// `newReward` and ONE query naming its recipient.
			body: [
				{
					...(parsed.member_id !== undefined
						? { memberQuery: { primaryInfo: { memberId: parsed.member_id } } }
						: {
								referralQuery: {
									primaryInfo: { referralId: parsed.referral_id },
								},
							}),
					newReward: queryOf({
						amount: parsed.amount,
						payoutId: parsed.payout_id,
						eligibilityDate: parsed.eligibility_date,
						description: parsed.description,
					}),
				},
			],
		}),
		{
			shape: rewardResultShape,
			log: (_, result) => ({
				rewardId: result.reward?.id ?? '',
				amount: result.reward?.amount ?? 0,
			}),
		},
	);
