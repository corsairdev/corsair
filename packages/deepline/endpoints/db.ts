import { makeDeeplineRequest } from '../client';
import { defineEndpoint } from './common';
import {
	QueryCustomerDbInputSchema,
	QueryCustomerDbOutputSchema,
} from './types-runs';

export const query = defineEndpoint({
	event: 'deepline.db.query',
	input: QueryCustomerDbInputSchema,
	output: QueryCustomerDbOutputSchema,
	run: async (ctx, input) => {
		const result = await makeDeeplineRequest(`/api/v2/db/query`, ctx.key, {
			method: 'POST',
			body: {
				sql: input.sql,
				max_rows: input.maxRows,
				operation_key: input.operationKey,
			},
		});
		if (input.operationKey !== undefined) {
			// A keyed write is only settled when the server acknowledges that key.
			const operation = (result as { operation?: { operation_key?: unknown } })
				?.operation;
			if (operation?.operation_key !== input.operationKey) {
				throw new Error(
					'Deepline did not confirm the keyed SQL operation; resend the same SQL and operationKey to recover',
				);
			}
		}
		return result;
	},
});
