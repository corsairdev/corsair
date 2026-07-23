import { z } from 'zod';

// DigitalOcean response payloads vary across 47 endpoints; per-route schemas are not yet mapped from API docs.
const DigitalOceanResponseSchema = z.unknown();
// Optional raw JSON body passthrough for operations with complex or dynamic request payloads.
const DigitalOceanOptionalBodySchema = z.unknown().optional();
// Nested API objects (tags, rules, node pools) are opaque until resource-specific schemas are added.
const DigitalOceanUnknownArraySchema = z.array(z.unknown());

// createCustomImage
const CreateCustomImageInputSchema = z.object({
	url: z.string(),
	name: z.string(),
	tags: DigitalOceanUnknownArraySchema.optional(),
	region: z.string(),
	description: z.string().optional(),
	distribution: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateCustomImageInput = z.infer<
	typeof CreateCustomImageInputSchema
>;
const CreateCustomImageResponseSchema = DigitalOceanResponseSchema;
export type CreateCustomImageResponse = z.infer<
	typeof CreateCustomImageResponseSchema
>;

// createDatabaseCluster
const CreateDatabaseClusterInputSchema = z.object({
	name: z.string(),
	size: z.string(),
	tags: DigitalOceanUnknownArraySchema.optional(),
	engine: z.string().optional(),
	region: z.string(),
	version: z.string(),
	db_names: DigitalOceanUnknownArraySchema.optional(),
	sql_mode: z.string().optional(),
	num_nodes: z.number().int(),
	user_names: DigitalOceanUnknownArraySchema.optional(),
	backup_restore: z.record(z.string(), z.unknown()).optional(),
	eviction_policy: z.string().optional(),
	storage_size_gb: z.number().int().optional(),
	maintenance_window: z.record(z.string(), z.unknown()).optional(),
	private_network_uuid: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDatabaseClusterInput = z.infer<
	typeof CreateDatabaseClusterInputSchema
>;
const CreateDatabaseClusterResponseSchema = DigitalOceanResponseSchema;
export type CreateDatabaseClusterResponse = z.infer<
	typeof CreateDatabaseClusterResponseSchema
>;

// createNewBlockStorageVolume
const CreateNewBlockStorageVolumeInputSchema = z.object({
	name: z.string(),
	tags: DigitalOceanUnknownArraySchema.optional(),
	region: z.string(),
	description: z.string().optional(),
	snapshot_id: z.string().optional(),
	size_gigabytes: z.number().int(),
	filesystem_type: z.string().optional(),
	filesystem_label: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewBlockStorageVolumeInput = z.infer<
	typeof CreateNewBlockStorageVolumeInputSchema
>;
const CreateNewBlockStorageVolumeResponseSchema = DigitalOceanResponseSchema;
export type CreateNewBlockStorageVolumeResponse = z.infer<
	typeof CreateNewBlockStorageVolumeResponseSchema
>;

// createNewDomain
const CreateNewDomainInputSchema = z.object({
	name: z.string(),
	ip_address: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewDomainInput = z.infer<typeof CreateNewDomainInputSchema>;
const CreateNewDomainResponseSchema = DigitalOceanResponseSchema;
export type CreateNewDomainResponse = z.infer<
	typeof CreateNewDomainResponseSchema
>;

// createNewDomainRecord
const CreateNewDomainRecordInputSchema = z.object({
	tag: z.string().optional(),
	ttl: z.number().int().optional(),
	data: z.string(),
	name: z.string().optional(),
	port: z.number().int().optional(),
	type: z.string().optional(),
	flags: z.number().int().optional(),
	weight: z.number().int().optional(),
	priority: z.number().int().optional(),
	domain_name: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewDomainRecordInput = z.infer<
	typeof CreateNewDomainRecordInputSchema
>;
const CreateNewDomainRecordResponseSchema = DigitalOceanResponseSchema;
export type CreateNewDomainRecordResponse = z.infer<
	typeof CreateNewDomainRecordResponseSchema
>;

// createNewDroplet
const CreateNewDropletInputSchema = z.object({
	ipv6: z.boolean().optional(),
	name: z.string(),
	size: z.string(),
	tags: DigitalOceanUnknownArraySchema.optional(),
	image: z.string(),
	region: z.string(),
	backups: z.boolean().optional(),
	volumes: DigitalOceanUnknownArraySchema.optional(),
	ssh_keys: DigitalOceanUnknownArraySchema.optional(),
	vpc_uuid: z.string().optional(),
	user_data: z.string().optional(),
	monitoring: z.boolean().optional(),
	private_networking: z.boolean().optional(),
	with_droplet_agent: z.boolean().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewDropletInput = z.infer<typeof CreateNewDropletInputSchema>;
const CreateNewDropletResponseSchema = DigitalOceanResponseSchema;
export type CreateNewDropletResponse = z.infer<
	typeof CreateNewDropletResponseSchema
>;

// createNewFirewall
const CreateNewFirewallInputSchema = z.object({
	name: z.string(),
	tags: DigitalOceanUnknownArraySchema.optional(),
	vpc_uuid: z.string().optional(),
	droplet_ids: DigitalOceanUnknownArraySchema.optional(),
	inbound_rules: DigitalOceanUnknownArraySchema,
	outbound_rules: DigitalOceanUnknownArraySchema,
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewFirewallInput = z.infer<
	typeof CreateNewFirewallInputSchema
>;
const CreateNewFirewallResponseSchema = DigitalOceanResponseSchema;
export type CreateNewFirewallResponse = z.infer<
	typeof CreateNewFirewallResponseSchema
>;

// createNewKubernetesCluster
const CreateNewKubernetesClusterInputSchema = z.object({
	name: z.string(),
	tags: DigitalOceanUnknownArraySchema.optional(),
	region: z.string(),
	version: z.string(),
	node_pools: DigitalOceanUnknownArraySchema,
	auto_upgrade: z.boolean().optional(),
	maintenance_policy: z.record(z.string(), z.unknown()).optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewKubernetesClusterInput = z.infer<
	typeof CreateNewKubernetesClusterInputSchema
>;
const CreateNewKubernetesClusterResponseSchema = DigitalOceanResponseSchema;
export type CreateNewKubernetesClusterResponse = z.infer<
	typeof CreateNewKubernetesClusterResponseSchema
>;

// createNewLoadBalancer
const CreateNewLoadBalancerInputSchema = z.object({
	tag: z.string().optional(),
	name: z.string(),
	region: z.string(),
	vpc_uuid: z.string().optional(),
	algorithm: z.string().optional(),
	droplet_ids: DigitalOceanUnknownArraySchema.optional(),
	health_check: z.record(z.string(), z.unknown()).optional(),
	firewall_policy: z.string().optional(),
	sticky_sessions: z.record(z.string(), z.unknown()).optional(),
	forwarding_rules: DigitalOceanUnknownArraySchema,
	enable_proxy_protocol: z.boolean().optional(),
	redirect_http_to_https: z.boolean().optional(),
	enable_backend_keepalive: z.boolean().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewLoadBalancerInput = z.infer<
	typeof CreateNewLoadBalancerInputSchema
>;
const CreateNewLoadBalancerResponseSchema = DigitalOceanResponseSchema;
export type CreateNewLoadBalancerResponse = z.infer<
	typeof CreateNewLoadBalancerResponseSchema
>;

// createNewSshKey
const CreateNewSshKeyInputSchema = z.object({
	name: z.string(),
	public_key: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewSshKeyInput = z.infer<typeof CreateNewSshKeyInputSchema>;
const CreateNewSshKeyResponseSchema = DigitalOceanResponseSchema;
export type CreateNewSshKeyResponse = z.infer<
	typeof CreateNewSshKeyResponseSchema
>;

// createNewTag
const CreateNewTagInputSchema = z.object({
	name: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewTagInput = z.infer<typeof CreateNewTagInputSchema>;
const CreateNewTagResponseSchema = DigitalOceanResponseSchema;
export type CreateNewTagResponse = z.infer<typeof CreateNewTagResponseSchema>;

// createNewVpc
const CreateNewVpcInputSchema = z.object({
	name: z.string(),
	tags: DigitalOceanUnknownArraySchema.optional(),
	region: z.string(),
	ip_range: z.string().optional(),
	description: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewVpcInput = z.infer<typeof CreateNewVpcInputSchema>;
const CreateNewVpcResponseSchema = DigitalOceanResponseSchema;
export type CreateNewVpcResponse = z.infer<typeof CreateNewVpcResponseSchema>;

// deleteBlockStorageVolume
const DeleteBlockStorageVolumeInputSchema = z.object({
	volume_id: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteBlockStorageVolumeInput = z.infer<
	typeof DeleteBlockStorageVolumeInputSchema
>;
const DeleteBlockStorageVolumeResponseSchema = DigitalOceanResponseSchema;
export type DeleteBlockStorageVolumeResponse = z.infer<
	typeof DeleteBlockStorageVolumeResponseSchema
>;

// deleteDatabaseCluster
const DeleteDatabaseClusterInputSchema = z.object({
	database_cluster_uuid: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDatabaseClusterInput = z.infer<
	typeof DeleteDatabaseClusterInputSchema
>;
const DeleteDatabaseClusterResponseSchema = DigitalOceanResponseSchema;
export type DeleteDatabaseClusterResponse = z.infer<
	typeof DeleteDatabaseClusterResponseSchema
>;

// deleteDomain
const DeleteDomainInputSchema = z.object({
	name: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDomainInput = z.infer<typeof DeleteDomainInputSchema>;
const DeleteDomainResponseSchema = DigitalOceanResponseSchema;
export type DeleteDomainResponse = z.infer<typeof DeleteDomainResponseSchema>;

// deleteDomainRecord
const DeleteDomainRecordInputSchema = z.object({
	domain_name: z.string(),
	record_id: z.number().int(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDomainRecordInput = z.infer<
	typeof DeleteDomainRecordInputSchema
>;
const DeleteDomainRecordResponseSchema = DigitalOceanResponseSchema;
export type DeleteDomainRecordResponse = z.infer<
	typeof DeleteDomainRecordResponseSchema
>;

// deleteExistingDroplet
const DeleteExistingDropletInputSchema = z.object({
	droplet_id: z.number().int(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteExistingDropletInput = z.infer<
	typeof DeleteExistingDropletInputSchema
>;
const DeleteExistingDropletResponseSchema = DigitalOceanResponseSchema;
export type DeleteExistingDropletResponse = z.infer<
	typeof DeleteExistingDropletResponseSchema
>;

// deleteFirewall
const DeleteFirewallInputSchema = z.object({
	firewall_id: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteFirewallInput = z.infer<typeof DeleteFirewallInputSchema>;
const DeleteFirewallResponseSchema = DigitalOceanResponseSchema;
export type DeleteFirewallResponse = z.infer<
	typeof DeleteFirewallResponseSchema
>;

// deleteImage
const DeleteImageInputSchema = z.object({
	image_id: z.number().int(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteImageInput = z.infer<typeof DeleteImageInputSchema>;
const DeleteImageResponseSchema = DigitalOceanResponseSchema;
export type DeleteImageResponse = z.infer<typeof DeleteImageResponseSchema>;

// deleteLoadBalancer
const DeleteLoadBalancerInputSchema = z.object({
	load_balancer_id: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteLoadBalancerInput = z.infer<
	typeof DeleteLoadBalancerInputSchema
>;
const DeleteLoadBalancerResponseSchema = DigitalOceanResponseSchema;
export type DeleteLoadBalancerResponse = z.infer<
	typeof DeleteLoadBalancerResponseSchema
>;

// deleteSshKey
const DeleteSshKeyInputSchema = z.object({
	key_id_or_fingerprint: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteSshKeyInput = z.infer<typeof DeleteSshKeyInputSchema>;
const DeleteSshKeyResponseSchema = DigitalOceanResponseSchema;
export type DeleteSshKeyResponse = z.infer<typeof DeleteSshKeyResponseSchema>;

// deleteTag
const DeleteTagInputSchema = z.object({
	name: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteTagInput = z.infer<typeof DeleteTagInputSchema>;
const DeleteTagResponseSchema = DigitalOceanResponseSchema;
export type DeleteTagResponse = z.infer<typeof DeleteTagResponseSchema>;

// deleteVpc
const DeleteVpcInputSchema = z.object({
	vpc_id: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteVpcInput = z.infer<typeof DeleteVpcInputSchema>;
const DeleteVpcResponseSchema = DigitalOceanResponseSchema;
export type DeleteVpcResponse = z.infer<typeof DeleteVpcResponseSchema>;

// listAllDatabases
const ListAllDatabasesInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	tag_name: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllDatabasesInput = z.infer<typeof ListAllDatabasesInputSchema>;
const ListAllDatabasesResponseSchema = DigitalOceanResponseSchema;
export type ListAllDatabasesResponse = z.infer<
	typeof ListAllDatabasesResponseSchema
>;

// listAllDomains
const ListAllDomainsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllDomainsInput = z.infer<typeof ListAllDomainsInputSchema>;
const ListAllDomainsResponseSchema = DigitalOceanResponseSchema;
export type ListAllDomainsResponse = z.infer<
	typeof ListAllDomainsResponseSchema
>;

// listAllDroplets
const ListAllDropletsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	tag_name: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllDropletsInput = z.infer<typeof ListAllDropletsInputSchema>;
const ListAllDropletsResponseSchema = DigitalOceanResponseSchema;
export type ListAllDropletsResponse = z.infer<
	typeof ListAllDropletsResponseSchema
>;

// listAllFirewalls
const ListAllFirewallsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllFirewallsInput = z.infer<typeof ListAllFirewallsInputSchema>;
const ListAllFirewallsResponseSchema = DigitalOceanResponseSchema;
export type ListAllFirewallsResponse = z.infer<
	typeof ListAllFirewallsResponseSchema
>;

// listAllImages
const ListAllImagesInputSchema = z.object({
	page: z.number().int().optional(),
	type: z.string().optional(),
	private: z.boolean().optional(),
	per_page: z.number().int().optional(),
	tag_name: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllImagesInput = z.infer<typeof ListAllImagesInputSchema>;
const ListAllImagesResponseSchema = DigitalOceanResponseSchema;
export type ListAllImagesResponse = z.infer<typeof ListAllImagesResponseSchema>;

// listAllKubernetesClusters
const ListAllKubernetesClustersInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllKubernetesClustersInput = z.infer<
	typeof ListAllKubernetesClustersInputSchema
>;
const ListAllKubernetesClustersResponseSchema = DigitalOceanResponseSchema;
export type ListAllKubernetesClustersResponse = z.infer<
	typeof ListAllKubernetesClustersResponseSchema
>;

// listAllLoadBalancers
const ListAllLoadBalancersInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllLoadBalancersInput = z.infer<
	typeof ListAllLoadBalancersInputSchema
>;
const ListAllLoadBalancersResponseSchema = DigitalOceanResponseSchema;
export type ListAllLoadBalancersResponse = z.infer<
	typeof ListAllLoadBalancersResponseSchema
>;

// listAllSnapshots
const ListAllSnapshotsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	resource_type: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllSnapshotsInput = z.infer<typeof ListAllSnapshotsInputSchema>;
const ListAllSnapshotsResponseSchema = DigitalOceanResponseSchema;
export type ListAllSnapshotsResponse = z.infer<
	typeof ListAllSnapshotsResponseSchema
>;

// listAllSshKeys
const ListAllSshKeysInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllSshKeysInput = z.infer<typeof ListAllSshKeysInputSchema>;
const ListAllSshKeysResponseSchema = DigitalOceanResponseSchema;
export type ListAllSshKeysResponse = z.infer<
	typeof ListAllSshKeysResponseSchema
>;

// listAllTags
const ListAllTagsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllTagsInput = z.infer<typeof ListAllTagsInputSchema>;
const ListAllTagsResponseSchema = DigitalOceanResponseSchema;
export type ListAllTagsResponse = z.infer<typeof ListAllTagsResponseSchema>;

// listAllVolumes
const ListAllVolumesInputSchema = z.object({
	name: z.string().optional(),
	page: z.number().int().optional(),
	region: z.string().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllVolumesInput = z.infer<typeof ListAllVolumesInputSchema>;
const ListAllVolumesResponseSchema = DigitalOceanResponseSchema;
export type ListAllVolumesResponse = z.infer<
	typeof ListAllVolumesResponseSchema
>;

// listAllVpcs
const ListAllVpcsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllVpcsInput = z.infer<typeof ListAllVpcsInputSchema>;
const ListAllVpcsResponseSchema = DigitalOceanResponseSchema;
export type ListAllVpcsResponse = z.infer<typeof ListAllVpcsResponseSchema>;

// listDatabaseOptions
const ListDatabaseOptionsInputSchema = z.object({
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListDatabaseOptionsInput = z.infer<
	typeof ListDatabaseOptionsInputSchema
>;
const ListDatabaseOptionsResponseSchema = DigitalOceanResponseSchema;
export type ListDatabaseOptionsResponse = z.infer<
	typeof ListDatabaseOptionsResponseSchema
>;

// listDomainRecords
const ListDomainRecordsInputSchema = z.object({
	page: z.number().int().optional(),
	type: z.string().optional(),
	per_page: z.number().int().optional(),
	domain_name: z.string(),
	record_name: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListDomainRecordsInput = z.infer<
	typeof ListDomainRecordsInputSchema
>;
const ListDomainRecordsResponseSchema = DigitalOceanResponseSchema;
export type ListDomainRecordsResponse = z.infer<
	typeof ListDomainRecordsResponseSchema
>;

// retrieveDomain
const RetrieveDomainInputSchema = z.object({
	name: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveDomainInput = z.infer<typeof RetrieveDomainInputSchema>;
const RetrieveDomainResponseSchema = DigitalOceanResponseSchema;
export type RetrieveDomainResponse = z.infer<
	typeof RetrieveDomainResponseSchema
>;

// retrieveDomainRecord
const RetrieveDomainRecordInputSchema = z.object({
	domain_name: z.string(),
	record_id: z.number().int(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveDomainRecordInput = z.infer<
	typeof RetrieveDomainRecordInputSchema
>;
const RetrieveDomainRecordResponseSchema = DigitalOceanResponseSchema;
export type RetrieveDomainRecordResponse = z.infer<
	typeof RetrieveDomainRecordResponseSchema
>;

// retrieveExistingDroplet
const RetrieveExistingDropletInputSchema = z.object({
	droplet_id: z.number().int(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveExistingDropletInput = z.infer<
	typeof RetrieveExistingDropletInputSchema
>;
const RetrieveExistingDropletResponseSchema = DigitalOceanResponseSchema;
export type RetrieveExistingDropletResponse = z.infer<
	typeof RetrieveExistingDropletResponseSchema
>;

// retrieveExistingImage
const RetrieveExistingImageInputSchema = z.object({
	image_id: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveExistingImageInput = z.infer<
	typeof RetrieveExistingImageInputSchema
>;
const RetrieveExistingImageResponseSchema = DigitalOceanResponseSchema;
export type RetrieveExistingImageResponse = z.infer<
	typeof RetrieveExistingImageResponseSchema
>;

// retrieveTag
const RetrieveTagInputSchema = z.object({
	name: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveTagInput = z.infer<typeof RetrieveTagInputSchema>;
const RetrieveTagResponseSchema = DigitalOceanResponseSchema;
export type RetrieveTagResponse = z.infer<typeof RetrieveTagResponseSchema>;

// retrieveVpc
const RetrieveVpcInputSchema = z.object({
	vpc_uuid: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveVpcInput = z.infer<typeof RetrieveVpcInputSchema>;
const RetrieveVpcResponseSchema = DigitalOceanResponseSchema;
export type RetrieveVpcResponse = z.infer<typeof RetrieveVpcResponseSchema>;

// tagResource
const TagResourceInputSchema = z.object({
	tag_name: z.string(),
	resources: DigitalOceanUnknownArraySchema,
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type TagResourceInput = z.infer<typeof TagResourceInputSchema>;
const TagResourceResponseSchema = DigitalOceanResponseSchema;
export type TagResourceResponse = z.infer<typeof TagResourceResponseSchema>;

// untagResource
const UntagResourceInputSchema = z.object({
	tag_name: z.string(),
	resources: DigitalOceanUnknownArraySchema,
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type UntagResourceInput = z.infer<typeof UntagResourceInputSchema>;
const UntagResourceResponseSchema = DigitalOceanResponseSchema;
export type UntagResourceResponse = z.infer<typeof UntagResourceResponseSchema>;

// updateDomainRecord
const UpdateDomainRecordInputSchema = z.object({
	tag: z.string().optional(),
	ttl: z.number().int().optional(),
	data: z.string().optional(),
	name: z.string().optional(),
	port: z.number().int().optional(),
	type: z.string().optional(),
	flags: z.number().int().optional(),
	weight: z.number().int().optional(),
	priority: z.number().int().optional(),
	record_id: z.number().int(),
	domain_name: z.string(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDomainRecordInput = z.infer<
	typeof UpdateDomainRecordInputSchema
>;
const UpdateDomainRecordResponseSchema = DigitalOceanResponseSchema;
export type UpdateDomainRecordResponse = z.infer<
	typeof UpdateDomainRecordResponseSchema
>;

// updateVpc
const UpdateVpcInputSchema = z.object({
	name: z.string().optional(),
	vpc_id: z.string(),
	default: z.boolean().optional(),
	description: z.string().optional(),
	body: DigitalOceanOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateVpcInput = z.infer<typeof UpdateVpcInputSchema>;
const UpdateVpcResponseSchema = DigitalOceanResponseSchema;
export type UpdateVpcResponse = z.infer<typeof UpdateVpcResponseSchema>;

export const DigitalOceanEndpointInputSchemas = {
	createCustomImage: CreateCustomImageInputSchema,
	createDatabaseCluster: CreateDatabaseClusterInputSchema,
	createNewBlockStorageVolume: CreateNewBlockStorageVolumeInputSchema,
	createNewDomain: CreateNewDomainInputSchema,
	createNewDomainRecord: CreateNewDomainRecordInputSchema,
	createNewDroplet: CreateNewDropletInputSchema,
	createNewFirewall: CreateNewFirewallInputSchema,
	createNewKubernetesCluster: CreateNewKubernetesClusterInputSchema,
	createNewLoadBalancer: CreateNewLoadBalancerInputSchema,
	createNewSshKey: CreateNewSshKeyInputSchema,
	createNewTag: CreateNewTagInputSchema,
	createNewVpc: CreateNewVpcInputSchema,
	deleteBlockStorageVolume: DeleteBlockStorageVolumeInputSchema,
	deleteDatabaseCluster: DeleteDatabaseClusterInputSchema,
	deleteDomain: DeleteDomainInputSchema,
	deleteDomainRecord: DeleteDomainRecordInputSchema,
	deleteExistingDroplet: DeleteExistingDropletInputSchema,
	deleteFirewall: DeleteFirewallInputSchema,
	deleteImage: DeleteImageInputSchema,
	deleteLoadBalancer: DeleteLoadBalancerInputSchema,
	deleteSshKey: DeleteSshKeyInputSchema,
	deleteTag: DeleteTagInputSchema,
	deleteVpc: DeleteVpcInputSchema,
	listAllDatabases: ListAllDatabasesInputSchema,
	listAllDomains: ListAllDomainsInputSchema,
	listAllDroplets: ListAllDropletsInputSchema,
	listAllFirewalls: ListAllFirewallsInputSchema,
	listAllImages: ListAllImagesInputSchema,
	listAllKubernetesClusters: ListAllKubernetesClustersInputSchema,
	listAllLoadBalancers: ListAllLoadBalancersInputSchema,
	listAllSnapshots: ListAllSnapshotsInputSchema,
	listAllSshKeys: ListAllSshKeysInputSchema,
	listAllTags: ListAllTagsInputSchema,
	listAllVolumes: ListAllVolumesInputSchema,
	listAllVpcs: ListAllVpcsInputSchema,
	listDatabaseOptions: ListDatabaseOptionsInputSchema,
	listDomainRecords: ListDomainRecordsInputSchema,
	retrieveDomain: RetrieveDomainInputSchema,
	retrieveDomainRecord: RetrieveDomainRecordInputSchema,
	retrieveExistingDroplet: RetrieveExistingDropletInputSchema,
	retrieveExistingImage: RetrieveExistingImageInputSchema,
	retrieveTag: RetrieveTagInputSchema,
	retrieveVpc: RetrieveVpcInputSchema,
	tagResource: TagResourceInputSchema,
	untagResource: UntagResourceInputSchema,
	updateDomainRecord: UpdateDomainRecordInputSchema,
	updateVpc: UpdateVpcInputSchema,
} as const;

export type DigitalOceanEndpointInputs = {
	[K in keyof typeof DigitalOceanEndpointInputSchemas]: z.infer<
		(typeof DigitalOceanEndpointInputSchemas)[K]
	>;
};

export const DigitalOceanEndpointOutputSchemas = {
	createCustomImage: CreateCustomImageResponseSchema,
	createDatabaseCluster: CreateDatabaseClusterResponseSchema,
	createNewBlockStorageVolume: CreateNewBlockStorageVolumeResponseSchema,
	createNewDomain: CreateNewDomainResponseSchema,
	createNewDomainRecord: CreateNewDomainRecordResponseSchema,
	createNewDroplet: CreateNewDropletResponseSchema,
	createNewFirewall: CreateNewFirewallResponseSchema,
	createNewKubernetesCluster: CreateNewKubernetesClusterResponseSchema,
	createNewLoadBalancer: CreateNewLoadBalancerResponseSchema,
	createNewSshKey: CreateNewSshKeyResponseSchema,
	createNewTag: CreateNewTagResponseSchema,
	createNewVpc: CreateNewVpcResponseSchema,
	deleteBlockStorageVolume: DeleteBlockStorageVolumeResponseSchema,
	deleteDatabaseCluster: DeleteDatabaseClusterResponseSchema,
	deleteDomain: DeleteDomainResponseSchema,
	deleteDomainRecord: DeleteDomainRecordResponseSchema,
	deleteExistingDroplet: DeleteExistingDropletResponseSchema,
	deleteFirewall: DeleteFirewallResponseSchema,
	deleteImage: DeleteImageResponseSchema,
	deleteLoadBalancer: DeleteLoadBalancerResponseSchema,
	deleteSshKey: DeleteSshKeyResponseSchema,
	deleteTag: DeleteTagResponseSchema,
	deleteVpc: DeleteVpcResponseSchema,
	listAllDatabases: ListAllDatabasesResponseSchema,
	listAllDomains: ListAllDomainsResponseSchema,
	listAllDroplets: ListAllDropletsResponseSchema,
	listAllFirewalls: ListAllFirewallsResponseSchema,
	listAllImages: ListAllImagesResponseSchema,
	listAllKubernetesClusters: ListAllKubernetesClustersResponseSchema,
	listAllLoadBalancers: ListAllLoadBalancersResponseSchema,
	listAllSnapshots: ListAllSnapshotsResponseSchema,
	listAllSshKeys: ListAllSshKeysResponseSchema,
	listAllTags: ListAllTagsResponseSchema,
	listAllVolumes: ListAllVolumesResponseSchema,
	listAllVpcs: ListAllVpcsResponseSchema,
	listDatabaseOptions: ListDatabaseOptionsResponseSchema,
	listDomainRecords: ListDomainRecordsResponseSchema,
	retrieveDomain: RetrieveDomainResponseSchema,
	retrieveDomainRecord: RetrieveDomainRecordResponseSchema,
	retrieveExistingDroplet: RetrieveExistingDropletResponseSchema,
	retrieveExistingImage: RetrieveExistingImageResponseSchema,
	retrieveTag: RetrieveTagResponseSchema,
	retrieveVpc: RetrieveVpcResponseSchema,
	tagResource: TagResourceResponseSchema,
	untagResource: UntagResourceResponseSchema,
	updateDomainRecord: UpdateDomainRecordResponseSchema,
	updateVpc: UpdateVpcResponseSchema,
} as const;

export type DigitalOceanEndpointOutputs = {
	[K in keyof typeof DigitalOceanEndpointOutputSchemas]: z.infer<
		(typeof DigitalOceanEndpointOutputSchemas)[K]
	>;
};

export type DigitalOceanEndpointInput =
	DigitalOceanEndpointInputs[keyof DigitalOceanEndpointInputs] & {
		[key: string]: unknown;
	};
