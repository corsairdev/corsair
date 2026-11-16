import type {
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
import { Bookings, Schedules, Slots, Users } from './endpoints';
import type {
	SupersaasEndpointInputs,
	SupersaasEndpointOutputs,
} from './endpoints/types';
import {
	SupersaasEndpointInputSchemas,
	SupersaasEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SupersaasSchema } from './schema';

/**
 * SuperSaaS authenticates with HTTP Basic, where the username is the account
 * name and the password is the API key. The key is the plugin key and the
 * account name is a second account field, because neither works alone.
 */
export const supersaasAuthConfig = {
	api_key: {
		account: ['account_name'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SupersaasPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSupersaasPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof supersaasEndpointsNested>;
};

export type SupersaasContext = CorsairPluginContext<
	typeof SupersaasSchema,
	SupersaasPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SupersaasEndpoint, and passing them back would make the type circular.
	undefined,
	typeof supersaasAuthConfig
>;

export type SupersaasKeyBuilderContext = KeyBuilderContext<
	SupersaasPluginOptions,
	typeof supersaasAuthConfig
>;

export type SupersaasBoundEndpoints = BindEndpoints<
	typeof supersaasEndpointsNested
>;

type SupersaasEndpoint<K extends keyof SupersaasEndpointOutputs> =
	CorsairEndpoint<
		SupersaasContext,
		SupersaasEndpointInputs[K],
		SupersaasEndpointOutputs[K]
	>;

export type SupersaasEndpoints = {
	usersList: SupersaasEndpoint<'usersList'>;
	usersGet: SupersaasEndpoint<'usersGet'>;
	usersCreate: SupersaasEndpoint<'usersCreate'>;
	usersCreateWithKey: SupersaasEndpoint<'usersCreateWithKey'>;
	usersUpdate: SupersaasEndpoint<'usersUpdate'>;
	usersDelete: SupersaasEndpoint<'usersDelete'>;
	bookingsList: SupersaasEndpoint<'bookingsList'>;
	bookingsGet: SupersaasEndpoint<'bookingsGet'>;
	bookingsCreate: SupersaasEndpoint<'bookingsCreate'>;
	bookingsUpdate: SupersaasEndpoint<'bookingsUpdate'>;
	bookingsDelete: SupersaasEndpoint<'bookingsDelete'>;
	slotsList: SupersaasEndpoint<'slotsList'>;
	slotsGet: SupersaasEndpoint<'slotsGet'>;
	slotsCreate: SupersaasEndpoint<'slotsCreate'>;
	slotsUpdate: SupersaasEndpoint<'slotsUpdate'>;
	slotsDelete: SupersaasEndpoint<'slotsDelete'>;
	scheduleChanges: SupersaasEndpoint<'scheduleChanges'>;
	scheduleRange: SupersaasEndpoint<'scheduleRange'>;
	scheduleAgenda: SupersaasEndpoint<'scheduleAgenda'>;
	scheduleFree: SupersaasEndpoint<'scheduleFree'>;
};

const supersaasEndpointsNested = {
	users: {
		list: Users.list,
		get: Users.get,
		create: Users.create,
		createWithKey: Users.createWithKey,
		update: Users.update,
		delete: Users.remove,
	},
	bookings: {
		list: Bookings.list,
		get: Bookings.get,
		create: Bookings.create,
		update: Bookings.update,
		delete: Bookings.remove,
	},
	slots: {
		list: Slots.list,
		get: Slots.get,
		create: Slots.create,
		update: Slots.update,
		delete: Slots.remove,
	},
	schedules: {
		changes: Schedules.changes,
		range: Schedules.range,
		agenda: Schedules.agenda,
		free: Schedules.free,
	},
} as const;

export const supersaasEndpointSchemas = {
	'users.list': {
		input: SupersaasEndpointInputSchemas.usersList,
		output: SupersaasEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: SupersaasEndpointInputSchemas.usersGet,
		output: SupersaasEndpointOutputSchemas.usersGet,
	},
	'users.create': {
		input: SupersaasEndpointInputSchemas.usersCreate,
		output: SupersaasEndpointOutputSchemas.usersCreate,
	},
	'users.createWithKey': {
		input: SupersaasEndpointInputSchemas.usersCreateWithKey,
		output: SupersaasEndpointOutputSchemas.usersCreateWithKey,
	},
	'users.update': {
		input: SupersaasEndpointInputSchemas.usersUpdate,
		output: SupersaasEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: SupersaasEndpointInputSchemas.usersDelete,
		output: SupersaasEndpointOutputSchemas.usersDelete,
	},
	'bookings.list': {
		input: SupersaasEndpointInputSchemas.bookingsList,
		output: SupersaasEndpointOutputSchemas.bookingsList,
	},
	'bookings.get': {
		input: SupersaasEndpointInputSchemas.bookingsGet,
		output: SupersaasEndpointOutputSchemas.bookingsGet,
	},
	'bookings.create': {
		input: SupersaasEndpointInputSchemas.bookingsCreate,
		output: SupersaasEndpointOutputSchemas.bookingsCreate,
	},
	'bookings.update': {
		input: SupersaasEndpointInputSchemas.bookingsUpdate,
		output: SupersaasEndpointOutputSchemas.bookingsUpdate,
	},
	'bookings.delete': {
		input: SupersaasEndpointInputSchemas.bookingsDelete,
		output: SupersaasEndpointOutputSchemas.bookingsDelete,
	},
	'slots.list': {
		input: SupersaasEndpointInputSchemas.slotsList,
		output: SupersaasEndpointOutputSchemas.slotsList,
	},
	'slots.get': {
		input: SupersaasEndpointInputSchemas.slotsGet,
		output: SupersaasEndpointOutputSchemas.slotsGet,
	},
	'slots.create': {
		input: SupersaasEndpointInputSchemas.slotsCreate,
		output: SupersaasEndpointOutputSchemas.slotsCreate,
	},
	'slots.update': {
		input: SupersaasEndpointInputSchemas.slotsUpdate,
		output: SupersaasEndpointOutputSchemas.slotsUpdate,
	},
	'slots.delete': {
		input: SupersaasEndpointInputSchemas.slotsDelete,
		output: SupersaasEndpointOutputSchemas.slotsDelete,
	},
	'schedules.changes': {
		input: SupersaasEndpointInputSchemas.scheduleChanges,
		output: SupersaasEndpointOutputSchemas.scheduleChanges,
	},
	'schedules.range': {
		input: SupersaasEndpointInputSchemas.scheduleRange,
		output: SupersaasEndpointOutputSchemas.scheduleRange,
	},
	'schedules.agenda': {
		input: SupersaasEndpointInputSchemas.scheduleAgenda,
		output: SupersaasEndpointOutputSchemas.scheduleAgenda,
	},
	'schedules.free': {
		input: SupersaasEndpointInputSchemas.scheduleFree,
		output: SupersaasEndpointOutputSchemas.scheduleFree,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof supersaasEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const supersaasEndpointMeta = {
	'users.list': {
		riskLevel: 'read',
		description:
			'List the users on the account, paging with limit and offset; more than 1000 records needs offset',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Read one user by SuperSaaS id or by your own key in the form 1234fk',
	},
	'users.create': {
		riskLevel: 'write',
		description:
			'Create a user. The name is the login name and is the only required field; SuperSaaS assigns the id and returns it in a Location header',
	},
	'users.createWithKey': {
		riskLevel: 'write',
		description:
			'Create a user under a key you choose. Reusing that key updates the existing record instead of creating another',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			'Update a user. A PUT to an unknown id creates it unless notfound says otherwise, so an update can silently become a create',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a user. Their login stops working and their bookings lose the link, and this cannot be undone',
	},
	'bookings.list': {
		riskLevel: 'read',
		description:
			'List bookings for a schedule, optionally within a start and finish window (resource and service schedules)',
	},
	'bookings.get': {
		riskLevel: 'read',
		description: 'Read a single booking by id',
	},
	'bookings.create': {
		// SuperSaaS emails a confirmation to the customer when the schedule is
		// set to (Process tab, the default for many schedules), so this can send.
		riskLevel: 'destructive',
		description:
			'Book an appointment; SuperSaaS may email the customer a confirmation, depending on the schedule settings. A resource schedule needs start and finish, a capacity schedule needs a slot id',
	},
	'bookings.update': {
		// A changed booking is confirmed by email the same way as a new one.
		riskLevel: 'destructive',
		description:
			"Change a booking's time or details; SuperSaaS may email the customer about the change, depending on the schedule settings",
	},
	'bookings.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a booking, which frees its time for someone else and cannot be undone',
	},
	'slots.list': {
		riskLevel: 'read',
		description: 'List the slots of a capacity schedule in a time window',
	},
	'slots.get': {
		riskLevel: 'read',
		description:
			'Read one slot with its capacity and how many places are taken',
	},
	'slots.create': {
		riskLevel: 'write',
		description:
			'Create a slot on a capacity schedule, which appointments are then booked into',
	},
	'slots.update': {
		riskLevel: 'write',
		description: "Change a slot's time or capacity",
	},
	'slots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a slot and the capacity it offered, and this cannot be undone',
	},
	'schedules.changes': {
		riskLevel: 'read',
		description:
			'Read the changes to a schedule since a time, which is how a sync catches up; omitting the time gives the ten most recent',
	},
	'schedules.range': {
		riskLevel: 'read',
		description: 'List the appointments in a schedule between two times',
	},
	'schedules.agenda': {
		riskLevel: 'read',
		description:
			"Read one user's appointments, either within a schedule or across the account",
	},
	'schedules.free': {
		riskLevel: 'read',
		description:
			'Read the free spaces in a schedule after a time, which is the availability check',
	},
} satisfies RequiredPluginEndpointMeta<typeof supersaasEndpointsNested>;

export type BaseSupersaasPlugin<T extends SupersaasPluginOptions> =
	CorsairPlugin<
		'supersaas',
		typeof SupersaasSchema,
		typeof supersaasEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof supersaasAuthConfig
	>;

export type InternalSupersaasPlugin =
	BaseSupersaasPlugin<SupersaasPluginOptions>;

export type ExternalSupersaasPlugin<T extends SupersaasPluginOptions> =
	BaseSupersaasPlugin<T>;

export function supersaas<const T extends SupersaasPluginOptions>(
	incomingOptions: SupersaasPluginOptions & T = {} as SupersaasPluginOptions &
		T,
): ExternalSupersaasPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'supersaas',
		authConfig: supersaasAuthConfig,
		schema: SupersaasSchema,
		options: options,
		hooks: options.hooks,
		endpoints: supersaasEndpointsNested,
		webhooks: {},
		endpointMeta: supersaasEndpointMeta,
		endpointSchemas: supersaasEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SupersaasKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('supersaas', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSupersaasPlugin;
}

export { SupersaasAPIError } from './client';

export type {
	BookingsCreateInput,
	ScheduleAgendaInput,
	ScheduleChangesInput,
	ScheduleFreeInput,
	ScheduleRangeInput,
	SlotsCreateInput,
	SupersaasBooking,
	SupersaasCreated,
	SupersaasDeleted,
	SupersaasEndpointInputs,
	SupersaasEndpointOutputs,
	SupersaasScheduleRead,
	SupersaasSlot,
	SupersaasUpdated,
	SupersaasUser,
	UsersCreateInput,
	UsersCreateWithKeyInput,
	UsersUpdateInput,
} from './endpoints/types';
