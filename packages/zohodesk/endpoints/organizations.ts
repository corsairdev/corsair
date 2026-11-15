import type { ZohoDeskEndpoints } from '..';
import { zohoDeskCall } from './call';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './types';

export const list: ZohoDeskEndpoints['organizationsList'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.organizations.list',
		input: ZohoDeskEndpointInputSchemas.organizationsList,
		output: ZohoDeskEndpointOutputSchemas.organizationsList,
		empty: { data: [] },
		toRequest: () => ({ path: '/organizations', withoutOrg: true }),
	});
