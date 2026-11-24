import type { z } from 'zod';
import type { MozInputSchema, MozOutputSchema } from './call';
import { mozInputSchema, mozOutputSchema } from './call';
import type { MozOperationName } from './manifest';
import { mozMethods } from './manifest';

// Every schema is built on first read (see call.ts), so these maps hold
// getters rather than schemas.
function lazyMap<T>(read: (name: MozOperationName) => T) {
	const map = {} as Record<MozOperationName, T>;
	for (const name of Object.keys(mozMethods) as MozOperationName[]) {
		Object.defineProperty(map, name, {
			enumerable: true,
			get: () => read(name),
		});
	}
	return map;
}

export const MozEndpointInputSchemas = lazyMap(mozInputSchema) as {
	[N in MozOperationName]: MozInputSchema<N>;
};

export const MozEndpointOutputSchemas = lazyMap(mozOutputSchema) as {
	[N in MozOperationName]: MozOutputSchema<N>;
};

export type MozEndpointInputs = {
	[N in MozOperationName]: z.input<MozInputSchema<N>>;
};

export type MozEndpointOutputs = {
	[N in MozOperationName]: z.output<MozOutputSchema<N>>;
};
