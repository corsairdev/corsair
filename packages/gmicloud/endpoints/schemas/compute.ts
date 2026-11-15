// Generated from the GMI Cloud OpenAPI spec: https://docs.gmicloud.ai/api-spec/service_api.yaml
import { z } from 'zod';

export const IdcName = z
	.string()
	.max(50)
	.regex(/^[a-zA-Z0-9._-]+$/);

export const UuidList = z.array(z.string());

export const BaremetalNetworkAddr = z.object({
	ip: z.string().optional(),
	type: z.enum(['internal', 'external']).optional(),
});

export const ProductName = z
	.string()
	.max(256)
	.regex(/^[a-zA-Z0-9._-]+$/);

export const BaremetalResp = z.object({
	associatedFirewalls: UuidList,
	consoleReady: z.boolean(),
	createdAt: z.string(),
	id: z.string(),
	idc: IdcName,
	image: z.string(),
	imageId: z.string(),
	name: z.string(),
	networks: z.array(BaremetalNetworkAddr),
	orgId: z.string(),
	product: ProductName,
	reason: z
		.string()
		.optional()
		.describe('The reason for the validation error.'),
	status: z.enum([
		'creating',
		'deleted',
		'deleting',
		'error',
		'powercycling',
		'rebooting',
		'rebuilding',
		'running',
		'starting',
		'stopped',
		'stopping',
		'unknown',
	]),
});

export const Name = z
	.string()
	.max(255)
	.regex(/^([A-Za-z0-9][A-Za-z0-9_\-. ]*)?[A-Za-z0-9]$/);

export const UuidObject = z.object({
	id: z.string(),
});

export const ProductType = z.enum(['Container', 'BareMetal', 'Storage', 'EIP']);

export const Product = z.object({
	gpuModel: z.string().optional(),
	idc: z.string(),
	name: z.string(),
	price: z.number().int(),
	productLine: z
		.string()
		.optional()
		.describe('product line for categorization'),
	// unknown: the OpenAPI spec types this as a free-form object.
	spec: z.record(z.string(), z.unknown()),
	type: ProductType,
	valid: z.boolean(),
});

export const ExternalIP = z.object({
	ipAddress: z.string(),
	status: z.enum(['ready', 'pending', 'error', 'not_applicable']),
});

export const ContainerStatus = z.enum([
	'unknown',
	'creating',
	'running',
	'terminating',
	'stopped',
	'error',
	'zombie',
]);

// mount persistent file systems in the container pod
export const Storage = z.object({
	containerPath: z
		.string()
		.max(4096)
		.regex(/^\/.+$/)
		.describe('Mounting root directory "/" is not allowed'),
	id: z.string(),
});

export const Env = z.object({
	name: z
		.string()
		.max(4096)
		.regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
	value: z.string().max(1048576),
});

export const ExposedPort = z.object({
	containerPort: z.number().int().min(0).max(65534),
	port: z.number().int().min(0).max(65534).optional(),
	protocol: z.enum(['TCP', 'UDP']),
});

export const ContainersResp = z.object({
	createdAt: z.string().optional(),
	eipAddress: z.string().optional(),
	eipId: z.string().optional(),
	firewalls: z.array(z.string()).optional(),
	id: z.string().optional(),
	inboundIP: ExternalIP.optional(),
	modifiedAt: z.string().optional(),
	orgId: z.string().optional(),
	outboundIP: ExternalIP.optional(),
	publicIP: ExternalIP.optional(),
	reason: z.string().describe('reason of container status'),
	status: ContainerStatus,
	storages: z.array(Storage),
	idc: IdcName,
	product: ProductName,
	args: z
		.array(z.string())
		.optional()
		.describe('Optional container command arguments'),
	command: z.string().optional().describe('Optional container start command'),
	envs: z.array(Env).optional(),
	name: Name,
	ports: z.array(ExposedPort).optional(),
	sshKeyIdList: UuidList.optional().describe(
		'The list of SSH key IDs to use in the container',
	),
	templateId: z.string().describe('template id'),
});

export const InstanceType = z.enum(['baremetal', 'container']).nullable();

export const ElasticIPResp = z.object({
	id: z.string(),
	orgId: z
		.string()
		.describe(
			'if nil, it means the elastic IP is not associated with any instance',
		),
	status: z.enum(['released', 'associated', 'disassociated']),
	internetConnectionType: z.enum(['BGP', 'Dual-Homed']),
	maxBandwidth: z.string().min(1).max(1048576),
	name: Name.describe('Name of the elastic IP'),
	idc: IdcName,
	ipAddress: z
		.string()
		.min(7)
		.max(39)
		.describe('IP address of the elastic IP.'),
	product: ProductName,
	instanceID: z
		.string()
		.nullable()
		.optional()
		.describe(
			'set instanceID and instanceType to associate the elastic IP to the instance, set to null to disassociate the elastic IP from the instance',
		),
	instanceType: InstanceType.optional(),
});

export const PortRange = z.object({
	max: z.number().int().min(1).max(65535),
	min: z.number().int().min(1).max(65535),
});

// CIDR notation
export const RemoteIpPrefix = z
	.string()
	.regex(/^[0-9]{1,3}(\.[0-9]{1,3}){3}\/[0-9]{1,2}$/);

export const FirewallRuleWithPortRange = z.object({
	description: z.string().max(255).optional(),
	portRange: PortRange,
	protocol: z.enum(['tcp', 'udp']),
	remoteIpPrefix: RemoteIpPrefix,
});

export const FirewallRuleWithoutPortRange = z.object({
	description: z.string().max(255).optional(),
	protocol: z.enum(['icmp', 'any']),
	remoteIpPrefix: RemoteIpPrefix,
});

export const FirewallRules = z.array(
	z.union([FirewallRuleWithPortRange, FirewallRuleWithoutPortRange]),
);

export const FirewallResp = z.object({
	description: z.string().max(255).optional(),
	inboundRules: FirewallRules,
	name: z.string().max(255),
	idc: IdcName,
	assoInstances: UuidList.optional(),
	assoContainers: UuidList.optional().describe(
		'Associated container instance IDs',
	),
	id: z.string().optional(),
	isPreset: z
		.boolean()
		.optional()
		.describe(
			'Whether this is a preset firewall (cannot be deleted or have rules modified)',
		),
	orgId: z.string().optional(),
	status: z.enum(['active', 'building', 'error']).optional(),
});

export const ImageBootMode = z.enum(['UEFI', 'Legacy']);

export const Partition = z.object({
	fileSystem: z.string().min(1).max(256),
	mountPoint: z.string().min(1).max(1024),
	name: Name,
	size: z.string().min(1).max(256),
});

export const ImageResp = z.object({
	supportedProducts: z.array(ProductName),
	BootMode: ImageBootMode,
	DefaultPartitionTable: z.array(Partition).min(1),
	OSArchitecture: z.string(),
	OSSeries: z.string(),
	OSVersion: z.string(),
	SystemDiskSize: z.string(),
	icon: z.string(),
	idc: IdcName,
	name: Name,
	orgId: z.string(),
	path: z.string(),
	createdAt: z.string(),
	id: z.string(),
	type: z.enum(['Public', 'Customized']),
});

export const Credential = z.object({
	secret: z.string().min(0).max(4096).optional(),
	username: z.string().min(0).max(4096).optional(),
});

export const TemplateResp = z.object({
	id: z.string(),
	official: z
		.boolean()
		.describe(
			"true means the template is provided by GMI Cloud and it's read only.",
		),
	orgId: z.string().optional(),
	credential: Credential.optional(),
	description: z.string().min(0).max(4096).optional(),
	name: Name,
	path: z.string().max(253).regex(/^\S+$/),
	status: z.enum(['draft', 'published', 'unpublished']).optional(),
});

export const VpcSubnet = z.object({
	cidr: z.string(),
	id: z.string(),
	name: z.string(),
});

export const Vpc = z.object({
	createdAt: z.string(),
	id: z.string(),
	idc: z.string(),
	name: z.string(),
	orgId: z.string(),
	subnets: z.array(VpcSubnet),
});
