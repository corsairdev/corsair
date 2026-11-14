import { connectHost, defineOperation } from './runtime';
import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './types';

const apiKey = defineOperation(
	'connectByApiKey',
	FormdeskEndpointInputSchemas.connectByApiKey,
	FormdeskEndpointOutputSchemas.connectByApiKey,
	(input) => ({
		host: connectHost(),
		domain: input.domain,
		path: '/connect',
		method: 'GET',
		retryable: true,
	}),
);

const credentials = defineOperation(
	'connectWithCredentials',
	FormdeskEndpointInputSchemas.connectWithCredentials,
	FormdeskEndpointOutputSchemas.connectWithCredentials,
	(input) => ({
		host: connectHost(),
		path: '/connect',
		method: 'POST',
		body: {
			domain: input.domain,
			username: input.username,
			password: input.password,
		},
		public: true,
		retryable: false,
	}),
);

export const Connect = { apiKey, credentials };
