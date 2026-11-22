import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MailerLiteRequestOptions } from '../client';
import { makeMailerLiteRequest } from '../client';
import type { MailerLiteContext } from '../index';
import { registerMailerLiteEndpointSchemas } from './types';

export type MailerLiteOperationContract = {
	readonly inputSchema: z.ZodType;
	readonly outputSchema: z.ZodType;
	// `unknown` is narrowed by the corresponding inputSchema before request building.
	readonly requestBuilder: (input: unknown) => MailerLiteRequestOptions;
	// `unknown` because tests invoke the heterogeneous registry; the endpoint
	// parses it with this operation's input schema before making a request.
	readonly invoke: (ctx: MailerLiteContext, input: unknown) => Promise<unknown>;
	readonly riskLevel: 'read' | 'write' | 'destructive';
	readonly description: string;
};

// `unknown` is necessary at this heterogeneous registry boundary; each
// requestBuilder validates it with its operation's input schema before use.
export const mailerLiteOperationRegistry: Record<
	string,
	MailerLiteOperationContract
> = {};

export function defineMailerLiteOperation<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
>(spec: {
	operation: string;
	input: InputSchema;
	output: OutputSchema;
	riskLevel?: 'read' | 'write' | 'destructive';
	description?: string;
	request: (input: z.infer<InputSchema>) => MailerLiteRequestOptions;
}): CorsairEndpoint<
	MailerLiteContext,
	z.infer<InputSchema>,
	z.infer<OutputSchema>
> & {
	readonly inputSchema: InputSchema;
	readonly outputSchema: OutputSchema;
	readonly riskLevel: 'read' | 'write' | 'destructive';
	readonly description: string;
} {
	const action = spec.operation.split('.').at(-1) ?? spec.operation;
	const isRead = new Set([
		'list',
		'get',
		'count',
		'activity',
		'importStatus',
		'ecommerceStats',
		'ecommerceOrders',
		'ecommerceReport',
		'stats',
		'subscriberActivity',
		'stepRunCounts',
		'stepRunCount',
		'triggerRunCounts',
		'triggerRunCount',
		'abStepStats',
		'abStepStat',
		'stepSubscribers',
		'triggerSubscribers',
		'orders',
		'emailTotals',
		'ecommerceTotals',
		'getContent',
		'unsubscribeReasons',
		'validateBlock',
		'validateSettings',
		'subscribers',
		'html',
		'getBlock',
		'versions',
	]).has(action);
	const isDestructive =
		new Set([
			'delete',
			'forget',
			'schedule',
			'cancel',
			'enable',
			'test',
			'restoreVersion',
			'selectWinner',
			'cancelRuns',
			'skipDelay',
		]).has(action) ||
		action.toLowerCase().includes('delete') ||
		/^(orders\.(create|update)|ecommerceImports\.orders|productVariants\.create)$/.test(
			spec.operation,
		) ||
		/^(automations\.(addSubscribers|readd|addToGroup|skipDelay|cancelRuns)|groups\.importSubscribers)$/.test(
			spec.operation,
		);
	const humanAction = action.replace(
		/[A-Z]/g,
		(letter) => ` ${letter.toLowerCase()}`,
	);
	const resource = spec.operation.split('.')[0] ?? 'resource';
	const humanResource = resource.replace(
		/[A-Z]/g,
		(letter) => ` ${letter.toLowerCase()}`,
	);
	const riskLevel =
		spec.riskLevel ??
		(isDestructive && spec.operation !== 'campaigns.cancel'
			? 'destructive'
			: isRead
				? 'read'
				: 'write');
	const description =
		spec.description ?? `MailerLite ${humanAction} ${humanResource}.`;
	registerMailerLiteEndpointSchemas(spec.operation, spec.input, spec.output);
	// `unknown` because tests or framework callers can supply arbitrary input;
	// the operation schema validates it before the typed request callback runs.
	const requestBuilder = (input: unknown) =>
		spec.request(spec.input.parse(input));
	const invoke = async (ctx: MailerLiteContext, input: unknown) => {
		const parsedInput = spec.input.parse(input);
		const response = await makeMailerLiteRequest<z.infer<OutputSchema>>(
			spec.request(parsedInput),
			ctx.key,
		);
		const parsedOutput = spec.output.parse(response);
		await logEventFromContext(
			ctx,
			`mailerlite.${spec.operation}`,
			{},
			'completed',
		);
		return parsedOutput;
	};
	mailerLiteOperationRegistry[spec.operation] = {
		inputSchema: spec.input,
		outputSchema: spec.output,
		requestBuilder,
		invoke,
		riskLevel,
		description,
	};
	const endpoint: CorsairEndpoint<
		MailerLiteContext,
		z.infer<InputSchema>,
		z.infer<OutputSchema>
	> = invoke;
	return Object.assign(endpoint, {
		inputSchema: spec.input,
		outputSchema: spec.output,
		requestBuilder,
		riskLevel,
		description,
	});
}
