import type { z } from 'zod';
import type {
	EncodianEndpointInputSchemas,
	EncodianEndpointOutputSchemas,
} from './generated';

export {
	EncodianEndpointInputSchemas,
	EncodianEndpointOutputSchemas,
} from './generated';
export type EncodianOperationId = keyof typeof EncodianEndpointInputSchemas;
export type EncodianEndpointInputs = {
	[K in EncodianOperationId]: z.infer<(typeof EncodianEndpointInputSchemas)[K]>;
};
export type EncodianEndpointOutputs = {
	[K in EncodianOperationId]: z.infer<
		(typeof EncodianEndpointOutputSchemas)[K]
	>;
};
