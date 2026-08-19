import type { CorsairEndpoint } from 'corsair/core';
import type { AttioContext } from '../index';
import type {
	GeneratedEndpointInputSchemas,
	GeneratedEndpointInputs,
	GeneratedEndpointOutputs,
} from './generated';

export type AttioEndpoint<K extends keyof GeneratedEndpointInputSchemas> =
	CorsairEndpoint<
		AttioContext,
		GeneratedEndpointInputs[K],
		GeneratedEndpointOutputs[K]
	>;
