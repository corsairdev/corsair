import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Basics = {
	bookkeepingSystemVersion: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['basics.bookkeepingSystemVersion'],
		SevdeskEndpointOutputSchemas['basics.bookkeepingSystemVersion'],
		'basics.bookkeepingSystemVersion',
		'GET',
		'/Tools/bookkeepingSystemVersion',
	),
} as const;
