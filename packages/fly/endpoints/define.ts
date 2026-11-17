import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { FlyRequest } from '../client';
import { makeFlyRequest } from '../client';
import type { FlyContext } from '../index';

export type Risk = 'read' | 'write' | 'destructive';

type Definition<I extends z.ZodType, O extends z.ZodType> = {
	input: I;
	output: O;
	riskLevel: Risk;
	description: string;
	/** Core adds "(irreversible)" to approval prompts for these. */
	irreversible?: boolean;
	/** Turn validated input into the HTTP request. */
	request: (args: z.output<I>) => FlyRequest;
	/** Reshape a body before the output schema parses it (empty 2xx bodies). */
	transform?: (body: unknown, args: z.output<I>) => unknown;
};

/**
 * One REST operation: validates the input, sends it with the stored key
 * (`ctx.key`), and parses the response with the output schema.
 */
export function defineOperation<I extends z.ZodType, O extends z.ZodType>(
	definition: Definition<I, O>,
) {
	const endpoint: CorsairEndpoint<FlyContext, z.input<I>, z.output<O>> = async (
		ctx,
		args,
	) => {
		const parsed = definition.input.parse(args ?? {});
		const body = await makeFlyRequest(ctx.key, definition.request(parsed));
		const shaped = definition.transform
			? definition.transform(body, parsed)
			: body;
		return definition.output.parse(shaped);
	};
	return { ...definition, endpoint };
}
