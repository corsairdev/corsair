import { z } from 'zod';

// createCustomImage
const CreateCustomImageInputSchema = z.object({
	url: z.string(),
	name: z.string(),
	tags: z.array(z.unknown()).optional(),
	region: z.string(),
	description: z.string().optional(),
	distribution: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateCustomImageInput = z.infer<typeof CreateCustomImageInputSchema>;
const CreateCustomImageResponseSchema = z.unknown();
export type CreateCustomImageResponse = z.infer<typeof CreateCustomImageResponseSchema>;

// createDatabaseCluster
const CreateDatabaseClusterInputSchema = z.object({
	name: z.string(),
	size: z.string(),
	tags: z.array(z.unknown()).optional(),
	engine: z.string().optional(),
	region: z.string(),
	version: z.string(),
	db_names: z.array(z.unknown()).optional(),
	sql_mode: z.string().optional(),
	num_nodes: z.number().int(),
	user_names: z.array(z.unknown()).optional(),
	backup_restore: z.record(z.string(), z.unknown()).optional(),
	eviction_policy: z.string().optional(),
	storage_size_gb: z.number().int().optional(),
	maintenance_window: z.record(z.string(), z.unknown()).optional(),
	private_network_uuid: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDatabaseClusterInput = z.infer<typeof CreateDatabaseClusterInputSchema>;
const CreateDatabaseClusterResponseSchema = z.unknown();
export type CreateDatabaseClusterResponse = z.infer<typeof CreateDatabaseClusterResponseSchema>;

// createNewBlockStorageVolume
const CreateNewBlockStorageVolumeInputSchema = z.object({
	name: z.string(),
	tags: z.array(z.unknown()).optional(),
	region: z.string(),
	description: z.string().optional(),
	snapshot_id: z.string().optional(),
	size_gigabytes: z.number().int(),
	filesystem_type: z.string().optional(),
	filesystem_label: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewBlockStorageVolumeInput = z.infer<typeof CreateNewBlockStorageVolumeInputSchema>;
const CreateNewBlockStorageVolumeResponseSchema = z.unknown();
export type CreateNewBlockStorageVolumeResponse = z.infer<typeof CreateNewBlockStorageVolumeResponseSchema>;

// createNewDomain
const CreateNewDomainInputSchema = z.object({
	name: z.string(),
	ip_address: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewDomainInput = z.infer<typeof CreateNewDomainInputSchema>;
const CreateNewDomainResponseSchema = z.unknown();
export type CreateNewDomainResponse = z.infer<typeof CreateNewDomainResponseSchema>;

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
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewDomainRecordInput = z.infer<typeof CreateNewDomainRecordInputSchema>;
const CreateNewDomainRecordResponseSchema = z.unknown();
export type CreateNewDomainRecordResponse = z.infer<typeof CreateNewDomainRecordResponseSchema>;

// createNewDroplet
const CreateNewDropletInputSchema = z.object({
	ipv6: z.boolean().optional(),
	name: z.string(),
	size: z.string(),
	tags: z.array(z.unknown()).optional(),
	image: z.string(),
	region: z.string(),
	backups: z.boolean().optional(),
	volumes: z.array(z.unknown()).optional(),
	ssh_keys: z.array(z.unknown()).optional(),
	vpc_uuid: z.string().optional(),
	user_data: z.string().optional(),
	monitoring: z.boolean().optional(),
	private_networking: z.boolean().optional(),
	with_droplet_agent: z.boolean().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewDropletInput = z.infer<typeof CreateNewDropletInputSchema>;
const CreateNewDropletResponseSchema = z.unknown();
export type CreateNewDropletResponse = z.infer<typeof CreateNewDropletResponseSchema>;

// createNewFirewall
const CreateNewFirewallInputSchema = z.object({
	name: z.string(),
	tags: z.array(z.unknown()).optional(),
	vpc_uuid: z.string().optional(),
	droplet_ids: z.array(z.unknown()).optional(),
	inbound_rules: z.array(z.unknown()),
	outbound_rules: z.array(z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewFirewallInput = z.infer<typeof CreateNewFirewallInputSchema>;
const CreateNewFirewallResponseSchema = z.unknown();
export type CreateNewFirewallResponse = z.infer<typeof CreateNewFirewallResponseSchema>;

// createNewKubernetesCluster
const CreateNewKubernetesClusterInputSchema = z.object({
	name: z.string(),
	tags: z.array(z.unknown()).optional(),
	region: z.string(),
	version: z.string(),
	node_pools: z.array(z.unknown()),
	auto_upgrade: z.boolean().optional(),
	maintenance_policy: z.record(z.string(), z.unknown()).optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewKubernetesClusterInput = z.infer<typeof CreateNewKubernetesClusterInputSchema>;
const CreateNewKubernetesClusterResponseSchema = z.unknown();
export type CreateNewKubernetesClusterResponse = z.infer<typeof CreateNewKubernetesClusterResponseSchema>;

// createNewLoadBalancer
const CreateNewLoadBalancerInputSchema = z.object({
	tag: z.string().optional(),
	name: z.string(),
	region: z.string(),
	vpc_uuid: z.string().optional(),
	algorithm: z.string().optional(),
	droplet_ids: z.array(z.unknown()).optional(),
	health_check: z.record(z.string(), z.unknown()).optional(),
	firewall_policy: z.string().optional(),
	sticky_sessions: z.record(z.string(), z.unknown()).optional(),
	forwarding_rules: z.array(z.unknown()),
	enable_proxy_protocol: z.boolean().optional(),
	redirect_http_to_https: z.boolean().optional(),
	enable_backend_keepalive: z.boolean().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewLoadBalancerInput = z.infer<typeof CreateNewLoadBalancerInputSchema>;
const CreateNewLoadBalancerResponseSchema = z.unknown();
export type CreateNewLoadBalancerResponse = z.infer<typeof CreateNewLoadBalancerResponseSchema>;

// createNewSshKey
const CreateNewSshKeyInputSchema = z.object({
	name: z.string(),
	public_key: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewSshKeyInput = z.infer<typeof CreateNewSshKeyInputSchema>;
const CreateNewSshKeyResponseSchema = z.unknown();
export type CreateNewSshKeyResponse = z.infer<typeof CreateNewSshKeyResponseSchema>;

// createNewTag
const CreateNewTagInputSchema = z.object({
	name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewTagInput = z.infer<typeof CreateNewTagInputSchema>;
const CreateNewTagResponseSchema = z.unknown();
export type CreateNewTagResponse = z.infer<typeof CreateNewTagResponseSchema>;

// createNewVpc
const CreateNewVpcInputSchema = z.object({
	name: z.string(),
	tags: z.array(z.unknown()).optional(),
	region: z.string(),
	ip_range: z.string().optional(),
	description: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateNewVpcInput = z.infer<typeof CreateNewVpcInputSchema>;
const CreateNewVpcResponseSchema = z.unknown();
export type CreateNewVpcResponse = z.infer<typeof CreateNewVpcResponseSchema>;

// deleteBlockStorageVolume
const DeleteBlockStorageVolumeInputSchema = z.object({
	volume_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteBlockStorageVolumeInput = z.infer<typeof DeleteBlockStorageVolumeInputSchema>;
const DeleteBlockStorageVolumeResponseSchema = z.unknown();
export type DeleteBlockStorageVolumeResponse = z.infer<typeof DeleteBlockStorageVolumeResponseSchema>;

// deleteDatabaseCluster
const DeleteDatabaseClusterInputSchema = z.object({
	database_cluster_uuid: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDatabaseClusterInput = z.infer<typeof DeleteDatabaseClusterInputSchema>;
const DeleteDatabaseClusterResponseSchema = z.unknown();
export type DeleteDatabaseClusterResponse = z.infer<typeof DeleteDatabaseClusterResponseSchema>;

// deleteDomain
const DeleteDomainInputSchema = z.object({
	name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDomainInput = z.infer<typeof DeleteDomainInputSchema>;
const DeleteDomainResponseSchema = z.unknown();
export type DeleteDomainResponse = z.infer<typeof DeleteDomainResponseSchema>;

// deleteDomainRecord
const DeleteDomainRecordInputSchema = z.object({
	name: z.string(),
	record_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDomainRecordInput = z.infer<typeof DeleteDomainRecordInputSchema>;
const DeleteDomainRecordResponseSchema = z.unknown();
export type DeleteDomainRecordResponse = z.infer<typeof DeleteDomainRecordResponseSchema>;

// deleteExistingDroplet
const DeleteExistingDropletInputSchema = z.object({
	droplet_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteExistingDropletInput = z.infer<typeof DeleteExistingDropletInputSchema>;
const DeleteExistingDropletResponseSchema = z.unknown();
export type DeleteExistingDropletResponse = z.infer<typeof DeleteExistingDropletResponseSchema>;

// deleteFirewall
const DeleteFirewallInputSchema = z.object({
	firewall_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteFirewallInput = z.infer<typeof DeleteFirewallInputSchema>;
const DeleteFirewallResponseSchema = z.unknown();
export type DeleteFirewallResponse = z.infer<typeof DeleteFirewallResponseSchema>;

// deleteImage
const DeleteImageInputSchema = z.object({
	image_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteImageInput = z.infer<typeof DeleteImageInputSchema>;
const DeleteImageResponseSchema = z.unknown();
export type DeleteImageResponse = z.infer<typeof DeleteImageResponseSchema>;

// deleteLoadBalancer
const DeleteLoadBalancerInputSchema = z.object({
	load_balancer_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteLoadBalancerInput = z.infer<typeof DeleteLoadBalancerInputSchema>;
const DeleteLoadBalancerResponseSchema = z.unknown();
export type DeleteLoadBalancerResponse = z.infer<typeof DeleteLoadBalancerResponseSchema>;

// deleteSshKey
const DeleteSshKeyInputSchema = z.object({
	key_id_or_fingerprint: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteSshKeyInput = z.infer<typeof DeleteSshKeyInputSchema>;
const DeleteSshKeyResponseSchema = z.unknown();
export type DeleteSshKeyResponse = z.infer<typeof DeleteSshKeyResponseSchema>;

// deleteTag
const DeleteTagInputSchema = z.object({
	name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteTagInput = z.infer<typeof DeleteTagInputSchema>;
const DeleteTagResponseSchema = z.unknown();
export type DeleteTagResponse = z.infer<typeof DeleteTagResponseSchema>;

// deleteVpc
const DeleteVpcInputSchema = z.object({
	vpc_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteVpcInput = z.infer<typeof DeleteVpcInputSchema>;
const DeleteVpcResponseSchema = z.unknown();
export type DeleteVpcResponse = z.infer<typeof DeleteVpcResponseSchema>;

// listAllDatabases
const ListAllDatabasesInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	tag_name: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllDatabasesInput = z.infer<typeof ListAllDatabasesInputSchema>;
const ListAllDatabasesResponseSchema = z.unknown();
export type ListAllDatabasesResponse = z.infer<typeof ListAllDatabasesResponseSchema>;

// listAllDomains
const ListAllDomainsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllDomainsInput = z.infer<typeof ListAllDomainsInputSchema>;
const ListAllDomainsResponseSchema = z.unknown();
export type ListAllDomainsResponse = z.infer<typeof ListAllDomainsResponseSchema>;

// listAllDroplets
const ListAllDropletsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	tag_name: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllDropletsInput = z.infer<typeof ListAllDropletsInputSchema>;
const ListAllDropletsResponseSchema = z.unknown();
export type ListAllDropletsResponse = z.infer<typeof ListAllDropletsResponseSchema>;

// listAllFirewalls
const ListAllFirewallsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllFirewallsInput = z.infer<typeof ListAllFirewallsInputSchema>;
const ListAllFirewallsResponseSchema = z.unknown();
export type ListAllFirewallsResponse = z.infer<typeof ListAllFirewallsResponseSchema>;

// listAllImages
const ListAllImagesInputSchema = z.object({
	page: z.number().int().optional(),
	type: z.string().optional(),
	private: z.boolean().optional(),
	per_page: z.number().int().optional(),
	tag_name: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllImagesInput = z.infer<typeof ListAllImagesInputSchema>;
const ListAllImagesResponseSchema = z.unknown();
export type ListAllImagesResponse = z.infer<typeof ListAllImagesResponseSchema>;

// listAllKubernetesClusters
const ListAllKubernetesClustersInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllKubernetesClustersInput = z.infer<typeof ListAllKubernetesClustersInputSchema>;
const ListAllKubernetesClustersResponseSchema = z.unknown();
export type ListAllKubernetesClustersResponse = z.infer<typeof ListAllKubernetesClustersResponseSchema>;

// listAllLoadBalancers
const ListAllLoadBalancersInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllLoadBalancersInput = z.infer<typeof ListAllLoadBalancersInputSchema>;
const ListAllLoadBalancersResponseSchema = z.unknown();
export type ListAllLoadBalancersResponse = z.infer<typeof ListAllLoadBalancersResponseSchema>;

// listAllSnapshots
const ListAllSnapshotsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	resource_type: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllSnapshotsInput = z.infer<typeof ListAllSnapshotsInputSchema>;
const ListAllSnapshotsResponseSchema = z.unknown();
export type ListAllSnapshotsResponse = z.infer<typeof ListAllSnapshotsResponseSchema>;

// listAllSshKeys
const ListAllSshKeysInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllSshKeysInput = z.infer<typeof ListAllSshKeysInputSchema>;
const ListAllSshKeysResponseSchema = z.unknown();
export type ListAllSshKeysResponse = z.infer<typeof ListAllSshKeysResponseSchema>;

// listAllTags
const ListAllTagsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllTagsInput = z.infer<typeof ListAllTagsInputSchema>;
const ListAllTagsResponseSchema = z.unknown();
export type ListAllTagsResponse = z.infer<typeof ListAllTagsResponseSchema>;

// listAllVolumes
const ListAllVolumesInputSchema = z.object({
	name: z.string().optional(),
	page: z.number().int().optional(),
	region: z.string().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllVolumesInput = z.infer<typeof ListAllVolumesInputSchema>;
const ListAllVolumesResponseSchema = z.unknown();
export type ListAllVolumesResponse = z.infer<typeof ListAllVolumesResponseSchema>;

// listAllVpcs
const ListAllVpcsInputSchema = z.object({
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAllVpcsInput = z.infer<typeof ListAllVpcsInputSchema>;
const ListAllVpcsResponseSchema = z.unknown();
export type ListAllVpcsResponse = z.infer<typeof ListAllVpcsResponseSchema>;

// listDatabaseOptions
const ListDatabaseOptionsInputSchema = z.object({
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListDatabaseOptionsInput = z.infer<typeof ListDatabaseOptionsInputSchema>;
const ListDatabaseOptionsResponseSchema = z.unknown();
export type ListDatabaseOptionsResponse = z.infer<typeof ListDatabaseOptionsResponseSchema>;

// listDomainRecords
const ListDomainRecordsInputSchema = z.object({
	page: z.number().int().optional(),
	type: z.string().optional(),
	per_page: z.number().int().optional(),
	domain_name: z.string(),
	record_name: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListDomainRecordsInput = z.infer<typeof ListDomainRecordsInputSchema>;
const ListDomainRecordsResponseSchema = z.unknown();
export type ListDomainRecordsResponse = z.infer<typeof ListDomainRecordsResponseSchema>;

// retrieveDomain
const RetrieveDomainInputSchema = z.object({
	name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveDomainInput = z.infer<typeof RetrieveDomainInputSchema>;
const RetrieveDomainResponseSchema = z.unknown();
export type RetrieveDomainResponse = z.infer<typeof RetrieveDomainResponseSchema>;

// retrieveDomainRecord
const RetrieveDomainRecordInputSchema = z.object({
	name: z.string(),
	record_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveDomainRecordInput = z.infer<typeof RetrieveDomainRecordInputSchema>;
const RetrieveDomainRecordResponseSchema = z.unknown();
export type RetrieveDomainRecordResponse = z.infer<typeof RetrieveDomainRecordResponseSchema>;

// retrieveExistingDroplet
const RetrieveExistingDropletInputSchema = z.object({
	droplet_id: z.number().int(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveExistingDropletInput = z.infer<typeof RetrieveExistingDropletInputSchema>;
const RetrieveExistingDropletResponseSchema = z.unknown();
export type RetrieveExistingDropletResponse = z.infer<typeof RetrieveExistingDropletResponseSchema>;

// retrieveExistingImage
const RetrieveExistingImageInputSchema = z.object({
	image_id: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveExistingImageInput = z.infer<typeof RetrieveExistingImageInputSchema>;
const RetrieveExistingImageResponseSchema = z.unknown();
export type RetrieveExistingImageResponse = z.infer<typeof RetrieveExistingImageResponseSchema>;

// retrieveTag
const RetrieveTagInputSchema = z.object({
	name: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveTagInput = z.infer<typeof RetrieveTagInputSchema>;
const RetrieveTagResponseSchema = z.unknown();
export type RetrieveTagResponse = z.infer<typeof RetrieveTagResponseSchema>;

// retrieveVpc
const RetrieveVpcInputSchema = z.object({
	vpc_uuid: z.string(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type RetrieveVpcInput = z.infer<typeof RetrieveVpcInputSchema>;
const RetrieveVpcResponseSchema = z.unknown();
export type RetrieveVpcResponse = z.infer<typeof RetrieveVpcResponseSchema>;

// tagResource
const TagResourceInputSchema = z.object({
	tag_name: z.string(),
	resources: z.array(z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type TagResourceInput = z.infer<typeof TagResourceInputSchema>;
const TagResourceResponseSchema = z.unknown();
export type TagResourceResponse = z.infer<typeof TagResourceResponseSchema>;

// untagResource
const UntagResourceInputSchema = z.object({
	tag_name: z.string(),
	resources: z.array(z.unknown()),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type UntagResourceInput = z.infer<typeof UntagResourceInputSchema>;
const UntagResourceResponseSchema = z.unknown();
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
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDomainRecordInput = z.infer<typeof UpdateDomainRecordInputSchema>;
const UpdateDomainRecordResponseSchema = z.unknown();
export type UpdateDomainRecordResponse = z.infer<typeof UpdateDomainRecordResponseSchema>;

// updateVpc
const UpdateVpcInputSchema = z.object({
	name: z.string().optional(),
	vpc_id: z.string(),
	default: z.boolean().optional(),
	description: z.string().optional(),
	body: z.unknown().optional(),
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateVpcInput = z.infer<typeof UpdateVpcInputSchema>;
const UpdateVpcResponseSchema = z.unknown();
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
	[K in keyof typeof DigitalOceanEndpointInputSchemas]: z.infer<(typeof DigitalOceanEndpointInputSchemas)[K]>;
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
	[K in keyof typeof DigitalOceanEndpointOutputSchemas]: z.infer<(typeof DigitalOceanEndpointOutputSchemas)[K]>;
};

export type DigitalOceanEndpointInput = DigitalOceanEndpointInputs[keyof DigitalOceanEndpointInputs] & {
	[key: string]: unknown;
};
