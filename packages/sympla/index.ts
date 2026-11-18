import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { SymplaContext } from './context';
import { Events, Orders, Participants, Presentations } from './endpoints';
import * as T from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SymplaSchema } from './schema';

export type { SymplaContext };

export type SymplaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSymplaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof symplaEndpointsNested>;
};

export type SymplaKeyBuilderContext = KeyBuilderContext<SymplaPluginOptions>;

const symplaEndpointsNested = {
	events: Events,
	presentations: Presentations,
	orders: Orders,
	participants: Participants,
} as const;

const symplaWebhooksNested = {} as const;

export type SymplaBoundEndpoints = BindEndpoints<typeof symplaEndpointsNested>;

export const symplaEndpointSchemas = {
	'events.list': {
		input: T.ListEventsInputSchema,
		output: T.ListEventsResponseSchema,
	},
	'events.get': {
		input: T.GetEventInputSchema,
		output: T.GetEventResponseSchema,
	},
	'presentations.list': {
		input: T.ListPresentationsInputSchema,
		output: T.ListPresentationsResponseSchema,
	},
	'presentations.get': {
		input: T.GetPresentationInputSchema,
		output: T.GetPresentationResponseSchema,
	},
	'orders.list': {
		input: T.ListOrdersInputSchema,
		output: T.ListOrdersResponseSchema,
	},
	'orders.listByPresentation': {
		input: T.ListPresentationOrdersInputSchema,
		output: T.ListPresentationOrdersResponseSchema,
	},
	'orders.get': {
		input: T.GetOrderInputSchema,
		output: T.GetOrderResponseSchema,
	},
	'participants.list': {
		input: T.ListParticipantsInputSchema,
		output: T.ListParticipantsResponseSchema,
	},
	'participants.listByOrder': {
		input: T.ListOrderParticipantsInputSchema,
		output: T.ListOrderParticipantsResponseSchema,
	},
	'participants.listByPresentation': {
		input: T.ListPresentationParticipantsInputSchema,
		output: T.ListPresentationParticipantsResponseSchema,
	},
	'participants.get': {
		input: T.GetParticipantInputSchema,
		output: T.GetParticipantResponseSchema,
	},
	'participants.getByTicketNumber': {
		input: T.GetParticipantByTicketInputSchema,
		output: T.GetParticipantByTicketResponseSchema,
	},
	'participants.checkIn': {
		input: T.CheckInParticipantInputSchema,
		output: T.CheckInParticipantResponseSchema,
	},
	'participants.checkInByTicketNumber': {
		input: T.CheckInByTicketInputSchema,
		output: T.CheckInByTicketResponseSchema,
	},
	'participants.checkInByQrCode': {
		input: T.CheckInByQrCodeInputSchema,
		output: T.CheckInByQrCodeResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof symplaEndpointsNested
>;

const symplaEndpointMeta = {
	'events.list': {
		riskLevel: 'read',
		description:
			'List the events of the Sympla organizer, with cursor pagination.',
	},
	'events.get': {
		riskLevel: 'read',
		description:
			'Get one event: dates, address, host, category and publication status.',
	},
	'presentations.list': {
		riskLevel: 'read',
		description: 'List the presentations (sessions or dates) of an event.',
	},
	'presentations.get': {
		riskLevel: 'read',
		description: 'Get one presentation of an event, with its sectors.',
	},
	'orders.list': {
		riskLevel: 'read',
		description:
			'List the orders of an event, filterable by date, buyer email and cancelled status.',
	},
	'orders.listByPresentation': {
		riskLevel: 'read',
		description: 'List the orders of one presentation of an event.',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Get one order of an event.',
	},
	'participants.list': {
		riskLevel: 'read',
		description:
			'List the participants (tickets) of an event, with check-in status.',
	},
	'participants.listByOrder': {
		riskLevel: 'read',
		description: 'List the participants (tickets) in one order.',
	},
	'participants.listByPresentation': {
		riskLevel: 'read',
		description: 'List the participants (tickets) of one presentation.',
	},
	'participants.get': {
		riskLevel: 'read',
		description: 'Get one participant of an event by participant id.',
	},
	'participants.getByTicketNumber': {
		riskLevel: 'read',
		description: 'Get one participant of an event by ticket number.',
	},
	'participants.checkIn': {
		riskLevel: 'destructive',
		description:
			'Check a participant in by participant id. The API has no way to undo a check-in.',
	},
	'participants.checkInByTicketNumber': {
		riskLevel: 'destructive',
		description:
			'Check a participant in by ticket number. The API has no way to undo a check-in.',
	},
	'participants.checkInByQrCode': {
		riskLevel: 'destructive',
		description:
			'Check a participant in with the fields of a scanned ticket QR code. The API has no way to undo a check-in.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof symplaEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const symplaAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSymplaPlugin<T extends SymplaPluginOptions> = CorsairPlugin<
	'sympla',
	typeof SymplaSchema,
	typeof symplaEndpointsNested,
	typeof symplaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSymplaPlugin = BaseSymplaPlugin<SymplaPluginOptions>;

export type ExternalSymplaPlugin<T extends SymplaPluginOptions> =
	BaseSymplaPlugin<T>;

export function sympla<const T extends SymplaPluginOptions>(
	incomingOptions: SymplaPluginOptions & T = {} as SymplaPluginOptions & T,
): ExternalSymplaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'sympla',
		authConfig: symplaAuthConfig,
		schema: SymplaSchema,
		options,
		hooks: options.hooks,
		endpoints: symplaEndpointsNested,
		webhooks: symplaWebhooksNested,
		endpointMeta: symplaEndpointMeta,
		endpointSchemas: symplaEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SymplaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('sympla', 'api_key');
				}
				return key;
			}

			return '';
		},
	} satisfies InternalSymplaPlugin;
}
