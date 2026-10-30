// Request inputs and response bodies for every spec-backed endpoint, built from
// the GMI Cloud OpenAPI specs (https://docs.gmicloud.ai/api-spec/*.yaml) and their examples.
// fixtures/ is git-ignored in this repo, so samples live here.

export type SpecCase = {
	// unknown: each endpoint has its own input shape; the endpoint's zod schema checks it.
	input: Record<string, unknown>;
	request: {
		method: string;
		url: string;
		// unknown: query and body values are whatever the spec defines for the op.
		query?: Record<string, unknown>;
		headers?: Record<string, unknown>;
		body?: unknown;
	};
	// unknown: the raw response body, parsed by the endpoint's output schema.
	response: unknown;
	contentType: string;
};

export const SPEC_CASES: Record<string, SpecCase> = {
	'apiKeys.getCurrent': {
		input: {},
		request: {
			method: 'GET',
			url: 'v1/me/api-keys/current',
		},
		response: {
			key: {
				id: '550e8400-e29b-41d4-a716-446655440000',
				type: 'ie_model',
				scope: 'ie_model',
				owner: {
					id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
				},
			},
			organization: {
				id: '066daf34-08e8-40fe-a384-4248bcff5842',
			},
		},
		contentType: 'application/json',
	},
	'idcs.list': {
		input: {},
		request: {
			method: 'GET',
			url: 'v1/idcs',
		},
		response: {
			idcs: [
				{
					idcId: 'us-denver-1',
					name: 'Denver IDC-1',
					country: 'US',
					countrySubdivision: 'US-CO',
					status: 'available',
				},
			],
		},
		contentType: 'application/json',
	},
	'baremetals.list': {
		input: {
			idc: 'us-denver-1',
		},
		request: {
			method: 'GET',
			url: 'v1/baremetals',
			query: {
				idc: 'us-denver-1',
			},
		},
		response: [
			{
				associatedFirewalls: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				consoleReady: true,
				createdAt: '2026-10-26T09:30:00Z',
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				idc: 'us-denver-1',
				image: 'sample-image',
				imageId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				name: 'sample-name',
				networks: [
					{
						ip: '203.0.113.10',
						type: 'internal',
					},
				],
				orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				product: 'container.h200.x1',
				reason: 'sample-reason',
				status: 'creating',
			},
		],
		contentType: 'application/json',
	},
	'baremetals.create': {
		input: {
			count: 1,
			enableZabbixAgent: true,
			idc: 'us-denver-1',
			imageId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			internalIp: '203.0.113.10',
			name: 'sample name',
			product: 'container.h200.x1',
			sshKey: 'sample-sshKey',
			sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
		},
		request: {
			method: 'POST',
			url: 'v1/baremetals',
			body: {
				count: 1,
				enableZabbixAgent: true,
				idc: 'us-denver-1',
				imageId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				internalIp: '203.0.113.10',
				name: 'sample name',
				product: 'container.h200.x1',
				sshKey: 'sample-sshKey',
				sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			},
		},
		response: [
			{
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			},
		],
		contentType: 'application/json',
	},
	'baremetals.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/baremetals/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			associatedFirewalls: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			consoleReady: true,
			createdAt: '2026-10-26T09:30:00Z',
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			idc: 'us-denver-1',
			image: 'sample-image',
			imageId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			name: 'sample-name',
			networks: [
				{
					ip: '203.0.113.10',
					type: 'internal',
				},
			],
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			product: 'container.h200.x1',
			reason: 'sample-reason',
			status: 'creating',
		},
		contentType: 'application/json',
	},
	'baremetals.update': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			name: 'sample-name',
		},
		request: {
			method: 'PUT',
			url: 'v1/baremetals/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			body: {
				name: 'sample-name',
			},
		},
		response: {
			associatedFirewalls: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			consoleReady: true,
			createdAt: '2026-10-26T09:30:00Z',
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			idc: 'us-denver-1',
			image: 'sample-image',
			imageId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			name: 'sample-name',
			networks: [
				{
					ip: '203.0.113.10',
					type: 'internal',
				},
			],
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			product: 'container.h200.x1',
			reason: 'sample-reason',
			status: 'creating',
		},
		contentType: 'application/json',
	},
	'baremetals.delete': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'DELETE',
			url: 'v1/baremetals/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'baremetals.action': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			type: 'start',
		},
		request: {
			method: 'POST',
			url: 'v1/baremetals/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/actions',
			body: {
				type: 'start',
			},
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'baremetals.listProducts': {
		input: {
			idc: 'us-denver-1',
		},
		request: {
			method: 'GET',
			url: 'v1/baremetals/products',
			query: {
				idc: 'us-denver-1',
			},
		},
		response: [
			{
				gpuModel: 'sample-gpuModel',
				idc: 'sample-idc',
				name: 'sample-name',
				price: 1,
				productLine: 'sample-productLine',
				spec: {},
				type: 'Container',
				valid: true,
			},
		],
		contentType: 'application/json',
	},
	'containers.list': {
		input: {},
		request: {
			method: 'GET',
			url: 'v1/containers',
		},
		response: [
			{
				createdAt: '2026-10-26T09:30:00Z',
				eipAddress: '203.0.113.10',
				eipId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				firewalls: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				inboundIP: {
					ipAddress: '203.0.113.10',
					status: 'ready',
				},
				modifiedAt: '2026-10-26T09:30:00Z',
				orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				outboundIP: {
					ipAddress: '203.0.113.10',
					status: 'ready',
				},
				publicIP: {
					ipAddress: '203.0.113.10',
					status: 'ready',
				},
				reason: 'sample-reason',
				status: 'unknown',
				storages: [
					{
						containerPath: '/tmp',
						id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
					},
				],
				idc: 'us-denver-1',
				product: 'container.h200.x1',
				args: ['sample-args'],
				command: 'sample-command',
				envs: [
					{
						name: 'API_TOKEN',
						value: 'sample-value',
					},
				],
				name: 'sample name',
				ports: [
					{
						containerPort: 1,
						port: 1,
						protocol: 'TCP',
					},
				],
				sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				templateId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			},
		],
		contentType: 'application/json',
	},
	'containers.create': {
		input: {
			count: 1,
			idc: 'us-denver-1',
			product: 'container.h200.x1',
			args: ['sample-args'],
			command: 'sample-command',
			envs: [
				{
					name: 'API_TOKEN',
					value: 'sample-value',
				},
			],
			name: 'sample name',
			ports: [
				{
					containerPort: 1,
					port: 1,
					protocol: 'TCP',
				},
			],
			sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			templateId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'POST',
			url: 'v1/containers',
			body: {
				count: 1,
				idc: 'us-denver-1',
				product: 'container.h200.x1',
				args: ['sample-args'],
				command: 'sample-command',
				envs: [
					{
						name: 'API_TOKEN',
						value: 'sample-value',
					},
				],
				name: 'sample name',
				ports: [
					{
						containerPort: 1,
						port: 1,
						protocol: 'TCP',
					},
				],
				sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				templateId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			},
		},
		response: [
			{
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			},
		],
		contentType: 'application/json',
	},
	'containers.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/containers/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			createdAt: '2026-10-26T09:30:00Z',
			eipAddress: '203.0.113.10',
			eipId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			firewalls: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			inboundIP: {
				ipAddress: '203.0.113.10',
				status: 'ready',
			},
			modifiedAt: '2026-10-26T09:30:00Z',
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			outboundIP: {
				ipAddress: '203.0.113.10',
				status: 'ready',
			},
			publicIP: {
				ipAddress: '203.0.113.10',
				status: 'ready',
			},
			reason: 'sample-reason',
			status: 'unknown',
			storages: [
				{
					containerPath: '/tmp',
					id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				},
			],
			idc: 'us-denver-1',
			product: 'container.h200.x1',
			args: ['sample-args'],
			command: 'sample-command',
			envs: [
				{
					name: 'API_TOKEN',
					value: 'sample-value',
				},
			],
			name: 'sample name',
			ports: [
				{
					containerPort: 1,
					port: 1,
					protocol: 'TCP',
				},
			],
			sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			templateId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		contentType: 'application/json',
	},
	'containers.update': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			args: ['sample-args'],
			command: 'sample-command',
			envs: [
				{
					name: 'API_TOKEN',
					value: 'sample-value',
				},
			],
			name: 'sample name',
			ports: [
				{
					containerPort: 1,
					port: 1,
					protocol: 'TCP',
				},
			],
			sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			templateId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'PUT',
			url: 'v1/containers/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			body: {
				args: ['sample-args'],
				command: 'sample-command',
				envs: [
					{
						name: 'API_TOKEN',
						value: 'sample-value',
					},
				],
				name: 'sample name',
				ports: [
					{
						containerPort: 1,
						port: 1,
						protocol: 'TCP',
					},
				],
				sshKeyIdList: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				templateId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			},
		},
		response: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		contentType: 'application/json',
	},
	'containers.delete': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'DELETE',
			url: 'v1/containers/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'containers.getLogs': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/containers/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/logs',
		},
		response: '2026-10-26T09:30:00Z container started\n',
		contentType: 'text/plain',
	},
	'containers.restart': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'POST',
			url: 'v1/containers/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/restart',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'containers.createShell': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'POST',
			url: 'v1/containers/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/shell',
		},
		response: {
			urlPath: 'https://example.com/path',
		},
		contentType: 'application/json',
	},
	'containers.listProducts': {
		input: {
			idc: 'us-denver-1',
		},
		request: {
			method: 'GET',
			url: 'v1/containers/products',
			query: {
				idc: 'us-denver-1',
			},
		},
		response: [
			{
				gpuModel: 'sample-gpuModel',
				idc: 'sample-idc',
				name: 'sample-name',
				price: 1,
				productLine: 'sample-productLine',
				spec: {},
				type: 'Container',
				valid: true,
			},
		],
		contentType: 'application/json',
	},
	'elasticIps.list': {
		input: {},
		request: {
			method: 'GET',
			url: 'v1/elastic-ips',
		},
		response: [
			{
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				status: 'released',
				internetConnectionType: 'BGP',
				maxBandwidth: 'sample-maxBandwidth',
				name: 'sample name',
				idc: 'us-denver-1',
				ipAddress: '203.0.113.10',
				product: 'container.h200.x1',
				instanceID: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				instanceType: 'baremetal',
			},
		],
		contentType: 'application/json',
	},
	'elasticIps.allocate': {
		input: {
			count: 1,
			idc: 'us-denver-1',
			name: 'sample name',
			product: 'container.h200.x1',
		},
		request: {
			method: 'POST',
			url: 'v1/elastic-ips',
			body: {
				count: 1,
				idc: 'us-denver-1',
				name: 'sample name',
				product: 'container.h200.x1',
			},
		},
		response: [
			{
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			},
		],
		contentType: 'application/json',
	},
	'elasticIps.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/elastic-ips/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			status: 'released',
			internetConnectionType: 'BGP',
			maxBandwidth: 'sample-maxBandwidth',
			name: 'sample name',
			idc: 'us-denver-1',
			ipAddress: '203.0.113.10',
			product: 'container.h200.x1',
			instanceID: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			instanceType: 'baremetal',
		},
		contentType: 'application/json',
	},
	'elasticIps.release': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'DELETE',
			url: 'v1/elastic-ips/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'elasticIps.associate': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			instanceID: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			instanceType: 'baremetal',
		},
		request: {
			method: 'POST',
			url: 'v1/elastic-ips/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/associate',
			body: {
				instanceID: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				instanceType: 'baremetal',
			},
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'elasticIps.disassociate': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'POST',
			url: 'v1/elastic-ips/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/disassociate',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'elasticIps.listProducts': {
		input: {
			idc: 'us-denver-1',
		},
		request: {
			method: 'GET',
			url: 'v1/elastic-ips/products',
			query: {
				idc: 'us-denver-1',
			},
		},
		response: [
			{
				gpuModel: 'sample-gpuModel',
				idc: 'sample-idc',
				name: 'sample-name',
				price: 1,
				productLine: 'sample-productLine',
				spec: {},
				type: 'Container',
				valid: true,
			},
		],
		contentType: 'application/json',
	},
	'firewalls.list': {
		input: {
			idc: 'us-denver-1',
		},
		request: {
			method: 'GET',
			url: 'v1/firewalls',
			query: {
				idc: 'us-denver-1',
			},
		},
		response: [
			{
				description: '203.0.113.10',
				inboundRules: [
					{
						description: '203.0.113.10',
						portRange: {
							max: 1,
							min: 1,
						},
						protocol: 'tcp',
						remoteIpPrefix: '237.84.2.178/24',
					},
				],
				name: 'sample-name',
				idc: 'us-denver-1',
				assoInstances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				assoContainers: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				isPreset: true,
				orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				status: 'active',
			},
		],
		contentType: 'application/json',
	},
	'firewalls.create': {
		input: {
			description: '203.0.113.10',
			inboundRules: [
				{
					description: '203.0.113.10',
					portRange: {
						max: 1,
						min: 1,
					},
					protocol: 'tcp',
					remoteIpPrefix: '237.84.2.178/24',
				},
			],
			name: 'sample-name',
			idc: 'us-denver-1',
		},
		request: {
			method: 'POST',
			url: 'v1/firewalls',
			body: {
				description: '203.0.113.10',
				inboundRules: [
					{
						description: '203.0.113.10',
						portRange: {
							max: 1,
							min: 1,
						},
						protocol: 'tcp',
						remoteIpPrefix: '237.84.2.178/24',
					},
				],
				name: 'sample-name',
				idc: 'us-denver-1',
			},
		},
		response: {
			description: '203.0.113.10',
			inboundRules: [
				{
					description: '203.0.113.10',
					portRange: {
						max: 1,
						min: 1,
					},
					protocol: 'tcp',
					remoteIpPrefix: '237.84.2.178/24',
				},
			],
			name: 'sample-name',
			idc: 'us-denver-1',
			assoInstances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			assoContainers: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			isPreset: true,
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			status: 'active',
		},
		contentType: 'application/json',
	},
	'firewalls.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/firewalls/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			description: '203.0.113.10',
			inboundRules: [
				{
					description: '203.0.113.10',
					portRange: {
						max: 1,
						min: 1,
					},
					protocol: 'tcp',
					remoteIpPrefix: '237.84.2.178/24',
				},
			],
			name: 'sample-name',
			idc: 'us-denver-1',
			assoInstances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			assoContainers: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			isPreset: true,
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			status: 'active',
		},
		contentType: 'application/json',
	},
	'firewalls.update': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			description: '203.0.113.10',
			inboundRules: [
				{
					description: '203.0.113.10',
					portRange: {
						max: 1,
						min: 1,
					},
					protocol: 'tcp',
					remoteIpPrefix: '237.84.2.178/24',
				},
			],
			name: 'sample-name',
		},
		request: {
			method: 'PUT',
			url: 'v1/firewalls/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			body: {
				description: '203.0.113.10',
				inboundRules: [
					{
						description: '203.0.113.10',
						portRange: {
							max: 1,
							min: 1,
						},
						protocol: 'tcp',
						remoteIpPrefix: '237.84.2.178/24',
					},
				],
				name: 'sample-name',
			},
		},
		response: {
			description: '203.0.113.10',
			inboundRules: [
				{
					description: '203.0.113.10',
					portRange: {
						max: 1,
						min: 1,
					},
					protocol: 'tcp',
					remoteIpPrefix: '237.84.2.178/24',
				},
			],
			name: 'sample-name',
			idc: 'us-denver-1',
			assoInstances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			assoContainers: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			isPreset: true,
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			status: 'active',
		},
		contentType: 'application/json',
	},
	'firewalls.delete': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'DELETE',
			url: 'v1/firewalls/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'firewalls.associate': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			instances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			instanceType: 'baremetal',
		},
		request: {
			method: 'POST',
			url: 'v1/firewalls/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/associate',
			body: {
				instances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				instanceType: 'baremetal',
			},
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'firewalls.disassociate': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			instances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
			instanceType: 'baremetal',
		},
		request: {
			method: 'POST',
			url: 'v1/firewalls/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/disassociate',
			body: {
				instances: ['6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c'],
				instanceType: 'baremetal',
			},
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'images.list': {
		input: {
			idc: 'us-denver-1',
			product: 'container.h200.x1',
		},
		request: {
			method: 'GET',
			url: 'v1/images',
			query: {
				idc: 'us-denver-1',
				product: 'container.h200.x1',
			},
		},
		response: [
			{
				supportedProducts: ['sample-name'],
				BootMode: 'UEFI',
				DefaultPartitionTable: [
					{
						fileSystem: 'sample-fileSystem',
						mountPoint: 'sample-mountPoint',
						name: 'sample name',
						size: 'sample-size',
					},
				],
				OSArchitecture: 'sample-OSArchitecture',
				OSSeries: 'sample-OSSeries',
				OSVersion: 'sample-OSVersion',
				SystemDiskSize: 'sample-SystemDiskSize',
				icon: 'https://example.com/path',
				idc: 'us-denver-1',
				name: 'sample name',
				orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				path: 'sample-path',
				createdAt: '2026-10-26T09:30:00Z',
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				type: 'Public',
			},
		],
		contentType: 'application/json',
	},
	'images.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/images/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			supportedProducts: ['sample-name'],
			BootMode: 'UEFI',
			DefaultPartitionTable: [
				{
					fileSystem: 'sample-fileSystem',
					mountPoint: 'sample-mountPoint',
					name: 'sample name',
					size: 'sample-size',
				},
			],
			OSArchitecture: 'sample-OSArchitecture',
			OSSeries: 'sample-OSSeries',
			OSVersion: 'sample-OSVersion',
			SystemDiskSize: 'sample-SystemDiskSize',
			icon: 'https://example.com/path',
			idc: 'us-denver-1',
			name: 'sample name',
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			path: 'sample-path',
			createdAt: '2026-10-26T09:30:00Z',
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			type: 'Public',
		},
		contentType: 'application/json',
	},
	'templates.list': {
		input: {},
		request: {
			method: 'GET',
			url: 'v1/templates',
		},
		response: [
			{
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				official: true,
				orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				credential: {
					secret: 'registry-token',
					username: 'sample-username',
				},
				description: '203.0.113.10',
				name: 'sample name',
				path: 'https://example.com/path',
				status: 'draft',
			},
		],
		contentType: 'application/json',
	},
	'templates.create': {
		input: {
			credential: {
				secret: 'registry-token',
				username: 'sample-username',
			},
			description: '203.0.113.10',
			name: 'sample name',
			path: 'https://example.com/path',
			status: 'draft',
		},
		request: {
			method: 'POST',
			url: 'v1/templates',
			body: {
				credential: {
					secret: 'registry-token',
					username: 'sample-username',
				},
				description: '203.0.113.10',
				name: 'sample name',
				path: 'https://example.com/path',
				status: 'draft',
			},
		},
		response: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		contentType: 'application/json',
	},
	'templates.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			official: true,
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			credential: {
				secret: 'registry-token',
				username: 'sample-username',
			},
			description: '203.0.113.10',
			name: 'sample name',
			path: 'https://example.com/path',
			status: 'draft',
		},
		contentType: 'application/json',
	},
	'templates.update': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			credential: {
				secret: 'registry-token',
				username: 'sample-username',
			},
			description: '203.0.113.10',
			name: 'sample name',
			path: 'https://example.com/path',
			status: 'draft',
		},
		request: {
			method: 'PUT',
			url: 'v1/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			body: {
				credential: {
					secret: 'registry-token',
					username: 'sample-username',
				},
				description: '203.0.113.10',
				name: 'sample name',
				path: 'https://example.com/path',
				status: 'draft',
			},
		},
		response: {
			modified: 'sample-modified',
		},
		contentType: 'application/json',
	},
	'templates.delete': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'DELETE',
			url: 'v1/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'vpcs.list': {
		input: {
			idc: 'us-denver-1',
		},
		request: {
			method: 'GET',
			url: 'v1/vpcs',
			query: {
				idc: 'us-denver-1',
			},
		},
		response: [
			{
				createdAt: '2026-10-26T09:30:00Z',
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				idc: 'sample-idc',
				name: 'sample-name',
				orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				subnets: [
					{
						cidr: 'sample-cidr',
						id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
						name: 'sample-name',
					},
				],
			},
		],
		contentType: 'application/json',
	},
	'vpcs.allocate': {
		input: {
			idc: 'us-denver-1',
		},
		request: {
			method: 'POST',
			url: 'v1/vpcs',
			body: {
				idc: 'us-denver-1',
			},
		},
		response: {
			createdAt: '2026-10-26T09:30:00Z',
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			idc: 'sample-idc',
			name: 'sample-name',
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			subnets: [
				{
					cidr: 'sample-cidr',
					id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
					name: 'sample-name',
				},
			],
		},
		contentType: 'application/json',
	},
	'vpcs.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v1/vpcs/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			createdAt: '2026-10-26T09:30:00Z',
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			idc: 'sample-idc',
			name: 'sample-name',
			orgId: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			subnets: [
				{
					cidr: 'sample-cidr',
					id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
					name: 'sample-name',
				},
			],
		},
		contentType: 'application/json',
	},
	'vpcs.release': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'DELETE',
			url: 'v1/vpcs/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			result: 'sample-result',
		},
		contentType: 'application/json',
	},
	'sandboxes.list': {
		input: {
			page: 1,
			page_size: 1,
			idc_name: 'sample-idc_name',
			state: ['provisioning'],
		},
		request: {
			method: 'GET',
			url: 'v2/sandboxes',
			query: {
				page: 1,
				page_size: 1,
				idc_name: 'sample-idc_name',
				state: ['provisioning'],
			},
		},
		response: {
			request_id: 'sample-request_id',
			total: 1,
			page: 1,
			page_size: 1,
			items: [
				{
					id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
					sandbox_key: 'sample-sandbox_key',
					template_id: 'sample-template_id',
					idc_name: 'sample-idc_name',
					state: 'provisioning',
					metadata: {
						team: 'sample-metadata',
					},
					created_at: 'sample-created_at',
					running_at: 'sample-running_at',
				},
			],
		},
		contentType: 'application/json',
	},
	'sandboxes.create': {
		input: {
			template_id: 'sample-template_id',
			idc_name: 'sample-idc_name',
			timeout: 1,
			env_vars: {
				team: 'sample-env_vars',
			},
			metadata: {
				team: 'sample-metadata',
			},
		},
		request: {
			method: 'POST',
			url: 'v2/sandboxes',
			body: {
				template_id: 'sample-template_id',
				idc_name: 'sample-idc_name',
				timeout: 1,
				env_vars: {
					team: 'sample-env_vars',
				},
				metadata: {
					team: 'sample-metadata',
				},
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				sandbox_key: 'sample-sandbox_key',
				template_id: 'sample-template_id',
				domain: 'sample-domain',
				sandbox_access_token: 'sample-sandbox_access_token',
				traffic_access_token: 'sample-traffic_access_token',
			},
		},
		contentType: 'application/json',
	},
	'sandboxes.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v2/sandboxes/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				sandbox_key: 'sample-sandbox_key',
				template_id: 'sample-template_id',
				idc_name: 'sample-idc_name',
				state: 'provisioning',
				product: 'sample-product',
				product_name: 'sample-product_name',
				resources: {
					vcpu: 1,
					memory_mb: 1,
					disk_mb: 1,
				},
				metadata: {
					team: 'sample-metadata',
				},
				latest_operation: {
					type: 'create',
					status: 'pending',
					error_code: 'invalid_argument',
					message: 'sample-message',
					completed_at: '2026-10-26T09:30:00Z',
				},
				failure: {
					code: 'Parameter.Invalid',
					message: 'sample-message',
					occurred_at: 'sample-occurred_at',
				},
				created_at: 'sample-created_at',
				running_at: 'sample-running_at',
				started_at: 'sample-started_at',
				end_at: 'sample-end_at',
				domain: 'sample-domain',
			},
		},
		contentType: 'application/json',
	},
	'sandboxes.updateMetadata': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			metadata: {
				team: 'sample-metadata',
			},
		},
		request: {
			method: 'PATCH',
			url: 'v2/sandboxes/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			body: {
				metadata: {
					team: 'sample-metadata',
				},
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				sandbox_key: 'sample-sandbox_key',
				template_id: 'sample-template_id',
				idc_name: 'sample-idc_name',
				state: 'provisioning',
				product: 'sample-product',
				product_name: 'sample-product_name',
				resources: {
					vcpu: 1,
					memory_mb: 1,
					disk_mb: 1,
				},
				metadata: {
					team: 'sample-metadata',
				},
				latest_operation: {
					type: 'create',
					status: 'pending',
					error_code: 'invalid_argument',
					message: 'sample-message',
					completed_at: '2026-10-26T09:30:00Z',
				},
				failure: {
					code: 'Parameter.Invalid',
					message: 'sample-message',
					occurred_at: 'sample-occurred_at',
				},
				created_at: 'sample-created_at',
				running_at: 'sample-running_at',
				started_at: 'sample-started_at',
				end_at: 'sample-end_at',
				domain: 'sample-domain',
			},
		},
		contentType: 'application/json',
	},
	'sandboxes.delete': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'DELETE',
			url: 'v2/sandboxes/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				state: 'deleting',
			},
		},
		contentType: 'application/json',
	},
	'sandboxes.connect': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			timeout: 1,
		},
		request: {
			method: 'POST',
			url: 'v2/sandboxes/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/connect',
			body: {
				timeout: 1,
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				sandbox_key: 'sample-sandbox_key',
				template_id: 'sample-template_id',
				domain: 'sample-domain',
				sandbox_access_token: 'sample-sandbox_access_token',
				traffic_access_token: 'sample-traffic_access_token',
				end_at: '2026-10-26T09:30:00Z',
			},
		},
		contentType: 'application/json',
	},
	'sandboxes.setTimeout': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			timeout: 1,
		},
		request: {
			method: 'POST',
			url: 'v2/sandboxes/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/timeout',
			body: {
				timeout: 1,
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				old_end_at: '2026-10-26T09:30:00Z',
				new_end_at: '2026-10-26T09:30:00Z',
			},
		},
		contentType: 'application/json',
	},
	'sandboxProducts.list': {
		input: {
			idc_name: 'sample-idc_name',
			resource_type: 'sandbox',
			include_unavailable: true,
		},
		request: {
			method: 'GET',
			url: 'v2/products',
			query: {
				idc_name: 'sample-idc_name',
				resource_type: 'sandbox',
				include_unavailable: true,
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: [
				{
					resource_type: 'sandbox',
					product: 'sample-product',
					name: 'sample-name',
					status: 'active',
					resources: {
						cpu_count: 1,
						memory_mb: 1,
						disk_size_mb: 1,
						architecture: 'x86_64',
					},
				},
			],
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.list': {
		input: {
			idc_name: 'sample-idc_name',
			page: 1,
			page_size: 1,
		},
		request: {
			method: 'GET',
			url: 'v2/templates',
			query: {
				idc_name: 'sample-idc_name',
				page: 1,
				page_size: 1,
			},
		},
		response: {
			request_id: 'sample-request_id',
			total: 1,
			page: 1,
			page_size: 1,
			items: [
				{
					id: 'sample-id',
					name: 'sample-name',
					description: '203.0.113.10',
					idc_name: 'sample-idc_name',
					source_type: 'image',
					product: 'sample-product',
					product_name: 'X_SMALL',
					resources: {
						cpu_count: 1,
						memory_mb: 1,
						disk_size_mb: 1,
						architecture: 'x86_64',
					},
					labels: {
						team: 'sample-labels',
					},
					current_build_id: 'sample-current_build_id',
					latest_build_id: 'sample-latest_build_id',
					latest_build_status: 'waiting',
					rebuildable: true,
					deleted_at: '2026-10-26T09:30:00Z',
					created_at: '2026-10-26T09:30:00Z',
					updated_at: '2026-10-26T09:30:00Z',
				},
			],
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.create': {
		input: {
			idempotency_key: 'sample-Idempotency-Key',
			name: 'sample_name',
			description: '203.0.113.10',
			idc_name: 'sample-idc_name',
			resources: {
				type: 'preset',
				product: 'sample-product',
			},
			labels: {
				team: 'sample-labels',
			},
			build: {
				source: {
					type: 'image',
					image: 'sample-image',
				},
				commands: ['sample-commands'],
				envs: {
					team: 'sample-envs',
				},
				start_cmd: 'sample-start_cmd',
			},
		},
		request: {
			method: 'POST',
			url: 'v2/templates',
			headers: {
				'Idempotency-Key': 'sample-Idempotency-Key',
			},
			body: {
				name: 'sample_name',
				description: '203.0.113.10',
				idc_name: 'sample-idc_name',
				resources: {
					type: 'preset',
					product: 'sample-product',
				},
				labels: {
					team: 'sample-labels',
				},
				build: {
					source: {
						type: 'image',
						image: 'sample-image',
					},
					commands: ['sample-commands'],
					envs: {
						team: 'sample-envs',
					},
					start_cmd: 'sample-start_cmd',
				},
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: 'sample-id',
				build_id: 'sample-build_id',
				status: 'waiting',
			},
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.get': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			idc_name: 'sample-idc_name',
		},
		request: {
			method: 'GET',
			url: 'v2/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			query: {
				idc_name: 'sample-idc_name',
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: 'sample-id',
				name: 'sample-name',
				description: '203.0.113.10',
				idc_name: 'sample-idc_name',
				source_type: 'image',
				product: 'sample-product',
				product_name: 'X_SMALL',
				resources: {
					cpu_count: 1,
					memory_mb: 1,
					disk_size_mb: 1,
					architecture: 'x86_64',
				},
				labels: {
					team: 'sample-labels',
				},
				current_build_id: 'sample-current_build_id',
				latest_build_id: 'sample-latest_build_id',
				latest_build_status: 'waiting',
				rebuildable: true,
				deleted_at: '2026-10-26T09:30:00Z',
				created_at: '2026-10-26T09:30:00Z',
				updated_at: '2026-10-26T09:30:00Z',
			},
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.update': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			idc_name: 'sample-idc_name',
			name: 'sample_name',
			description: '203.0.113.10',
			labels: {
				team: 'sample-labels',
			},
		},
		request: {
			method: 'PATCH',
			url: 'v2/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			query: {
				idc_name: 'sample-idc_name',
			},
			body: {
				name: 'sample_name',
				description: '203.0.113.10',
				labels: {
					team: 'sample-labels',
				},
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: 'sample-id',
				name: 'sample-name',
				description: '203.0.113.10',
				idc_name: 'sample-idc_name',
				source_type: 'image',
				product: 'sample-product',
				product_name: 'X_SMALL',
				resources: {
					cpu_count: 1,
					memory_mb: 1,
					disk_size_mb: 1,
					architecture: 'x86_64',
				},
				labels: {
					team: 'sample-labels',
				},
				current_build_id: 'sample-current_build_id',
				latest_build_id: 'sample-latest_build_id',
				latest_build_status: 'waiting',
				rebuildable: true,
				deleted_at: '2026-10-26T09:30:00Z',
				created_at: '2026-10-26T09:30:00Z',
				updated_at: '2026-10-26T09:30:00Z',
			},
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.delete': {
		input: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			idc_name: 'sample-idc_name',
		},
		request: {
			method: 'DELETE',
			url: 'v2/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			query: {
				idc_name: 'sample-idc_name',
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: 'sample-id',
				deleted: true,
			},
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.listBuilds': {
		input: {
			template_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			page: 1,
			page_size: 1,
		},
		request: {
			method: 'GET',
			url: 'v2/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/builds',
			query: {
				page: 1,
				page_size: 1,
			},
		},
		response: {
			request_id: 'sample-request_id',
			total: 1,
			page: 1,
			page_size: 1,
			items: [
				{
					id: 'sample-id',
					template_id: 'sample-template_id',
					trigger: 'initial_build',
					status: 'waiting',
					artifact_state: 'absent',
					source_type: 'image',
					source: {},
					resources: {
						cpu_count: 1,
						memory_mb: 1,
						disk_size_mb: 1,
						architecture: 'x86_64',
					},
					product: 'sample-product',
					product_name: 'X_SMALL',
					commands: ['sample-commands'],
					start_cmd: 'sample-start_cmd',
					failure: {
						code: 'TemplateBuild.OutOfMemory',
						message: 'sample-message',
					},
					created_at: '2026-10-26T09:30:00Z',
					started_at: '2026-10-26T09:30:00Z',
					finished_at: '2026-10-26T09:30:00Z',
				},
			],
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.getBuild': {
		input: {
			template_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		request: {
			method: 'GET',
			url: 'v2/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/builds/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				id: 'sample-id',
				template_id: 'sample-template_id',
				trigger: 'initial_build',
				status: 'waiting',
				artifact_state: 'absent',
				source_type: 'image',
				source: {},
				resources: {
					cpu_count: 1,
					memory_mb: 1,
					disk_size_mb: 1,
					architecture: 'x86_64',
				},
				product: 'sample-product',
				product_name: 'X_SMALL',
				commands: ['sample-commands'],
				start_cmd: 'sample-start_cmd',
				failure: {
					code: 'TemplateBuild.OutOfMemory',
					message: 'sample-message',
				},
				created_at: '2026-10-26T09:30:00Z',
				started_at: '2026-10-26T09:30:00Z',
				finished_at: '2026-10-26T09:30:00Z',
			},
		},
		contentType: 'application/json',
	},
	'sandboxTemplates.getBuildLogs': {
		input: {
			template_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			offset: 1,
			limit: 1,
			level: 'debug',
		},
		request: {
			method: 'GET',
			url: 'v2/templates/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/builds/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/logs',
			query: {
				offset: 1,
				limit: 1,
				level: 'debug',
			},
		},
		response: {
			request_id: 'sample-request_id',
			data: {
				entries: [
					{
						offset: 1,
						timestamp: '2026-10-26T09:30:00Z',
						level: 'debug',
						message: 'sample-message',
					},
				],
				next_offset: 1,
				has_more: true,
			},
		},
		contentType: 'application/json',
	},
	'sandboxExec.run': {
		input: {
			wait: true,
			wait_timeout_seconds: 1,
			parameters: {
				command: 'sample-command',
				envs: {
					team: 'sample-envs',
				},
				cwd: 'sample-cwd',
			},
			sandbox_key: 'sbx-7f3a',
			domain: 'sandbox.gmicloud.ai',
			access_token: 'sat-test',
		},
		request: {
			method: 'POST',
			url: 'executions',
			query: {
				wait: true,
				wait_timeout_seconds: 1,
			},
			body: {
				action: 'exec',
				parameters: {
					command: 'sample-command',
					envs: {
						team: 'sample-envs',
					},
					cwd: 'sample-cwd',
				},
			},
		},
		response: {
			request_id: 'sample-request_id',
			execution_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			sandbox_id: 'sample-sandbox_id',
			status: 'pending',
			exit_code: 1,
			stdout: 'sample-stdout',
			stderr: 'sample-stderr',
			stdout_truncated: true,
			stderr_truncated: true,
			started_at: '2026-10-26T09:30:00Z',
			completed_at: '2026-10-26T09:30:00Z',
		},
		contentType: 'application/json',
	},
	'sandboxExec.get': {
		input: {
			execution_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			sandbox_key: 'sbx-7f3a',
			domain: 'sandbox.gmicloud.ai',
			access_token: 'sat-test',
		},
		request: {
			method: 'GET',
			url: 'executions/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		},
		response: {
			request_id: 'sample-request_id',
			execution_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			sandbox_id: 'sample-sandbox_id',
			status: 'pending',
			exit_code: 1,
			stdout: 'sample-stdout',
			stderr: 'sample-stderr',
			stdout_truncated: true,
			stderr_truncated: true,
			started_at: '2026-10-26T09:30:00Z',
			completed_at: '2026-10-26T09:30:00Z',
		},
		contentType: 'application/json',
	},
	'sandboxExec.cancel': {
		input: {
			execution_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			sandbox_key: 'sbx-7f3a',
			domain: 'sandbox.gmicloud.ai',
			access_token: 'sat-test',
		},
		request: {
			method: 'POST',
			url: 'executions/6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c/cancel',
		},
		response: {
			request_id: 'sample-request_id',
			execution_id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			sandbox_id: 'sample-sandbox_id',
			status: 'pending',
			exit_code: 1,
			stdout: 'sample-stdout',
			stderr: 'sample-stderr',
			stdout_truncated: true,
			stderr_truncated: true,
			started_at: '2026-10-26T09:30:00Z',
			completed_at: '2026-10-26T09:30:00Z',
		},
		contentType: 'application/json',
	},
};

// Real GMI Cloud responses captured on 2026-10-26 (account IDs and URL signatures replaced).
export const LIVE_RESPONSES = {
	modelsList: {
		object: 'list',
		data: [
			{
				id: 'deepseek-ai/deepseek-v4.1-flash-1017',
				internal_id: '9aa6bb1e-170b-41ec-929d-1532858f9390',
				name: 'DeepSeek-V4.1-Flash-1017',
				object: 'model',
				created: 1792449200,
				context_length: 1048575,
				quantization: 'fp8',
				owned_by: 'GMI Cloud',
				pricing: {
					prompt: '0.000000300',
					completion: '0.000001200',
					request: '0',
					image: '0',
					input_cache_read: '0.000000006',
					input_cache_write: '0',
				},
				discount_to_user: 0.4,
			},
			{
				id: 'x-ai/grok-4.5',
				internal_id: '74d835b8-6689-4caa-a580-e4a28128a64d',
				name: 'Grok 4.5',
				object: 'model',
				created: 1783733264,
				context_length: 2000000,
				quantization: 'fp8',
				owned_by: 'GMI Cloud',
				pricing: {
					prompt: '0.000002000',
					completion: '0.000006000',
					request: '0',
					image: '0',
					input_cache_read: '0.000000500',
					input_cache_write: '0',
					overrides: [
						{
							min_prompt_tokens: 200000,
							prompt: '0.000004000',
							completion: '0.000012000',
							input_cache_read: '0.000001000',
							input_cache_write: '0',
						},
					],
				},
				discount_to_user: 0,
			},
		],
	},
	chatCreateCompletion: {
		id: 'as-vrdca05yii',
		object: 'chat.completion',
		created: 1793011648,
		model: 'deepseek-v4-flash-0731',
		choices: [
			{
				index: 0,
				message: {
					role: 'assistant',
					content: 'pong',
					reasoning_content: 'We need to reply with single word "pong".',
				},
				finish_reason: 'stop',
				flag: 0,
			},
		],
		usage: {
			prompt_tokens: 91,
			completion_tokens: 15,
			total_tokens: 106,
			prompt_tokens_details: {
				cached_tokens: 76,
			},
			completion_tokens_details: {
				reasoning_tokens: 11,
			},
		},
	},
	routerAutoroute: {
		model: 'deepseek-ai/DeepSeek-V4-Flash-0731',
		message: {
			role: 'assistant',
			content: 'Hi there.',
			reasoning_content:
				'We need answer to user: "Say hi in two words." Need exactly two words? "Hi there." Two words. Need comply.',
		},
		usage: {
			prompt_tokens: 89,
			completion_tokens: 32,
			total_tokens: 121,
			prompt_tokens_details: {
				cached_tokens: 0,
			},
			completion_tokens_details: {
				reasoning_tokens: 28,
			},
		},
		routing_metadata: {
			recommendation_id: '8feb4464-f4be-40e3-83fa-07072aebf656',
			selected_model: 'deepseek-ai/DeepSeek-V4-Flash-0731',
			attempted_primary: 'deepseek-ai/DeepSeek-V4-Flash-0731',
			fallback_models: ['deepseek-ai/DeepSeek-V4-Flash'],
			fallback_triggered: false,
			selected_mode: 'cost',
			routing_settings: {
				model_scope: 'all',
				price_tier: 'all',
				allowed_model_pool: [
					'openai/gpt-5.5',
					'google/gemini-3.1-pro-preview',
					'deepseek-ai/DeepSeek-V4-Pro',
					'deepseek-ai/DeepSeek-V4-Flash',
					'Qwen/Qwen3.7-Max',
					'zai-org/GLM-5.2-FP8',
					'tencent/hy3-preview',
					'MiniMaxAI/MiniMax-M3',
					'zai-org/GLM-5-FP8',
					'deepseek-ai/DeepSeek-V3-0324',
					'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8',
					'tencent/Hy3',
					'google/gemini-3.6-flash',
					'deepseek-ai/DeepSeek-V4-Flash-0731',
					'moonshotai/kimi-k3',
					'openai/gpt-5.6-luna',
					'google/gemini-3.7-flash',
					'zai-org/GLM-5.3',
					'zai-org/GLM-5.3-Flash',
					'deepseek-ai/DeepSeek-V4-Pro-0813',
				],
				mode: 'cost',
				auto_mode: true,
			},
			attempts: [
				{
					model: 'deepseek-ai/DeepSeek-V4-Flash-0731',
					outcome: 'success',
				},
			],
		},
	},
	apiKeysGetCurrent: {
		key: {
			id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
			owner: {
				id: '99999999-8888-4777-8666-555555555555',
			},
			product: 'IE',
			scope: 'ie_model',
			type: 'ie_model',
		},
		organization: {
			id: '11111111-2222-4333-8444-555555555555',
		},
	},
	idcsList: {
		idcs: [
			{
				country: '',
				countrySubdivision: '',
				idcId: 'global',
				name: 'Global',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-CO',
				idcId: 'us-denver-1',
				name: 'Denver IDC-1',
				status: 'available',
			},
			{
				country: 'SG',
				countrySubdivision: 'SG-01',
				idcId: 'asia-east-singapore1',
				name: 'Singapore IDC-1',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-OH',
				idcId: 'us-east-ohio1',
				name: 'Ohio IDC-1',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-OR',
				idcId: 'us-east-oregon1',
				name: 'Oregon IDC-1',
				status: 'available',
			},
			{
				country: 'TW',
				countrySubdivision: 'TW-TPE',
				idcId: 'asia-east-taiwan1',
				name: 'Taiwan IDC-1',
				status: 'available',
			},
			{
				country: 'JP',
				countrySubdivision: 'JP-27',
				idcId: 'asia-east-japan1',
				name: 'JAPAN IDC-1',
				status: 'available',
			},
			{
				country: 'TW',
				countrySubdivision: 'TW-TAO',
				idcId: 'asia-east-twaif',
				name: 'Taiwan IDC-AIF',
				status: 'available',
			},
			{
				country: 'SG',
				countrySubdivision: 'SG-01',
				idcId: 'asia-southeast-singapore2',
				name: 'Singapore IDC-2',
				status: 'maintenance',
			},
			{
				country: 'US',
				countrySubdivision: 'US-CO',
				idcId: 'us-denver-2',
				name: 'Denver IDC-2',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa15',
				name: 'IOWA IDC-15',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa14',
				name: 'IOWA IDC-14',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa13',
				name: 'IOWA IDC-13',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa12',
				name: 'IOWA IDC-12',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa11',
				name: 'IOWA IDC-11',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa10',
				name: 'IOWA IDC-10',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa9',
				name: 'IOWA IDC-9',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa8',
				name: 'IOWA IDC-8',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa7',
				name: 'IOWA IDC-7',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa6',
				name: 'IOWA IDC-6',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa5',
				name: 'IOWA IDC-5',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa4',
				name: 'IOWA IDC-4',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa3',
				name: 'IOWA IDC-3',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa1',
				name: 'IOWA IDC-1',
				status: 'available',
			},
			{
				country: 'US',
				countrySubdivision: 'US-IA',
				idcId: 'us-central-iowa2',
				name: 'IOWA IDC-2',
				status: 'maintenance',
			},
			{
				country: 'TW',
				countrySubdivision: 'TW-TPE',
				idcId: 'asia-east-taiwan2',
				name: 'Taiwan IDC-2',
				status: 'maintenance',
			},
			{
				country: 'TW',
				countrySubdivision: 'TW-TPE',
				idcId: 'asia-east-taiwan3',
				name: 'Taiwan IDC-3',
				status: 'maintenance',
			},
			{
				country: 'US',
				countrySubdivision: '',
				idcId: 'us-central-iowa16',
				name: 'us-central-iowa16',
				status: 'available',
			},
		],
	},
	mediaModelsList: {
		model_ids: [
			'gemini-3-pro-image',
			'heygen-avatar-4',
			'gemini-3-pro-image-preview',
			'vtx-bypass-test-1009',
			'ssrf-file-test-1009',
		],
	},
	mediaRequestsGet: {
		request_id: '57aa4ff5-9ce4-4d83-9993-45f8f05a66b5',
		org_id: '11111111-2222-4333-8444-555555555555',
		user_id: '99999999-8888-4777-8666-555555555555',
		model: 'Z-Image-Turbo',
		status: 'queued',
		is_public: false,
		payload: {
			height: 512,
			prompt: 'a small red paper boat on calm water',
			width: 512,
		},
		outcome: null,
		created_at: 1793011410,
		updated_at: 1793011410,
		queued_at: 1793011410,
	},
	uploadsCreateUrl: {
		upload_url:
			'https://storage.googleapis.com/gmi-video-assests-prod/11111111-2222-4333-8444-555555555555/99999999-8888-4777-8666-555555555555/gmi-videogen/upload/bc96b765-5760-4c3c-8ed1-b27d481fd4df.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Signature=redacted',
		public_url:
			'https://storage.googleapis.com/gmi-video-assests-prod/11111111-2222-4333-8444-555555555555/99999999-8888-4777-8666-555555555555/gmi-videogen/upload/bc96b765-5760-4c3c-8ed1-b27d481fd4df.png',
	},
};
