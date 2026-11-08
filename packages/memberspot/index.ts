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
import { Api } from './endpoints';
import type {
	MemberSpotEndpointInputs,
	MemberSpotEndpointOutputs,
} from './endpoints/types';
import {
	MemberSpotEndpointInputSchemas,
	MemberSpotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MemberSpotSchema } from './schema';

export type MemberSpotPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMemberSpotPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof memberSpotEndpointsNested>;
};

export type MemberSpotContext = CorsairPluginContext<
	typeof MemberSpotSchema,
	MemberSpotPluginOptions
>;

export type MemberSpotKeyBuilderContext =
	KeyBuilderContext<MemberSpotPluginOptions>;

export type MemberSpotBoundEndpoints = BindEndpoints<
	typeof memberSpotEndpointsNested
>;

type MemberSpotEndpoint<K extends keyof MemberSpotEndpointOutputs> =
	CorsairEndpoint<
		MemberSpotContext,
		MemberSpotEndpointInputs[K],
		MemberSpotEndpointOutputs[K]
	>;

export type MemberSpotEndpoints = {
	authCheck: MemberSpotEndpoint<'authCheck'>;
	offersList: MemberSpotEndpoint<'offersList'>;
	coursesList: MemberSpotEndpoint<'coursesList'>;
	examsList: MemberSpotEndpoint<'examsList'>;
	customPropertiesList: MemberSpotEndpoint<'customPropertiesList'>;
	usersList: MemberSpotEndpoint<'usersList'>;
	usersFindByEmail: MemberSpotEndpoint<'usersFindByEmail'>;
	usersFindByUid: MemberSpotEndpoint<'usersFindByUid'>;
	usersOffers: MemberSpotEndpoint<'usersOffers'>;
	usersLoginToken: MemberSpotEndpoint<'usersLoginToken'>;
	usersGrantOffer: MemberSpotEndpoint<'usersGrantOffer'>;
	usersGrantOfferByUid: MemberSpotEndpoint<'usersGrantOfferByUid'>;
	usersSetOfferState: MemberSpotEndpoint<'usersSetOfferState'>;
	usersSetOfferStateByUid: MemberSpotEndpoint<'usersSetOfferStateByUid'>;
	usersSetOrderState: MemberSpotEndpoint<'usersSetOrderState'>;
	usersSetOrderStateByUid: MemberSpotEndpoint<'usersSetOrderStateByUid'>;
	usersSetOrderStateByOrderId: MemberSpotEndpoint<'usersSetOrderStateByOrderId'>;
	usersSetOfferExpires: MemberSpotEndpoint<'usersSetOfferExpires'>;
	usersSetCourseStartDate: MemberSpotEndpoint<'usersSetCourseStartDate'>;
	usersCourseProgress: MemberSpotEndpoint<'usersCourseProgress'>;
	usersCourseProgressByUid: MemberSpotEndpoint<'usersCourseProgressByUid'>;
	usersCourseProgressDetail: MemberSpotEndpoint<'usersCourseProgressDetail'>;
	usersCourseProgressDetailByUid: MemberSpotEndpoint<'usersCourseProgressDetailByUid'>;
	usersSetCustomProperties: MemberSpotEndpoint<'usersSetCustomProperties'>;
	usersSetCustomPropertiesByUid: MemberSpotEndpoint<'usersSetCustomPropertiesByUid'>;
	usersSetCustomProperty: MemberSpotEndpoint<'usersSetCustomProperty'>;
	usersSetCustomPropertyByUid: MemberSpotEndpoint<'usersSetCustomPropertyByUid'>;
	usersDelete: MemberSpotEndpoint<'usersDelete'>;
	usersDeleteByUid: MemberSpotEndpoint<'usersDeleteByUid'>;
	examResults: MemberSpotEndpoint<'examResults'>;
	chaptersEnableAccess: MemberSpotEndpoint<'chaptersEnableAccess'>;
	chaptersEnableAccessByUid: MemberSpotEndpoint<'chaptersEnableAccessByUid'>;
};

const memberSpotEndpointsNested = {
	auth: {
		check: Api.authCheck,
	},
	offers: {
		list: Api.offersList,
	},
	courses: {
		list: Api.coursesList,
	},
	exams: {
		list: Api.examsList,
		results: Api.examResults,
	},
	customProperties: {
		list: Api.customPropertiesList,
	},
	users: {
		list: Api.usersList,
		findByEmail: Api.usersFindByEmail,
		findByUid: Api.usersFindByUid,
		offers: Api.usersOffers,
		loginToken: Api.usersLoginToken,
		grantOffer: Api.usersGrantOffer,
		grantOfferByUid: Api.usersGrantOfferByUid,
		setOfferState: Api.usersSetOfferState,
		setOfferStateByUid: Api.usersSetOfferStateByUid,
		setOrderState: Api.usersSetOrderState,
		setOrderStateByUid: Api.usersSetOrderStateByUid,
		setOrderStateByOrderId: Api.usersSetOrderStateByOrderId,
		setOfferExpires: Api.usersSetOfferExpires,
		setCourseStartDate: Api.usersSetCourseStartDate,
		courseProgress: Api.usersCourseProgress,
		courseProgressByUid: Api.usersCourseProgressByUid,
		courseProgressDetail: Api.usersCourseProgressDetail,
		courseProgressDetailByUid: Api.usersCourseProgressDetailByUid,
		setCustomProperties: Api.usersSetCustomProperties,
		setCustomPropertiesByUid: Api.usersSetCustomPropertiesByUid,
		setCustomProperty: Api.usersSetCustomProperty,
		setCustomPropertyByUid: Api.usersSetCustomPropertyByUid,
		delete: Api.usersDelete,
		deleteByUid: Api.usersDeleteByUid,
	},
	chapters: {
		enableAccess: Api.chaptersEnableAccess,
		enableAccessByUid: Api.chaptersEnableAccessByUid,
	},
} as const;

export const memberSpotEndpointSchemas = {
	'auth.check': {
		input: MemberSpotEndpointInputSchemas.authCheck,
		output: MemberSpotEndpointOutputSchemas.authCheck,
	},
	'offers.list': {
		input: MemberSpotEndpointInputSchemas.offersList,
		output: MemberSpotEndpointOutputSchemas.offersList,
	},
	'courses.list': {
		input: MemberSpotEndpointInputSchemas.coursesList,
		output: MemberSpotEndpointOutputSchemas.coursesList,
	},
	'exams.list': {
		input: MemberSpotEndpointInputSchemas.examsList,
		output: MemberSpotEndpointOutputSchemas.examsList,
	},
	'exams.results': {
		input: MemberSpotEndpointInputSchemas.examResults,
		output: MemberSpotEndpointOutputSchemas.examResults,
	},
	'customProperties.list': {
		input: MemberSpotEndpointInputSchemas.customPropertiesList,
		output: MemberSpotEndpointOutputSchemas.customPropertiesList,
	},
	'users.list': {
		input: MemberSpotEndpointInputSchemas.usersList,
		output: MemberSpotEndpointOutputSchemas.usersList,
	},
	'users.findByEmail': {
		input: MemberSpotEndpointInputSchemas.usersFindByEmail,
		output: MemberSpotEndpointOutputSchemas.usersFindByEmail,
	},
	'users.findByUid': {
		input: MemberSpotEndpointInputSchemas.usersFindByUid,
		output: MemberSpotEndpointOutputSchemas.usersFindByUid,
	},
	'users.offers': {
		input: MemberSpotEndpointInputSchemas.usersOffers,
		output: MemberSpotEndpointOutputSchemas.usersOffers,
	},
	'users.loginToken': {
		input: MemberSpotEndpointInputSchemas.usersLoginToken,
		output: MemberSpotEndpointOutputSchemas.usersLoginToken,
	},
	'users.grantOffer': {
		input: MemberSpotEndpointInputSchemas.usersGrantOffer,
		output: MemberSpotEndpointOutputSchemas.usersGrantOffer,
	},
	'users.grantOfferByUid': {
		input: MemberSpotEndpointInputSchemas.usersGrantOfferByUid,
		output: MemberSpotEndpointOutputSchemas.usersGrantOfferByUid,
	},
	'users.setOfferState': {
		input: MemberSpotEndpointInputSchemas.usersSetOfferState,
		output: MemberSpotEndpointOutputSchemas.usersSetOfferState,
	},
	'users.setOfferStateByUid': {
		input: MemberSpotEndpointInputSchemas.usersSetOfferStateByUid,
		output: MemberSpotEndpointOutputSchemas.usersSetOfferStateByUid,
	},
	'users.setOrderState': {
		input: MemberSpotEndpointInputSchemas.usersSetOrderState,
		output: MemberSpotEndpointOutputSchemas.usersSetOrderState,
	},
	'users.setOrderStateByUid': {
		input: MemberSpotEndpointInputSchemas.usersSetOrderStateByUid,
		output: MemberSpotEndpointOutputSchemas.usersSetOrderStateByUid,
	},
	'users.setOrderStateByOrderId': {
		input: MemberSpotEndpointInputSchemas.usersSetOrderStateByOrderId,
		output: MemberSpotEndpointOutputSchemas.usersSetOrderStateByOrderId,
	},
	'users.setOfferExpires': {
		input: MemberSpotEndpointInputSchemas.usersSetOfferExpires,
		output: MemberSpotEndpointOutputSchemas.usersSetOfferExpires,
	},
	'users.setCourseStartDate': {
		input: MemberSpotEndpointInputSchemas.usersSetCourseStartDate,
		output: MemberSpotEndpointOutputSchemas.usersSetCourseStartDate,
	},
	'users.courseProgress': {
		input: MemberSpotEndpointInputSchemas.usersCourseProgress,
		output: MemberSpotEndpointOutputSchemas.usersCourseProgress,
	},
	'users.courseProgressByUid': {
		input: MemberSpotEndpointInputSchemas.usersCourseProgressByUid,
		output: MemberSpotEndpointOutputSchemas.usersCourseProgressByUid,
	},
	'users.courseProgressDetail': {
		input: MemberSpotEndpointInputSchemas.usersCourseProgressDetail,
		output: MemberSpotEndpointOutputSchemas.usersCourseProgressDetail,
	},
	'users.courseProgressDetailByUid': {
		input: MemberSpotEndpointInputSchemas.usersCourseProgressDetailByUid,
		output: MemberSpotEndpointOutputSchemas.usersCourseProgressDetailByUid,
	},
	'users.setCustomProperties': {
		input: MemberSpotEndpointInputSchemas.usersSetCustomProperties,
		output: MemberSpotEndpointOutputSchemas.usersSetCustomProperties,
	},
	'users.setCustomPropertiesByUid': {
		input: MemberSpotEndpointInputSchemas.usersSetCustomPropertiesByUid,
		output: MemberSpotEndpointOutputSchemas.usersSetCustomPropertiesByUid,
	},
	'users.setCustomProperty': {
		input: MemberSpotEndpointInputSchemas.usersSetCustomProperty,
		output: MemberSpotEndpointOutputSchemas.usersSetCustomProperty,
	},
	'users.setCustomPropertyByUid': {
		input: MemberSpotEndpointInputSchemas.usersSetCustomPropertyByUid,
		output: MemberSpotEndpointOutputSchemas.usersSetCustomPropertyByUid,
	},
	'users.delete': {
		input: MemberSpotEndpointInputSchemas.usersDelete,
		output: MemberSpotEndpointOutputSchemas.usersDelete,
	},
	'users.deleteByUid': {
		input: MemberSpotEndpointInputSchemas.usersDeleteByUid,
		output: MemberSpotEndpointOutputSchemas.usersDeleteByUid,
	},
	'chapters.enableAccess': {
		input: MemberSpotEndpointInputSchemas.chaptersEnableAccess,
		output: MemberSpotEndpointOutputSchemas.chaptersEnableAccess,
	},
	'chapters.enableAccessByUid': {
		input: MemberSpotEndpointInputSchemas.chaptersEnableAccessByUid,
		output: MemberSpotEndpointOutputSchemas.chaptersEnableAccessByUid,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof memberSpotEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const memberSpotEndpointMeta = {
	'auth.check': {
		riskLevel: 'read',
		description:
			'Returns the school the API key belongs to, which is the cheapest way to confirm a key works',
	},
	'offers.list': {
		riskLevel: 'read',
		description: 'Lists the offers available in the school',
	},
	'courses.list': {
		riskLevel: 'read',
		description: 'Lists all courses of the school with their ids and types',
	},
	'exams.list': {
		riskLevel: 'read',
		description:
			'Lists all exams of the school, including the examId used for results',
	},
	'exams.results': {
		riskLevel: 'read',
		description:
			'Lists the exam results of every user who took an exam, with each run and whether it passed',
	},
	'customProperties.list': {
		riskLevel: 'read',
		description: 'Lists the custom user properties defined for the school',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'Returns a page of users, optionally filtered by offer or course, with a cursor for the next page',
	},
	'users.findByEmail': {
		riskLevel: 'read',
		description:
			'Returns one user by email; a member that does not exist answers 400 USER_NOT_FOUND rather than an empty result',
	},
	'users.findByUid': {
		riskLevel: 'read',
		description:
			'Returns one user by uid; a uid that does not exist answers an empty body, which fails the output schema rather than returning null',
	},
	'users.offers': {
		riskLevel: 'read',
		description:
			'Returns the offers granted to a user with their active state and expiry',
	},
	'users.loginToken': {
		// Write, not read: the token it mints signs in as the member, so a
		// read-only caller must not be able to create one.
		riskLevel: 'write',
		description:
			'Mints a token and login URL that signs a user in automatically, which is a credential; the token expires after one hour',
	},
	'users.grantOffer': {
		riskLevel: 'write',
		description:
			'Creates or updates a user by email and optionally grants an offer in the same call; reports whether the user is new',
	},
	'users.grantOfferByUid': {
		riskLevel: 'write',
		description: 'Grants an offer to an existing user by uid',
	},
	'users.setOfferState': {
		riskLevel: 'write',
		description:
			'Activates or deactivates an offer for a user by email, which is how access is revoked',
	},
	'users.setOfferStateByUid': {
		riskLevel: 'write',
		description: 'Activates or deactivates an offer for a user by uid',
	},
	'users.setOrderState': {
		riskLevel: 'write',
		description:
			'Sets the state of an offer tied to an order for a user by email',
	},
	'users.setOrderStateByUid': {
		riskLevel: 'write',
		description:
			'Sets the state of an offer tied to an order for a user by uid',
	},
	'users.setOrderStateByOrderId': {
		riskLevel: 'write',
		description:
			'Sets the state of every offer carrying a given orderId, across all users',
	},
	'users.setOfferExpires': {
		riskLevel: 'write',
		description: 'Sets or clears the expiry date of an offer for a user by uid',
	},
	'users.setCourseStartDate': {
		riskLevel: 'write',
		description: 'Sets when a user\u2019s access to a course starts',
	},
	'users.courseProgress': {
		riskLevel: 'read',
		description:
			'Lists every course progress record for a user by email, paginated',
	},
	'users.courseProgressByUid': {
		riskLevel: 'read',
		description:
			'Lists every course progress record for a user by uid, paginated',
	},
	'users.courseProgressDetail': {
		riskLevel: 'read',
		description: 'Returns one user\u2019s progress in one course, by email',
	},
	'users.courseProgressDetailByUid': {
		riskLevel: 'read',
		description: 'Returns one user\u2019s progress in one course, by uid',
	},
	'users.setCustomProperties': {
		riskLevel: 'write',
		description:
			'Sets several custom user properties at once by email; properties omitted from the map are left unchanged',
	},
	'users.setCustomPropertiesByUid': {
		riskLevel: 'write',
		description: 'Sets several custom user properties at once by uid',
	},
	'users.setCustomProperty': {
		riskLevel: 'write',
		description:
			'Sets one custom user property by email; a null value blanks it',
	},
	'users.setCustomPropertyByUid': {
		riskLevel: 'write',
		description: 'Sets one custom user property by uid',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently deletes up to 10 users by email; deleted accounts and their progress cannot be restored',
	},
	'users.deleteByUid': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently deletes up to 10 users by uid; deleted accounts and their progress cannot be restored',
	},
	'chapters.enableAccess': {
		riskLevel: 'write',
		description: 'Grants a user access to one chapter by email',
	},
	'chapters.enableAccessByUid': {
		riskLevel: 'write',
		description: 'Grants a user access to one chapter by uid',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof memberSpotEndpointsNested
>;

export type BaseMemberSpotPlugin<T extends MemberSpotPluginOptions> =
	CorsairPlugin<
		'memberspot',
		typeof MemberSpotSchema,
		typeof memberSpotEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalMemberSpotPlugin =
	BaseMemberSpotPlugin<MemberSpotPluginOptions>;

export type ExternalMemberSpotPlugin<T extends MemberSpotPluginOptions> =
	BaseMemberSpotPlugin<T>;

export function memberspot<const T extends MemberSpotPluginOptions>(
	incomingOptions: MemberSpotPluginOptions & T = {} as MemberSpotPluginOptions &
		T,
): ExternalMemberSpotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'memberspot',
		schema: MemberSpotSchema,
		options: options,
		hooks: options.hooks,
		endpoints: memberSpotEndpointsNested,
		webhooks: {},
		endpointMeta: memberSpotEndpointMeta,
		endpointSchemas: memberSpotEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MemberSpotKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('memberspot', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMemberSpotPlugin;
}

export { MemberSpotAPIError } from './client';

export type {
	AuthCheckInput,
	AuthCheckResponse,
	ChapterAccessByUidInput,
	ChapterAccessInput,
	CoursesResponse,
	CustomPropertiesResponse,
	DeleteUsersByUidInput,
	DeleteUsersInput,
	ExamResultsInput,
	ExamResultsResponse,
	ExamsResponse,
	GrantOfferByUidInput,
	GrantOfferInput,
	LoginTokenInput,
	LoginTokenResponse,
	MemberSpotCourse,
	MemberSpotEndpointInputs,
	MemberSpotEndpointOutputs,
	MemberSpotOffer,
	MemberSpotUser,
	MutationResponse,
	NoInput,
	OffersResponse,
	SetCourseStartDateInput,
	SetCustomPropertiesByUidInput,
	SetCustomPropertiesInput,
	SetCustomPropertyByUidInput,
	SetCustomPropertyInput,
	SetOfferExpiresInput,
	SetOfferStateByUidInput,
	SetOfferStateInput,
	SetOrderStateByOrderIdInput,
	SetOrderStateByUidInput,
	SetOrderStateInput,
	UserByEmailInput,
	UserByUidInput,
	UserCourseByUidInput,
	UserCourseInput,
	UserCourseProgressByUidListInput,
	UserCourseProgressDetail,
	UserCourseProgressListInput,
	UserCourseProgressResponse,
	UserCreatedResponse,
	UserOffersResponse,
	UserResponse,
	UsersListInput,
	UsersListResponse,
} from './endpoints/types';
