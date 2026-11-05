import type { InstantlyEndpoints } from '..';
import { call } from './call';

export const list: InstantlyEndpoints['auditLogsList'] = (ctx, input) =>
	call(
		ctx,
		'auditLogsList',
		'auditLogs.list',
		input,
		(query) => ({ method: 'GET', path: '/audit-logs', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);
