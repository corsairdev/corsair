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
import { Validations } from './endpoints';
import type {
	MailssoEndpointInputs,
	MailssoEndpointOutputs,
} from './endpoints/types';
import {
	BATCH_STATUSES,
	MailssoEndpointInputSchemas,
	MailssoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MailssoSchema } from './schema';

export type MailssoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMailssoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailssoEndpointsNested>;
};

export type MailssoContext = CorsairPluginContext<
	typeof MailssoSchema,
	MailssoPluginOptions
>;

export type MailssoKeyBuilderContext = KeyBuilderContext<MailssoPluginOptions>;

export type MailssoBoundEndpoints = BindEndpoints<
	typeof mailssoEndpointsNested
>;

type MailssoEndpoint<K extends keyof MailssoEndpointOutputs> = CorsairEndpoint<
	MailssoContext,
	MailssoEndpointInputs[K],
	MailssoEndpointOutputs[K]
>;

export type MailssoEndpoints = {
	validationsSingle: MailssoEndpoint<'validationsSingle'>;
	validationsBatch: MailssoEndpoint<'validationsBatch'>;
	validationsGetBatch: MailssoEndpoint<'validationsGetBatch'>;
};

const mailssoEndpointsNested = {
	validations: {
		single: Validations.single,
		batch: Validations.batch,
		getBatch: Validations.getBatch,
	},
} as const;

export const mailssoEndpointSchemas = {
	'validations.single': {
		input: MailssoEndpointInputSchemas.validationsSingle,
		output: MailssoEndpointOutputSchemas.validationsSingle,
	},
	'validations.batch': {
		input: MailssoEndpointInputSchemas.validationsBatch,
		output: MailssoEndpointOutputSchemas.validationsBatch,
	},
	'validations.getBatch': {
		input: MailssoEndpointInputSchemas.validationsGetBatch,
		output: MailssoEndpointOutputSchemas.validationsGetBatch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailssoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// POST /v1/batch starts the job and GET /v1/batch/{id} reads it back, which is
// the pair the agent's get_job needs. Mails.so documents `finished_at` and was
// seen answering `status: 'pending'`, `'processing'` then `'completed'`; it documents no failed
// status, so `failed` is empty rather than a guess. Mails.so has no cancel
// route. jobs.test.ts keeps these values in step with the schema.
const BATCH_JOB = {
	idPath: 'id',
	status: {
		op: 'validations.getBatch',
		idArg: 'id',
		statusPath: 'status',
		done: BATCH_STATUSES.done,
		failed: [],
	},
} as const;

const mailssoEndpointMeta = {
	'validations.single': {
		riskLevel: 'read',
		description:
			'Validate one email address: deliverability result and reason, a 0-100 score, and format, domain, MX, block-list, catch-all, generic, disposable and free-provider checks',
	},
	'validations.batch': {
		riskLevel: 'write',
		description:
			'Start a batch validation job for at least 2 different email addresses; Mails.so documents it as paid-plan only, but a free account with credits ran batches in our test, and an account without access gets MailssoSubscriptionRequiredError. The job cannot be deleted through the API. It returns the job at once with no results: follow it with validations.getBatch until status is completed (it reads processing meanwhile).',
		job: BATCH_JOB,
	},
	'validations.getBatch': {
		riskLevel: 'read',
		description:
			'Read a batch validation job by id: status processing while it runs, and once completed the counts per result and the validation of every address',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mailssoEndpointsNested>;

export type BaseMailssoPlugin<T extends MailssoPluginOptions> = CorsairPlugin<
	'mailsso',
	typeof MailssoSchema,
	typeof mailssoEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalMailssoPlugin = BaseMailssoPlugin<MailssoPluginOptions>;

export type ExternalMailssoPlugin<T extends MailssoPluginOptions> =
	BaseMailssoPlugin<T>;

export function mailsso<const T extends MailssoPluginOptions>(
	incomingOptions: MailssoPluginOptions & T = {} as MailssoPluginOptions & T,
): ExternalMailssoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailsso',
		schema: MailssoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mailssoEndpointsNested,
		webhooks: {},
		endpointMeta: mailssoEndpointMeta,
		endpointSchemas: mailssoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MailssoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('mailsso', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMailssoPlugin;
}

export {
	MailssoAPIError,
	MailssoSubscriptionRequiredError,
} from './client';

export type {
	MailssoEmailValidation,
	MailssoEndpointInputs,
	MailssoEndpointOutputs,
	ValidationsBatchInput,
	ValidationsBatchResponse,
	ValidationsGetBatchInput,
	ValidationsGetBatchResponse,
	ValidationsSingleInput,
	ValidationsSingleResponse,
} from './endpoints/types';
