import {
	activateLiveStream,
	createLiveStream,
	createLiveStreamOutput,
	deleteLiveStream,
	deleteLiveStreamOutput,
	getLiveStream,
	getLiveStreamOutput,
	getLiveStreamOutputs,
	getLiveStreams,
	idleLiveStream,
	updateLiveStream,
	updateLiveStreamOutput,
} from './live';
export const LiveEndpoints = {
	activateLiveStream,
	createLiveStream,
	createLiveStreamOutput,
	deleteLiveStream,
	deleteLiveStreamOutput,
	getLiveStream,
	getLiveStreamOutput,
	getLiveStreamOutputs,
	getLiveStreams,
	idleLiveStream,
	updateLiveStream,
	updateLiveStreamOutput,
} as const;

import {
	createAssetRelationsByAssetId,
	createAssetRelationsByPublicId,
	deleteAssetRelationsByAssetId,
	deleteAssetRelationsByPublicId,
	destroyAsset,
	destroyAssetById,
	updateAssetMetadata,
	uploadAsset,
} from './asset';
export const AssetEndpoints = {
	createAssetRelationsByAssetId,
	createAssetRelationsByPublicId,
	deleteAssetRelationsByAssetId,
	deleteAssetRelationsByPublicId,
	updateAssetMetadata,
	destroyAsset,
	destroyAssetById,
	uploadAsset,
} as const;

import { createFolder, deleteFolder, showFolder, updateFolder } from './folder';
export const FolderEndpoints = {
	createFolder,
	deleteFolder,
	showFolder,
	updateFolder,
} as const;

import { getRootFolders } from './root';
export const RootEndpoints = { getRootFolders } as const;

import {
	deleteResourcesByAssetId,
	deleteResourcesByPublicId,
	deleteResourcesByTags,
	getResourcesByAssetFolder,
	getResourcesByContext,
	getResourcesInModeration,
	listResourcesByAssetIds,
	listResourcesByExternalIds,
	listResourcesByTag,
	listResourcesByType,
	publishResources,
	restoreResources,
	restoreResourcesByAssetIds,
} from './resources';
export const ResourcesEndpoints = {
	getResourcesByAssetFolder,
	getResourcesByContext,
	getResourcesInModeration,
	listResourcesByAssetIds,
	listResourcesByExternalIds,
	listResourcesByTag,
	listResourcesByType,
	publishResources,
	restoreResources,
	restoreResourcesByAssetIds,
	deleteResourcesByAssetId,
	deleteResourcesByPublicId,
	deleteResourcesByTags,
} as const;

import { searchFolders, searchFoldersV2 } from './folders';
export const FoldersEndpoints = { searchFolders, searchFoldersV2 } as const;

import { createImageFromText } from './image';
export const ImageEndpoints = { createImageFromText } as const;

import { createMultiResource } from './multi';
export const MultiEndpoints = { createMultiResource } as const;

import { createSlideshow } from './slideshow';
export const SlideshowEndpoints = { createSlideshow } as const;

import {
	createStreamingProfile,
	deleteStreamingProfile,
	getStreamingProfileDetails,
	updateStreamingProfile,
} from './streaming';
export const StreamingEndpoints = {
	createStreamingProfile,
	deleteStreamingProfile,
	getStreamingProfileDetails,
	updateStreamingProfile,
} as const;

import { getAdaptiveStreamingProfiles } from './adaptive';
export const AdaptiveEndpoints = { getAdaptiveStreamingProfiles } as const;

import { createTransformation, getTransformation } from './transformation';
export const TransformationEndpoints = {
	createTransformation,
	getTransformation,
} as const;

import {
	deleteTransformation2,
	updateTransformation2,
} from './transformation2';
export const Transformation2Endpoints = {
	deleteTransformation2,
	updateTransformation2,
} as const;

import { getTransformations } from './transformations';
export const TransformationsEndpoints = { getTransformations } as const;

import {
	createMetadataField,
	createMetadataRule,
	deleteMetadataField,
	deleteMetadataRule,
	getMetadataFieldById,
	listMetadataFields,
	listMetadataRules,
	orderMetadataFieldDatasource,
	reorderMetadataField,
	reorderMetadataFields,
	searchMetadataFieldDatasource,
	updateMetadataField,
	updateMetadataFieldDatasource,
	updateMetadataRule,
} from './metadata';
export const MetadataEndpoints = {
	createMetadataField,
	createMetadataRule,
	deleteMetadataField,
	deleteMetadataRule,
	getMetadataFieldById,
	listMetadataFields,
	listMetadataRules,
	orderMetadataFieldDatasource,
	reorderMetadataField,
	reorderMetadataFields,
	searchMetadataFieldDatasource,
	updateMetadataField,
	updateMetadataFieldDatasource,
	updateMetadataRule,
} as const;

import {
	deleteEntriesInMetadataFieldDatasource,
	restoreEntriesInMetadataFieldDatasource,
} from './entries';
export const EntriesEndpoints = {
	deleteEntriesInMetadataFieldDatasource,
	restoreEntriesInMetadataFieldDatasource,
} as const;

import { searchDatasourceInMetadataField } from './datasource';
export const DatasourceEndpoints = { searchDatasourceInMetadataField } as const;

import { createTrigger } from './create';
export const CreateEndpoints = { createTrigger } as const;

import { deleteTrigger } from './delete';
export const DeleteEndpoints = { deleteTrigger } as const;

import { getTriggers } from './triggers';
export const TriggersEndpoints = { getTriggers } as const;

import { updateTrigger } from './update';
export const UpdateEndpoints = { updateTrigger } as const;

import {
	createUploadMapping,
	deleteUploadMapping,
	getUploadMappingDetails,
	updateUploadMapping,
} from './mapping';
export const MappingEndpoints = {
	createUploadMapping,
	deleteUploadMapping,
	getUploadMappingDetails,
	updateUploadMapping,
} as const;

import { getUploadMappings } from './mappings';
export const MappingsEndpoints = { getUploadMappings } as const;

import {
	createUploadPreset,
	deleteUploadPreset,
	getUploadPreset,
	updateUploadPreset,
} from './preset';
export const PresetEndpoints = {
	createUploadPreset,
	deleteUploadPreset,
	getUploadPreset,
	updateUploadPreset,
} as const;

import { listUploadPresets } from './presets';
export const PresetsEndpoints = { listUploadPresets } as const;

import {
	explicitResource,
	explodeResource,
	getResourceByAssetId,
	getResourceByPublicId,
	listResourceTypes,
	renameResource,
	updateResourceByAssetId,
	updateResourceByPublicId,
	updateResourceTags,
} from './resource';
export const ResourceEndpoints = {
	getResourceByAssetId,
	getResourceByPublicId,
	listResourceTypes,
	explicitResource,
	explodeResource,
	renameResource,
	updateResourceByAssetId,
	updateResourceByPublicId,
	updateResourceTags,
} as const;

import { listImages } from './images';
export const ImagesEndpoints = { listImages } as const;

import { listRawFiles } from './raw';
export const RawEndpoints = { listRawFiles } as const;

import { listVideos } from './videos';
export const VideosEndpoints = { listVideos } as const;

import { searchAssets, searchVisualAssets } from './assets';
export const AssetsEndpoints = { searchAssets, searchVisualAssets } as const;

import { manageContext } from './context';
export const ContextEndpoints = { manageContext } as const;

import { getTags } from './tags';
export const TagsEndpoints = { getTags } as const;

import { deleteDerivedResources } from './derived';
export const DerivedEndpoints = { deleteDerivedResources } as const;

import { uploadFileAutoDetect } from './file';
export const FileEndpoints = { uploadFileAutoDetect } as const;

import { uploadChunk } from './chunk';
export const ChunkEndpoints = { uploadChunk } as const;

import { generateArchive } from './generate';
export const GenerateEndpoints = { generateArchive } as const;

import { generateSprite } from './sprite';
export const SpriteEndpoints = { generateSprite } as const;

import { getConfig } from './config';
export const ConfigEndpoints = { getConfig } as const;

import { getUsage } from './usage';
export const UsageEndpoints = { getUsage } as const;

import { getVideoViews } from './video';
export const VideoEndpoints = { getVideoViews } as const;

import { getAnalysisTaskStatus } from './analysis';
export const AnalysisEndpoints = { getAnalysisTaskStatus } as const;

import { pingCloudinaryServers } from './cloudinary';
export const PingEndpoints = { pingCloudinaryServers } as const;

export * from './types';
export {
	CloudinaryEndpointInputSchemas,
	CloudinaryEndpointOutputSchemas,
} from './types';
