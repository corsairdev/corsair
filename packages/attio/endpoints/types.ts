import type { CorsairEndpoint } from 'corsair/core';
import type { AttioContext } from '../index';
import type {
	GeneratedEndpointInputs,
	GeneratedEndpointOutputs,
} from './generated';
import {
	GeneratedEndpointInputSchemas,
	GeneratedEndpointOutputSchemas,
} from './generated';

export const EndpointInputSchemas = GeneratedEndpointInputSchemas;
export const EndpointOutputSchemas = GeneratedEndpointOutputSchemas;

export type AttioEndpoint<
	K extends keyof typeof GeneratedEndpointInputSchemas,
> = CorsairEndpoint<
	AttioContext,
	GeneratedEndpointInputs[K],
	GeneratedEndpointOutputs[K]
>;
