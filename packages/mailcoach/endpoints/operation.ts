import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { MailcoachMethod, MailcoachQueryValue } from '../client';
import { makeMailcoachRequest } from '../client';
import type { MailcoachContext } from '../index';
import type { MailcoachJsonValue } from './types';

export type MailcoachOperationSpec<I extends z.ZodType, O extends z.ZodType> = {
	inputSchema: I;
	outputSchema: O;
	method: MailcoachMethod;
	path: (input: z.output<I>) => string;
	query?: (
		input: z.output<I>,
	) => Record<string, MailcoachQueryValue> | undefined;
	body?: (
		input: z.output<I>,
	) => Record<string, MailcoachJsonValue | undefined> | undefined;
	nextPageUrl?: (input: z.output<I>) => string | undefined;
	riskLevel: 'read' | 'write' | 'destructive';
	description: string;
};

export type DefinedMailcoachOperation<
	I extends z.ZodType,
	O extends z.ZodType,
> = MailcoachOperationSpec<I, O> & {
	endpoint: CorsairEndpoint<MailcoachContext, z.input<I>, z.output<O>>;
};

export function defineMailcoachOperation<
	I extends z.ZodType,
	O extends z.ZodType,
>(spec: MailcoachOperationSpec<I, O>): DefinedMailcoachOperation<I, O> {
	const endpoint: CorsairEndpoint<
		MailcoachContext,
		z.input<I>,
		z.output<O>
	> = async (context, input) => {
		const parsedInput = spec.inputSchema.parse(input);
		// A key passed in the plugin options pairs with the options' apiUrl, never with a
		// team URL stored on the account, so a token is never sent to another team's host.
		const usesOptionsKey = context.options.key !== undefined;
		const accountApiUrl = usesOptionsKey
			? undefined
			: await context.keys?.get_api_url();
		const rawResponse = await makeMailcoachRequest<z.output<O>>(
			spec.path(parsedInput),
			context.key,
			{
				apiUrl: accountApiUrl ?? context.options.apiUrl,
				method: spec.method,
				query: spec.query?.(parsedInput),
				body: spec.body?.(parsedInput),
				nextPageUrl: spec.nextPageUrl?.(parsedInput),
			},
		);
		return spec.outputSchema.parse(rawResponse);
	};

	return { ...spec, endpoint };
}
