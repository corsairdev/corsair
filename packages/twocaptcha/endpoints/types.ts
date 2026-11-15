import { z } from 'zod';

/**
 * A JSON value: the solution payload and the enterprise parameters are open, and
 * a value can nest, so this type refers to itself. `z.lazy` is what Zod needs for
 * a recursive shape, and the reference page renders it as the union rather than
 * as `any`.
 */
type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

/**
 * 2Captcha's API v2 answers `{ status, request, error_text }`. `status` is `1`
 * for success and `0` for failure, and a still-solving task answers `0` with
 * `request: 'CAPCHA_NOT_READY'`, which the result endpoint reports as a
 * `not_ready` state rather than an error.
 *
 * `request` carries different things per route: a task id string, a token, a
 * balance number, or `OK` for a report.
 */
const TaskCreatedSchema = z
	.object({
		status: z.number(),
		request: z.union([z.string(), z.number()]).nullish(),
		error_text: z.string().nullish(),
	})
	.loose();
export type TaskCreatedOutput = z.output<typeof TaskCreatedSchema>;

/**
 * A task result. `status: 1` means `request` holds the solution; `status: 0`
 * with `CAPCHA_NOT_READY` means poll again. The schema keeps both so a caller
 * can wait on the same call.
 */
const TaskResultSchema = z
	.object({
		status: z.number(),
		request: z.union([z.string(), z.number()]).nullish(),
		error_text: z.string().nullish(),
		/** Present when the task was created with `task: {}`; a raw payload. */
		solution: z.record(z.string(), JsonValueSchema).nullish(),
	})
	.loose();
export type TaskResultOutput = z.output<typeof TaskResultSchema>;

const BalanceSchema = z
	.object({
		status: z.number(),
		request: z.union([z.string(), z.number()]).nullish(),
		error_text: z.string().nullish(),
	})
	.loose();

const ReportSchema = z
	.object({
		status: z.number(),
		request: z.union([z.string(), z.number()]).nullish(),
		error_text: z.string().nullish(),
	})
	.loose();

/**
 * The captcha kinds the task API accepts. 2Captcha names each one with a
 * `type` string, and each kind takes its own fields inside `task`.
 */
const CaptchaTypeSchema = z.enum([
	'RecaptchaV2TaskProxyless',
	'RecaptchaV3TaskProxyless',
	'RecaptchaV2EnterpriseTaskProxyless',
	'HCaptchaTaskProxyless',
	'FunCaptchaTaskProxyless',
	'TurnstileTaskProxyless',
	'GeeTestTaskProxyless',
	'AmazonTaskProxyless',
	'KeyCaptchaTaskProxyless',
	'LeminTaskProxyless',
	'CapyTaskProxyless',
	'AtbCaptchaTaskProxyless',
]);

/**
 * The per-kind fields. Most kinds need `websiteURL` and one site key field, and
 * the names differ (`websiteKey`, `sitekey`, `websitePublicKey`), so they are
 * typed as the union of the documented names rather than one name per kind.
 */
const TaskBodySchema = z
	.object({
		websiteURL: z.string().min(1).optional(),
		websiteKey: z.string().optional(),
		sitekey: z.string().optional(),
		websitePublicKey: z.string().optional(),
		websiteSToken: z.string().optional(),
		recaptchaDataSValue: z.string().optional(),
		pageAction: z
			.string()
			.optional()
			.describe('reCAPTCHA v3 action, such as login'),
		minScore: z
			.number()
			.min(0.1)
			.max(0.9)
			.optional()
			.describe('reCAPTCHA v3 minimum score'),
		enterprisePayload: z.record(z.string(), JsonValueSchema).optional(),
		isInvisible: z.boolean().optional(),
		userAgent: z
			.string()
			.optional()
			.describe('Must match the browser that will use the token'),
		proxyType: z.enum(['http', 'https', 'socks4', 'socks5']).optional(),
		proxyAddress: z.string().optional(),
		proxyPort: z.number().int().min(1).max(65535).optional(),
		proxyLogin: z.string().optional(),
		proxyPassword: z.string().optional(),
		gt: z.string().optional().describe('GeeTest gt value'),
		challenge: z.string().optional().describe('GeeTest challenge value'),
		apiServer: z.string().optional(),
		jsApiKey: z.string().optional(),
	})
	.loose();

const CreateTaskInputSchema = z
	.object({
		type: CaptchaTypeSchema,
		task: TaskBodySchema,
		soft_id: z
			.number()
			.int()
			.optional()
			.describe('Referral id; leave it out to send none'),
		callback: z
			.string()
			.optional()
			.describe('A URL to POST the result to instead of polling'),
	})
	.superRefine((value, ctx) => {
		// The proxyless kinds all need a page and a key of some spelling.
		const hasKey =
			value.task.websiteKey !== undefined ||
			value.task.sitekey !== undefined ||
			value.task.websitePublicKey !== undefined;
		if (value.task.websiteURL === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: '`task.websiteURL` is required',
				path: ['task', 'websiteURL'],
			});
		}
		if (!hasKey) {
			ctx.addIssue({
				code: 'custom',
				message:
					'One of `websiteKey`, `sitekey` or `websitePublicKey` is required, depending on the captcha kind',
				path: ['task'],
			});
		}
		// A proxy kind without its address and port cannot be dispatched.
		if (
			value.type.endsWith('Task') === false &&
			value.task.proxyType === undefined &&
			(value.task.proxyAddress !== undefined ||
				value.task.proxyPort !== undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				message:
					'`proxyType` is required when a proxy address or port is given',
				path: ['task', 'proxyType'],
			});
		}
	});
export type CreateTaskInput = z.input<typeof CreateTaskInputSchema>;

const GetTaskResultInputSchema = z.object({
	task_id: z.string().min(1).describe('The task id `tasks.create` returned'),
});
export type GetTaskResultInput = z.input<typeof GetTaskResultInputSchema>;

const GetBalanceInputSchema = z.object({});
export type GetBalanceInput = z.input<typeof GetBalanceInputSchema>;

const ReportCorrectInputSchema = z.object({
	task_id: z.string().min(1).describe('A task whose token the site accepted'),
});
export type ReportCorrectInput = z.input<typeof ReportCorrectInputSchema>;

const ReportIncorrectInputSchema = z.object({
	task_id: z
		.string()
		.min(1)
		.describe('A task whose token the site rejected; the account is refunded'),
});
export type ReportIncorrectInput = z.input<typeof ReportIncorrectInputSchema>;

/** What a caller should do with a result. */
export type TaskState = 'ready' | 'not_ready';

export type TwoCaptchaEndpointInputs = {
	createTask: CreateTaskInput;
	getTaskResult: GetTaskResultInput;
	getBalance: GetBalanceInput;
	reportCorrect: ReportCorrectInput;
	reportIncorrect: ReportIncorrectInput;
};

export type TwoCaptchaEndpointOutputs = {
	createTask: TaskCreatedOutput;
	getTaskResult: TaskResultOutput;
	getBalance: z.output<typeof BalanceSchema>;
	reportCorrect: z.output<typeof ReportSchema>;
	reportIncorrect: z.output<typeof ReportSchema>;
};

export const TwoCaptchaEndpointInputSchemas = {
	createTask: CreateTaskInputSchema,
	getTaskResult: GetTaskResultInputSchema,
	getBalance: GetBalanceInputSchema,
	reportCorrect: ReportCorrectInputSchema,
	reportIncorrect: ReportIncorrectInputSchema,
} as const;

export const TwoCaptchaEndpointOutputSchemas = {
	createTask: TaskCreatedSchema,
	getTaskResult: TaskResultSchema,
	getBalance: BalanceSchema,
	reportCorrect: ReportSchema,
	reportIncorrect: ReportSchema,
} as const;
