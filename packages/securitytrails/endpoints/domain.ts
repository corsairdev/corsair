import { logEventFromContext } from 'corsair/core';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpoints } from '../index';
import { earliestDate, fromUnixSeconds, safely } from './persist';
import type { SecuritytrailsEndpointOutputs } from './types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './types';

/**
 * `GET /v1/domain/{hostname}` — current DNS plus co-occurrence statistics.
 * https://docs.securitytrails.com/reference/get-domain-old-1
 */
export const get: SecuritytrailsEndpoints['domainGet'] = async (ctx, input) => {
	// The binder does not parse endpoint inputs, so validate here or an untyped
	// caller could send an empty hostname straight into the request path.
	const { hostname } =
		SecuritytrailsEndpointInputSchemas.domainGet.parse(input);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['domainGet']
	>(`domain/${encodeURIComponent(hostname)}`, ctx.key, {
		method: 'GET',
		schema: SecuritytrailsEndpointOutputSchemas.domainGet,
	});

	if (response && ctx.db.domains) {
		const dns = response.current_dns;
		await safely(`domain ${hostname}`, () =>
			ctx.db.domains.upsertByEntityId(hostname, {
				id: hostname,
				hostname: response.hostname ?? hostname,
				alexa_rank: response.alexa_rank ?? null,
				ipv4: dns?.a?.values?.map((value) => value.ip ?? '').filter(Boolean),
				ipv6: dns?.aaaa?.values?.map((value) => value.ip ?? '').filter(Boolean),
				mail_hosts: dns?.mx?.values
					?.map((value) => value.host ?? '')
					.filter(Boolean),
				nameservers: dns?.ns?.values
					?.map((value) => value.nameserver ?? '')
					.filter(Boolean),
				soa_emails: dns?.soa?.values
					?.map((value) => value.email ?? '')
					.filter(Boolean),
				txt_values: dns?.txt?.values
					?.map((value) => value.value ?? '')
					.filter(Boolean),
				dns_first_seen: earliestDate([
					dns?.a?.first_seen,
					dns?.aaaa?.first_seen,
					dns?.mx?.first_seen,
					dns?.ns?.first_seen,
					dns?.soa?.first_seen,
					dns?.txt?.first_seen,
				]),
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'securitytrails.domain.get',
		{ hostname },
		'completed',
	);

	return response;
};

/**
 * `GET /v1/domain/{hostname}/ssl` — current and historical certificates.
 * Paginated via `page`; `meta.max_page` reports how many pages exist.
 * https://docs.securitytrails.com/reference/get-domain-ssl-data-old-1
 */
export const ssl: SecuritytrailsEndpoints['domainSsl'] = async (ctx, input) => {
	const query = SecuritytrailsEndpointInputSchemas.domainSsl.parse(input);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['domainSsl']
	>(`domain/${encodeURIComponent(query.hostname)}/ssl`, ctx.key, {
		method: 'GET',
		query: {
			include_subdomains: query.include_subdomains,
			status: query.status,
			page: query.page,
		},
		schema: SecuritytrailsEndpointOutputSchemas.domainSsl,
	});

	if (response?.records?.length && ctx.db.certificates) {
		for (const record of response.records) {
			// Without a fingerprint there is no stable key, so skip rather than
			// invent one. The id is scoped by hostname because one SAN
			// certificate serves many hosts and each lookup is its own
			// observation; see SecuritytrailsCertificate in ../schema/database.
			const fingerprint = record.fingerprints?.sha256;
			if (!fingerprint) continue;

			const entityId = `${query.hostname}:${fingerprint}`;
			await safely(`certificate ${entityId}`, () =>
				ctx.db.certificates.upsertByEntityId(entityId, {
					id: entityId,
					hostname: query.hostname,
					dns_names: record.dns_names,
					sha1: record.fingerprints?.sha1 ?? null,
					sha256: fingerprint,
					issuer_common_name: record.issuer?.common_name ?? null,
					issuer_country: record.issuer?.country,
					issuer_organization: record.issuer?.organization,
					serial_number: record.serial_number ?? null,
					not_before: fromUnixSeconds(record.not_before),
					not_after: fromUnixSeconds(record.not_after),
				}),
			);
		}
	}

	await logEventFromContext(
		ctx,
		'securitytrails.domain.ssl',
		{ ...query },
		'completed',
	);

	return response;
};
