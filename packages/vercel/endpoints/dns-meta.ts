import type { EndpointMeta } from './common';

export const vercelDnsMeta = {
	getRecords: {
		riskLevel: 'read',
		description:
			"List the DNS records in a domain's Vercel DNS zone, 20 per page by default. Empty when the domain's DNS is hosted elsewhere (check serviceType with domains.getDomain). For the next page pass pagination.next as until.",
	},
	createRecord: {
		riskLevel: 'write',
		description:
			'Add a DNS record to a domain whose DNS is on Vercel. Fields depend on type: A, AAAA, ALIAS, CAA, CNAME, TXT and NS take value; MX takes value and mxPriority; SRV takes srv; HTTPS takes https. Takes effect on live traffic and email.',
	},
	updateRecord: {
		riskLevel: 'write',
		description:
			'Change an existing DNS record by id (from getRecords): name, value, type, TTL, MX priority, SRV or HTTPS data, comment. Takes effect on live traffic and email; read the record first to be able to restore it.',
	},
	deleteRecord: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a DNS record from a domain. Takes effect on live traffic and email, and the record cannot be restored, only recreated with a new id.',
	},
} as const satisfies Record<string, EndpointMeta>;
