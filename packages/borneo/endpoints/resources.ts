import { createBorneoEndpoint } from './factory';

export const deleteTagFromResource = createBorneoEndpoint(
	'deleteTagFromResource',
	'BORNEO_DELETE_TAG_FROM_RESOURCE',
	'borneo.resources.deleteTagFromResource',
);

export const exportFilteredLeafResources = createBorneoEndpoint(
	'exportFilteredLeafResources',
	'BORNEO_EXPORT_FILTERED_LEAF_RESOURCES',
	'borneo.resources.exportFilteredLeafResources',
);

export const exportInventoryResourceList = createBorneoEndpoint(
	'exportInventoryResourceList',
	'BORNEO_EXPORT_INVENTORY_RESOURCE_LIST',
	'borneo.resources.exportInventoryResourceList',
);

export const getResourceInventoryById = createBorneoEndpoint(
	'getResourceInventoryById',
	'BORNEO_GET_RESOURCE_INVENTORY_BY_ID',
	'borneo.resources.getResourceInventoryById',
);

export const listInventoryResourcesWithFilters = createBorneoEndpoint(
	'listInventoryResourcesWithFilters',
	'BORNEO_LIST_INVENTORY_RESOURCES_WITH_FILTERS',
	'borneo.resources.listInventoryResourcesWithFilters',
);

export const listLeafResourcesWithFilters = createBorneoEndpoint(
	'listLeafResourcesWithFilters',
	'BORNEO_LIST_LEAF_RESOURCES_WITH_FILTERS',
	'borneo.resources.listLeafResourcesWithFilters',
);

export const postClassificationStats = createBorneoEndpoint(
	'postClassificationStats',
	'BORNEO_POST_CLASSIFICATION_STATS',
	'borneo.resources.postClassificationStats',
);

export const postResourceLineageFilter = createBorneoEndpoint(
	'postResourceLineageFilter',
	'BORNEO_POST_RESOURCE_LINEAGE_FILTER',
	'borneo.resources.postResourceLineageFilter',
);

export const postResourceStatsWithDeletedResources = createBorneoEndpoint(
	'postResourceStatsWithDeletedResources',
	'BORNEO_POST_RESOURCE_STATS_WITH_DELETED_RESOURCES',
	'borneo.resources.postResourceStatsWithDeletedResources',
);

export const retrieveDataResourceStatistics = createBorneoEndpoint(
	'retrieveDataResourceStatistics',
	'BORNEO_RETRIEVE_DATA_RESOURCE_STATISTICS',
	'borneo.resources.retrieveDataResourceStatistics',
);

export const retrieveResourceCatalogById = createBorneoEndpoint(
	'retrieveResourceCatalogById',
	'BORNEO_RETRIEVE_RESOURCE_CATALOG_BY_ID',
	'borneo.resources.retrieveResourceCatalogById',
);

export const retrieveResourceColumns = createBorneoEndpoint(
	'retrieveResourceColumns',
	'BORNEO_RETRIEVE_RESOURCE_COLUMNS',
	'borneo.resources.retrieveResourceColumns',
);
