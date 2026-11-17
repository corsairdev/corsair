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

// Responses are parsed loosely: 2Captcha sends ids as numbers, amounts as
// strings or numbers, and adds fields over time.
const NumberOrString = z.union([z.number(), z.string()]);

/** `createTask`: `{ errorId: 0, taskId }`. */
const TaskCreatedSchema = z
	.object({
		errorId: z.number(),
		taskId: NumberOrString,
	})
	.loose();
export type TaskCreatedOutput = z.output<typeof TaskCreatedSchema>;

/**
 * `getTaskResult`: `status` is `processing` while workers solve the task
 * (poll again in 5-10 s) and `ready` with a `solution` once done. The
 * solution's fields depend on the captcha kind (`token`, `gRecaptchaResponse`,
 * `text`, ...). `cost` is what the task was charged, in USD.
 */
const TaskResultSchema = z
	.object({
		errorId: z.number(),
		status: z.string().describe('`ready` or `processing`'),
		solution: z.record(z.string(), JsonValueSchema).nullish(),
		cost: NumberOrString.nullish(),
		ip: z.string().nullish(),
		createTime: z.number().nullish(),
		endTime: z.number().nullish(),
		solveCount: z.number().nullish(),
	})
	.loose();
export type TaskResultOutput = z.output<typeof TaskResultSchema>;

/** `getBalance`: `{ errorId: 0, balance }`, in USD. */
const BalanceSchema = z
	.object({
		errorId: z.number(),
		balance: NumberOrString,
	})
	.loose();

/** `reportCorrect` / `reportIncorrect`: `{ errorId: 0, status: 'success' }`. */
const ReportSchema = z
	.object({
		errorId: z.number(),
		status: z.string().nullish(),
	})
	.loose();

/**
 * The per-kind fields of a task. Each captcha kind takes its own fields, and
 * the key field name differs (`websiteKey`, `websitePublicKey`, `gt` and
 * `challenge` for GeeTest, `body` for an image), so the common documented
 * fields are typed and any other field the kind needs passes through.
 * https://2captcha.com/api-docs
 */
const TaskBodySchema = z
	.object({
		websiteURL: z.string().min(1).optional(),
		websiteKey: z.string().optional(),
		websitePublicKey: z.string().optional(),
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
		cookies: z.string().optional(),
		proxyType: z.enum(['http', 'https', 'socks4', 'socks5']).optional(),
		proxyAddress: z.string().optional(),
		proxyPort: z
			.union([z.number().int().min(1).max(65535), z.string()])
			.optional(),
		proxyLogin: z.string().optional(),
		proxyPassword: z.string().optional(),
		gt: z.string().optional().describe('GeeTest gt value'),
		challenge: z.string().optional().describe('GeeTest challenge value'),
		body: z.string().optional().describe('Image captchas: the image as base64'),
	})
	.loose();

const CreateTaskInputSchema = z.object({
	type: z
		.string()
		.min(1)
		.describe(
			'The captcha kind, such as RecaptchaV2TaskProxyless, RecaptchaV3TaskProxyless, TurnstileTaskProxyless, GeeTestTaskProxyless or ImageToTextTask; the *Task variants without "Proxyless" take your proxy fields',
		),
	task: TaskBodySchema.describe(
		'The fields for this kind, sent inside the task object next to `type`',
	),
	language_pool: z
		.string()
		.optional()
		.describe('Worker language for image and text captchas, such as en'),
	soft_id: z
		.number()
		.int()
		.optional()
		.describe('Software catalog id; leave it out to send none'),
	callback: z
		.string()
		.url()
		.optional()
		.describe(
			'A registered URL 2Captcha POSTs the result to; this plugin does not receive it, so poll tasks.result',
		),
});
export type CreateTaskInput = z.input<typeof CreateTaskInputSchema>;

// 2Captcha task ids are integers; a numeric string is accepted and sent as one.
const TaskIdSchema = z
	.union([z.number().int().positive(), z.string().regex(/^\d+$/)])
	.transform((value) => Number(value));

const GetTaskResultInputSchema = z.object({
	task_id: TaskIdSchema.describe('The task id `tasks.create` returned'),
});
export type GetTaskResultInput = z.input<typeof GetTaskResultInputSchema>;

const GetBalanceInputSchema = z.object({});
export type GetBalanceInput = z.input<typeof GetBalanceInputSchema>;

const ReportCorrectInputSchema = z.object({
	task_id: TaskIdSchema.describe('A task whose answer the site accepted'),
});
export type ReportCorrectInput = z.input<typeof ReportCorrectInputSchema>;

const ReportIncorrectInputSchema = z.object({
	task_id: TaskIdSchema.describe(
		'A task whose answer the site rejected; 2Captcha reviews the complaint and may refund it',
	),
});
export type ReportIncorrectInput = z.input<typeof ReportIncorrectInputSchema>;

/** `tasks.result` status values documented today; others may follow. */
export type TaskState = 'ready' | 'processing';

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
