import type { SignpathEndpoints } from '..';
import type { SignpathQuery } from '../client';
import { segment } from '../client';
import { assertBodyless, call, orgPath } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

/**
 * SignPath pages with a full URL in `pagination.nextLink` that already carries
 * every filter from the request. `corsair/http` joins `path` onto the API base
 * and appends `query`, so the base is stripped here and the query split out.
 *
 * Returns null for a URL that does not point at the API, which is what a
 * mistyped or stale cursor looks like.
 */
export function parseNextLink(
	nextLink: string,
): { path: string; query: SignpathQuery } | null {
	let url: URL;
	try {
		url = new URL(nextLink);
	} catch {
		return null;
	}
	if (!url.pathname.startsWith('/Api/')) return null;

	const query: SignpathQuery = {};
	for (const key of new Set(url.searchParams.keys())) {
		const values = url.searchParams.getAll(key);
		query[key] = values.length === 1 ? values[0] : values;
	}
	return { path: url.pathname.slice('/Api'.length), query };
}

export const list: SignpathEndpoints['signingRequestsList'] = (ctx, input) => {
	const {
		nextLink,
		signingRequestStatus,
		submittedAfter,
		submittedBefore,
		...filters
	} = Inputs.signingRequestsList.parse(input ?? {});

	const filtersQuery: SignpathQuery = {
		...filters,
		submittedAfter,
		submittedBefore,
		signingRequestStatus,
	};

	return call(
		ctx,
		{
			event: 'signingRequests.list',
			input: Inputs.signingRequestsList,
			output: Outputs.signingRequestsList,
		},
		input,
		(_, organizationId) => {
			if (nextLink) {
				const next = parseNextLink(nextLink);
				// A cursor from another account's organization would send that
				// organization's path with this account's token.
				const collection = orgPath(organizationId, '/SigningRequests');
				if (!next || next.path !== collection) {
					throw new Error(
						`signingRequests.list needs the nextLink SignPath returned for this organization, such as https://app.signpath.io/Api${collection}?...`,
					);
				}
				return { method: 'GET', path: next.path, query: next.query };
			}
			return {
				method: 'GET',
				path: orgPath(organizationId, '/SigningRequests'),
				query: filtersQuery,
			};
		},
		{
			log: (_, result) => ({ count: result.signingRequests.length }),
		},
	);
};

export const get: SignpathEndpoints['signingRequestsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'signingRequests.get',
			input: Inputs.signingRequestsGet,
			output: Outputs.signingRequestsGet,
		},
		input,
		({ signingRequestId }, organizationId) => ({
			method: 'GET',
			path: orgPath(
				organizationId,
				`/SigningRequests/${segment(signingRequestId)}`,
			),
		}),
		{
			log: ({ signingRequestId }, result) => ({
				signingRequestId,
				status: result.status,
			}),
		},
	);

export const getStatus: SignpathEndpoints['signingRequestsGetStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingRequests.getStatus',
			input: Inputs.signingRequestsGetStatus,
			output: Outputs.signingRequestsGetStatus,
		},
		input,
		({ signingRequestId }, organizationId) => ({
			method: 'GET',
			path: orgPath(
				organizationId,
				`/SigningRequests/${segment(signingRequestId)}/Status`,
			),
		}),
		{
			log: ({ signingRequestId }, result) => ({
				signingRequestId,
				status: result.status,
			}),
		},
	);

/**
 * SignPath takes the parameters map as flat `parameters.<name>` form fields,
 * not as a nested object, so a nested body would be ignored.
 */
function parameterFields(
	parameters: Record<string, string> | undefined,
): Record<string, string> {
	if (!parameters) return {};
	return Object.fromEntries(
		Object.entries(parameters).map(([name, value]) => [
			`parameters.${name}`,
			value,
		]),
	);
}

/** Core's formData builder sends `null` as the string "null", so drop empties. */
function compact(
	fields: Record<string, string | number | boolean | File | undefined>,
): Record<string, string | number | boolean | File> {
	const out: Record<string, string | number | boolean | File> = {};
	for (const [name, value] of Object.entries(fields)) {
		if (value !== undefined) out[name] = value;
	}
	return out;
}

export const submitWithArtifact: SignpathEndpoints['signingRequestsSubmitWithArtifact'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'signingRequests.submitWithArtifact',
				input: Inputs.signingRequestsSubmitWithArtifact,
				output: Outputs.signingRequestsSubmitWithArtifact,
			},
			input,
			(
				{
					projectSlug,
					signingPolicySlug,
					artifactConfigurationSlug,
					description,
					cancellationTimeoutInSeconds,
					artifactBase64,
					artifactFileName,
					artifactContentType,
					parameters,
				},
				organizationId,
			) => ({
				method: 'POST',
				path: orgPath(organizationId, '/SigningRequests/SubmitWithArtifact'),
				formData: compact({
					projectSlug,
					signingPolicySlug,
					artifactConfigurationSlug,
					description,
					cancellationTimeoutInSeconds,
					artifact: new File(
						[Buffer.from(artifactBase64, 'base64')],
						artifactFileName,
						{ type: artifactContentType ?? 'application/octet-stream' },
					),
					...parameterFields(parameters),
				}),
			}),
			{
				log: (_, result) => ({
					signingRequestId: result.signingRequestId,
					status: result.status,
				}),
			},
		);

export const submitWithArtifactRetrievalLink: SignpathEndpoints['signingRequestsSubmitWithArtifactRetrievalLink'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'signingRequests.submitWithArtifactRetrievalLink',
				input: Inputs.signingRequestsSubmitWithArtifactRetrievalLink,
				output: Outputs.signingRequestsSubmitWithArtifactRetrievalLink,
			},
			input,
			(
				{
					projectSlug,
					signingPolicySlug,
					artifactConfigurationSlug,
					description,
					cancellationTimeoutInSeconds,
					artifactUrl,
					artifactFileName,
					artifactSha256,
					httpHeaders,
					parameters,
				},
				organizationId,
			) => ({
				method: 'POST',
				path: orgPath(
					organizationId,
					'/SigningRequests/SubmitWithArtifactRetrievalLink',
				),
				formData: compact({
					projectSlug,
					signingPolicySlug,
					artifactConfigurationSlug,
					description,
					cancellationTimeoutInSeconds,
					'artifactRetrievalLink.url': artifactUrl,
					'artifactRetrievalLink.fileName': artifactFileName,
					'artifactRetrievalLink.sha256Hash': artifactSha256,
					...Object.fromEntries(
						Object.entries(httpHeaders ?? {}).map(([name, value]) => [
							`artifactRetrievalLink.httpHeaders.${name}`,
							value,
						]),
					),
					...parameterFields(parameters),
				}),
			}),
			{
				log: (_, result) => ({
					signingRequestId: result.signingRequestId,
					status: result.status,
				}),
			},
		);

export const submitWithoutArtifact: SignpathEndpoints['signingRequestsSubmitWithoutArtifact'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'signingRequests.submitWithoutArtifact',
				input: Inputs.signingRequestsSubmitWithoutArtifact,
				output: Outputs.signingRequestsSubmitWithoutArtifact,
			},
			input,
			(
				{
					projectSlug,
					signingPolicySlug,
					artifactConfigurationSlug,
					description,
					cancellationTimeoutInSeconds,
					artifactId,
					artifactSha256,
					parameters,
				},
				organizationId,
			) => ({
				method: 'POST',
				path: orgPath(organizationId, '/SigningRequests/SubmitWithoutArtifact'),
				formData: compact({
					projectSlug,
					signingPolicySlug,
					artifactConfigurationSlug,
					description,
					cancellationTimeoutInSeconds,
					'unsignedArtifactMetadata.fileName': artifactId,
					'unsignedArtifactMetadata.sha256Hash': artifactSha256,
					...parameterFields(parameters),
				}),
			}),
			{
				log: (_, result) => ({
					signingRequestId: result.signingRequestId,
					status: result.status,
				}),
			},
		);

export const signHash: SignpathEndpoints['signingRequestsSignHash'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingRequests.signHash',
			input: Inputs.signingRequestsSignHash,
			output: Outputs.signingRequestsSignHash,
		},
		input,
		(
			{
				projectSlug,
				signingPolicySlug,
				artifactConfigurationSlug,
				description,
				cancellationTimeoutInSeconds,
				...signingData
			},
			organizationId,
		) => ({
			method: 'POST',
			path: orgPath(organizationId, '/SigningRequests/SignHash'),
			body: {
				projectSlug,
				signingPolicySlug,
				artifactConfigurationSlug,
				description,
				cancellationTimeoutInSeconds,
				hashSigningData: signingData,
			},
		}),
		{
			log: (_, result) => ({ signingRequestId: result.signingRequestId }),
		},
	);

export const signMessage: SignpathEndpoints['signingRequestsSignMessage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingRequests.signMessage',
			input: Inputs.signingRequestsSignMessage,
			output: Outputs.signingRequestsSignMessage,
		},
		input,
		(
			{
				projectSlug,
				signingPolicySlug,
				artifactConfigurationSlug,
				description,
				cancellationTimeoutInSeconds,
				...signingData
			},
			organizationId,
		) => ({
			method: 'POST',
			path: orgPath(organizationId, '/SigningRequests/SignMessage'),
			body: {
				projectSlug,
				signingPolicySlug,
				artifactConfigurationSlug,
				description,
				cancellationTimeoutInSeconds,
				signingData,
			},
		}),
		{
			log: (_, result) => ({ signingRequestId: result.signingRequestId }),
		},
	);

/**
 * Location is `.../v1/<organizationId>/SigningRequests/<id>`; the id is the last
 * segment. Null when SignPath sent no Location, so the caller knows to list.
 */
export function signingRequestIdFromLocation(
	location: unknown, // unknown: the Location header, or undefined without one
): string | null {
	if (typeof location !== 'string' || location.length === 0) return null;
	const path = location.split(/[?#]/)[0] ?? '';
	const match = /\/SigningRequests\/([^/]+)\/?$/i.exec(path);
	return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export const resubmit: SignpathEndpoints['signingRequestsResubmit'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingRequests.resubmit',
			input: Inputs.signingRequestsResubmit,
			output: Outputs.signingRequestsResubmit,
		},
		input,
		(body, organizationId) => ({
			method: 'POST',
			path: orgPath(organizationId, '/SigningRequests/Resubmit'),
			body,
			// 201 with no body: the new request is only in Location.
			responseHeader: 'Location',
		}),
		{
			shape: (raw, { originalSigningRequestId, signingPolicySlug }) => ({
				signingRequestId: signingRequestIdFromLocation(raw),
				originalSigningRequestId,
				signingPolicySlug,
				resubmitted: true as const,
			}),
			log: ({ originalSigningRequestId, signingPolicySlug }, result) => ({
				signingRequestId: result.signingRequestId ?? undefined,
				originalSigningRequestId,
				signingPolicySlug,
			}),
		},
	);

export const cancel: SignpathEndpoints['signingRequestsCancel'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingRequests.cancel',
			input: Inputs.signingRequestsCancel,
			output: Outputs.signingRequestsCancel,
		},
		input,
		({ signingRequestId }, organizationId) => ({
			method: 'POST',
			path: orgPath(
				organizationId,
				`/SigningRequests/${segment(signingRequestId)}/Cancel`,
			),
		}),
		{
			shape: (raw, { signingRequestId }) => {
				assertBodyless(raw, 'signingRequests.cancel');
				return { signingRequestId, success: true as const };
			},
			log: ({ signingRequestId }) => ({ signingRequestId }),
		},
	);

export const approve: SignpathEndpoints['signingRequestsApprove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'signingRequests.approve',
			input: Inputs.signingRequestsApprove,
			output: Outputs.signingRequestsApprove,
		},
		input,
		({ signingRequestId }, organizationId) => ({
			method: 'POST',
			path: orgPath(
				organizationId,
				`/SigningRequests/${segment(signingRequestId)}/Approve`,
			),
		}),
		{
			shape: (raw, { signingRequestId }) => {
				assertBodyless(raw, 'signingRequests.approve');
				return { signingRequestId, success: true as const };
			},
			log: ({ signingRequestId }) => ({ signingRequestId }),
		},
	);

export const deny: SignpathEndpoints['signingRequestsDeny'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'signingRequests.deny',
			input: Inputs.signingRequestsDeny,
			output: Outputs.signingRequestsDeny,
		},
		input,
		({ signingRequestId, denyReason }, organizationId) => ({
			method: 'POST',
			path: orgPath(
				organizationId,
				`/SigningRequests/${segment(signingRequestId)}/Deny`,
			),
			body: { denyReason },
		}),
		{
			shape: (raw, { signingRequestId }) => {
				assertBodyless(raw, 'signingRequests.deny');
				return { signingRequestId, success: true as const };
			},
			log: ({ signingRequestId }) => ({ signingRequestId }),
		},
	);
