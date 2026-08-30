import { logEventFromContext } from 'corsair/core';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpoints } from '../index';
import { safely } from './persist';
import type { SecuritytrailsEndpointOutputs } from './types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './types';

/**
 * `GET /v2/company/{domain}/associated-ips` — CIDR blocks attributed to a
 * company, paginated with `page` / `page_size`.
 *
 * This lives on the v2 surface, not v1.
 * https://docs.securitytrails.com/reference/get-company-associated-ips
 */
export const associatedIps: SecuritytrailsEndpoints['companyAssociatedIps'] =
	async (ctx, input) => {
		const parsed =
			SecuritytrailsEndpointInputSchemas.companyAssociatedIps.parse(input);

		const response = await makeSecuritytrailsRequest<
			SecuritytrailsEndpointOutputs['companyAssociatedIps']
		>(`company/${encodeURIComponent(parsed.domain)}/associated-ips`, ctx.key, {
			method: 'GET',
			version: 'v2',
			query: { page: parsed.page, page_size: parsed.page_size },
			schema: SecuritytrailsEndpointOutputSchemas.companyAssociatedIps,
		});

		if (response?.records?.length && ctx.db.companyIpRanges) {
			for (const record of response.records) {
				if (!record.cidr) continue;

				// The provider returns bare CIDR blocks with no id, so scope the key
				// by company to keep two companies' ranges from overwriting one another.
				const entityId = `${parsed.domain}:${record.cidr}`;
				await safely(`company ip range ${entityId}`, () =>
					ctx.db.companyIpRanges.upsertByEntityId(entityId, {
						id: entityId,
						domain: parsed.domain,
						cidr: record.cidr as string,
					}),
				);
			}
		}

		await logEventFromContext(
			ctx,
			'securitytrails.company.associatedIps',
			{ ...parsed },
			'completed',
		);

		return response;
	};
