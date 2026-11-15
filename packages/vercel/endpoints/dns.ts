import { makeAuthenticatedVercelRequest, seg } from '../client';
import { compactBody, defineEndpoint, pickQuery } from './common';
import {
	VercelDnsInputSchemas as In,
	VercelDnsOutputSchemas as Out,
} from './dns-types';

export const getRecords = defineEndpoint({
	event: 'vercel.dns.getRecords',
	input: In.getRecords,
	output: Out.getRecords,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v5/domains/${seg(input.domain)}/records`,
			ctx,
			{
				teamId: input.teamId,
				query: pickQuery(input, ['limit', 'since', 'until']),
			},
		),
});

export const createRecord = defineEndpoint({
	event: 'vercel.dns.createRecord',
	input: In.createRecord,
	output: Out.createRecord,
	run: async (ctx, input) => {
		const { teamId, domain, ...body } = input;
		return makeAuthenticatedVercelRequest(
			`/v2/domains/${seg(domain)}/records`,
			ctx,
			{ method: 'POST', teamId, body: compactBody(body) },
		);
	},
});

export const updateRecord = defineEndpoint({
	event: 'vercel.dns.updateRecord',
	input: In.updateRecord,
	output: Out.updateRecord,
	run: async (ctx, input) => {
		const { teamId, recordId, ...body } = input;
		return makeAuthenticatedVercelRequest(
			`/v1/domains/records/${seg(recordId)}`,
			ctx,
			{ method: 'PATCH', teamId, body: compactBody(body) },
		);
	},
});

export const deleteRecord = defineEndpoint({
	event: 'vercel.dns.deleteRecord',
	input: In.deleteRecord,
	output: Out.deleteRecord,
	run: async (ctx, input) => {
		await makeAuthenticatedVercelRequest(
			`/v2/domains/${seg(input.domain)}/records/${seg(input.recordId)}`,
			ctx,
			{ method: 'DELETE', teamId: input.teamId },
		);
		// Vercel answers with an empty object.
		return { deleted: true, domain: input.domain, recordId: input.recordId };
	},
});
