import { z } from 'zod';
import { seg } from '../client';
import { defineOperation } from './define';
import {
	appName,
	certificateCheck,
	certificateDetail,
	certificateSummary,
	nonEmpty,
} from './schemas';

const hostname = nonEmpty.describe(
	'Hostname, such as example.com or *.example.com',
);
const certPath = (app_name: string, host: string, suffix = '') =>
	`/v1/apps/${seg(app_name)}/certificates/${seg(host)}${suffix}`;

export const certificates = {
	list: defineOperation({
		description: "List an app's custom-domain certificates",
		riskLevel: 'read',
		input: z.object({
			app_name: appName,
			filter: z.string().min(1).optional().describe('Hostname substring'),
			cursor: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(500).optional(),
		}),
		output: z.object({
			certificates: z.array(certificateSummary),
			next_cursor: z.string().nullish(),
			total_count: z.number().int().nullish(),
		}),
		request: ({ app_name, ...query }) => ({
			method: 'GET',
			path: `/v1/apps/${seg(app_name)}/certificates`,
			query,
		}),
	}),
	get: defineOperation({
		description:
			'Get a certificate with the DNS records to create and its validation state',
		riskLevel: 'read',
		input: z.object({ app_name: appName, hostname }),
		output: certificateDetail,
		request: ({ app_name, hostname: host }) => ({
			method: 'GET',
			path: certPath(app_name, host),
		}),
	}),
	request: defineOperation({
		description:
			'Add a hostname to an app and request Fly-issued (ACME) certificates for it. Fly bills certificates beyond the free allowance.',
		riskLevel: 'destructive',
		input: z.object({
			app_name: appName,
			hostname: hostname.refine(
				(value) => !/(^|\.)fly\.dev$/i.test(value),
				'Hostnames under fly.dev are not allowed',
			),
		}),
		output: certificateDetail,
		request: ({ app_name, hostname: host }) => ({
			method: 'POST',
			path: `/v1/apps/${seg(app_name)}/certificates/acme`,
			body: { hostname: host },
		}),
	}),
	check: defineOperation({
		description: "Look up a hostname's DNS now and re-validate its certificate",
		riskLevel: 'write',
		input: z.object({ app_name: appName, hostname }),
		output: certificateCheck,
		request: ({ app_name, hostname: host }) => ({
			method: 'POST',
			path: certPath(app_name, host, '/check'),
		}),
	}),
	delete: defineOperation({
		description: 'Remove a hostname and all its certificates from an app',
		riskLevel: 'destructive',
		irreversible: true,
		input: z.object({ app_name: appName, hostname }),
		// Fly answers 204 with no body.
		output: z.object({ hostname: z.string(), deleted: z.literal(true) }),
		request: ({ app_name, hostname: host }) => ({
			method: 'DELETE',
			path: certPath(app_name, host),
		}),
		transform: (_body, { hostname: host }) => ({
			hostname: host,
			deleted: true,
		}),
	}),
};
