import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest, UnioneAPIError } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

const ACTION_PATH = {
	get_dns_records: 'domain/get-dns-records.json',
	validate_verification: 'domain/validate-verification-record.json',
	validate_dkim: 'domain/validate-dkim.json',
	list: 'domain/list.json',
} as const;

export const manage: UnioneEndpoints['domain']['manage'] = async (
	ctx,
	input,
) => {
	if (input.action !== 'list' && !input.domain) {
		throw new UnioneAPIError(
			`domain is required for domain action "${input.action}"`,
		);
	}

	const path = ACTION_PATH[input.action];
	const body = input.action === 'list' ? {} : { domain: input.domain };

	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['domainManage']
	>(path, ctx.key, { body });

	if (input.action === 'list') {
		for (const domain of response.domains ?? []) {
			await maybeUpsert(ctx.db.domains, domain.domain, {
				domain: domain.domain,
				verification_status: domain['verification-record']?.status,
				verification_value: domain['verification-record']?.value,
				dkim_status: domain.dkim?.status,
				dkim_key: domain.dkim?.key,
			});
		}
	} else if (input.domain) {
		await maybeUpsert(ctx.db.domains, input.domain, {
			domain: input.domain,
		});
	}

	await logEventFromContext(
		ctx,
		'unione.domain.manage',
		{ action: input.action, domain: input.domain },
		'completed',
	);
	return response;
};

/**
 * Kept out of `manage` so deleting a sender domain carries its own destructive
 * classification - folding it into the multiplexed operation would force the
 * read actions (list, DNS records, verification checks) to inherit it.
 */
export const remove: UnioneEndpoints['domain']['delete'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['domainDelete']
	>('domain/delete.json', ctx.key, { body: { domain: input.domain } });

	await logEventFromContext(
		ctx,
		'unione.domain.delete',
		{ ...input },
		'completed',
	);
	return response;
};
