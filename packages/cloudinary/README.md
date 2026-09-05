# @corsair-dev/cloudinary

Cloudinary plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cloudinary
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `adaptive.getAdaptiveStreamingProfiles` | `cloudinary.api.adaptive.getAdaptiveStreamingProfiles` | `read` | List streaming profiles |
| `analysis.getAnalysisTaskStatus` | `cloudinary.api.analysis.getAnalysisTaskStatus` | `read` | Get analysis task status |
| `asset.createAssetRelationsByAssetId` | `cloudinary.api.asset.createAssetRelationsByAssetId` | `write` | Add related assets by asset ID |
| `asset.createAssetRelationsByPublicId` | `cloudinary.api.asset.createAssetRelationsByPublicId` | `write` | Add related assets by public ID |
| `asset.deleteAssetRelationsByAssetId` | `cloudinary.api.asset.deleteAssetRelationsByAssetId` | `destructive` | Remove related assets by asset ID |
| `asset.deleteAssetRelationsByPublicId` | `cloudinary.api.asset.deleteAssetRelationsByPublicId` | `destructive` | Remove related assets by public ID |
| `asset.destroyAsset` | `cloudinary.api.asset.destroyAsset` | `destructive` | Destroy asset by public ID |
| `asset.destroyAssetById` | `cloudinary.api.asset.destroyAssetById` | `destructive` | Destroy asset by asset ID |
| `asset.updateAssetMetadata` | `cloudinary.api.asset.updateAssetMetadata` | `write` | Update asset metadata values |
| `asset.uploadAsset` | `cloudinary.api.asset.uploadAsset` | `write` | Upload media asset |
| `assets.searchAssets` | `cloudinary.api.assets.searchAssets` | `read` | Search assets with Lucene-like expressions |
| `assets.searchVisualAssets` | `cloudinary.api.assets.searchVisualAssets` | `read` | Visual search for similar assets |
| `chunk.uploadChunk` | `cloudinary.api.chunk.uploadChunk` | `write` | Upload a file chunk for large uploads (requires content_range and x_unique_upload_id) |
| `cloudinary.pingCloudinaryServers` | `cloudinary.api.cloudinary.pingCloudinaryServers` | `read` | Ping Cloudinary servers |
| `config.getConfig` | `cloudinary.api.config.getConfig` | `read` | Get product environment config |
| `context.manageContext` | `cloudinary.api.context.manageContext` | `write` | Add or remove contextual metadata |
| `create.createTrigger` | `cloudinary.api.create.createTrigger` | `write` | Create webhook trigger |
| `datasource.searchDatasourceInMetadataField` | `cloudinary.api.datasource.searchDatasourceInMetadataField` | `read` | Search datasource in metadata field |
| `delete.deleteTrigger` | `cloudinary.api.delete.deleteTrigger` | `destructive` | Delete webhook trigger |
| `derived.deleteDerivedResources` | `cloudinary.api.derived.deleteDerivedResources` | `destructive` | Delete derived resources |
| `entries.deleteEntriesInMetadataFieldDatasource` | `cloudinary.api.entries.deleteEntriesInMetadataFieldDatasource` | `destructive` | Delete datasource entries |
| `entries.restoreEntriesInMetadataFieldDatasource` | `cloudinary.api.entries.restoreEntriesInMetadataFieldDatasource` | `write` | Restore datasource entries |
| `file.uploadFileAutoDetect` | `cloudinary.api.file.uploadFileAutoDetect` | `write` | Upload with auto resource type detection |
| `folder.createFolder` | `cloudinary.api.folder.createFolder` | `write` | Create a new asset folder |
| `folder.deleteFolder` | `cloudinary.api.folder.deleteFolder` | `destructive` | Delete an empty folder |
| `folder.showFolder` | `cloudinary.api.folder.showFolder` | `read` | List subfolders in a folder |
| `folder.updateFolder` | `cloudinary.api.folder.updateFolder` | `write` | Rename or move a folder |
| `folders.searchFolders` | `cloudinary.api.folders.searchFolders` | `read` | Search asset folders |
| `folders.searchFoldersV2` | `cloudinary.api.folders.searchFoldersV2` | `read` | Search folders (v2 POST) |
| `generate.generateArchive` | `cloudinary.api.generate.generateArchive` | `write` | Generate ZIP/TGZ archive of assets |
| `image.createImageFromText` | `cloudinary.api.image.createImageFromText` | `write` | Generate an image from text |
| `images.listImages` | `cloudinary.api.images.listImages` | `read` | List image assets |
| `live.activateLiveStream` | `cloudinary.api.live.activateLiveStream` | `write` | Manually activate a live stream |
| `live.createLiveStream` | `cloudinary.api.live.createLiveStream` | `write` | Create a new live stream |
| `live.createLiveStreamOutput` | `cloudinary.api.live.createLiveStreamOutput` | `write` | Create a live stream output |
| `live.deleteLiveStream` | `cloudinary.api.live.deleteLiveStream` | `destructive` | Delete a live stream |
| `live.deleteLiveStreamOutput` | `cloudinary.api.live.deleteLiveStreamOutput` | `destructive` | Delete a live stream output |
| `live.getLiveStream` | `cloudinary.api.live.getLiveStream` | `read` | Get live stream details |
| `live.getLiveStreamOutput` | `cloudinary.api.live.getLiveStreamOutput` | `read` | Get live stream output details |
| `live.getLiveStreamOutputs` | `cloudinary.api.live.getLiveStreamOutputs` | `read` | List live stream outputs |
| `live.getLiveStreams` | `cloudinary.api.live.getLiveStreams` | `read` | List live streams |
| `live.idleLiveStream` | `cloudinary.api.live.idleLiveStream` | `write` | Put a live stream into idle state |
| `live.updateLiveStream` | `cloudinary.api.live.updateLiveStream` | `write` | Update live stream configuration |
| `live.updateLiveStreamOutput` | `cloudinary.api.live.updateLiveStreamOutput` | `write` | Update live stream output configuration |
| `mapping.createUploadMapping` | `cloudinary.api.mapping.createUploadMapping` | `write` | Create upload mapping |
| `mapping.deleteUploadMapping` | `cloudinary.api.mapping.deleteUploadMapping` | `destructive` | Delete upload mapping |
| `mapping.getUploadMappingDetails` | `cloudinary.api.mapping.getUploadMappingDetails` | `read` | Get upload mapping details |
| `mapping.updateUploadMapping` | `cloudinary.api.mapping.updateUploadMapping` | `write` | Update upload mapping |
| `mappings.getUploadMappings` | `cloudinary.api.mappings.getUploadMappings` | `read` | List upload mappings |
| `metadata.createMetadataField` | `cloudinary.api.metadata.createMetadataField` | `write` | Create metadata field definition |
| `metadata.createMetadataRule` | `cloudinary.api.metadata.createMetadataRule` | `write` | Create metadata rule |
| `metadata.deleteMetadataField` | `cloudinary.api.metadata.deleteMetadataField` | `destructive` | Delete metadata field |
| `metadata.deleteMetadataRule` | `cloudinary.api.metadata.deleteMetadataRule` | `destructive` | Delete metadata rule |
| `metadata.getMetadataFieldById` | `cloudinary.api.metadata.getMetadataFieldById` | `read` | Get metadata field by external ID |
| `metadata.listMetadataFields` | `cloudinary.api.metadata.listMetadataFields` | `read` | List metadata fields |
| `metadata.listMetadataRules` | `cloudinary.api.metadata.listMetadataRules` | `read` | List metadata rules |
| `metadata.orderMetadataFieldDatasource` | `cloudinary.api.metadata.orderMetadataFieldDatasource` | `write` | Order metadata field datasource |
| `metadata.reorderMetadataField` | `cloudinary.api.metadata.reorderMetadataField` | `write` | Reorder a metadata field |
| `metadata.reorderMetadataFields` | `cloudinary.api.metadata.reorderMetadataFields` | `write` | Reorder all metadata fields |
| `metadata.searchMetadataFieldDatasource` | `cloudinary.api.metadata.searchMetadataFieldDatasource` | `read` | Search all metadata datasources |
| `metadata.updateMetadataField` | `cloudinary.api.metadata.updateMetadataField` | `write` | Update metadata field definition |
| `metadata.updateMetadataFieldDatasource` | `cloudinary.api.metadata.updateMetadataFieldDatasource` | `write` | Update metadata field datasource |
| `metadata.updateMetadataRule` | `cloudinary.api.metadata.updateMetadataRule` | `write` | Update metadata rule |
| `multi.createMultiResource` | `cloudinary.api.multi.createMultiResource` | `write` | Create animation from multiple images |
| `preset.createUploadPreset` | `cloudinary.api.preset.createUploadPreset` | `write` | Create upload preset |
| `preset.deleteUploadPreset` | `cloudinary.api.preset.deleteUploadPreset` | `destructive` | Delete upload preset |
| `preset.getUploadPreset` | `cloudinary.api.preset.getUploadPreset` | `read` | Get upload preset |
| `preset.updateUploadPreset` | `cloudinary.api.preset.updateUploadPreset` | `write` | Update upload preset |
| `presets.listUploadPresets` | `cloudinary.api.presets.listUploadPresets` | `read` | List upload presets |
| `raw.listRawFiles` | `cloudinary.api.raw.listRawFiles` | `read` | List raw assets |
| `resource.explicitResource` | `cloudinary.api.resource.explicitResource` | `write` | Explicitly update or generate derived assets |
| `resource.explodeResource` | `cloudinary.api.resource.explodeResource` | `write` | Explode multi-page resource into separate images |
| `resource.getResourceByAssetId` | `cloudinary.api.resource.getResourceByAssetId` | `read` | Get resource by asset ID |
| `resource.getResourceByPublicId` | `cloudinary.api.resource.getResourceByPublicId` | `read` | Get resource by public ID |
| `resource.listResourceTypes` | `cloudinary.api.resource.listResourceTypes` | `read` | List available resource types |
| `resource.renameResource` | `cloudinary.api.resource.renameResource` | `write` | Rename or move resource public ID |
| `resource.updateResourceByAssetId` | `cloudinary.api.resource.updateResourceByAssetId` | `write` | Update resource by asset ID |
| `resource.updateResourceByPublicId` | `cloudinary.api.resource.updateResourceByPublicId` | `write` | Update resource by public ID |
| `resource.updateResourceTags` | `cloudinary.api.resource.updateResourceTags` | `write` | Add, remove, or replace resource tags |
| `resources.deleteResourcesByAssetId` | `cloudinary.api.resources.deleteResourcesByAssetId` | `destructive` | Delete resources by asset IDs |
| `resources.deleteResourcesByPublicId` | `cloudinary.api.resources.deleteResourcesByPublicId` | `destructive` | Delete resources by public ID |
| `resources.deleteResourcesByTags` | `cloudinary.api.resources.deleteResourcesByTags` | `destructive` | Delete resources by tag |
| `resources.getResourcesByAssetFolder` | `cloudinary.api.resources.getResourcesByAssetFolder` | `read` | List assets in a folder |
| `resources.getResourcesByContext` | `cloudinary.api.resources.getResourcesByContext` | `read` | Get resources by context metadata |
| `resources.getResourcesInModeration` | `cloudinary.api.resources.getResourcesInModeration` | `read` | Get resources in moderation queue |
| `resources.listResourcesByAssetIds` | `cloudinary.api.resources.listResourcesByAssetIds` | `read` | List resources by asset IDs |
| `resources.listResourcesByExternalIds` | `cloudinary.api.resources.listResourcesByExternalIds` | `read` | List resources by external IDs |
| `resources.listResourcesByTag` | `cloudinary.api.resources.listResourcesByTag` | `read` | List resources by tag |
| `resources.listResourcesByType` | `cloudinary.api.resources.listResourcesByType` | `read` | List resources by type |
| `resources.publishResources` | `cloudinary.api.resources.publishResources` | `write` | Publish resources to public access |
| `resources.restoreResources` | `cloudinary.api.resources.restoreResources` | `write` | Restore deleted resources by public ID |
| `resources.restoreResourcesByAssetIds` | `cloudinary.api.resources.restoreResourcesByAssetIds` | `write` | Restore resources by asset IDs |
| `root.getRootFolders` | `cloudinary.api.root.getRootFolders` | `read` | List root folders |
| `slideshow.createSlideshow` | `cloudinary.api.slideshow.createSlideshow` | `write` | Create video slideshow from assets |
| `sprite.generateSprite` | `cloudinary.api.sprite.generateSprite` | `write` | Generate sprite from images (deprecated) |
| `streaming.createStreamingProfile` | `cloudinary.api.streaming.createStreamingProfile` | `write` | Create adaptive streaming profile |
| `streaming.deleteStreamingProfile` | `cloudinary.api.streaming.deleteStreamingProfile` | `destructive` | Delete streaming profile |
| `streaming.getStreamingProfileDetails` | `cloudinary.api.streaming.getStreamingProfileDetails` | `read` | Get streaming profile details |
| `streaming.updateStreamingProfile` | `cloudinary.api.streaming.updateStreamingProfile` | `write` | Update streaming profile |
| `tags.getTags` | `cloudinary.api.tags.getTags` | `read` | List tags for a resource type |
| `transformation.createTransformation` | `cloudinary.api.transformation.createTransformation` | `write` | Create named transformation |
| `transformation.getTransformation` | `cloudinary.api.transformation.getTransformation` | `read` | Get transformation details |
| `transformation2.deleteTransformation2` | `cloudinary.api.transformation2.deleteTransformation2` | `destructive` | Delete named transformation |
| `transformation2.updateTransformation2` | `cloudinary.api.transformation2.updateTransformation2` | `write` | Update named transformation |
| `transformations.getTransformations` | `cloudinary.api.transformations.getTransformations` | `read` | List transformations |
| `triggers.getTriggers` | `cloudinary.api.triggers.getTriggers` | `read` | List webhook triggers |
| `update.updateTrigger` | `cloudinary.api.update.updateTrigger` | `write` | Update webhook trigger |
| `usage.getUsage` | `cloudinary.api.usage.getUsage` | `read` | Get account usage details |
| `video.getVideoViews` | `cloudinary.api.video.getVideoViews` | `read` | Get video analytics views |
| `videos.listVideos` | `cloudinary.api.videos.listVideos` | `read` | List video assets |

## Auth

Authentication depends on how you configure the plugin factory. See the full reference for supported methods.

## Webhooks

Handles 13 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cloudinary

## License

Apache-2.0
