import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Endpoints } from './endpoints';
import type {
	ReferralrockEndpointInputs,
	ReferralrockEndpointOutputs,
} from './endpoints/types';
import {
	ReferralrockEndpointInputSchemas,
	ReferralrockEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ReferralrockSchema } from './schema';

export type ReferralrockPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalReferralrockPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof referralrockEndpointsNested>;
};

export type ReferralrockContext = CorsairPluginContext<
	typeof ReferralrockSchema,
	ReferralrockPluginOptions
>;

export type ReferralrockKeyBuilderContext =
	KeyBuilderContext<ReferralrockPluginOptions>;

export type ReferralrockBoundEndpoints = BindEndpoints<
	typeof referralrockEndpointsNested
>;

type ReferralrockEndpoint<K extends keyof ReferralrockEndpointOutputs> =
	CorsairEndpoint<
		ReferralrockContext,
		ReferralrockEndpointInputs[K],
		ReferralrockEndpointOutputs[K]
	>;

export type ReferralrockEndpoints = {
	programsList: ReferralrockEndpoint<'programsList'>;
	membersList: ReferralrockEndpoint<'membersList'>;
	membersCreate: ReferralrockEndpoint<'membersCreate'>;
	referralsList: ReferralrockEndpoint<'referralsList'>;
	referralsCreate: ReferralrockEndpoint<'referralsCreate'>;
	rewardsList: ReferralrockEndpoint<'rewardsList'>;
	rewardsCreate: ReferralrockEndpoint<'rewardsCreate'>;
};

const referralrockEndpointsNested = {
	programs: {
		list: Endpoints.programsList,
	},
	members: {
		list: Endpoints.membersList,
		create: Endpoints.membersCreate,
	},
	referrals: {
		list: Endpoints.referralsList,
		create: Endpoints.referralsCreate,
	},
	rewards: {
		list: Endpoints.rewardsList,
		create: Endpoints.rewardsCreate,
	},
} as const;

export const referralrockEndpointSchemas = {
	'programs.list': {
		input: ReferralrockEndpointInputSchemas.programsList,
		output: ReferralrockEndpointOutputSchemas.programsList,
	},
	'members.list': {
		input: ReferralrockEndpointInputSchemas.membersList,
		output: ReferralrockEndpointOutputSchemas.membersList,
	},
	'members.create': {
		input: ReferralrockEndpointInputSchemas.membersCreate,
		output: ReferralrockEndpointOutputSchemas.membersCreate,
	},
	'referrals.list': {
		input: ReferralrockEndpointInputSchemas.referralsList,
		output: ReferralrockEndpointOutputSchemas.referralsList,
	},
	'referrals.create': {
		input: ReferralrockEndpointInputSchemas.referralsCreate,
		output: ReferralrockEndpointOutputSchemas.referralsCreate,
	},
	'rewards.list': {
		input: ReferralrockEndpointInputSchemas.rewardsList,
		output: ReferralrockEndpointOutputSchemas.rewardsList,
	},
	'rewards.create': {
		input: ReferralrockEndpointInputSchemas.rewardsCreate,
		output: ReferralrockEndpointOutputSchemas.rewardsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof referralrockEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const referralrockEndpointMeta = {
	'programs.list': {
		riskLevel: 'read',
		description:
			'List the referral programs on the account, optionally narrowed to one program id',
	},
	'members.list': {
		riskLevel: 'read',
		description:
			'List advocates with program, search, disabled and date filters, plus offset paging',
	},
	'members.create': {
		riskLevel: 'write',
		description:
			'Add an advocate to a program with their name, email and an optional referral code',
	},
	'referrals.list': {
		riskLevel: 'read',
		description:
			'List referrals with program, member, status and date filters, plus offset paging',
	},
	'referrals.create': {
		riskLevel: 'write',
		description:
			'Record a referral against the code of the member who introduced it, with the order amount that reward rules key on',
	},
	'rewards.list': {
		riskLevel: 'read',
		description:
			'List rewards with program, member, status and date filters, plus offset paging',
	},
	'rewards.create': {
		riskLevel: 'write',
		description:
			'Create a pending reward for a member or for a referred person, with its amount and payout',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof referralrockEndpointsNested
>;

export type BaseReferralrockPlugin<T extends ReferralrockPluginOptions> =
	CorsairPlugin<
		'referralrock',
		typeof ReferralrockSchema,
		typeof referralrockEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalReferralrockPlugin =
	BaseReferralrockPlugin<ReferralrockPluginOptions>;

export type ExternalReferralrockPlugin<T extends ReferralrockPluginOptions> =
	BaseReferralrockPlugin<T>;

export function referralrock<const T extends ReferralrockPluginOptions>(
	incomingOptions: ReferralrockPluginOptions &
		T = {} as ReferralrockPluginOptions & T,
): ExternalReferralrockPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'referralrock',
		schema: ReferralrockSchema,
		options: options,
		hooks: options.hooks,
		endpoints: referralrockEndpointsNested,
		webhooks: {},
		endpointMeta: referralrockEndpointMeta,
		endpointSchemas: referralrockEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ReferralrockKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('referralrock', ctx.authType ?? 'api_key');
		},
	} satisfies InternalReferralrockPlugin;
}

export { ReferralrockAPIError } from './client';

export type {
	MembersCreateInput,
	MembersCreateResponse,
	MembersListInput,
	MembersListResponse,
	ProgramsListInput,
	ProgramsListResponse,
	ReferralrockEndpointInputs,
	ReferralrockEndpointOutputs,
	ReferralrockMember,
	ReferralrockProgram,
	ReferralrockReferral,
	ReferralrockReward,
	ReferralsCreateInput,
	ReferralsCreateResponse,
	ReferralsListInput,
	ReferralsListResponse,
	RewardsCreateInput,
	RewardsCreateResponse,
	RewardsListInput,
	RewardsListResponse,
} from './endpoints/types';
