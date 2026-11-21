import type { z } from 'zod';
import type { FreeAgentPaginationHeaders } from '../client';
import { makeFreeAgentPaginatedRequest, makeFreeAgentRequest } from '../client';
import type { FreeAgentContext } from '../index';

type OperationOptions<
	Input extends z.ZodType,
	Output extends z.ZodType,
	Data extends z.ZodType,
> = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: (input: z.infer<Input>) => string;
	query?: (
		input: z.infer<Input>,
	) => Record<string, string | number | boolean | undefined>;
	// `unknown` is necessary because JSON request envelopes differ by resource.
	body?: (input: z.infer<Input>) => Record<string, unknown>;
	apiVersion?: string;
	paginated?: {
		data: Data;
		combine: (
			data: z.infer<Data>,
			pagination: FreeAgentPaginationHeaders,
		) => z.infer<Output>;
	};
};

export function defineOperation<
	Input extends z.ZodType,
	Output extends z.ZodType,
	Data extends z.ZodType = z.ZodType,
>(
	inputSchema: Input,
	outputSchema: Output,
	options: OperationOptions<Input, Output, Data>,
): (ctx: FreeAgentContext, input: z.input<Input>) => Promise<z.infer<Output>> {
	return async (ctx, input) => {
		const parsed = inputSchema.parse(input);
		if (options.paginated) {
			const response = await makeFreeAgentPaginatedRequest(
				options.path(parsed),
				ctx,
				options.query?.(parsed) ?? {},
				options.paginated.data,
				{ apiVersion: options.apiVersion },
			);
			const data = options.paginated.data.parse(response.data);
			return outputSchema.parse(
				options.paginated.combine(data, response.pagination),
			);
		}
		const response = await makeFreeAgentRequest(options.path(parsed), ctx, {
			method: options.method,
			query: options.query?.(parsed),
			body: options.body?.(parsed),
			apiVersion: options.apiVersion,
		});
		return outputSchema.parse(response);
	};
}
