import { logEventFromContext } from 'corsair/core';
import { Account, Config, Network, Storage, Vm } from './endpoints';
import {
	bucket,
	bucketsList,
	disk,
	firewall,
	firewallsList,
	locationsList,
	network,
	pricingPolicy,
	sshKey,
	stoppedVm,
	user,
	vm,
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

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? null : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body:
			typeof init.body === 'string'
				? init.body.startsWith('{')
					? JSON.parse(init.body)
					: Object.fromEntries(new URLSearchParams(init.body))
				: undefined,
	};
}

function expectCall(expected: Partial<ReturnType<typeof lastRequest>>) {
	const sent = lastRequest();
	for (const [key, value] of Object.entries(expected)) {
		expect(sent[key as keyof typeof sent]).toEqual(value);
	}
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account', () => {
	it('getUser sends the apikey header', async () => {
		respond(user);
		await invoke(Account.getUser, {});
		expectCall({
			origin: 'https://api.pilvio.com',
			path: '/v1/user-resource/user',
			method: 'GET',
		});
		expect(lastRequest().headers.get('apikey')).toBe(KEY);
	});

	it('updateProfile PATCHes form-encoded fields', async () => {
		respond(user);
		await invoke(Account.updateProfile, {
			firstName: 'New',
			phoneNumber: '+372',
		});
		expectCall({
			path: '/v1/user-resource/user/profile',
			method: 'PATCH',
			body: { first_name: 'New', phone_number: '+372' },
		});
	});

	it('ssh key create sends JSON', async () => {
		respond(sshKey);
		await invoke(Account.createSshKey, {
			name: 'laptop',
			publicKey: 'ssh-ed25519 AAA',
		});
		expectCall({
			path: '/v1/user-resource/ssh_keys',
			method: 'POST',
			body: { name: 'laptop', public_key: 'ssh-ed25519 AAA' },
		});
		expect(lastRequest().headers.get('content-type')).toContain(
			'application/json',
		);
	});

	it('ssh key rename and delete hit the key UUID route', async () => {
		respond(sshKey);
		await invoke(Account.renameSshKey, {
			uuid: 'k-1',
			name: 'personal-laptop',
		});
		expectCall({
			path: '/v1/user-resource/ssh_keys/k-1',
			method: 'PATCH',
			body: { name: 'personal-laptop' },
		});

		respond(null, 204);
		await invoke(Account.deleteSshKey, { uuid: 'k-1' });
		expectCall({
			path: '/v1/user-resource/ssh_keys/k-1',
			method: 'DELETE',
		});
	});

	it('token delete sends DELETE with the token id', async () => {
		respond({ deleted: true });
		await invoke(Account.deleteToken, { tokenId: 7 });
		expectCall({
			path: '/v1/user-resource/token',
			method: 'DELETE',
			body: { token_id: '7' },
		});
	});
});

describe('config', () => {
	it('locations, images and pools hit their routes', async () => {
		respond(locationsList);
		await invoke(Config.listLocations, {});
		expectCall({ path: '/v1/config/locations', method: 'GET' });

		respond([]);
		await invoke(Config.listPlainOsImages, {});
		expectCall({ path: '/v1/config/vm_images/plain_os' });

		respond([]);
		await invoke(Config.listAppCatalogImages, {});
		expectCall({ path: '/v1/config/vm_images/app_catalog' });

		respond([]);
		await invoke(Config.listBootImages, {});
		expectCall({ path: '/v1/config/boot_images' });

		respond([]);
		await invoke(Config.listResourcePools, {});
		expectCall({ path: '/v1/user-resource/host_pool/list' });
	});

	it('pricing policy hits the policy route', async () => {
		respond(pricingPolicy);
		const policy = (await invoke(Config.getPricingPolicy, {})) as {
			policy: Array<{ price?: number }>;
		};
		expect(policy.policy[0]?.price).toBe(0.00521);
		expectCall({ path: '/v1/pricing/policy', method: 'GET' });
	});
});

describe('vm', () => {
	it('create posts the full form payload', async () => {
		respond(vm);
		await invoke(Vm.create, {
			name: 'web',
			osName: 'ubuntu',
			osVersion: '22.04-lts',
			disks: 20,
			vcpu: 2,
			ram: 2048,
			username: 'deploy',
			password: 'hunter22',
			reservePublicIp: false,
		});
		expectCall({
			path: '/v1/user-resource/vm',
			method: 'POST',
			body: {
				name: 'web',
				os_name: 'ubuntu',
				os_version: '22.04-lts',
				disks: '20',
				vcpu: '2',
				ram: '2048',
				username: 'deploy',
				password: 'hunter22',
				reserve_public_ip: 'false',
			},
		});
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('hunter22');
	});

	it('start and stop post the uuid', async () => {
		respond(vm);
		await invoke(Vm.start, { uuid: 'u-1' });
		expectCall({
			path: '/v1/user-resource/vm/start',
			method: 'POST',
			body: { uuid: 'u-1' },
		});

		respond(stoppedVm);
		const result = (await invoke(Vm.stop, { uuid: 'u-1' })) as {
			status?: string;
		};
		expect(result.status).toBe('stopped');
		expectCall({ path: '/v1/user-resource/vm/stop' });
	});

	it('get queries by uuid and delete sends DELETE with the uuid', async () => {
		respond(vm);
		await invoke(Vm.get, { uuid: 'u-1' });
		expectCall({
			path: '/v1/user-resource/vm',
			method: 'GET',
			query: { uuid: 'u-1' },
		});

		respond(vmNotFound);
		await invoke(Vm.deleteVm, { uuid: 'u-1' });
		expectCall({
			path: '/v1/user-resource/vm',
			method: 'DELETE',
			body: { uuid: 'u-1' },
		});
	});

	it('reinstall posts the new OS', async () => {
		respond(vm);
		await invoke(Vm.reinstall, {
			uuid: 'u-1',
			osName: 'ubuntu',
			osVersion: '22.04-lts',
		});
		expectCall({
			path: '/v1/user-resource/vm/reinstall',
			method: 'POST',
			body: { uuid: 'u-1', os_name: 'ubuntu', os_version: '22.04-lts' },
		});
	});

	it('list hits the list route', async () => {
		respond(vmsList);
		const page = (await invoke(Vm.list, {})) as Array<{ uuid?: string }>;
		expect(page[0]?.uuid).toBe(vm.uuid);
		expectCall({ path: '/v1/user-resource/vm/list', method: 'GET' });
	});
});

describe('storage', () => {
	it('disk create posts the size and source', async () => {
		respond(disk);
		await invoke(Storage.createDisk, {
			sizeGb: 50,
			sourceImageType: 'OS_BASE',
			sourceImage: 'ubuntu_20.04',
			displayName: 'DB data',
		});
		expectCall({
			path: '/v1/storage/disks',
			method: 'POST',
			body: {
				size_gb: '50',
				source_image_type: 'OS_BASE',
				source_image: 'ubuntu_20.04',
				display_name: 'DB data',
			},
		});
	});

	it('disk routes hang off the UUID', async () => {
		respond(disk);
		await invoke(Storage.getDisk, {
			name: '05a61876-86f3-4b05-b0ec-53ee6fa03ced',
		});
		expectCall({
			path: '/v1/storage/disks/05a61876-86f3-4b05-b0ec-53ee6fa03ced',
			method: 'GET',
		});

		respond(disk);
		await invoke(Storage.updateDisk, { uuid: 'd-1', displayName: 'Web' });
		expectCall({
			path: '/v1/storage/disks/d-1',
			method: 'PATCH',
			body: { display_name: 'Web' },
		});

		respond({ deleted: true });
		await invoke(Storage.deleteDisk, { uuid: 'd-1' });
		expectCall({ path: '/v1/storage/disks/d-1', method: 'DELETE' });
	});

	it('bucket create uses PUT and get queries by name', async () => {
		respond(bucket);
		await invoke(Storage.createBucket, {
			name: 'pang1',
			billingAccountId: 129093,
		});
		expectCall({
			path: '/v1/storage/bucket',
			method: 'PUT',
			body: { name: 'pang1', billing_account_id: '129093' },
		});

		respond(bucket);
		await invoke(Storage.getBucket, { name: 'pang1' });
		expectCall({
			path: '/v1/storage/bucket',
			method: 'GET',
			query: { name: 'pang1' },
		});
	});

	it('bucket update PATCHes and delete queries by name', async () => {
		respond(bucket);
		await invoke(Storage.updateBucket, { name: 'pang1', billingAccountId: 2 });
		expectCall({
			path: '/v1/storage/bucket',
			method: 'PATCH',
			body: { name: 'pang1', billing_account_id: '2' },
		});

		respond({ deleted: true });
		await invoke(Storage.deleteBucket, { name: 'pang1' });
		expectCall({
			path: '/v1/storage/bucket',
			method: 'DELETE',
			query: { name: 'pang1' },
		});
	});

	it('bucket list hits the list route', async () => {
		respond(bucketsList);
		const page = (await invoke(Storage.listBuckets, {})) as Array<{
			name?: string;
		}>;
		expect(page[0]?.name).toBe('pang1');
		expectCall({ path: '/v1/storage/bucket/list', method: 'GET' });
	});
});

describe('network', () => {
	it('network create sends the name as a query parameter', async () => {
		respond(network);
		await invoke(Network.createNetwork, { name: 'network3' });
		expectCall({
			path: '/v1/network/network',
			method: 'POST',
			query: { name: 'network3' },
		});
	});

	it('network routes hang off the UUID', async () => {
		respond(network);
		await invoke(Network.getNetwork, { uuid: 'n-1' });
		expectCall({
			path: '/v1/network/network/n-1',
			method: 'GET',
		});

		respond(null);
		await invoke(Network.deleteNetwork, { uuid: 'n-1' });
		expectCall({ path: '/v1/network/network/n-1', method: 'DELETE' });
	});

	it('firewall create sends JSON rules', async () => {
		respond(firewall);
		await invoke(Network.createFirewall, {
			displayName: 'Database Firewall',
			billingAccountId: 123,
			rules: [
				{
					protocol: 'tcp',
					direction: 'inbound',
					portStart: 3306,
					portEnd: 3306,
					endpointSpecType: 'ip_prefixes',
					endpointSpec: ['10.0.0.0/24'],
				},
			],
		});
		expectCall({
			path: '/v1/network/firewalls',
			method: 'POST',
			body: {
				display_name: 'Database Firewall',
				billing_account_id: 123,
				rules: [
					{
						protocol: 'tcp',
						direction: 'inbound',
						port_start: 3306,
						port_end: 3306,
						endpoint_spec_type: 'ip_prefixes',
						endpoint_spec: ['10.0.0.0/24'],
					},
				],
			},
		});
		expect(lastRequest().headers.get('content-type')).toContain(
			'application/json',
		);
	});

	it('firewall list and delete hit the firewalls routes', async () => {
		respond(firewallsList);
		const page = (await invoke(Network.listFirewalls, {})) as Array<{
			uuid?: string;
		}>;
		expect(page[0]?.uuid).toBe(firewallsList[0]?.uuid);
		expectCall({ path: '/v1/network/firewalls', method: 'GET' });

		respond({ deleted: true });
		await invoke(Network.deleteFirewall, { uuid: 'f-1' });
		expectCall({ path: '/v1/network/firewalls/f-1', method: 'DELETE' });
	});
});
