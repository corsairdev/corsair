import { logEventFromContext } from 'corsair/core';
import { Account, Config, Network, Storage, Vm } from './endpoints';
import {
	bucket,
	bucketsList,
	disk,
	disksList,
	firewallsList,
	locationsList,
	networksList,
	pricingPolicy,
	sshKeysList,
	stoppedVm,
	tokensList,
	user,
	vmImagesList,
	vmNotFound,
	vmsList,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const KEY = 'pv-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: KEY, options: {} } as never, input as never);
}

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses the user with its profile', async () => {
		respond(user);
		const result = (await invoke(Account.getUser, {})) as {
			id?: number;
			profile?: { first_name?: string };
		};
		expect(result.id).toBe(8);
		expect(result.profile?.first_name).toBe('Cloudia');
	});

	it('parses a VM list with storage entries', async () => {
		respond(vmsList);
		const page = (await invoke(Vm.list, {})) as Array<{
			status?: string;
			storage?: Array<{ primary?: boolean }>;
		}>;
		expect(page[0]?.status).toBe('running');
		expect(page[0]?.storage?.[0]?.primary).toBe(true);
	});

	it('parses a stopped VM after stop', async () => {
		respond(stoppedVm);
		const result = (await invoke(Vm.stop, { uuid: 'u-1' })) as {
			status?: string;
		};
		expect(result.status).toBe('stopped');
	});

	it('parses tokens with their values', async () => {
		respond(tokensList);
		const page = (await invoke(Account.listTokens, {})) as Array<{
			restricted?: boolean;
		}>;
		expect(page[0]?.restricted).toBe(true);
	});

	it('parses SSH keys', async () => {
		respond(sshKeysList);
		const page = (await invoke(Account.listSshKeys, {})) as Array<{
			name?: string;
		}>;
		expect(page[0]?.name).toBe('laptop-mbp');
	});

	it('parses locations', async () => {
		respond(locationsList);
		const page = (await invoke(Config.listLocations, {})) as Array<{
			slug?: string;
			is_default?: boolean;
		}>;
		expect(page[0]?.slug).toBe('cyc01');
		expect(page[0]?.is_default).toBe(true);
	});

	it('parses image catalogs and pricing policy', async () => {
		respond(vmImagesList);
		const images = (await invoke(Config.listVmImages, {})) as Array<{
			os_name?: string;
		}>;
		expect(images[0]?.os_name).toBe('ubuntu');

		respond(pricingPolicy);
		const policy = (await invoke(Config.getPricingPolicy, {})) as {
			policy?: Array<{ resourceType?: string }>;
		};
		expect(policy.policy?.[0]?.resourceType).toBe('CPU');
	});

	it('parses disks with snapshots', async () => {
		respond(disksList);
		const page = (await invoke(Storage.listDisks, {})) as Array<{
			size_gb?: number;
		}>;
		expect(page[0]?.size_gb).toBe(50);

		respond(disk);
		const one = (await invoke(Storage.getDisk, {
			name: '05a61876-86f3-4b05-b0ec-53ee6fa03ced',
		})) as { uuid?: string };
		expect(one.uuid).toBe(disk.uuid);
	});

	it('parses buckets', async () => {
		respond(bucketsList);
		const page = (await invoke(Storage.listBuckets, {})) as Array<{
			name?: string;
		}>;
		expect(page[0]?.name).toBe('pang1');

		respond(bucket);
		const one = (await invoke(Storage.getBucket, {
			name: 'pang1',
		})) as { size_bytes?: number };
		expect(one.size_bytes).toBe(3189211059);
	});

	it('parses networks', async () => {
		respond(networksList);
		const page = (await invoke(Network.listNetworks, {})) as Array<{
			subnet?: string;
		}>;
		expect(page[0]?.subnet).toBe('10.1.104.0/24');
	});

	it('parses firewalls with rules', async () => {
		respond(firewallsList);
		const page = (await invoke(Network.listFirewalls, {})) as Array<{
			rules?: Array<{ protocol?: string }>;
		}>;
		expect(page[0]?.rules?.[0]?.protocol).toBe('tcp');
	});

	it('keeps the documented business error envelope on delete answers', async () => {
		respond(vmNotFound);
		const result = (await invoke(Vm.deleteVm, { uuid: 'u-1' })) as {
			errors?: unknown;
		};
		expect(result.errors).toBeDefined();
	});
});

describe('input validation', () => {
	it('rejects a VM get without a uuid', async () => {
		await rejects(Vm.get, {}, 'uuid');
	});

	it('rejects a VM create without an OS', async () => {
		await rejects(Vm.create, { name: 'web' }, 'osName');
	});

	it('rejects a reinstall without an os version', async () => {
		await rejects(Vm.reinstall, { uuid: 'u-1', osName: 'ubuntu' }, 'osVersion');
	});

	it('rejects a disk source image type the docs do not list', async () => {
		await rejects(
			Storage.createDisk,
			{ sizeGb: 20, sourceImageType: 'CLONE' },
			'sourceImageType',
		);
	});

	it('rejects a firewall rule protocol the docs do not list', async () => {
		await rejects(
			Network.createFirewall,
			{
				displayName: 'f',
				rules: [
					{
						protocol: 'gre',
						direction: 'inbound',
						endpointSpecType: 'any',
					},
				],
			},
			'protocol',
		);
	});

	it('rejects a token delete without an id', async () => {
		await rejects(Account.deleteToken, {}, 'tokenId');
	});
});
