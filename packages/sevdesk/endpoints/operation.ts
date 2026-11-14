import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import type { SevdeskHttpMethod } from '../client';
import { makeSevdeskRequest } from '../client';
import type { SevdeskContext } from '../index';

export const NON_REPLAYABLE_GETS = new Set([
	'creditNote.sendCreditNoteByPrinting',
	'creditNote.creditNoteGetPdf',
	'export.exportDatevDepricated',
	'export.exportDatevCSV',
	'export.exportDatevXML',
	'export.generateDownloadHash',
	'invoice.invoiceGetPdf',
	'order.orderGetPdf',
]);

export function createSevdeskEndpoint<
	Input extends {
		path?: object;
		query?: object;
		body?: object;
		resourceVersion?: string;
	},
	Output,
>(
	inputSchema: ZodType<Input>,
	outputSchema: ZodType<Output>,
	operation: string,
	method: SevdeskHttpMethod,
	route: string,
): CorsairEndpoint<SevdeskContext, Input, Output> {
	return async (ctx, input) => {
		const parsedInput = inputSchema.parse(input);
		// JSON is provider-controlled until the operation output schema validates it.
		const response = await makeSevdeskRequest<unknown>(method, route, ctx.key, {
			path: parsedInput.path,
			query: parsedInput.query,
			body: parsedInput.body,
			resourceVersion:
				parsedInput.resourceVersion ?? ctx.options.resourceVersion,
			replayable: method === 'GET' && !NON_REPLAYABLE_GETS.has(operation),
		});
		const parsedOutput = outputSchema.parse(response);
		await logEventFromContext(ctx, 'sevdesk.' + operation, {}, 'completed');
		return parsedOutput;
	};
}
