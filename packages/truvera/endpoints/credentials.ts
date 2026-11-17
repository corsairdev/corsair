import type { TruveraEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	TruveraEndpointInputSchemas,
	TruveraEndpointOutputSchemas,
} from './types';

export const issue: TruveraEndpoints['credentialsIssue'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'credentials.issue',
			input: TruveraEndpointInputSchemas.issueCredential,
			output: TruveraEndpointOutputSchemas.issueCredential,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'credentials',
			body: {
				credential: {
					...parsed.credential,
					// The API is camelCase here; the input is snake_case.
					...(parsed.credential.issuanceDate === undefined
						? {}
						: { issuanceDate: parsed.credential.issuanceDate }),
				},
				...(parsed.persist === undefined ? {} : { persist: parsed.persist }),
				...(parsed.password === undefined ? {} : { password: parsed.password }),
				...(parsed.recipient_did === undefined
					? {}
					: { recipientDID: parsed.recipient_did }),
				...(parsed.recipient_email === undefined
					? {}
					: { recipientEmail: parsed.recipient_email }),
				...(parsed.algorithm === undefined
					? {}
					: { algorithm: parsed.algorithm }),
				...(parsed.distribute === undefined
					? {}
					: { distribute: parsed.distribute }),
				...(parsed.format === undefined ? {} : { format: parsed.format }),
				...(parsed.revocable === undefined
					? {}
					: { revocable: parsed.revocable }),
			},
		}),
		{
			log: (parsed, result) => ({
				issuer: parsed.credential.issuer,
				format: parsed.format ?? 'jsonld',
				// The credential's own id, which is what a later revoke or delete
				// takes. Never the credential body.
				credential_id: result.id ?? undefined,
			}),
		},
	);

export const list: TruveraEndpoints['credentialsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'credentials.list',
			input: TruveraEndpointInputSchemas.listCredentials,
			output: TruveraEndpointOutputSchemas.listCredentials,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'credentials',
			query: {
				offset: parsed.offset,
				limit: parsed.limit,
				filter: parsed.filter,
				subjectId: parsed.subject_id,
			},
		}),
		{
			log: (parsed, result) => ({
				offset: parsed.offset ?? 0,
				credentials: result.length,
			}),
		},
	);

export const get: TruveraEndpoints['credentialsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'credentials.get',
			input: TruveraEndpointInputSchemas.getCredential,
			output: TruveraEndpointOutputSchemas.getCredential,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `credentials/${segment(parsed.credential_id)}`,
		}),
		{ log: (parsed) => ({ credential_id: parsed.credential_id }) },
	);

export const remove: TruveraEndpoints['credentialsDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credentials.delete',
			input: TruveraEndpointInputSchemas.deleteCredential,
			output: TruveraEndpointOutputSchemas.deleteCredential,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `credentials/${segment(parsed.credential_id)}`,
			query: { password: parsed.password },
		}),
		{ log: (parsed) => ({ credential_id: parsed.credential_id }) },
	);

export const revoke: TruveraEndpoints['credentialsRevoke'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credentials.revoke',
			input: TruveraEndpointInputSchemas.revokeCredential,
			output: TruveraEndpointOutputSchemas.revokeCredential,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `credentials/${segment(parsed.credential_id)}/revoke`,
		}),
		{ log: (parsed) => ({ credential_id: parsed.credential_id }) },
	);

export const unrevoke: TruveraEndpoints['credentialsUnrevoke'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credentials.unrevoke',
			input: TruveraEndpointInputSchemas.unrevokeCredential,
			output: TruveraEndpointOutputSchemas.unrevokeCredential,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `credentials/${segment(parsed.credential_id)}/unrevoke`,
		}),
		{ log: (parsed) => ({ credential_id: parsed.credential_id }) },
	);
