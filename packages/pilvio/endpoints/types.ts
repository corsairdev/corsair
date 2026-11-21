import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** A disk attached to a VM or a standalone block storage disk. */
export const StorageEntrySchema = z
	.object({
		uuid: z.string().nullish().describe('Disk UUID'),
		name: z.string().nullish().describe('Device name, e.g. sda'),
		pool: z.string().nullish().describe('Storage pool'),
		primary: z.boolean().nullish().describe('Whether this is the boot disk'),
		replica: z
			.array(z.unknown())
			.nullish()
			.describe('Snapshots or replicas of the disk'),
		shared: z.boolean().nullish().describe('Whether the disk is shared'),
		size: z.number().nullish().describe('Size in GiB'),
		type: z.string().nullish().describe('Disk type, e.g. block'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
		user_id: z.number().nullish().describe('Owner user id'),
		id: z.number().nullish().describe('Disk numeric id'),
	})
	.loose()
	.describe('A storage entry');
export type StorageEntry = z.infer<typeof StorageEntrySchema>;

/** A virtual machine, as VM endpoints answer. */
export const VmSchema = z
	.object({
		uuid: z.string().nullish().describe('VM UUID'),
		id: z.number().nullish().describe('VM numeric id'),
		name: z.string().nullish().describe('VM name'),
		hostname: z.string().nullish().describe('Hostname'),
		description: z.string().nullish().describe('Description'),
		status: z.string().nullish().describe('running, stopped, …'),
		os_name: z.string().nullish().describe('OS name, e.g. ubuntu'),
		os_version: z.string().nullish().describe('OS version'),
		vcpu: z.number().nullish().describe('Virtual CPUs'),
		memory: z.number().nullish().describe('RAM in MiB'),
		mac: z.string().nullish().describe('MAC address'),
		private_ipv4: z.string().nullish().describe('Private IPv4'),
		public_ipv6: z.string().nullish().describe('Public IPv6'),
		username: z.string().nullish().describe('Login username'),
		backup: z.boolean().nullish().describe('Whether auto backup is on'),
		billing_account: z.number().nullish().describe('Billing account id'),
		storage: z.array(StorageEntrySchema).nullish().describe('Attached disks'),
		tags: z.unknown().nullish().describe('Tags'),
		user_id: z.number().nullish().describe('Owner user id'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('A Pilvio virtual machine');
export type Vm = z.infer<typeof VmSchema>;

/** A block storage disk, as disk endpoints answer. */
export const DiskSchema = z
	.object({
		uuid: z.string().nullish().describe('Disk UUID'),
		id: z.number().nullish().describe('Disk numeric id'),
		status: z.string().nullish().describe('Active, …'),
		display_name: z.string().nullish().describe('Display name'),
		size_gb: z.number().nullish().describe('Size in GiB'),
		source_image_type: z
			.string()
			.nullish()
			.describe('EMPTY, OS_BASE, DISK or SNAPSHOT'),
		billing_account_id: z.number().nullish().describe('Billing account id'),
		storage_pool_uuid: z.string().nullish().describe('Storage pool'),
		snapshots: z
			.array(
				z
					.object({
						uuid: z.string().nullish(),
						size_gb: z.number().nullish(),
						display_name: z.string().nullish(),
						created_at: z.string().nullish(),
						disk_uuid: z.string().nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe('Disk snapshots'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
		user_id: z.number().nullish().describe('Owner user id'),
	})
	.loose()
	.describe('A block storage disk');
export type Disk = z.infer<typeof DiskSchema>;

/** An S3 object storage bucket. */
export const BucketSchema = z
	.object({
		name: z.string().nullish().describe('Bucket name'),
		size_bytes: z.number().nullish().describe('Stored bytes'),
		num_objects: z.number().nullish().describe('Object count'),
		billing_account_id: z.number().nullish().describe('Billing account id'),
		is_suspended: z
			.boolean()
			.nullish()
			.describe('Whether the bucket is suspended'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		modified_at: z.string().nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('An object storage bucket');
export type Bucket = z.infer<typeof BucketSchema>;

/** A private network. */
export const NetworkSchema = z
	.object({
		uuid: z.string().nullish().describe('Network UUID'),
		name: z.string().nullish().describe('Network name'),
		type: z.string().nullish().describe('private or default'),
		vlan_id: z.number().nullish().describe('VLAN id'),
		subnet: z.string().nullish().describe('IPv4 subnet in CIDR notation'),
		subnet_ipv6: z.string().nullish().describe('IPv6 subnet in CIDR notation'),
		is_default: z
			.boolean()
			.nullish()
			.describe('Whether this is the user default network'),
		vm_uuids: z
			.array(z.string())
			.nullish()
			.describe('UUIDs of VMs on the network'),
		resources_count: z.number().nullish().describe('Resources on the network'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('A private network');
export type Network = z.infer<typeof NetworkSchema>;

/** One firewall rule, as the firewall endpoints accept and answer. */
export const FirewallRuleSchema = z
	.object({
		uuid: z.string().nullish().describe('Rule UUID'),
		protocol: z
			.enum(['tcp', 'udp', 'icmp'])
			.nullish()
			.describe('Rule protocol'),
		direction: z
			.enum(['inbound', 'outbound'])
			.nullish()
			.describe('Rule direction'),
		port_start: z.number().nullish().describe('First port of the range'),
		port_end: z.number().nullish().describe('Last port of the range'),
		endpoint_spec_type: z
			.enum(['ip_prefixes', 'any'])
			.nullish()
			.describe('How the rule endpoint is expressed'),
		endpoint_spec: z
			.array(z.string())
			.nullish()
			.describe('CIDR prefixes the rule applies to'),
	})
	.loose()
	.describe('A firewall rule');
export type FirewallRule = z.infer<typeof FirewallRuleSchema>;

/** A firewall with its rules and assigned resources. */
export const FirewallSchema = z
	.object({
		uuid: z.string().nullish().describe('Firewall UUID'),
		display_name: z.string().nullish().describe('Firewall name'),
		billing_account_id: z.number().nullish().describe('Billing account id'),
		rules: z.array(FirewallRuleSchema).nullish().describe('Firewall rules'),
		resources_assigned: z
			.array(z.unknown())
			.nullish()
			.describe('Resources the firewall is assigned to'),
		user_id: z.number().nullish().describe('Owner user id'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		deleted_at: z.string().nullish().describe('Deletion timestamp'),
	})
	.loose()
	.describe('A firewall');
export type Firewall = z.infer<typeof FirewallSchema>;

/** The authenticated user. */
export const UserSchema = z
	.object({
		id: z.number().nullish().describe('User id'),
		name: z.string().nullish().describe('Login name'),
		cookie_id: z.string().nullish().describe('Session cookie id'),
		last_activity: z.string().nullish().describe('Last activity timestamp'),
		profile: z
			.object({
				id: z.number().nullish(),
				user_id: z.number().nullish(),
				email: z.string().nullish(),
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
				phone_number: z.string().nullish(),
				personal_id_number: z.string().nullish(),
				avatar: z.string().nullish(),
				created_at: z.string().nullish(),
				updated_at: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('Profile details'),
		state: z.unknown().nullish().describe('User state'),
	})
	.loose()
	.describe('The authenticated Pilvio user');
export type User = z.infer<typeof UserSchema>;

/** An API token. */
export const TokenSchema = z
	.object({
		id: z.number().nullish().describe('Token id'),
		token: z.string().nullish().describe('The API token value'),
		description: z.string().nullish().describe('Token description'),
		restricted: z
			.boolean()
			.nullish()
			.describe('Whether the token is bound to one billing account'),
		billing_account_id: z
			.number()
			.nullish()
			.describe('Billing account a restricted token is bound to'),
		user_id: z.number().nullish().describe('Owner user id'),
		consumer_id: z.string().nullish().describe('Gateway consumer id'),
		kong_id: z.string().nullish().describe('Gateway token id'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('An API token');
export type Token = z.infer<typeof TokenSchema>;

/** An SSH public key. */
export const SshKeySchema = z
	.object({
		uuid: z.string().nullish().describe('Key UUID'),
		name: z.string().nullish().describe('Key name'),
		public_key: z.string().nullish().describe('OpenSSH public key material'),
		user_id: z.number().nullish().describe('Owner user id'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('An SSH public key');
export type SshKey = z.infer<typeof SshKeySchema>;

/** A Pilvio location (data centre). */
export const LocationSchema = z
	.object({
		slug: z
			.string()
			.nullish()
			.describe('Location slug used in URLs, e.g. cyc01'),
		display_name: z.string().nullish().describe('Location name'),
		description: z.string().nullish().describe('Location description'),
		country_code: z.string().nullish().describe('Country code'),
		is_default: z.boolean().nullish().describe('Served when no slug is given'),
		is_preferred: z.boolean().nullish().describe('Recommended location'),
		order_nr: z.number().nullish().describe('Display order'),
	})
	.loose()
	.describe('A Pilvio location');
export type Location = z.infer<typeof LocationSchema>;

/** A pricing policy line. */
export const PricingLineSchema = z
	.object({
		policyId: z.number().nullish().describe('Policy id'),
		resourceType: z.string().nullish().describe('CPU, RAM, STORAGE, …'),
		price: z.number().nullish().describe('Unit price'),
		serviceNameUserFriendly: z
			.string()
			.nullish()
			.describe('Human-readable service name'),
		numCpus: z.number().nullish().describe('CPU count the line prices'),
		megsRam: z.number().nullish().describe('RAM the line prices'),
		serviceNameInUptime: z.unknown().nullish().describe('Service attributes'),
	})
	.loose()
	.describe('A pricing policy line');
export type PricingLine = z.infer<typeof PricingLineSchema>;

/** The error envelope documented on write endpoints. */
export const PilvioErrorsSchema = z
	.object({
		errors: z
			// unknown: the docs show {"Error": "<message>"}; the shape stays open.
			.record(z.string(), z.unknown())
			.describe('Error details keyed by error name'),
	})
	.loose()
	.describe('A Pilvio business error');

// ── account ────────────────────────────────────────────────────────────────

export const UserGetInputSchema = z
	.object({})
	.describe('No input; serves the token user');
export type UserGetInput = z.infer<typeof UserGetInputSchema>;

export const UserOutputSchema = UserSchema.describe('The authenticated user');

export const UserUpdateProfileInputSchema = z
	.object({
		firstName: z.string().optional().describe('New first name'),
		lastName: z.string().optional().describe('New last name'),
		phoneNumber: z.string().optional().describe('New phone number'),
		personalIdNumber: z.string().optional().describe('New personal id number'),
	})
	.describe('Input for updating profile info');
export type UserUpdateProfileInput = z.infer<
	typeof UserUpdateProfileInputSchema
>;

export const UserUpdateProfileOutputSchema = UserSchema.describe(
	'The updated profile',
);

export const EmptyInputSchema = z.object({}).describe('No input parameters');
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const TokensListOutputSchema = z
	.array(TokenSchema)
	.describe('The user API tokens');

export const TokensCreateInputSchema = z
	.object({
		description: z.string().optional().describe('Token description'),
		billingAccountId: z
			.number()
			.int()
			.optional()
			.describe('Binds the token to one billing account (restricted)'),
		restricted: z
			.boolean()
			.optional()
			.describe('Restrict the token to billingAccountId'),
	})
	.describe('Input for creating an API token');
export type TokensCreateInput = z.infer<typeof TokensCreateInputSchema>;

export const TokensUpdateInputSchema = z
	.object({
		tokenId: z.number().int().describe('Id of the token to update'),
		description: z.string().optional().describe('New description'),
		restricted: z.boolean().optional().describe('New restricted flag'),
		billingAccountId: z
			.number()
			.int()
			.optional()
			.describe('Billing account for a restricted token'),
	})
	.describe('Input for updating an API token');
export type TokensUpdateInput = z.infer<typeof TokensUpdateInputSchema>;

export const TokensDeleteInputSchema = z
	.object({ tokenId: z.number().int().describe('Id of the token to delete') })
	.describe('Input for deleting an API token');
export type TokensDeleteInput = z.infer<typeof TokensDeleteInputSchema>;

export const SshKeysListOutputSchema = z
	.array(SshKeySchema)
	.describe('The user SSH public keys');

export const SshKeysCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Key name'),
		publicKey: z.string().min(1).describe('OpenSSH public key material'),
	})
	.describe('Input for adding an SSH key');
export type SshKeysCreateInput = z.infer<typeof SshKeysCreateInputSchema>;

export const SshKeysRenameInputSchema = z
	.object({
		uuid: z.string().min(1).describe('UUID of the key to rename'),
		name: z.string().min(1).describe('New key name'),
	})
	.describe('Input for renaming an SSH key');
export type SshKeysRenameInput = z.infer<typeof SshKeysRenameInputSchema>;

export const SshKeysDeleteInputSchema = z
	.object({ uuid: z.string().min(1).describe('UUID of the key to delete') })
	.describe('Input for deleting an SSH key');
export type SshKeysDeleteInput = z.infer<typeof SshKeysDeleteInputSchema>;

/**
 * SSH key delete typically returns 204 No Content per the docs; the
 * output accepts whatever comes back.
 */
export const SshKeysDeletedOutputSchema = z
	.unknown()
	.optional()
	.describe('The key was deleted (usually 204 with no body)');

// ── config ─────────────────────────────────────────────────────────────────

export const LocationsListOutputSchema = z
	.array(LocationSchema)
	.describe('The Pilvio locations');

export const VmImageSchema = z
	.object({
		os_name: z.string().nullish().describe('Image OS name'),
		os_version: z.string().nullish().describe('Image OS version'),
	})
	.loose()
	.describe('A VM image entry');

export const VmImagesListOutputSchema = z
	.array(VmImageSchema)
	.describe('The available VM images');

export const BootImageSchema = z
	.object({})
	.loose()
	.describe('A bootable media image');

export const BootImagesListOutputSchema = z
	.array(BootImageSchema)
	.describe('Bootable media images');

export const ResourcePoolSchema = z
	.object({})
	.loose()
	.describe('A VM server class (resource pool)');

export const ResourcePoolsListOutputSchema = z
	.array(ResourcePoolSchema)
	.describe('VM resource pools');

export const PricingPolicyOutputSchema = z
	.object({
		policy: z
			.array(PricingLineSchema)
			.describe('Pricing lines per resource type'),
	})
	.loose()
	.describe('The pricing policy');

// ── vm ─────────────────────────────────────────────────────────────────────

export const VmsListOutputSchema = z
	.array(VmSchema)
	.describe('The user virtual machines');

export const VmGetInputSchema = z
	.object({ uuid: z.string().min(1).describe('UUID of the VM') })
	.describe('Input for reading one VM');
export type VmGetInput = z.infer<typeof VmGetInputSchema>;

export const VmOutputSchema = VmSchema.describe('The virtual machine');

export const VmCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('VM name'),
		osName: z
			.string()
			.min(1)
			.describe('OS name from the image catalog, or _custom for an empty disk'),
		osVersion: z
			.string()
			.min(1)
			.describe('OS version from the image catalog, or _ for an empty disk'),
		disks: z.number().int().optional().describe('Boot disk size in GiB'),
		vcpu: z.number().int().optional().describe('Virtual CPUs'),
		ram: z.number().int().optional().describe('RAM in MiB'),
		designatedPoolUuid: z
			.string()
			.optional()
			.describe('Server class (resource pool) to host the VM on'),
		username: z.string().optional().describe('Login username'),
		password: z.string().optional().describe('Login password'),
		billingAccountId: z
			.number()
			.int()
			.optional()
			.describe('Billing account; optional for account-restricted tokens'),
		networkUuid: z
			.string()
			.optional()
			.describe('Private network; the default network when omitted'),
		reservePublicIp: z
			.boolean()
			.optional()
			.describe('Set false to create the VM without a public IPv4'),
		cloudInit: z
			.string()
			.optional()
			.describe('Cloud-init user data as a YAML or JSON object'),
		sourceUuid: z
			.string()
			.optional()
			.describe('VM UUID to create the VM from (copy of a backup or snapshot)'),
		sourceReplica: z
			.string()
			.optional()
			.describe('Snapshot or backup UUID used with sourceUuid'),
		diskUuid: z
			.string()
			.optional()
			.describe('Existing unattached disk to use as the boot disk'),
	})
	.describe('Input for creating a VM');
export type VmCreateInput = z.infer<typeof VmCreateInputSchema>;

export const VmStartStopInputSchema = z
	.object({ uuid: z.string().min(1).describe('UUID of the VM') })
	.describe('Input for starting or stopping a VM');
export type VmStartStopInput = z.infer<typeof VmStartStopInputSchema>;

export const VmReinstallInputSchema = z
	.object({
		uuid: z.string().min(1).describe('UUID of the VM to reinstall'),
		osName: z.string().min(1).describe('New OS name'),
		osVersion: z.string().min(1).describe('New OS version'),
	})
	.describe('Input for reinstalling a VM');
export type VmReinstallInput = z.infer<typeof VmReinstallInputSchema>;

export const VmDeleteInputSchema = z
	.object({ uuid: z.string().min(1).describe('UUID of the VM to delete') })
	.describe('Input for deleting a VM');
export type VmDeleteInput = z.infer<typeof VmDeleteInputSchema>;

/**
 * Delete answers `{"errors": …}` per the docs' example; the output stays
 * open.
 */
export const VmDeletedOutputSchema = z
	.object({})
	.loose()
	.describe('The delete answer; the docs show an error-keyed object');

// ── storage ────────────────────────────────────────────────────────────────

export const DisksListOutputSchema = z
	.array(DiskSchema)
	.describe('The user block storage disks');

export const DiskOutputSchema = DiskSchema.describe('The disk');

export const DisksCreateInputSchema = z
	.object({
		sizeGb: z
			.number()
			.int()
			.optional()
			.describe(
				'Size in GiB; required when not apparent from the source image',
			),
		sourceImageType: z
			.enum(['EMPTY', 'OS_BASE', 'DISK', 'SNAPSHOT'])
			.optional()
			.describe('What the disk starts from (default EMPTY)'),
		sourceImage: z
			.string()
			.optional()
			.describe('Image reference: e.g. ubuntu_20.04 for OS_BASE or a UUID'),
		displayName: z.string().optional().describe('Display name'),
		billingAccountId: z.number().int().optional().describe('Billing account'),
	})
	.describe('Input for creating a disk');
export type DisksCreateInput = z.infer<typeof DisksCreateInputSchema>;

export const DisksUpdateInputSchema = z
	.object({
		uuid: z.string().min(1).describe('UUID of the disk to update'),
		displayName: z.string().optional().describe('New display name'),
		billingAccountId: z.number().int().optional().describe('Billing account'),
	})
	.describe('Input for updating disk metadata');
export type DisksUpdateInput = z.infer<typeof DisksUpdateInputSchema>;

export const DisksDeleteInputSchema = z
	.object({ uuid: z.string().min(1).describe('UUID of the disk to delete') })
	.describe('Input for deleting a disk');
export type DisksDeleteInput = z.infer<typeof DisksDeleteInputSchema>;

export const BucketsListOutputSchema = z
	.array(BucketSchema)
	.describe('The user object storage buckets');

export const BucketOutputSchema = BucketSchema.describe('The bucket');

export const BucketsCreateInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe('Bucket name following S3 naming rules; globally unique'),
		billingAccountId: z
			.number()
			.int()
			.optional()
			.describe('Billing account; required for global API tokens'),
	})
	.describe('Input for creating a bucket');
export type BucketsCreateInput = z.infer<typeof BucketsCreateInputSchema>;

export const BucketsGetInputSchema = z
	.object({ name: z.string().min(1).describe('The bucket name') })
	.describe('Input for reading one bucket');
export type BucketsGetInput = z.infer<typeof BucketsGetInputSchema>;

export const BucketsUpdateInputSchema = z
	.object({
		name: z.string().min(1).describe('The bucket name'),
		billingAccountId: z
			.number()
			.int()
			.describe('Billing account to move it to'),
	})
	.describe('Input for updating a bucket');
export type BucketsUpdateInput = z.infer<typeof BucketsUpdateInputSchema>;

export const BucketsDeleteInputSchema = z
	.object({ name: z.string().min(1).describe('The bucket name') })
	.describe('Input for deleting a bucket');
export type BucketsDeleteInput = z.infer<typeof BucketsDeleteInputSchema>;

// ── network ────────────────────────────────────────────────────────────────

export const NetworksListOutputSchema = z
	.array(NetworkSchema)
	.describe('The user private networks');

export const NetworksGetInputSchema = z
	.object({ uuid: z.string().min(1).describe('UUID of the network') })
	.describe('Input for reading one network');
export type NetworksGetInput = z.infer<typeof NetworksGetInputSchema>;

export const NetworkOutputSchema = NetworkSchema.describe('The network');

export const NetworksCreateInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe('Descriptive network name, sent as the name query parameter'),
	})
	.describe('Input for creating a private network');
export type NetworksCreateInput = z.infer<typeof NetworksCreateInputSchema>;

export const NetworksDeleteInputSchema = z
	.object({
		uuid: z
			.string()
			.min(1)
			.describe('UUID of the network; it must be empty and not the default'),
	})
	.describe('Input for deleting a private network');
export type NetworksDeleteInput = z.infer<typeof NetworksDeleteInputSchema>;

export const NetworksDeletedOutputSchema = z
	.unknown()
	.optional()
	.describe('The network was deleted');

export const FirewallsListOutputSchema = z
	.array(FirewallSchema)
	.describe('The user firewalls');

export const FirewallOutputSchema = FirewallSchema.describe('The firewall');

export const FirewallsCreateInputSchema = z
	.object({
		displayName: z.string().min(1).describe('Firewall name'),
		billingAccountId: z.number().int().optional().describe('Billing account'),
		rules: z
			.array(
				z.object({
					protocol: z.enum(['tcp', 'udp', 'icmp']).describe('Rule protocol'),
					direction: z.enum(['inbound', 'outbound']).describe('Rule direction'),
					portStart: z.number().int().optional().describe('First port'),
					portEnd: z.number().int().optional().describe('Last port'),
					endpointSpecType: z
						.enum(['ip_prefixes', 'any'])
						.describe('How the endpoint is expressed'),
					endpointSpec: z
						.array(z.string())
						.optional()
						.describe('CIDR prefixes for endpointSpecType ip_prefixes'),
				}),
			)
			.describe('The firewall rules'),
	})
	.describe('Input for creating a firewall');
export type FirewallsCreateInput = z.infer<typeof FirewallsCreateInputSchema>;

export const FirewallsDeleteInputSchema = z
	.object({
		uuid: z.string().min(1).describe('UUID of the firewall to delete'),
	})
	.describe('Input for deleting a firewall');
export type FirewallsDeleteInput = z.infer<typeof FirewallsDeleteInputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PilvioEndpointInputSchemas = {
	userGet: UserGetInputSchema,
	userUpdateProfile: UserUpdateProfileInputSchema,
	tokensList: EmptyInputSchema,
	tokensCreate: TokensCreateInputSchema,
	tokensUpdate: TokensUpdateInputSchema,
	tokensDelete: TokensDeleteInputSchema,
	sshKeysList: EmptyInputSchema,
	sshKeysCreate: SshKeysCreateInputSchema,
	sshKeysRename: SshKeysRenameInputSchema,
	sshKeysDelete: SshKeysDeleteInputSchema,
	configListLocations: EmptyInputSchema,
	configListVmImages: EmptyInputSchema,
	configListPlainOsImages: EmptyInputSchema,
	configListAppCatalogImages: EmptyInputSchema,
	configListBootImages: EmptyInputSchema,
	configListResourcePools: EmptyInputSchema,
	configGetPricingPolicy: EmptyInputSchema,
	vmList: EmptyInputSchema,
	vmGet: VmGetInputSchema,
	vmCreate: VmCreateInputSchema,
	vmStart: VmStartStopInputSchema,
	vmStop: VmStartStopInputSchema,
	vmReinstall: VmReinstallInputSchema,
	vmDelete: VmDeleteInputSchema,
	disksList: EmptyInputSchema,
	disksCreate: DisksCreateInputSchema,
	disksGet: BucketsGetInputSchema,
	disksUpdate: DisksUpdateInputSchema,
	disksDelete: DisksDeleteInputSchema,
	bucketsList: EmptyInputSchema,
	bucketsCreate: BucketsCreateInputSchema,
	bucketsGet: BucketsGetInputSchema,
	bucketsUpdate: BucketsUpdateInputSchema,
	bucketsDelete: BucketsDeleteInputSchema,
	networksList: EmptyInputSchema,
	networksGet: NetworksGetInputSchema,
	networksCreate: NetworksCreateInputSchema,
	networksDelete: NetworksDeleteInputSchema,
	firewallsList: EmptyInputSchema,
	firewallsCreate: FirewallsCreateInputSchema,
	firewallsDelete: FirewallsDeleteInputSchema,
};

export const PilvioEndpointOutputSchemas = {
	userGet: UserOutputSchema,
	userUpdateProfile: UserUpdateProfileOutputSchema,
	tokensList: TokensListOutputSchema,
	tokensCreate: TokenSchema,
	tokensUpdate: TokenSchema,
	tokensDelete: VmDeletedOutputSchema,
	sshKeysList: SshKeysListOutputSchema,
	sshKeysCreate: SshKeySchema,
	sshKeysRename: SshKeySchema,
	sshKeysDelete: SshKeysDeletedOutputSchema,
	configListLocations: LocationsListOutputSchema,
	configListVmImages: VmImagesListOutputSchema,
	configListPlainOsImages: VmImagesListOutputSchema,
	configListAppCatalogImages: VmImagesListOutputSchema,
	configListBootImages: BootImagesListOutputSchema,
	configListResourcePools: ResourcePoolsListOutputSchema,
	configGetPricingPolicy: PricingPolicyOutputSchema,
	vmList: VmsListOutputSchema,
	vmGet: VmOutputSchema,
	vmCreate: VmOutputSchema,
	vmStart: VmOutputSchema,
	vmStop: VmOutputSchema,
	vmReinstall: VmOutputSchema,
	vmDelete: VmDeletedOutputSchema,
	disksList: DisksListOutputSchema,
	disksCreate: DiskOutputSchema,
	disksGet: DiskOutputSchema,
	disksUpdate: DiskOutputSchema,
	disksDelete: VmDeletedOutputSchema,
	bucketsList: BucketsListOutputSchema,
	bucketsCreate: BucketOutputSchema,
	bucketsGet: BucketOutputSchema,
	bucketsUpdate: BucketOutputSchema,
	bucketsDelete: VmDeletedOutputSchema,
	networksList: NetworksListOutputSchema,
	networksGet: NetworkOutputSchema,
	networksCreate: NetworkOutputSchema,
	networksDelete: NetworksDeletedOutputSchema,
	firewallsList: FirewallsListOutputSchema,
	firewallsCreate: FirewallOutputSchema,
	firewallsDelete: VmDeletedOutputSchema,
};

export type PilvioEndpointInputs = {
	[K in keyof typeof PilvioEndpointInputSchemas]: z.input<
		(typeof PilvioEndpointInputSchemas)[K]
	>;
};

export type PilvioEndpointOutputs = {
	[K in keyof typeof PilvioEndpointOutputSchemas]: z.infer<
		(typeof PilvioEndpointOutputSchemas)[K]
	>;
};
