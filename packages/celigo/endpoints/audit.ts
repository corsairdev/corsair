import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['auditList'] = (ctx, input) =>
	callCeligo(ctx, 'audit.list', In.auditList, Out.auditList, input, (i) => ({
		method: 'GET',
		path: ['audit'],
		query: {
			limit: i.limit,
			after: i.after,
			resourceType: i.resourceType,
			_resourceId: i._resourceId,
			_byUserId: i._byUserId,
			source: i.source,
			fieldPath: i.fieldPath,
			action: i.action,
			from: i.from,
			to: i.to,
		},
		empty: [],
	}));
