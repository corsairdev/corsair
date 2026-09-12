import type { ClassmarkerEndpoints } from '..';
import { runClassmarkerEndpoint } from './helpers';
import {
	AccessCodesResponseOutputSchema,
	AddAccessCodesInputSchema,
	DeleteAccessCodesInputSchema,
} from './types';

export const addAccessCodes: ClassmarkerEndpoints['addAccessCodes'] = async (
	ctx,
	input,
) => {
	const parsedInput = AddAccessCodesInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'addAccessCodes',
		path: `/v1/accesslists/${parsedInput.access_list_id}.json`,
		method: 'POST',
		input: parsedInput,
		inputSchema: AddAccessCodesInputSchema,
		outputSchema: AccessCodesResponseOutputSchema,
		body: parsedInput.access_codes,
	});
};

export const deleteAccessCodes: ClassmarkerEndpoints['deleteAccessCodes'] =
	async (ctx, input) => {
		const parsedInput = DeleteAccessCodesInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'deleteAccessCodes',
			path: `/v1/accesslists/${parsedInput.access_list_id}.json`,
			method: 'DELETE',
			input: parsedInput,
			inputSchema: DeleteAccessCodesInputSchema,
			outputSchema: AccessCodesResponseOutputSchema,
			body: parsedInput.access_codes,
		});
	};
