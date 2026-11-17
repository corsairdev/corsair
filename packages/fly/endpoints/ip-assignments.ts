import { z } from 'zod';
import { seg } from '../client';
import { defineOperation } from './define';
import { appName, ipAssignment, nonEmpty } from './schemas';

export const ipAssignments = {
	list: defineOperation({
		description:
			"List an app's IP addresses, including its shared IPv4 and egress addresses",
		riskLevel: 'read',
		input: z.object({ app_name: appName }),
		output: z.object({ ips: z.array(ipAssignment) }),
		request: ({ app_name }) => ({
			method: 'GET',
			path: `/v1/apps/${seg(app_name)}/ip_assignments`,
		}),
	}),
	create: defineOperation({
		description:
			'Assign an IP address to an app. Dedicated IPv4 and egress addresses are billed monthly; shared_v4, v6 and private_v6 are free.',
		riskLevel: 'destructive',
		input: z.object({
			app_name: appName,
			type: z.enum([
				'v4',
				'v6',
				'shared_v4',
				'private_v6',
				'egress_v4',
				'egress_v6',
				'egress_pair',
			]),
			region: z
				.string()
				.min(1)
				.optional()
				.describe('Required for egress types; v4 and v6 default to global'),
			service_name: z.string().min(1).optional(),
			network: z.string().min(1).optional().describe('Only for private_v6'),
			org_slug: z.string().min(1).optional().describe('Only for private_v6'),
		}),
		output: ipAssignment,
		request: ({ app_name, ...body }) => ({
			method: 'POST',
			path: `/v1/apps/${seg(app_name)}/ip_assignments`,
			body,
		}),
	}),
	delete: defineOperation({
		description:
			'Release an IP address from an app. A released address cannot be got back.',
		riskLevel: 'destructive',
		irreversible: true,
		input: z.object({ app_name: appName, ip: nonEmpty.describe('IP address') }),
		// Fly answers 204 with no body.
		output: z.object({ ip: z.string(), released: z.literal(true) }),
		request: ({ app_name, ip }) => ({
			method: 'DELETE',
			path: `/v1/apps/${seg(app_name)}/ip_assignments/${seg(ip)}`,
		}),
		transform: (_body, { ip }) => ({ ip, released: true }),
	}),
};
