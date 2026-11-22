/**
 * Response fixtures shaped after the Pilvio API docs
 * (api.pilvio.com Slate portal).
 */

export const invalidCredentials = {
	message: 'Invalid authentication credentials',
};
export const noRoute = {
	message: 'no route and no API found with those values',
};
export const vmNotFound = {
	errors: {
		Error:
			'No such virtual machine exists. aaaaaaaa-0000-bbbb-1111-cccccccccccc',
	},
};

export const user = {
	cookie_id: '61b0378574974ae88dbfec0feb9917bc',
	id: 8,
	last_activity: '2018-02-22 14:18:47',
	name: 'user@example.com',
	profile: {
		avatar: 'https://s.gravatar.com/avatar/bbb?s=480&r=pg',
		created_at: '2018-10-25 11:02:59',
		email: 'user@example.com',
		first_name: 'Cloudia',
		id: 22,
		last_name: 'Iaas',
		personal_id_number: '123456',
		phone_number: '+111111111',
		updated_at: '2021-05-18 11:07:00',
		user_id: 8,
	},
	state: {},
};

export const storageEntry = {
	created_at: '2018-02-22 14:24:30.312877',
	id: 8,
	name: 'sda',
	pool: 'default2',
	primary: true,
	replica: [],
	shared: false,
	size: 20,
	type: 'block',
	updated_at: null,
	user_id: 8,
	uuid: 'fc880f74-cf03-4a7a-93da-74c506157023',
};

export const vm = {
	backup: false,
	billing_account: 6,
	created_at: '2018-02-22 14:24:03',
	description: '',
	hostname: 'hostname',
	id: 10,
	mac: '52:54:00:a2:52:6a',
	memory: 2048,
	name: 'Ubuntu-16-04',
	os_name: 'ubuntu',
	os_version: '16.04',
	private_ipv4: '10.1.14.253',
	public_ipv6: '2a05:1cc0:10:30::80:fffb',
	status: 'running',
	storage: [storageEntry],
	tags: null,
	updated_at: '2018-02-22 14:24:13',
	user_id: 8,
	username: 'example',
	uuid: 'fc880f74-cf03-4a7a-93da-74c506157023',
	vcpu: 2,
};

export const vmsList = [vm];

export const stoppedVm = { ...vm, status: 'stopped' };

export const token = {
	billing_account_id: 6,
	consumer_id: '9b68f9e5-34a5-41bb-8938-944c17e38723',
	created_at: '2018-02-22 14:24:02',
	description: 'Token Description',
	id: 7,
	kong_id: '1dd6f9f7-f679-4ad0-a44d-9343c37a7dfb',
	restricted: true,
	token: 'PS2vfOCKuU52be83QZhMMndqOusfFkHr',
	updated_at: null,
	user_id: 8,
};

export const tokensList = [token];

export const sshKey = {
	uuid: '3f8f4c5a-2c6d-4f0a-9a3a-8c9f6e3f1a2b',
	name: 'laptop-mbp',
	public_key:
		'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMockPublicKeyData user@host',
	user_id: 268,
	created_at: '2025-01-12T09:21:33Z',
};

export const sshKeysList = [sshKey];

export const location = {
	display_name: 'Cycletown',
	is_default: true,
	is_preferred: false,
	description: 'The original location',
	order_nr: 1,
	slug: 'cyc01',
	country_code: 'est',
};

export const locationsList = [location];

export const vmImage = { os_name: 'ubuntu', os_version: '22.04-lts' };
export const vmImagesList = [vmImage];
export const bootImagesList = [{ id: 'rescue', name: 'Rescue ISO' }];
export const resourcePoolsList = [
	{ uuid: 'd2fc6881-9316-46d7-b515-b6cddaeee927', name: 'General purpose' },
];

export const pricingPolicy = {
	policy: [
		{
			numCpus: 1,
			policyId: 1001,
			price: 0.00521,
			resourceType: 'CPU',
			serviceNameUserFriendly: '1 CPU',
		},
		{
			megsRam: 512,
			policyId: 1010,
			price: 0.001645,
			resourceType: 'RAM',
			serviceNameUserFriendly: '0.5 GB RAM',
		},
	],
};

export const disk = {
	uuid: '05a61876-86f3-4b05-b0ec-53ee6fa03ced',
	status: 'Active',
	user_id: 28,
	billing_account_id: 129673,
	size_gb: 50,
	source_image_type: 'EMPTY',
	created_at: '2022-09-01T12:03:14.355+0000',
	updated_at: '2022-09-01T12:03:14.355+0000',
	storage_pool_uuid: '57a219ef-83fd-412c-8b6a-953ac292bc37',
};

export const diskWithSnapshots = {
	uuid: 'cef3a629-89b0-40ec-986b-4b6e831f9b64',
	status: 'Active',
	display_name: 'Web server main',
	snapshots: [
		{
			uuid: '8ae9b8e2-54b5-4163-b692-1327ec39ce35',
			size_gb: 20,
			display_name: 'before update',
			created_at: '2022-09-02T01:31:51.065+0000',
			disk_uuid: 'cef3a629-89b0-40ec-986b-4b6e831f9b64',
		},
	],
};

export const disksList = [disk];

export const bucket = {
	name: 'pang1',
	size_bytes: 3189211059,
	billing_account_id: 129093,
	num_objects: 5,
	created_at: '2021-01-22T12:57:13.808+0000',
	modified_at: '2021-01-22T14:57:13.694+0000',
	is_suspended: false,
};

export const bucketsList = [bucket];

export const network = {
	vlan_id: 104,
	subnet: '10.1.104.0/24',
	subnet_ipv6: '2a05:1cc0:10:30::40:0/112',
	name: 'network3',
	created_at: '2021-06-29 08:22:52',
	updated_at: '2021-06-29 08:22:52',
	uuid: '2e8cd389-27fe-45ce-a63d-d536068659e5',
	type: 'private',
	is_default: true,
	vm_uuids: [],
	resources_count: 0,
};

export const networksList = [network];

export const firewall = {
	uuid: '2a874f44-310f-4df8-9340-1dc274c2bd51',
	created_at: '2025-06-01 11:43:14',
	deleted_at: null,
	display_name: 'Database Firewall',
	user_id: 101,
	billing_account_id: 123,
	rules: [
		{
			uuid: 'db9acacd-91e1-4225-b934-7f264f9f75a2',
			direction: 'inbound',
			protocol: 'tcp',
			port_start: 3306,
			port_end: 3306,
			endpoint_spec_type: 'ip_prefixes',
			endpoint_spec: ['10.0.0.0/24'],
		},
	],
	resources_assigned: [],
};

export const firewallsList = [firewall];
