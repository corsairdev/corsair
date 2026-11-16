# @corsair-dev/felt

Felt plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/felt
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.delete` | `felt.api.comments.delete` | `destructive` | Permanently delete a map comment |
| `comments.export` | `felt.api.comments.export` | `read` | Export all comments and replies from a map |
| `comments.resolve` | `felt.api.comments.resolve` | `write` | Resolve a map comment thread |
| `elements.delete` | `felt.api.elements.delete` | `destructive` | Delete a drawn element from a map |
| `elements.getGroup` | `felt.api.elements.getGroup` | `read` | Get elements in an element group as GeoJSON |
| `elements.list` | `felt.api.elements.list` | `read` | List drawn elements on a map in GeoJSON format |
| `elements.listGroups` | `felt.api.elements.listGroups` | `read` | List element groups in a map |
| `elements.upsert` | `felt.api.elements.upsert` | `write` | Create or update elements on a map using GeoJSON FeatureCollection |
| `elements.upsertGroups` | `felt.api.elements.upsertGroups` | `write` | Create or update element groups in a map |
| `layerComponents.create` | `felt.api.layerComponents.create` | `write` | Create a dashboard component on a layer |
| `layerComponents.delete` | `felt.api.layerComponents.delete` | `destructive` | Permanently delete a layer component |
| `layerComponents.get` | `felt.api.layerComponents.get` | `read` | Get details of a layer component |
| `layerComponents.list` | `felt.api.layerComponents.list` | `read` | List dashboard UI components attached to a layer |
| `layerComponents.update` | `felt.api.layerComponents.update` | `write` | Update a dashboard component on a layer |
| `layerGroups.delete` | `felt.api.layerGroups.delete` | `destructive` | Permanently delete a layer group |
| `layerGroups.get` | `felt.api.layerGroups.get` | `read` | Get details of a layer group |
| `layerGroups.list` | `felt.api.layerGroups.list` | `read` | List layer groups in a map |
| `layerGroups.publish` | `felt.api.layerGroups.publish` | `write` | Publish a layer group to the library |
| `layerGroups.update` | `felt.api.layerGroups.update` | `write` | Update properties of a layer group |
| `layerGroups.updateBulk` | `felt.api.layerGroups.updateBulk` | `write` | Update multiple layer groups in bulk |
| `layers.addFromSource` | `felt.api.layers.addFromSource` | `write` | Add a layer to a map from a connected data source dataset |
| `layers.createCustomExport` | `felt.api.layers.createCustomExport` | `write` | Request an export of layer data in a specified format |
| `layers.delete` | `felt.api.layers.delete` | `destructive` | Permanently delete a map layer |
| `layers.duplicate` | `felt.api.layers.duplicate` | `write` | Duplicate layers across maps |
| `layers.get` | `felt.api.layers.get` | `read` | Get details of a specific map layer |
| `layers.getExportLink` | `felt.api.layers.getExportLink` | `read` | Get a direct download link for layer data |
| `layers.list` | `felt.api.layers.list` | `read` | List all layers within a map |
| `layers.listLibrary` | `felt.api.layers.listLibrary` | `read` | List layers available in the library |
| `layers.pollCustomExport` | `felt.api.layers.pollCustomExport` | `read` | Check status and get download URL of a layer export request |
| `layers.publish` | `felt.api.layers.publish` | `write` | Publish a layer to the library |
| `layers.refresh` | `felt.api.layers.refresh` | `write` | Trigger a refresh of a live data layer |
| `layers.update` | `felt.api.layers.update` | `write` | Update multiple map layers in bulk |
| `layers.updateStyle` | `felt.api.layers.updateStyle` | `write` | Update visual style of a layer using Felt Style Language |
| `layers.upload` | `felt.api.layers.upload` | `write` | Upload a data layer to a map from a URL or file upload parameters |
| `maps.create` | `felt.api.maps.create` | `write` | Create a new map in Felt |
| `maps.createEmbedToken` | `felt.api.maps.createEmbedToken` | `write` | Create a secure authenticated embed token for a map |
| `maps.delete` | `felt.api.maps.delete` | `destructive` | Permanently delete a map |
| `maps.duplicate` | `felt.api.maps.duplicate` | `write` | Duplicate an existing map |
| `maps.exportImage` | `felt.api.maps.exportImage` | `write` | Trigger an export of the map as an image |
| `maps.get` | `felt.api.maps.get` | `read` | Get details and layers of a map |
| `maps.move` | `felt.api.maps.move` | `write` | Move a map to a project or folder |
| `maps.update` | `felt.api.maps.update` | `write` | Update map properties such as title, description, or permissions |
| `printPages.createLayout` | `felt.api.printPages.createLayout` | `write` | Save a print page as a reusable layout template |
| `printPages.createPage` | `felt.api.printPages.createPage` | `write` | Create a new print page design in a map |
| `printPages.deleteItem` | `felt.api.printPages.deleteItem` | `destructive` | Delete an item from a print page design |
| `printPages.deleteLayout` | `felt.api.printPages.deleteLayout` | `destructive` | Delete a print layout template |
| `printPages.deletePage` | `felt.api.printPages.deletePage` | `destructive` | Permanently delete a print page design |
| `printPages.exportPage` | `felt.api.printPages.exportPage` | `write` | Export a print page as a PDF or image |
| `printPages.getPage` | `felt.api.printPages.getPage` | `read` | Get details and items of a print page design |
| `printPages.listLayouts` | `felt.api.printPages.listLayouts` | `read` | List saved print layouts in a map |
| `printPages.listPages` | `felt.api.printPages.listPages` | `read` | List print page designs in a map |
| `printPages.updateLayout` | `felt.api.printPages.updateLayout` | `write` | Update a print layout template |
| `printPages.updatePage` | `felt.api.printPages.updatePage` | `write` | Update properties and dimensions of a print page design |
| `printPages.upsertItems` | `felt.api.printPages.upsertItems` | `write` | Create or update items on a print page design |
| `projects.create` | `felt.api.projects.create` | `write` | Create a new project in the workspace |
| `projects.delete` | `felt.api.projects.delete` | `destructive` | Permanently delete a project |
| `projects.get` | `felt.api.projects.get` | `read` | Get details and maps contained within a project |
| `projects.list` | `felt.api.projects.list` | `read` | List projects in the workspace |
| `projects.update` | `felt.api.projects.update` | `write` | Update project settings or permissions |
| `sources.create` | `felt.api.sources.create` | `write` | Connect a new cloud database or warehouse data source |
| `sources.createCredential` | `felt.api.sources.createCredential` | `write` | Add an authentication credential to a data source |
| `sources.delete` | `felt.api.sources.delete` | `destructive` | Permanently delete a data source connection |
| `sources.deleteCredential` | `felt.api.sources.deleteCredential` | `destructive` | Permanently delete a credential from a data source |
| `sources.get` | `felt.api.sources.get` | `read` | Get details of a connected data source and its datasets |
| `sources.list` | `felt.api.sources.list` | `read` | List connected data sources in the workspace |
| `sources.sync` | `felt.api.sources.sync` | `write` | Trigger a manual sync of a connected data source |
| `sources.update` | `felt.api.sources.update` | `write` | Update data source configuration or permissions |
| `sources.updateCredential` | `felt.api.sources.updateCredential` | `write` | Update an authentication credential on a data source |
| `users.getCurrent` | `felt.api.users.getCurrent` | `read` | Retrieve profile information for the authenticated user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

- Official Felt API Reference: https://developers.felt.com/
- Official API Base URL: https://felt.com/api/v2
- Full Corsair docs, types, and examples: https://docs.corsair.dev/plugins/felt

## License

Apache-2.0
