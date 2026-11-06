import { z } from 'zod';
import {
	BrowserUseBrowser,
	RunCreated,
	RunStatusBody,
	RunSummary,
} from '../schema/database';

const PROXY_COUNTRY_CODES = [
	'ad',
	'ae',
	'af',
	'ag',
	'ai',
	'al',
	'am',
	'an',
	'ao',
	'aq',
	'ar',
	'as',
	'at',
	'au',
	'aw',
	'az',
	'ba',
	'bb',
	'bd',
	'be',
	'bf',
	'bg',
	'bh',
	'bi',
	'bj',
	'bl',
	'bm',
	'bn',
	'bo',
	'bq',
	'br',
	'bs',
	'bt',
	'bv',
	'bw',
	'by',
	'bz',
	'ca',
	'cc',
	'cd',
	'cf',
	'cg',
	'ch',
	'ci',
	'ck',
	'cl',
	'cm',
	'co',
	'cr',
	'cs',
	'cu',
	'cv',
	'cw',
	'cx',
	'cy',
	'cz',
	'de',
	'dj',
	'dk',
	'dm',
	'do',
	'dz',
	'ec',
	'ee',
	'eg',
	'eh',
	'er',
	'es',
	'et',
	'fi',
	'fj',
	'fk',
	'fm',
	'fo',
	'fr',
	'ga',
	'gd',
	'ge',
	'gf',
	'gg',
	'gh',
	'gi',
	'gl',
	'gm',
	'gn',
	'gp',
	'gq',
	'gr',
	'gs',
	'gt',
	'gu',
	'gw',
	'gy',
	'hk',
	'hm',
	'hn',
	'hr',
	'ht',
	'hu',
	'id',
	'ie',
	'il',
	'im',
	'in',
	'iq',
	'ir',
	'is',
	'it',
	'je',
	'jm',
	'jo',
	'jp',
	'ke',
	'kg',
	'kh',
	'ki',
	'km',
	'kn',
	'kp',
	'kr',
	'kw',
	'ky',
	'kz',
	'la',
	'lb',
	'lc',
	'li',
	'lk',
	'lr',
	'ls',
	'lt',
	'lu',
	'lv',
	'ly',
	'ma',
	'mc',
	'md',
	'me',
	'mf',
	'mg',
	'mh',
	'mk',
	'ml',
	'mm',
	'mn',
	'mo',
	'mp',
	'mq',
	'mr',
	'ms',
	'mt',
	'mu',
	'mv',
	'mw',
	'mx',
	'my',
	'mz',
	'na',
	'nc',
	'ne',
	'nf',
	'ng',
	'ni',
	'nl',
	'no',
	'np',
	'nr',
	'nu',
	'nz',
	'om',
	'pa',
	'pe',
	'pf',
	'pg',
	'ph',
	'pk',
	'pl',
	'pm',
	'pn',
	'pr',
	'ps',
	'pt',
	'pw',
	'py',
	'qa',
	're',
	'ro',
	'rs',
	'ru',
	'rw',
	'sa',
	'sb',
	'sc',
	'sd',
	'se',
	'sg',
	'sh',
	'si',
	'sj',
	'sk',
	'sl',
	'sm',
	'sn',
	'so',
	'sr',
	'ss',
	'st',
	'sv',
	'sx',
	'sy',
	'sz',
	'tc',
	'td',
	'tf',
	'tg',
	'th',
	'tj',
	'tk',
	'tl',
	'tm',
	'tn',
	'to',
	'tr',
	'tt',
	'tv',
	'tw',
	'tz',
	'ua',
	'ug',
	'uk',
	'us',
	'uy',
	'uz',
	'va',
	'vc',
	've',
	'vg',
	'vi',
	'vn',
	'vu',
	'wf',
	'ws',
	'xk',
	'ye',
	'yt',
	'za',
	'zm',
	'zw',
] as const; // as is necessary: this must stay a literal. A wider type is not practical.

const RUN_MODELS = [
	'mimo-v2.6-pro',
	'mimo-v2.6-flash',
	'deepseek-v4.1-flash',
	'glm-5.2',
	'grok-4.5',
	'grok-4.6',
	'glm-5.3-flash',
	'deepseek-v4-flash-vision',
	'kimi-k3',
	'minimax-m3',
	'claude-opus-4.7',
	'claude-opus-4.8',
	'claude-opus-5',
	'claude-opus-5-5',
	'claude-fable-5',
	'claude-sonnet-5',
	'claude-sonnet-5-5',
	'gpt-5.5',
	'gpt-5.6',
	'gpt-6-astra',
	'gpt-6-sol',
	'gpt-6.1-sol',
	'gpt-6-luna',
	'gpt-5.6-sol',
	'gpt-5.6-terra',
	'gpt-5.6-luna',
	'gemini-3.6-flash',
	'gemini-3.5-flash',
	'gemini-3.1-pro',
	'gemini-3-flash',
	'bu-ultrafast',
	'bu-fast',
] as const; // as is necessary: this must stay a literal. A wider type is not practical.

const ProxyCountryCode = z.enum(PROXY_COUNTRY_CODES).nullable();
const RunModel = z.enum(RUN_MODELS);

const Uuid = z.string().uuid();

const CustomProxy = z
	.object({
		host: z.string().min(1).max(255),
		port: z.number().int().min(1).max(65535),
		username: z.string().min(1).max(255).nullable().optional(),
		password: z.string().min(1).max(255).nullable().optional(),
		ignoreCertErrors: z.boolean().optional(),
	})
	.strict();

const BrowserSettings = z
	.object({
		profileId: Uuid.nullable().optional(),
		proxyCountryCode: ProxyCountryCode.optional(),
		customProxy: CustomProxy.nullable().optional(),
		screenWidth: z.number().int().min(320).max(6144).nullable().optional(),
		screenHeight: z.number().int().min(320).max(3456).nullable().optional(),
		allowResizing: z.boolean().nullable().optional(),
		record: z.boolean().nullable().optional(),
		extensionIds: z.array(Uuid).max(3).optional(),
	})
	.strict();

const InlineSecret = z
	.object({
		type: z.literal('inline'),
		value: z.string().min(1),
	})
	.strict();

const OnePasswordSecret = z
	.object({
		type: z.literal('onepassword'),
		integrationId: Uuid,
		vaultId: z.string().min(1).max(64),
		itemId: z.string().min(1).max(64),
		fieldId: z.string().min(1).max(64),
	})
	.strict();

const SecretBinding = z
	.object({
		alias: z.string().min(1),
		source: z.discriminatedUnion('type', [InlineSecret, OnePasswordSecret]),
		allowedDomains: z.array(z.string()).min(1).max(20),
	})
	.strict();

const Id = z.object({ id: Uuid }).strict();

export const BrowsersCreateInputSchema = z
	.object({
		profileId: Uuid.optional(),
		proxyCountryCode: ProxyCountryCode.optional(),
		timeout: z.number().int().min(1).max(240).optional(),
		browserScreenWidth: z
			.number()
			.int()
			.min(320)
			.max(6144)
			.nullable()
			.optional(),
		browserScreenHeight: z
			.number()
			.int()
			.min(320)
			.max(3456)
			.nullable()
			.optional(),
		allowResizing: z.boolean().optional(),
		pdfRendererEnabled: z.boolean().optional(),
		solveCaptchas: z.boolean().optional(),
		enableRecording: z.boolean().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		customProxy: CustomProxy.nullable().optional(),
		extensionIds: z.array(Uuid).max(3).optional(),
	})
	.strict();

export const BrowsersGetInputSchema = Id;

export const BrowsersListInputSchema = z
	.object({
		pageSize: z.number().int().min(1).max(100).optional(),
		pageNumber: z.number().int().min(1).optional(),
		filterBy: z.enum(['active', 'stopped']).optional(),
		// Repeated query param. `key` matches any value; `key=value` matches exactly.
		metadata: z.array(z.string()).nullable().optional(),
		agentSessionId: Uuid.nullable().optional(),
	})
	.strict();

export const BrowsersStopInputSchema = Id;

export const RunsCreateInputSchema = z
	.object({
		task: z.string().min(1),
		// Closed list from the v4 spec on 2026-10-21. A typo must fail here, not as a billed 422.
		model: RunModel.optional(),
		// unknown: model params use each provider's own keys, so a fixed object is not practical.
		modelParams: z.record(z.string(), z.unknown()).nullable().optional(),
		// unknown: outputSchema is a caller JSON Schema, so a fixed object is not practical.
		outputSchema: z.record(z.string(), z.unknown()).nullable().optional(),
		sessionId: Uuid.nullable().optional(),
		workspaceId: Uuid.nullable().optional(),
		browserSettings: BrowserSettings.nullable().optional(),
		keepAlive: z.number().int().min(120).max(14400).nullable().optional(),
		agentmail: z.boolean().optional(),
		agentcardWalletId: Uuid.nullable().optional(),
		stripeLinkConnectionId: Uuid.nullable().optional(),
		agenticAutofillGrantId: Uuid.nullable().optional(),
		attachedFileIds: z.array(Uuid).max(20).nullable().optional(),
		secretBindings: z.array(SecretBinding).max(20).nullable().optional(),
		opVaultId: z.string().min(1).max(64).nullable().optional(),
		opVaultAllowedDomains: z.array(z.string()).nullable().optional(),
		judge: z
			.object({ context: z.string().max(10000).nullable().optional() })
			.strict()
			.nullable()
			.optional(),
		// The spec accepts a number or a numeric string.
		maxCostUsd: z
			.union([
				z.number().positive(),
				z.string().regex(/^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$/),
			])
			.nullable()
			.optional(),
	})
	.strict();

export const RunsGetInputSchema = Id;
export const RunsStatusInputSchema = Id;
export const RunsCancelInputSchema = Id;

export const BrowserUseEndpointInputSchemas = {
	browsersCreate: BrowsersCreateInputSchema,
	browsersGet: BrowsersGetInputSchema,
	browsersList: BrowsersListInputSchema,
	browsersStop: BrowsersStopInputSchema,
	runsCreate: RunsCreateInputSchema,
	runsGet: RunsGetInputSchema,
	runsGetStatus: RunsStatusInputSchema,
	runsCancel: RunsCancelInputSchema,
} as const; // as is necessary: this must stay a literal. A wider type is not practical.

export type BrowserUseEndpointInputs = {
	[K in keyof typeof BrowserUseEndpointInputSchemas]: z.input<
		(typeof BrowserUseEndpointInputSchemas)[K]
	>;
};

export const BrowsersCreateOutputSchema = BrowserUseBrowser;
export const BrowsersGetOutputSchema = BrowserUseBrowser;
export const BrowsersStopOutputSchema = BrowserUseBrowser;
export const RunsCreateOutputSchema = RunCreated;
export const RunsGetOutputSchema = RunSummary;
export const RunsStatusOutputSchema = RunStatusBody;
export const RunsCancelOutputSchema = RunSummary;

export const BrowsersListOutputSchema = z
	.object({
		items: z.array(BrowserUseBrowser),
		totalItems: z.number().int(),
		pageNumber: z.number().int(),
		pageSize: z.number().int(),
	})
	.loose();

export const BrowserUseEndpointOutputSchemas = {
	browsersCreate: BrowserUseBrowser,
	browsersGet: BrowserUseBrowser,
	browsersList: BrowsersListOutputSchema,
	browsersStop: BrowserUseBrowser,
	runsCreate: RunCreated,
	runsGet: RunSummary,
	runsGetStatus: RunStatusBody,
	runsCancel: RunSummary,
} as const; // as is necessary: this must stay a literal. A wider type is not practical.

export type BrowserUseEndpointOutputs = {
	[K in keyof typeof BrowserUseEndpointOutputSchemas]: z.infer<
		(typeof BrowserUseEndpointOutputSchemas)[K]
	>;
};
