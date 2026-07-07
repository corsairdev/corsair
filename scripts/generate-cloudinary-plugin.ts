/**
 * Generates Cloudinary plugin endpoint wiring from the operations registry.
 * Run: node --experimental-strip-types scripts/generate-cloudinary-plugin.ts
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const VERBS = new Set([
	'GET', 'LIST', 'CREATE', 'UPDATE', 'DELETE', 'POST', 'SET', 'FETCH', 'RETRIEVE',
	'VALIDATE', 'CHECK', 'SEND', 'SEARCH', 'FIND', 'ADD', 'REMOVE', 'BULK', 'BATCH',
	'RESOLVE', 'GENERATE', 'IMPORT', 'EXPORT', 'UPLOAD', 'DOWNLOAD', 'SYNC', 'INVITE',
	'REVOKE', 'CANCEL', 'CONFIRM', 'SUBMIT', 'PUBLISH', 'ARCHIVE', 'RESTORE', 'CLONE',
	'COPY', 'MOVE', 'RENAME', 'SHARE', 'TAG', 'LINK', 'UNLINK', 'MERGE', 'SPLIT',
	'ENABLE', 'DISABLE', 'ACTIVATE', 'DEACTIVATE', 'ASSIGN', 'UNASSIGN', 'TRACK',
	'VERIFY', 'COMPLETE', 'START', 'STOP', 'PAUSE', 'RESUME', 'REFRESH', 'RESET',
	'REBUILD', 'REPROCESS', 'TRIGGER', 'RUN', 'SHOW', 'ORDER', 'REORDER', 'MANAGE',
	'EXPLODE', 'EXPLICIT', 'VISUAL', 'IDLE', 'DESTROY', 'PING',
]);

type ApiKind = 'admin' | 'upload' | 'live';
type BodyKind = 'json' | 'form' | 'multipart' | 'none';
type RiskLevel = 'read' | 'write' | 'destructive';

type OperationDef = {
	slug: string;
	name: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string;
	api: ApiKind;
	bodyKind?: BodyKind;
	pathParams?: string[];
	queryParams?: string[];
	riskLevel: RiskLevel;
	irreversible?: boolean;
	description: string;
	uploadResourceType?: 'image' | 'video' | 'raw' | 'auto';
};

function stripPrefix(slug: string): string {
	const prefix = 'CLOUDINARY_';
	return slug.startsWith(prefix) ? slug.slice(prefix.length) : slug;
}

function endpointKey(slug: string): string {
	return stripPrefix(slug)
		.toLowerCase()
		.split('_')
		.map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
		.join('');
}

function groupFromSlug(slug: string): string {
	const parts = stripPrefix(slug).split('_').filter(Boolean);
	for (const part of parts) {
		if (!VERBS.has(part)) return part.toLowerCase();
	}
	return parts[0]?.toLowerCase() ?? 'operations';
}

function toPascalCase(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

const operations: OperationDef[] = [
	// Live streaming (v2 API)
	{ slug: 'CLOUDINARY_ACTIVATE_LIVE_STREAM', name: 'Activate Live Stream', method: 'POST', path: '/live_streams/{liveStreamId}/activate', api: 'live', pathParams: ['liveStreamId'], riskLevel: 'write', description: 'Manually activate a live stream' },
	{ slug: 'CLOUDINARY_CREATE_LIVE_STREAM', name: 'Create Live Stream', method: 'POST', path: '/live_streams', api: 'live', bodyKind: 'json', riskLevel: 'write', description: 'Create a new live stream' },
	{ slug: 'CLOUDINARY_CREATE_LIVE_STREAM_OUTPUT', name: 'Create Live Stream Output', method: 'POST', path: '/live_streams/{liveStreamId}/outputs', api: 'live', pathParams: ['liveStreamId'], bodyKind: 'json', riskLevel: 'write', description: 'Create a live stream output' },
	{ slug: 'CLOUDINARY_DELETE_LIVE_STREAM', name: 'Delete Live Stream', method: 'DELETE', path: '/live_streams/{liveStreamId}', api: 'live', pathParams: ['liveStreamId'], riskLevel: 'destructive', irreversible: true, description: 'Delete a live stream' },
	{ slug: 'CLOUDINARY_DELETE_LIVE_STREAM_OUTPUT', name: 'Delete Live Stream Output', method: 'DELETE', path: '/live_streams/{liveStreamId}/outputs/{outputId}', api: 'live', pathParams: ['liveStreamId', 'outputId'], riskLevel: 'destructive', irreversible: true, description: 'Delete a live stream output' },
	{ slug: 'CLOUDINARY_GET_LIVE_STREAM', name: 'Get Live Stream', method: 'GET', path: '/live_streams/{liveStreamId}', api: 'live', pathParams: ['liveStreamId'], riskLevel: 'read', description: 'Get live stream details' },
	{ slug: 'CLOUDINARY_GET_LIVE_STREAM_OUTPUT', name: 'Get Live Stream Output', method: 'GET', path: '/live_streams/{liveStreamId}/outputs/{outputId}', api: 'live', pathParams: ['liveStreamId', 'outputId'], riskLevel: 'read', description: 'Get live stream output details' },
	{ slug: 'CLOUDINARY_GET_LIVE_STREAM_OUTPUTS', name: 'Get Live Stream Outputs', method: 'GET', path: '/live_streams/{liveStreamId}/outputs', api: 'live', pathParams: ['liveStreamId'], queryParams: ['max_results', 'next_cursor'], riskLevel: 'read', description: 'List live stream outputs' },
	{ slug: 'CLOUDINARY_GET_LIVE_STREAMS', name: 'Get Live Streams', method: 'GET', path: '/live_streams', api: 'live', queryParams: ['max_results', 'next_cursor'], riskLevel: 'read', description: 'List live streams' },
	{ slug: 'CLOUDINARY_IDLE_LIVE_STREAM', name: 'Idle Live Stream', method: 'POST', path: '/live_streams/{liveStreamId}/idle', api: 'live', pathParams: ['liveStreamId'], riskLevel: 'write', description: 'Put a live stream into idle state' },
	{ slug: 'CLOUDINARY_UPDATE_LIVE_STREAM', name: 'Update Live Stream', method: 'PUT', path: '/live_streams/{liveStreamId}', api: 'live', pathParams: ['liveStreamId'], bodyKind: 'json', riskLevel: 'write', description: 'Update live stream configuration' },
	{ slug: 'CLOUDINARY_UPDATE_LIVE_STREAM_OUTPUT', name: 'Update Live Stream Output', method: 'PUT', path: '/live_streams/{liveStreamId}/outputs/{outputId}', api: 'live', pathParams: ['liveStreamId', 'outputId'], bodyKind: 'json', riskLevel: 'write', description: 'Update live stream output configuration' },

	// Asset relations
	{ slug: 'CLOUDINARY_CREATE_ASSET_RELATIONS_BY_ASSET_ID', name: 'Create Asset Relations by Asset ID', method: 'POST', path: '/resources/related_assets/{asset_id}', api: 'admin', pathParams: ['asset_id'], bodyKind: 'json', riskLevel: 'write', description: 'Add related assets by asset ID' },
	{ slug: 'CLOUDINARY_CREATE_ASSET_RELATIONS_BY_PUBLIC_ID', name: 'Create Asset Relations by Public ID', method: 'POST', path: '/resources/related_assets/{resource_type}/{type}/{public_id}', api: 'admin', pathParams: ['resource_type', 'type', 'public_id'], bodyKind: 'json', riskLevel: 'write', description: 'Add related assets by public ID' },
	{ slug: 'CLOUDINARY_DELETE_ASSET_RELATIONS_BY_ASSET_ID', name: 'Delete Asset Relations by Asset ID', method: 'DELETE', path: '/resources/related_assets/{asset_id}', api: 'admin', pathParams: ['asset_id'], bodyKind: 'json', riskLevel: 'destructive', description: 'Remove related assets by asset ID' },
	{ slug: 'CLOUDINARY_DELETE_ASSET_RELATIONS_BY_PUBLIC_ID', name: 'Delete Asset Relations by Public ID', method: 'DELETE', path: '/resources/related_assets/{resource_type}/{type}/{public_id}', api: 'admin', pathParams: ['resource_type', 'type', 'public_id'], bodyKind: 'json', riskLevel: 'destructive', description: 'Remove related assets by public ID' },

	// Folders
	{ slug: 'CLOUDINARY_CREATE_FOLDER', name: 'Create Folder', method: 'POST', path: '/folders/{folder}', api: 'admin', pathParams: ['folder'], riskLevel: 'write', description: 'Create a new asset folder' },
	{ slug: 'CLOUDINARY_DELETE_FOLDER', name: 'Delete Folder', method: 'DELETE', path: '/folders/{folder}', api: 'admin', pathParams: ['folder'], riskLevel: 'destructive', irreversible: true, description: 'Delete an empty folder' },
	{ slug: 'CLOUDINARY_GET_ROOT_FOLDERS', name: 'Get Root Folders', method: 'GET', path: '/folders', api: 'admin', queryParams: ['max_results', 'next_cursor'], riskLevel: 'read', description: 'List root folders' },
	{ slug: 'CLOUDINARY_GET_RESOURCES_BY_ASSET_FOLDER', name: 'Get Resources by Asset Folder', method: 'GET', path: '/resources/by_asset_folder', api: 'admin', queryParams: ['asset_folder', 'max_results', 'next_cursor', 'tags', 'context', 'metadata', 'moderations', 'fields'], riskLevel: 'read', description: 'List assets in a folder' },
	{ slug: 'CLOUDINARY_SEARCH_FOLDERS', name: 'Search Folders', method: 'GET', path: '/folders/search', api: 'admin', queryParams: ['expression', 'sort_by', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'Search asset folders' },
	{ slug: 'CLOUDINARY_SEARCH_FOLDERS_V2', name: 'Search Folders (V2)', method: 'GET', path: '/v2/folders/search', api: 'admin', queryParams: ['expression', 'sort_by', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'Search folders (v2)' },
	{ slug: 'CLOUDINARY_SHOW_FOLDER', name: 'Show Folder', method: 'GET', path: '/folders/{folder}', api: 'admin', pathParams: ['folder'], queryParams: ['max_results', 'next_cursor'], riskLevel: 'read', description: 'List subfolders in a folder' },
	{ slug: 'CLOUDINARY_UPDATE_FOLDER', name: 'Update Folder', method: 'PUT', path: '/folders/{folder}', api: 'admin', pathParams: ['folder'], bodyKind: 'json', riskLevel: 'write', description: 'Rename or move a folder' },

	// Image generation
	{ slug: 'CLOUDINARY_CREATE_IMAGE_FROM_TEXT', name: 'Create Image from Text', method: 'POST', path: '/text', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Generate an image from text' },

	// Multi-resource / slideshow
	{ slug: 'CLOUDINARY_CREATE_MULTI_RESOURCE', name: 'Create Multi-Resource Animation', method: 'POST', path: '/multi', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Create animation from multiple images' },
	{ slug: 'CLOUDINARY_CREATE_SLIDESHOW', name: 'Create Slideshow', method: 'POST', path: '/create_slideshow', api: 'upload', uploadResourceType: 'video', bodyKind: 'form', riskLevel: 'write', description: 'Create video slideshow from assets' },

	// Streaming profiles
	{ slug: 'CLOUDINARY_CREATE_STREAMING_PROFILE', name: 'Create Streaming Profile', method: 'POST', path: '/streaming_profiles', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Create adaptive streaming profile' },
	{ slug: 'CLOUDINARY_DELETE_STREAMING_PROFILE', name: 'Delete Streaming Profile', method: 'DELETE', path: '/streaming_profiles/{name}', api: 'admin', pathParams: ['name'], riskLevel: 'destructive', irreversible: true, description: 'Delete streaming profile' },
	{ slug: 'CLOUDINARY_GET_ADAPTIVE_STREAMING_PROFILES', name: 'Get Adaptive Streaming Profiles', method: 'GET', path: '/streaming_profiles', api: 'admin', riskLevel: 'read', description: 'List streaming profiles' },
	{ slug: 'CLOUDINARY_GET_STREAMING_PROFILE_DETAILS', name: 'Get Streaming Profile Details', method: 'GET', path: '/streaming_profiles/{name}', api: 'admin', pathParams: ['name'], riskLevel: 'read', description: 'Get streaming profile details' },
	{ slug: 'CLOUDINARY_UPDATE_STREAMING_PROFILE', name: 'Update Streaming Profile', method: 'PUT', path: '/streaming_profiles/{name}', api: 'admin', pathParams: ['name'], bodyKind: 'json', riskLevel: 'write', description: 'Update streaming profile' },

	// Transformations
	{ slug: 'CLOUDINARY_CREATE_TRANSFORMATION', name: 'Create Transformation', method: 'POST', path: '/transformations/{name}', api: 'admin', pathParams: ['name'], bodyKind: 'json', riskLevel: 'write', description: 'Create named transformation' },
	{ slug: 'CLOUDINARY_DELETE_TRANSFORMATION2', name: 'Delete Transformation (v2)', method: 'DELETE', path: '/transformations/{transformation}', api: 'admin', pathParams: ['transformation'], riskLevel: 'destructive', irreversible: true, description: 'Delete named transformation' },
	{ slug: 'CLOUDINARY_GET_TRANSFORMATION', name: 'Get Transformation', method: 'GET', path: '/transformations/{transformation}', api: 'admin', pathParams: ['transformation'], riskLevel: 'read', description: 'Get transformation details' },
	{ slug: 'CLOUDINARY_GET_TRANSFORMATIONS', name: 'Get Transformations', method: 'GET', path: '/transformations', api: 'admin', queryParams: ['named', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'List transformations' },
	{ slug: 'CLOUDINARY_UPDATE_TRANSFORMATION2', name: 'Update Transformation (v2)', method: 'PUT', path: '/transformations/{transformation}', api: 'admin', pathParams: ['transformation'], bodyKind: 'json', riskLevel: 'write', description: 'Update named transformation' },

	// Metadata fields & rules
	{ slug: 'CLOUDINARY_CREATE_METADATA_FIELD', name: 'Create Metadata Field', method: 'POST', path: '/metadata_fields', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Create metadata field definition' },
	{ slug: 'CLOUDINARY_CREATE_METADATA_RULE', name: 'Create Metadata Rule', method: 'POST', path: '/metadata_rules', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Create metadata rule' },
	{ slug: 'CLOUDINARY_DELETE_METADATA_FIELD', name: 'Delete Metadata Field', method: 'DELETE', path: '/metadata_fields/{external_id}', api: 'admin', pathParams: ['external_id'], riskLevel: 'destructive', irreversible: true, description: 'Delete metadata field' },
	{ slug: 'CLOUDINARY_DELETE_ENTRIES_IN_METADATA_FIELD_DATASOURCE', name: 'Delete Metadata Field Datasource Entries', method: 'DELETE', path: '/metadata_fields/{external_id}/datasource', api: 'admin', pathParams: ['external_id'], bodyKind: 'json', riskLevel: 'destructive', description: 'Delete datasource entries' },
	{ slug: 'CLOUDINARY_DELETE_METADATA_RULE', name: 'Delete Metadata Rule', method: 'DELETE', path: '/metadata_rules/{metadata_rule_id}', api: 'admin', pathParams: ['metadata_rule_id'], riskLevel: 'destructive', irreversible: true, description: 'Delete metadata rule' },
	{ slug: 'CLOUDINARY_GET_METADATA_FIELD_BY_ID', name: 'Get Metadata Field By ID', method: 'GET', path: '/metadata_fields/{external_id}', api: 'admin', pathParams: ['external_id'], riskLevel: 'read', description: 'Get metadata field by external ID' },
	{ slug: 'CLOUDINARY_LIST_METADATA_FIELDS', name: 'List Metadata Fields', method: 'GET', path: '/metadata_fields', api: 'admin', queryParams: ['external_ids'], riskLevel: 'read', description: 'List metadata fields' },
	{ slug: 'CLOUDINARY_LIST_METADATA_RULES', name: 'List Metadata Rules', method: 'GET', path: '/metadata_rules', api: 'admin', riskLevel: 'read', description: 'List metadata rules' },
	{ slug: 'CLOUDINARY_ORDER_METADATA_FIELD_DATASOURCE', name: 'Order Metadata Field Datasource', method: 'PUT', path: '/metadata_fields/{external_id}/datasource/order', api: 'admin', pathParams: ['external_id'], bodyKind: 'json', riskLevel: 'write', description: 'Order metadata field datasource' },
	{ slug: 'CLOUDINARY_REORDER_METADATA_FIELD', name: 'Reorder Metadata Field', method: 'PUT', path: '/metadata_fields/{external_id}/order', api: 'admin', pathParams: ['external_id'], bodyKind: 'json', riskLevel: 'write', description: 'Reorder a metadata field' },
	{ slug: 'CLOUDINARY_REORDER_METADATA_FIELDS', name: 'Reorder Metadata Fields', method: 'PUT', path: '/metadata_fields/order', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Reorder all metadata fields' },
	{ slug: 'CLOUDINARY_RESTORE_ENTRIES_IN_METADATA_FIELD_DATASOURCE', name: 'Restore Metadata Field Datasource Entries', method: 'POST', path: '/metadata_fields/{external_id}/datasource/restore', api: 'admin', pathParams: ['external_id'], bodyKind: 'json', riskLevel: 'write', description: 'Restore datasource entries' },
	{ slug: 'CLOUDINARY_SEARCH_METADATA_FIELD_DATASOURCE', name: 'Search All Metadata Field Datasources', method: 'GET', path: '/metadata_fields/datasource/search', api: 'admin', queryParams: ['term', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'Search all metadata datasources' },
	{ slug: 'CLOUDINARY_SEARCH_DATASOURCE_IN_METADATA_FIELD', name: 'Search Datasource in Metadata Field', method: 'GET', path: '/metadata_fields/{external_id}/datasource/search', api: 'admin', pathParams: ['external_id'], queryParams: ['term', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'Search datasource in metadata field' },
	{ slug: 'CLOUDINARY_UPDATE_ASSET_METADATA', name: 'Update Asset Metadata', method: 'POST', path: '/metadata', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Update asset metadata values' },
	{ slug: 'CLOUDINARY_UPDATE_METADATA_FIELD', name: 'Update Metadata Field', method: 'PUT', path: '/metadata_fields/{external_id}', api: 'admin', pathParams: ['external_id'], bodyKind: 'json', riskLevel: 'write', description: 'Update metadata field definition' },
	{ slug: 'CLOUDINARY_UPDATE_METADATA_FIELD_DATASOURCE', name: 'Update Metadata Field Datasource', method: 'PUT', path: '/metadata_fields/{external_id}/datasource', api: 'admin', pathParams: ['external_id'], bodyKind: 'json', riskLevel: 'write', description: 'Update metadata field datasource' },
	{ slug: 'CLOUDINARY_UPDATE_METADATA_RULE', name: 'Update Metadata Rule', method: 'PUT', path: '/metadata_rules/{metadata_rule_id}', api: 'admin', pathParams: ['metadata_rule_id'], bodyKind: 'json', riskLevel: 'write', description: 'Update metadata rule' },

	// Webhook triggers
	{ slug: 'CLOUDINARY_CREATE_TRIGGER', name: 'Create Trigger', method: 'POST', path: '/triggers', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Create webhook trigger' },
	{ slug: 'CLOUDINARY_DELETE_TRIGGER', name: 'Delete Trigger', method: 'DELETE', path: '/triggers/{trigger_id}', api: 'admin', pathParams: ['trigger_id'], riskLevel: 'destructive', irreversible: true, description: 'Delete webhook trigger' },
	{ slug: 'CLOUDINARY_GET_TRIGGERS', name: 'List Webhook Triggers', method: 'GET', path: '/triggers', api: 'admin', queryParams: ['event_type', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'List webhook triggers' },
	{ slug: 'CLOUDINARY_UPDATE_TRIGGER', name: 'Update Trigger', method: 'PUT', path: '/triggers/{trigger_id}', api: 'admin', pathParams: ['trigger_id'], bodyKind: 'json', riskLevel: 'write', description: 'Update webhook trigger' },

	// Upload mappings
	{ slug: 'CLOUDINARY_CREATE_UPLOAD_MAPPING', name: 'Create Upload Mapping', method: 'POST', path: '/upload_mappings', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Create upload mapping' },
	{ slug: 'CLOUDINARY_DELETE_UPLOAD_MAPPING', name: 'Delete Upload Mapping', method: 'DELETE', path: '/upload_mappings/{folder}', api: 'admin', pathParams: ['folder'], riskLevel: 'destructive', irreversible: true, description: 'Delete upload mapping' },
	{ slug: 'CLOUDINARY_GET_UPLOAD_MAPPING_DETAILS', name: 'Get Upload Mapping Details', method: 'GET', path: '/upload_mappings/{folder}', api: 'admin', pathParams: ['folder'], riskLevel: 'read', description: 'Get upload mapping details' },
	{ slug: 'CLOUDINARY_GET_UPLOAD_MAPPINGS', name: 'Get Upload Mappings', method: 'GET', path: '/upload_mappings', api: 'admin', queryParams: ['max_results', 'next_cursor'], riskLevel: 'read', description: 'List upload mappings' },
	{ slug: 'CLOUDINARY_UPDATE_UPLOAD_MAPPING', name: 'Update Upload Mapping', method: 'PUT', path: '/upload_mappings/{folder}', api: 'admin', pathParams: ['folder'], bodyKind: 'json', riskLevel: 'write', description: 'Update upload mapping' },

	// Upload presets
	{ slug: 'CLOUDINARY_CREATE_UPLOAD_PRESET', name: 'Create Upload Preset', method: 'POST', path: '/upload_presets', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Create upload preset' },
	{ slug: 'CLOUDINARY_DELETE_UPLOAD_PRESET', name: 'Delete Upload Preset', method: 'DELETE', path: '/upload_presets/{name}', api: 'admin', pathParams: ['name'], riskLevel: 'destructive', irreversible: true, description: 'Delete upload preset' },
	{ slug: 'CLOUDINARY_GET_UPLOAD_PRESET', name: 'Get Upload Preset', method: 'GET', path: '/upload_presets/{name}', api: 'admin', pathParams: ['name'], riskLevel: 'read', description: 'Get upload preset' },
	{ slug: 'CLOUDINARY_LIST_UPLOAD_PRESETS', name: 'List Upload Presets', method: 'GET', path: '/upload_presets', api: 'admin', queryParams: ['max_results', 'next_cursor'], riskLevel: 'read', description: 'List upload presets' },
	{ slug: 'CLOUDINARY_UPDATE_UPLOAD_PRESET', name: 'Update Upload Preset', method: 'PUT', path: '/upload_presets/{name}', api: 'admin', pathParams: ['name'], bodyKind: 'json', riskLevel: 'write', description: 'Update upload preset' },

	// Resource read / list / search
	{ slug: 'CLOUDINARY_GET_RESOURCE_BY_ASSET_ID', name: 'Get Resource by Asset ID', method: 'GET', path: '/resources/{asset_id}', api: 'admin', pathParams: ['asset_id'], queryParams: ['context', 'metadata', 'moderations', 'quality_analysis', 'accessibility_analysis'], riskLevel: 'read', description: 'Get resource by asset ID' },
	{ slug: 'CLOUDINARY_GET_RESOURCE_BY_PUBLIC_ID', name: 'Get Resource by Public ID', method: 'GET', path: '/resources/{resource_type}/{type}/{public_id}', api: 'admin', pathParams: ['resource_type', 'type', 'public_id'], queryParams: ['context', 'metadata', 'moderations', 'quality_analysis', 'accessibility_analysis'], riskLevel: 'read', description: 'Get resource by public ID' },
	{ slug: 'CLOUDINARY_GET_RESOURCES_BY_CONTEXT', name: 'Get Resources by Context', method: 'GET', path: '/resources/{resource_type}/context', api: 'admin', pathParams: ['resource_type'], queryParams: ['key', 'value', 'max_results', 'next_cursor', 'context', 'metadata', 'tags', 'moderations', 'fields'], riskLevel: 'read', description: 'Get resources by context metadata' },
	{ slug: 'CLOUDINARY_GET_RESOURCES_IN_MODERATION', name: 'Get Resources in Moderation', method: 'GET', path: '/resources/{resource_type}/moderations/{moderation_kind}/{status}', api: 'admin', pathParams: ['resource_type', 'moderation_kind', 'status'], queryParams: ['max_results', 'next_cursor', 'context', 'metadata', 'tags', 'moderations', 'fields'], riskLevel: 'read', description: 'Get resources in moderation queue' },
	{ slug: 'CLOUDINARY_LIST_IMAGES', name: 'List Images', method: 'GET', path: '/resources/image', api: 'admin', queryParams: ['type', 'prefix', 'public_ids', 'max_results', 'next_cursor', 'start_at', 'direction', 'context', 'metadata', 'moderation', 'tags', 'fields'], riskLevel: 'read', description: 'List image assets' },
	{ slug: 'CLOUDINARY_LIST_RAW_FILES', name: 'List Raw Files', method: 'GET', path: '/resources/raw', api: 'admin', queryParams: ['type', 'prefix', 'public_ids', 'max_results', 'next_cursor', 'start_at', 'direction', 'context', 'metadata', 'moderation', 'tags', 'fields'], riskLevel: 'read', description: 'List raw assets' },
	{ slug: 'CLOUDINARY_LIST_RESOURCE_TYPES', name: 'List Resource Types', method: 'GET', path: '/resources/types', api: 'admin', riskLevel: 'read', description: 'List available resource types' },
	{ slug: 'CLOUDINARY_LIST_RESOURCES_BY_ASSET_IDS', name: 'List Resources by Asset IDs', method: 'GET', path: '/resources/by_asset_ids', api: 'admin', queryParams: ['asset_ids', 'context', 'metadata', 'moderations', 'tags', 'fields'], riskLevel: 'read', description: 'List resources by asset IDs' },
	{ slug: 'CLOUDINARY_LIST_RESOURCES_BY_EXTERNAL_IDS', name: 'List Resources by External IDs', method: 'GET', path: '/resources/by_external_ids', api: 'admin', queryParams: ['external_ids', 'context', 'metadata', 'moderations', 'tags', 'fields'], riskLevel: 'read', description: 'List resources by external IDs' },
	{ slug: 'CLOUDINARY_LIST_RESOURCES_BY_TAG', name: 'List Resources by Tag', method: 'GET', path: '/resources/{resource_type}/tags/{tag}', api: 'admin', pathParams: ['resource_type', 'tag'], queryParams: ['max_results', 'next_cursor', 'context', 'metadata', 'moderations', 'fields'], riskLevel: 'read', description: 'List resources by tag' },
	{ slug: 'CLOUDINARY_LIST_RESOURCES_BY_TYPE', name: 'List Resources by Type', method: 'GET', path: '/resources/{resource_type}/{type}', api: 'admin', pathParams: ['resource_type', 'type'], queryParams: ['prefix', 'public_ids', 'max_results', 'next_cursor', 'start_at', 'direction', 'context', 'metadata', 'moderation', 'tags', 'fields'], riskLevel: 'read', description: 'List resources by type' },
	{ slug: 'CLOUDINARY_LIST_VIDEOS', name: 'List Video Assets', method: 'GET', path: '/resources/video', api: 'admin', queryParams: ['type', 'prefix', 'public_ids', 'max_results', 'next_cursor', 'start_at', 'direction', 'context', 'metadata', 'moderation', 'tags', 'fields'], riskLevel: 'read', description: 'List video assets' },
	{ slug: 'CLOUDINARY_SEARCH_ASSETS', name: 'Search Assets', method: 'GET', path: '/resources/search', api: 'admin', queryParams: ['expression', 'sort_by', 'max_results', 'next_cursor', 'fields', 'with_field', 'aggregate'], riskLevel: 'read', description: 'Search assets with Lucene-like expressions' },
	{ slug: 'CLOUDINARY_SEARCH_VISUAL_ASSETS', name: 'Visual Search Assets', method: 'GET', path: '/resources/visual_search', api: 'admin', queryParams: ['image_url', 'image_asset_id', 'text', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'Visual search for similar assets' },

	// Resource write / lifecycle
	{ slug: 'CLOUDINARY_EXPLICIT_RESOURCE', name: 'Explicit Resource Update', method: 'POST', path: '/explicit', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Explicitly update or generate derived assets' },
	{ slug: 'CLOUDINARY_EXPLODE_RESOURCE', name: 'Explode Multi-Page Resource', method: 'POST', path: '/explode', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Explode multi-page resource into separate images' },
	{ slug: 'CLOUDINARY_MANAGE_CONTEXT', name: 'Manage Context Metadata', method: 'POST', path: '/context', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Add or remove contextual metadata' },
	{ slug: 'CLOUDINARY_PUBLISH_RESOURCES', name: 'Publish Resources', method: 'POST', path: '/access_mode', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Publish resources to public access' },
	{ slug: 'CLOUDINARY_RENAME_RESOURCE', name: 'Rename or Move Resource Public ID', method: 'POST', path: '/rename', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Rename or move resource public ID' },
	{ slug: 'CLOUDINARY_RESTORE_RESOURCES', name: 'Restore Deleted Resources', method: 'POST', path: '/resources/{resource_type}/{type}/restore', api: 'admin', pathParams: ['resource_type', 'type'], bodyKind: 'json', riskLevel: 'write', description: 'Restore deleted resources by public ID' },
	{ slug: 'CLOUDINARY_RESTORE_RESOURCES_BY_ASSET_IDS', name: 'Restore Resources by Asset IDs', method: 'POST', path: '/resources/restore', api: 'admin', bodyKind: 'json', riskLevel: 'write', description: 'Restore resources by asset IDs' },
	{ slug: 'CLOUDINARY_UPDATE_RESOURCE_BY_ASSET_ID', name: 'Update Resource by Asset ID', method: 'PUT', path: '/resources/{asset_id}', api: 'admin', pathParams: ['asset_id'], bodyKind: 'json', riskLevel: 'write', description: 'Update resource by asset ID' },
	{ slug: 'CLOUDINARY_UPDATE_RESOURCE_BY_PUBLIC_ID', name: 'Update Resource by Public ID', method: 'POST', path: '/resources/{resource_type}/{type}/{public_id}', api: 'admin', pathParams: ['resource_type', 'type', 'public_id'], bodyKind: 'json', riskLevel: 'write', description: 'Update resource by public ID' },
	{ slug: 'CLOUDINARY_UPDATE_RESOURCE_TAGS', name: 'Update Resource Tags', method: 'POST', path: '/tags/{tag}', api: 'upload', uploadResourceType: 'image', pathParams: ['tag'], bodyKind: 'form', riskLevel: 'write', description: 'Add, remove, or replace resource tags' },
	{ slug: 'CLOUDINARY_GET_TAGS', name: 'Get Resource Tags', method: 'GET', path: '/tags/{resource_type}', api: 'admin', pathParams: ['resource_type'], queryParams: ['prefix', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'List tags for a resource type' },

	// Resource deletion
	{ slug: 'CLOUDINARY_DELETE_DERIVED_RESOURCES', name: 'Delete Derived Resources', method: 'DELETE', path: '/derived_resources', api: 'admin', bodyKind: 'json', riskLevel: 'destructive', irreversible: true, description: 'Delete derived resources' },
	{ slug: 'CLOUDINARY_DELETE_RESOURCES_BY_ASSET_ID', name: 'Delete Resources by Asset ID', method: 'DELETE', path: '/resources', api: 'admin', bodyKind: 'json', riskLevel: 'destructive', irreversible: true, description: 'Delete resources by asset IDs' },
	{ slug: 'CLOUDINARY_DELETE_RESOURCES_BY_PUBLIC_ID', name: 'Delete Resources by Public ID', method: 'DELETE', path: '/resources/{resource_type}/{type}', api: 'admin', pathParams: ['resource_type', 'type'], bodyKind: 'json', riskLevel: 'destructive', irreversible: true, description: 'Delete resources by public ID' },
	{ slug: 'CLOUDINARY_DELETE_RESOURCES_BY_TAGS', name: 'Delete Resources by Tags', method: 'DELETE', path: '/resources/{resource_type}/tags/{tag}', api: 'admin', pathParams: ['resource_type', 'tag'], riskLevel: 'destructive', irreversible: true, description: 'Delete resources by tag' },
	{ slug: 'CLOUDINARY_DESTROY_ASSET', name: 'Destroy Asset', method: 'POST', path: '/destroy', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'destructive', irreversible: true, description: 'Destroy asset by public ID' },
	{ slug: 'CLOUDINARY_DESTROY_ASSET_BY_ID', name: 'Destroy Asset by ID', method: 'POST', path: '/destroy_by_id', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'destructive', irreversible: true, description: 'Destroy asset by asset ID' },

	// Upload
	{ slug: 'CLOUDINARY_UPLOAD_ASSET', name: 'Upload Asset', method: 'POST', path: '/upload', api: 'upload', uploadResourceType: 'image', bodyKind: 'multipart', riskLevel: 'write', description: 'Upload media asset' },
	{ slug: 'CLOUDINARY_UPLOAD_FILE_AUTO_DETECT', name: 'Upload File (Auto Detect)', method: 'POST', path: '/upload', api: 'upload', uploadResourceType: 'auto', bodyKind: 'multipart', riskLevel: 'write', description: 'Upload with auto resource type detection' },
	{ slug: 'CLOUDINARY_UPLOAD_CHUNK', name: 'Upload File Chunk', method: 'POST', path: '/upload_chunk', api: 'upload', uploadResourceType: 'image', bodyKind: 'multipart', riskLevel: 'write', description: 'Upload a file chunk for large uploads' },

	// Archive / generation
	{ slug: 'CLOUDINARY_GENERATE_ARCHIVE', name: 'Generate Archive', method: 'POST', path: '/generate_archive', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Generate ZIP/TGZ archive of assets' },
	{ slug: 'CLOUDINARY_GENERATE_SPRITE', name: 'Generate Sprite', method: 'POST', path: '/sprite', api: 'upload', uploadResourceType: 'image', bodyKind: 'form', riskLevel: 'write', description: 'Generate sprite from images (deprecated)' },

	// Account / config / analytics
	{ slug: 'CLOUDINARY_GET_CONFIG', name: 'Get product environment config', method: 'GET', path: '/config', api: 'admin', riskLevel: 'read', description: 'Get product environment config' },
	{ slug: 'CLOUDINARY_GET_USAGE', name: 'Get Usage', method: 'GET', path: '/usage', api: 'admin', queryParams: ['date'], riskLevel: 'read', description: 'Get account usage details' },
	{ slug: 'CLOUDINARY_GET_VIDEO_VIEWS', name: 'Get Video Views', method: 'GET', path: '/video/analytics/views', api: 'admin', queryParams: ['public_ids', 'start_date', 'end_date', 'max_results', 'next_cursor'], riskLevel: 'read', description: 'Get video analytics views' },
	{ slug: 'CLOUDINARY_GET_ANALYSIS_TASK_STATUS', name: 'Get Analysis Task Status', method: 'GET', path: '/analysis/tasks/{task_id}', api: 'admin', pathParams: ['task_id'], riskLevel: 'read', description: 'Get analysis task status' },
	{ slug: 'CLOUDINARY_PING_CLOUDINARY_SERVERS', name: 'Ping Cloudinary Servers', method: 'GET', path: '/ping', api: 'admin', riskLevel: 'read', description: 'Ping Cloudinary servers' },
];

const enriched = operations.map((op) => ({
	...op,
	key: endpointKey(op.slug),
	group: groupFromSlug(op.slug),
	bodyKind: op.bodyKind ?? (op.method === 'GET' ? 'none' : 'json'),
}));

const pkgDir = join(import.meta.dirname, '../packages/cloudinary');

// Write operations registry
writeFileSync(
	join(pkgDir, 'operations/index.ts'),
	`// Auto-generated by scripts/generate-cloudinary-plugin.ts — do not edit manually
import type { CloudinaryOperation } from '../endpoints/operation-types';

export const cloudinaryOperations: CloudinaryOperation[] = ${JSON.stringify(enriched, null, '\t')};
`,
);

// Group operations
const grouped = new Map<string, typeof enriched>();
for (const op of enriched) {
	const list = grouped.get(op.group) ?? [];
	list.push(op);
	grouped.set(op.group, list);
}

// Write group endpoint files
for (const [group, ops] of grouped) {
	const imports = `import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(\`[cloudinary] missing operation: \${name}\`);
	return operation;
}
`;
	const exports = ops
		.map((op) => `export const ${op.key}: CloudinaryEndpoint = createCloudinaryEndpoint(op('${op.key}'));`)
		.join('\n\n');

	writeFileSync(join(pkgDir, `endpoints/${group}.ts`), `${imports}\n${exports}\n`);
}

// Write endpoints/index.ts (group exports only)
const indexLines: string[] = [];

for (const [group, ops] of grouped) {
	const keys = ops.map((o) => o.key);
	indexLines.push(`import { ${keys.join(', ')} } from './${group}';`);
	const exportName =
		group === 'cloudinary' ? 'PingEndpoints' : `${toPascalCase(group)}Endpoints`;
	indexLines.push(`export const ${exportName} = { ${keys.join(', ')} } as const;`);
	indexLines.push('');
}

indexLines.push(`export {
	CloudinaryEndpointInputSchemas,
	CloudinaryEndpointOutputSchemas,
} from './types';`);
indexLines.push('export * from "./types";');

writeFileSync(join(pkgDir, 'endpoints/index.ts'), indexLines.join('\n'));

// Write endpoints/plugin.ts (nested tree + meta + schemas)
const pluginLines = [
	"import type { RequiredPluginEndpointMeta } from 'corsair/core';",
	"import { cloudinaryOperations } from '../operations';",
	"import {",
];

for (const [group] of grouped) {
	const exportName =
		group === 'cloudinary' ? 'PingEndpoints' : `${toPascalCase(group)}Endpoints`;
	pluginLines.push(`\t${exportName},`);
}
pluginLines.push("} from './index';");
pluginLines.push("import { CloudinaryEndpointInputSchemas, CloudinaryEndpointOutputSchemas } from './types';");
pluginLines.push('');
pluginLines.push('export const cloudinaryEndpointsNested = {');
for (const [group] of grouped) {
	const exportName =
		group === 'cloudinary' ? 'PingEndpoints' : `${toPascalCase(group)}Endpoints`;
	pluginLines.push(`\t${group}: ${exportName},`);
}
pluginLines.push('} as const;', '');
pluginLines.push(`export const cloudinaryEndpointMeta = Object.fromEntries(
	cloudinaryOperations.map((operation) => [
		\`\${operation.group}.\${operation.key}\`,
		{
			riskLevel: operation.riskLevel,
			...(operation.irreversible ? { irreversible: true as const } : {}),
			description: operation.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof cloudinaryEndpointsNested>;`, '');
pluginLines.push(`export const cloudinaryEndpointSchemas = Object.fromEntries(
	cloudinaryOperations.map((operation) => [
		\`\${operation.group}.\${operation.key}\`,
		{
			input: CloudinaryEndpointInputSchemas[operation.key],
			output: CloudinaryEndpointOutputSchemas[operation.key],
		},
	]),
);`, '');

writeFileSync(join(pkgDir, 'endpoints/plugin.ts'), pluginLines.join('\n'));

// Write endpoints/types.ts
const typeLines = [
	"import { z } from 'zod';",
	"import { cloudinaryOperations } from '../operations';",
	"import type { CloudinaryOperation } from './operation-types';",
	"import {",
	'\tCloudinaryFolderSchema,',
	'\tCloudinaryLiveStreamSchema,',
	'\tCloudinaryMetadataFieldSchema,',
	'\tCloudinaryResourceSchema,',
	'\tCloudinaryTransformationSchema,',
	'\tCloudinaryUploadPresetSchema,',
	'\tPaginationSchema,',
	'} from "./schemas";',
	'',
	'const QuerySchema = z.record(z.string(), z.unknown());',
	'',
	'export const CloudinaryEndpointInputBaseSchema = z',
	'\t.object({',
	'\t\tquery: QuerySchema.optional(),',
	'\t\tbody: z.unknown().optional(),',
	'\t\tfile: z.union([z.instanceof(Blob), z.instanceof(File)]).optional(),',
	'\t\tresource_type: z.enum(["image", "video", "raw", "auto"]).optional(),',
	'\t\tupload_resource_type: z.enum(["image", "video", "raw", "auto"]).optional(),',
	'\t})',
	'\t.catchall(z.unknown());',
	'',
	'export type CloudinaryEndpointInput = z.infer<',
	'\ttypeof CloudinaryEndpointInputBaseSchema',
	'>;',
	'',
	'function inputSchemaForOperation(operation: CloudinaryOperation) {',
	'\tconst pathParams = Object.fromEntries(',
	'\t\t(operation.pathParams ?? []).map((param) => [param, z.string().min(1)]),',
	'\t);',
	'\tconst queryParams = Object.fromEntries(',
	'\t\t(operation.queryParams ?? []).map((param) => [param, z.unknown().optional()]),',
	'\t);',
	'\treturn CloudinaryEndpointInputBaseSchema.extend({',
	'\t\t...pathParams,',
	'\t\t...queryParams,',
	'\t});',
	'}',
	'',
	'export const CloudinaryEndpointInputSchemas = Object.fromEntries(',
	'\tcloudinaryOperations.map((operation) => [',
	'\t\toperation.key,',
	'\t\tinputSchemaForOperation(operation),',
	'\t]),',
	') as Record<string, z.ZodTypeAny>;',
	'',
	'export type CloudinaryEndpointInputs = {',
	'\t[K in keyof typeof CloudinaryEndpointInputSchemas]: z.infer<',
	'\t\t(typeof CloudinaryEndpointInputSchemas)[K]',
	'\t>;',
	'};',
	'',
	'const CloudinaryResourceListResponseSchema = PaginationSchema.extend({',
	'\tresources: z.array(CloudinaryResourceSchema).optional(),',
	'}).passthrough();',
	'',
	'const CloudinaryFolderListResponseSchema = PaginationSchema.extend({',
	'\tfolders: z.array(CloudinaryFolderSchema).optional(),',
	'}).passthrough();',
	'',
	'const CloudinaryUploadPresetListResponseSchema = PaginationSchema.extend({',
	'\tpresets: z.array(CloudinaryUploadPresetSchema).optional(),',
	'}).passthrough();',
	'',
	'const CloudinaryTransformationListResponseSchema = PaginationSchema.extend({',
	'\ttransformations: z.array(CloudinaryTransformationSchema).optional(),',
	'}).passthrough();',
	'',
	'const CloudinaryMetadataFieldListResponseSchema = z',
	'\t.object({',
	'\t\tmetadata_fields: z.array(CloudinaryMetadataFieldSchema).optional(),',
	'\t})',
	'\t.passthrough();',
	'',
	'const CloudinaryLiveStreamListResponseSchema = PaginationSchema.extend({',
	'\tlive_streams: z.array(CloudinaryLiveStreamSchema).optional(),',
	'}).passthrough();',
	'',
	'const OUTPUT_SCHEMA_BY_KEY: Partial<Record<string, z.ZodTypeAny>> = {',
	'\tgetResourceByAssetId: CloudinaryResourceSchema.passthrough(),',
	'\tgetResourceByPublicId: CloudinaryResourceSchema.passthrough(),',
	'\tlistImages: CloudinaryResourceListResponseSchema,',
	'\tlistVideos: CloudinaryResourceListResponseSchema,',
	'\tlistRawFiles: CloudinaryResourceListResponseSchema,',
	'\tlistResourcesByType: CloudinaryResourceListResponseSchema,',
	'\tsearchAssets: CloudinaryResourceListResponseSchema,',
	'\tgetRootFolders: CloudinaryFolderListResponseSchema,',
	'\tshowFolder: CloudinaryFolderListResponseSchema,',
	'\tgetUploadPreset: CloudinaryUploadPresetSchema.passthrough(),',
	'\tlistUploadPresets: CloudinaryUploadPresetListResponseSchema,',
	'\tgetTransformation: CloudinaryTransformationSchema.passthrough(),',
	'\tgetTransformations: CloudinaryTransformationListResponseSchema,',
	'\tlistMetadataFields: CloudinaryMetadataFieldListResponseSchema,',
	'\tgetMetadataFieldById: CloudinaryMetadataFieldSchema.passthrough(),',
	'\tgetLiveStream: CloudinaryLiveStreamSchema.passthrough(),',
	'\tgetLiveStreams: CloudinaryLiveStreamListResponseSchema,',
	'};',
	'',
	'export const CloudinaryEndpointOutputSchemas = Object.fromEntries(',
	'\tcloudinaryOperations.map((operation) => [',
	'\t\toperation.key,',
	'\t\tOUTPUT_SCHEMA_BY_KEY[operation.key] ?? z.unknown(),',
	'\t]),',
	') as Record<string, z.ZodTypeAny>;',
	'',
	'export type CloudinaryEndpointOutputs = {',
	'\t[K in keyof typeof CloudinaryEndpointOutputSchemas]: z.infer<',
	'\t\t(typeof CloudinaryEndpointOutputSchemas)[K]',
	'\t>;',
	'};',
	'',
];

writeFileSync(join(pkgDir, 'endpoints/types.ts'), typeLines.join('\n'));

console.log(`Generated ${enriched.length} operations in ${grouped.size} groups`);
