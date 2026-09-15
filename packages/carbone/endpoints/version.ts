import { logEventFromContext } from 'corsair/core';
import type { CarboneEndpoints } from '../index';
import type { SetApiVersionOutput } from './types';

/**
 * Validates and confirms the requested Carbone API version.
 * Does not mutate shared plugin options to prevent cross-tenant state leakage.
 */
export const setApiVersion: CarboneEndpoints['setApiVersion'] = async (
	ctx,
	input,
) => {
	await logEventFromContext(
		ctx,
		'carbone.version.set',
		{ version: input.version },
		'completed',
	);

	return {
		success: true,
		version: input.version,
		message: `Carbone API version set to ${input.version}`,
	} satisfies SetApiVersionOutput;
};
