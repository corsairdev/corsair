import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Attendees,
	Breaks,
	Content,
	Groups,
	Halls,
	Labels,
	Partners,
	Registrations,
	Reviews,
	Sessions,
	Speakers,
} from './endpoints';
import type {
	EventeeEndpointInputs,
	EventeeEndpointOutputs,
} from './endpoints/types';
import {
	EventeeEndpointInputSchemas,
	EventeeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EventeeSchema } from './schema';

export type EventeePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEventeePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof eventeeEndpointsNested>;
};

export type EventeeContext = CorsairPluginContext<
	typeof EventeeSchema,
	EventeePluginOptions
>;
export type EventeeKeyBuilderContext = KeyBuilderContext<EventeePluginOptions>;

type EventeeEndpoint<K extends keyof EventeeEndpointInputs> = CorsairEndpoint<
	EventeeContext,
	EventeeEndpointInputs[K],
	EventeeEndpointOutputs[K]
>;

export type EventeeEndpoints = {
	contentGet: EventeeEndpoint<'contentGet'>;
	contentDeleteAll: EventeeEndpoint<'contentDeleteAll'>;
	hallCreate: EventeeEndpoint<'hallCreate'>;
	hallUpdate: EventeeEndpoint<'hallUpdate'>;
	hallDelete: EventeeEndpoint<'hallDelete'>;
	sessionCreate: EventeeEndpoint<'sessionCreate'>;
	sessionUpdate: EventeeEndpoint<'sessionUpdate'>;
	sessionDelete: EventeeEndpoint<'sessionDelete'>;
	breakCreate: EventeeEndpoint<'breakCreate'>;
	breakUpdate: EventeeEndpoint<'breakUpdate'>;
	breakDelete: EventeeEndpoint<'breakDelete'>;
	speakerCreate: EventeeEndpoint<'speakerCreate'>;
	speakerUpdate: EventeeEndpoint<'speakerUpdate'>;
	speakerDelete: EventeeEndpoint<'speakerDelete'>;
	labelCreate: EventeeEndpoint<'labelCreate'>;
	labelUpdate: EventeeEndpoint<'labelUpdate'>;
	labelDelete: EventeeEndpoint<'labelDelete'>;
	partnerCreate: EventeeEndpoint<'partnerCreate'>;
	partnerUpdate: EventeeEndpoint<'partnerUpdate'>;
	partnerDelete: EventeeEndpoint<'partnerDelete'>;
	partnerUpdateSections: EventeeEndpoint<'partnerUpdateSections'>;
	partnerList: EventeeEndpoint<'partnerList'>;
	attendeeInvite: EventeeEndpoint<'attendeeInvite'>;
	attendeeCheckIn: EventeeEndpoint<'attendeeCheckIn'>;
	attendeeList: EventeeEndpoint<'attendeeList'>;
	attendeeRemove: EventeeEndpoint<'attendeeRemove'>;
	registrationCreate: EventeeEndpoint<'registrationCreate'>;
	registrationList: EventeeEndpoint<'registrationList'>;
	registrationRemove: EventeeEndpoint<'registrationRemove'>;
	groupList: EventeeEndpoint<'groupList'>;
	reviewList: EventeeEndpoint<'reviewList'>;
};

const eventeeEndpointsNested = {
	content: { get: Content.get },
	contentReset: { delete: Content.deleteAll },
	hall: { post: Halls.create, patch: Halls.update, delete: Halls.delete },
	session: {
		post: Sessions.create,
		patch: Sessions.update,
		delete: Sessions.delete,
	},
	pause: { post: Breaks.create, patch: Breaks.update, delete: Breaks.delete },
	speaker: {
		post: Speakers.create,
		patch: Speakers.update,
		delete: Speakers.delete,
	},
	label: { post: Labels.create, patch: Labels.update, delete: Labels.delete },
	partner: {
		post: Partners.create,
		patch: Partners.update,
		delete: Partners.delete,
		get: Partners.list,
	},
	partnerSections: { patch: Partners.updateSections },
	attendeeInvite: { put: Attendees.invite },
	attendeeCheckIn: { patch: Attendees.checkIn },
	attendees: { get: Attendees.list, delete: Attendees.remove },
	registrationInvite: { put: Registrations.create },
	registrations: { get: Registrations.list, delete: Registrations.remove },
	groups: { get: Groups.list },
	reviews: { get: Reviews.list },
} as const;

export type EventeeBoundEndpoints = BindEndpoints<
	typeof eventeeEndpointsNested
>;

export const eventeeEndpointSchemas = {
	'content.get': {
		input: EventeeEndpointInputSchemas.contentGet,
		output: EventeeEndpointOutputSchemas.contentGet,
	},
	'contentReset.delete': {
		input: EventeeEndpointInputSchemas.contentDeleteAll,
		output: EventeeEndpointOutputSchemas.contentDeleteAll,
	},
	'hall.post': {
		input: EventeeEndpointInputSchemas.hallCreate,
		output: EventeeEndpointOutputSchemas.hallCreate,
	},
	'hall.patch': {
		input: EventeeEndpointInputSchemas.hallUpdate,
		output: EventeeEndpointOutputSchemas.hallUpdate,
	},
	'hall.delete': {
		input: EventeeEndpointInputSchemas.hallDelete,
		output: EventeeEndpointOutputSchemas.hallDelete,
	},
	'session.post': {
		input: EventeeEndpointInputSchemas.sessionCreate,
		output: EventeeEndpointOutputSchemas.sessionCreate,
	},
	'session.patch': {
		input: EventeeEndpointInputSchemas.sessionUpdate,
		output: EventeeEndpointOutputSchemas.sessionUpdate,
	},
	'session.delete': {
		input: EventeeEndpointInputSchemas.sessionDelete,
		output: EventeeEndpointOutputSchemas.sessionDelete,
	},
	'pause.post': {
		input: EventeeEndpointInputSchemas.breakCreate,
		output: EventeeEndpointOutputSchemas.breakCreate,
	},
	'pause.patch': {
		input: EventeeEndpointInputSchemas.breakUpdate,
		output: EventeeEndpointOutputSchemas.breakUpdate,
	},
	'pause.delete': {
		input: EventeeEndpointInputSchemas.breakDelete,
		output: EventeeEndpointOutputSchemas.breakDelete,
	},
	'speaker.post': {
		input: EventeeEndpointInputSchemas.speakerCreate,
		output: EventeeEndpointOutputSchemas.speakerCreate,
	},
	'speaker.patch': {
		input: EventeeEndpointInputSchemas.speakerUpdate,
		output: EventeeEndpointOutputSchemas.speakerUpdate,
	},
	'speaker.delete': {
		input: EventeeEndpointInputSchemas.speakerDelete,
		output: EventeeEndpointOutputSchemas.speakerDelete,
	},
	'label.post': {
		input: EventeeEndpointInputSchemas.labelCreate,
		output: EventeeEndpointOutputSchemas.labelCreate,
	},
	'label.patch': {
		input: EventeeEndpointInputSchemas.labelUpdate,
		output: EventeeEndpointOutputSchemas.labelUpdate,
	},
	'label.delete': {
		input: EventeeEndpointInputSchemas.labelDelete,
		output: EventeeEndpointOutputSchemas.labelDelete,
	},
	'partner.post': {
		input: EventeeEndpointInputSchemas.partnerCreate,
		output: EventeeEndpointOutputSchemas.partnerCreate,
	},
	'partner.patch': {
		input: EventeeEndpointInputSchemas.partnerUpdate,
		output: EventeeEndpointOutputSchemas.partnerUpdate,
	},
	'partner.delete': {
		input: EventeeEndpointInputSchemas.partnerDelete,
		output: EventeeEndpointOutputSchemas.partnerDelete,
	},
	'partnerSections.patch': {
		input: EventeeEndpointInputSchemas.partnerUpdateSections,
		output: EventeeEndpointOutputSchemas.partnerUpdateSections,
	},
	'partner.get': {
		input: EventeeEndpointInputSchemas.partnerList,
		output: EventeeEndpointOutputSchemas.partnerList,
	},
	'attendeeInvite.put': {
		input: EventeeEndpointInputSchemas.attendeeInvite,
		output: EventeeEndpointOutputSchemas.attendeeInvite,
	},
	'attendeeCheckIn.patch': {
		input: EventeeEndpointInputSchemas.attendeeCheckIn,
		output: EventeeEndpointOutputSchemas.attendeeCheckIn,
	},
	'attendees.get': {
		input: EventeeEndpointInputSchemas.attendeeList,
		output: EventeeEndpointOutputSchemas.attendeeList,
	},
	'attendees.delete': {
		input: EventeeEndpointInputSchemas.attendeeRemove,
		output: EventeeEndpointOutputSchemas.attendeeRemove,
	},
	'registrationInvite.put': {
		input: EventeeEndpointInputSchemas.registrationCreate,
		output: EventeeEndpointOutputSchemas.registrationCreate,
	},
	'registrations.get': {
		input: EventeeEndpointInputSchemas.registrationList,
		output: EventeeEndpointOutputSchemas.registrationList,
	},
	'registrations.delete': {
		input: EventeeEndpointInputSchemas.registrationRemove,
		output: EventeeEndpointOutputSchemas.registrationRemove,
	},
	'groups.get': {
		input: EventeeEndpointInputSchemas.groupList,
		output: EventeeEndpointOutputSchemas.groupList,
	},
	'reviews.get': {
		input: EventeeEndpointInputSchemas.reviewList,
		output: EventeeEndpointOutputSchemas.reviewList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof eventeeEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;
const eventeeEndpointMeta = {
	'content.get': {
		riskLevel: 'read',
		description:
			'Read the complete event program, speakers, halls, breaks and labels',
	},
	'contentReset.delete': {
		riskLevel: 'destructive',
		description:
			'Irreversibly delete all program content, halls, speakers and labels',
	},
	'hall.post': {
		riskLevel: 'write',
		description: 'Create a hall for sessions in the event program',
	},
	'hall.patch': {
		riskLevel: 'write',
		description: 'Update a hall and its live stream assignment',
	},
	'hall.delete': {
		riskLevel: 'destructive',
		description: 'Delete a hall and every session placed in it',
	},
	'session.post': {
		riskLevel: 'write',
		description: 'Create a lecture or bookable workshop in the event program',
	},
	'session.patch': {
		riskLevel: 'write',
		description: 'Update a lecture or workshop and its scheduling details',
	},
	'session.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a session including its questions, polls, bookings and ratings',
	},
	'pause.post': {
		riskLevel: 'write',
		description: 'Add a break to the event program',
	},
	'pause.patch': {
		riskLevel: 'write',
		description: 'Update a break in the event program',
	},
	'pause.delete': {
		riskLevel: 'destructive',
		description: 'Remove a break from the event program',
	},
	'speaker.post': {
		riskLevel: 'write',
		description: 'Create a speaker profile for the event',
	},
	'speaker.patch': {
		riskLevel: 'write',
		description: 'Update fields on an event speaker profile',
	},
	'speaker.delete': {
		riskLevel: 'destructive',
		description: 'Delete a speaker and remove them from all sessions',
	},
	'label.post': {
		riskLevel: 'write',
		description: 'Create a colored label for categorizing sessions',
	},
	'label.patch': {
		riskLevel: 'write',
		description: 'Update an event program label',
	},
	'label.delete': {
		riskLevel: 'destructive',
		description: 'Delete a label and remove it from all sessions',
	},
	'partner.post': {
		riskLevel: 'write',
		description: 'Create an event sponsor or exhibitor partner profile',
	},
	'partner.patch': {
		riskLevel: 'write',
		description: 'Replace a partner profile and sponsor or exhibitor media',
	},
	'partner.delete': {
		riskLevel: 'destructive',
		description: 'Delete a partner and all of its detail page sections',
	},
	'partnerSections.patch': {
		riskLevel: 'destructive',
		description: 'Replace a partner detail page sections list',
	},
	'partner.get': {
		riskLevel: 'read',
		description: 'List all event partners with sponsor and exhibitor details',
	},
	'attendeeInvite.put': {
		riskLevel: 'destructive',
		description:
			'Invite attendees by email with optional profile details and tickets',
	},
	'attendeeCheckIn.patch': {
		riskLevel: 'write',
		description: 'Check in an attendee or undo their event check-in',
	},
	'attendees.get': {
		riskLevel: 'read',
		description:
			'List event participants with roles, groups and check-in details',
	},
	'attendees.delete': {
		riskLevel: 'destructive',
		description:
			'Remove an attendee, their event participation, invitation and tickets',
	},
	'registrationInvite.put': {
		riskLevel: 'destructive',
		description: 'Create or update event registrations by email',
	},
	'registrations.get': {
		riskLevel: 'read',
		description: 'List event registrations with statuses and profile details',
	},
	'registrations.delete': {
		riskLevel: 'destructive',
		description: 'Delete an event registration by email address',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'List attendee groups and their enabled app features',
	},
	'reviews.get': {
		riskLevel: 'read',
		description: 'List attendee ratings and comments for event sessions',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof eventeeEndpointsNested>;

export const eventeeAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseEventeePlugin<T extends EventeePluginOptions> = CorsairPlugin<
	'eventee',
	typeof EventeeSchema,
	typeof eventeeEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalEventeePlugin = BaseEventeePlugin<EventeePluginOptions>;
export type ExternalEventeePlugin<T extends EventeePluginOptions> =
	BaseEventeePlugin<T>;

export function eventee<const T extends EventeePluginOptions>(
	incomingOptions: EventeePluginOptions & T = {} as EventeePluginOptions & T,
): ExternalEventeePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'eventee',
		authConfig: eventeeAuthConfig,
		schema: EventeeSchema,
		options,
		hooks: options.hooks,
		endpoints: eventeeEndpointsNested,
		// Eventee's published OpenAPI documents REST operations only; it defines no webhooks.
		webhooks: {},
		endpointMeta: eventeeEndpointMeta,
		endpointSchemas: eventeeEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: EventeeKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) return options.key;
			if (!ctx.keys) throw new AuthMissingError('eventee', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('eventee', 'api_key');
			return apiKey;
		},
	} satisfies InternalEventeePlugin;
}

export type {
	EventeeEndpointInputs,
	EventeeEndpointOutputs,
} from './endpoints/types';
