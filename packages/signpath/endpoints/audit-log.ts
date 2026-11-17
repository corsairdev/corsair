import type { SignpathEndpoints } from '..';
import { call } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The audit log routes live under `v1-pre` rather than `v1`: SignPath keeps
 * them at a preview path, so `orgPath` (which builds `v1` paths) cannot be
 * used here. Both answer the same envelope and take the same query.
 */
export const listEvents: SignpathEndpoints['auditLogListEvents'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'auditLog.listEvents',
			input: Inputs.auditLogListEvents,
			output: Outputs.auditLogListEvents,
		},
		input,
		({ cursor, startTime }, organizationId) => ({
			method: 'GET',
			path: `/v1-pre/${encodeURIComponent(organizationId)}/AuditLog/Events`,
			query: { cursor, startTime },
		}),
		{ log: (_, result) => ({ count: result.auditLogEvents.length }) },
	);

export const listSigningRequestEvents: SignpathEndpoints['auditLogListSigningRequestEvents'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'auditLog.listSigningRequestEvents',
				input: Inputs.auditLogListSigningRequestEvents,
				output: Outputs.auditLogListSigningRequestEvents,
			},
			input,
			({ cursor, startTime }, organizationId) => ({
				method: 'GET',
				path: `/v1-pre/${encodeURIComponent(organizationId)}/AuditLog/SigningRequestEvents`,
				query: { cursor, startTime },
			}),
			{ log: (_, result) => ({ count: result.auditLogEvents.length }) },
		);
