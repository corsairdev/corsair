import { z } from 'zod';
import {
	optNum,
	optStr,
	PaginationSchema,
	paginationInput,
	teamIdInput,
} from './common';

const domain = z
	.string()
	.min(1)
	.describe('Domain whose DNS zone is on Vercel, e.g. example.com.');
const recordId = z.string().min(1).describe('DNS record id (rec_…).');

const recordTypes = [
	'A',
	'AAAA',
	'ALIAS',
	'CAA',
	'CNAME',
	'HTTPS',
	'MX',
	'SRV',
	'TXT',
	'NS',
] as const;

const uint16 = () => z.number().int().min(0).max(65535);

const ttl = z
	.number()
	.int()
	.min(60)
	.max(2147483647)
	.describe('Time to live in seconds, 60 or more. Vercel defaults to 60.');
const comment = z.string().max(500).describe('Note on what the record is for.');

const recordBase = {
	teamId: teamIdInput,
	domain,
	name: z
		.string()
		.describe('Subdomain, e.g. www. An empty string means the root domain.'),
	ttl: ttl.optional(),
	comment: comment.optional(),
};

// One shape per record type, as the spec's body lists them. The spec leaves
// `name` out of the SRV, TXT and HTTPS shapes while still requiring it, and
// lets CNAME and NS go without a value; both are treated as required here.
const createRecordInput = z.discriminatedUnion('type', [
	z.object({
		...recordBase,
		type: z.literal('A'),
		value: z.ipv4().describe('IPv4 address, e.g. 192.0.2.42.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('AAAA'),
		value: z.ipv6().describe('IPv6 address, e.g. 2001:db8::42.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('ALIAS'),
		value: z
			.string()
			.min(1)
			.describe('Hostname resolved to A records on Vercel’s side.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('CAA'),
		value: z
			.string()
			.min(1)
			.describe('CAA value, e.g. 0 issue "letsencrypt.org".'),
	}),
	z.object({
		...recordBase,
		type: z.literal('CNAME'),
		value: z
			.string()
			.min(1)
			.describe('Domain the name points to, e.g. cname.vercel-dns.com.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('MX'),
		value: z.string().min(1).describe('Mail server, e.g. mail.example.com.'),
		mxPriority: uint16().describe('MX priority, 0-65535; lower is preferred.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('SRV'),
		srv: z
			.object({
				priority: uint16().nullable(),
				weight: uint16().nullable(),
				port: uint16().nullable(),
				target: z.string().min(1).describe('Target host.'),
			})
			.describe('SRV record data.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('TXT'),
		value: z.string().describe('Text value.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('NS'),
		name: z.string().min(1).describe('Subdomain to delegate.'),
		value: z.string().min(1).describe('Nameserver, e.g. ns1.example.com.'),
	}),
	z.object({
		...recordBase,
		type: z.literal('HTTPS'),
		https: z
			.object({
				priority: uint16().nullable(),
				target: z.string().min(1).describe('Target host.'),
				params: z.string().optional().describe('SvcParams, e.g. alpn=h2,h3.'),
			})
			.describe('HTTPS record data.'),
	}),
]);

const updateFields = {
	name: z.string().nullable().optional().describe('New subdomain.'),
	value: z.string().nullable().optional().describe('New value.'),
	type: z.enum(recordTypes).nullable().optional().describe('New record type.'),
	ttl: ttl.nullable().optional(),
	mxPriority: uint16().nullable().optional().describe('New MX priority.'),
	srv: z
		.object({
			target: z.string().max(255).nullable(),
			weight: uint16().nullable(),
			port: uint16().nullable(),
			priority: uint16().nullable(),
		})
		.nullable()
		.optional()
		.describe('New SRV data (all four fields).'),
	https: z
		.object({
			priority: uint16().nullable(),
			target: z.string().max(255).nullable(),
			params: z.string().nullable().optional(),
		})
		.nullable()
		.optional()
		.describe('New HTTPS record data.'),
	comment: comment.optional(),
};
const updateFieldNames = Object.keys(
	updateFields,
) as (keyof typeof updateFields)[];

// Responses: lenient, as live data drifts from the spec.

/** A record as GET /v5/domains/{domain}/records lists it. */
export const DnsRecordSchema = z
	.object({
		id: z.string(),
		name: optStr(),
		type: optStr(),
		value: optStr(),
		ttl: optNum(),
		mxPriority: optNum(),
		priority: optNum(),
		slug: optStr(),
		creator: optStr(),
		comment: optStr(),
		created: optNum(),
		createdAt: optNum(),
		updated: optNum(),
		updatedAt: optNum(),
	})
	.passthrough();

/** The record PATCH /v1/domains/records/{recordId} returns. */
export const UpdatedDnsRecordSchema = z
	.object({
		id: z.string(),
		name: optStr(),
		value: optStr(),
		recordType: optStr(),
		type: optStr(),
		ttl: optNum(),
		domain: optStr(),
		creator: optStr(),
		comment: optStr(),
		createdAt: optNum(),
	})
	.passthrough();

export const VercelDnsInputSchemas = {
	getRecords: z.object({
		teamId: teamIdInput,
		domain,
		...paginationInput,
	}),
	createRecord: createRecordInput,
	updateRecord: z
		.object({
			teamId: teamIdInput,
			recordId,
			...updateFields,
		})
		.refine(
			(input) => updateFieldNames.some((key) => input[key] !== undefined),
			{ message: 'Pass at least one field to change.' },
		),
	deleteRecord: z.object({
		teamId: teamIdInput,
		domain,
		recordId,
	}),
} as const;

export const VercelDnsOutputSchemas = {
	getRecords: z
		.object({
			records: z.array(DnsRecordSchema),
			pagination: PaginationSchema.nullable().optional(),
		})
		.passthrough(),
	// The spec documents { uid } and an older { uid?, updated }.
	createRecord: z.object({ uid: optStr(), updated: optNum() }).passthrough(),
	updateRecord: UpdatedDnsRecordSchema,
	deleteRecord: z.object({
		deleted: z.boolean(),
		domain: z.string(),
		recordId: z.string(),
	}),
} as const;

export type VercelDnsInputs = {
	[K in keyof typeof VercelDnsInputSchemas]: z.input<
		(typeof VercelDnsInputSchemas)[K]
	>;
};
export type VercelDnsOutputs = {
	[K in keyof typeof VercelDnsOutputSchemas]: z.infer<
		(typeof VercelDnsOutputSchemas)[K]
	>;
};
