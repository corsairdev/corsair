import { logEventFromContext } from 'corsair/core';
import type { CarboneEndpoints } from '../index';
import type { SetApiVersionOutput } from './types';

export const setApiVersion: CarboneEndpoints['setApiVersion'] = async (
	ctx,
	input,
) => {
	if (ctx.options) {
		ctx.options.version = input.version;
	}

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
