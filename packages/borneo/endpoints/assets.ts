import { createBorneoEndpoint } from './factory';

export const createNewAsset = createBorneoEndpoint(
	'createNewAsset',
	'BORNEO_CREATE_NEW_ASSET',
	'borneo.assets.createNewAsset',
);

export const deleteAssetById = createBorneoEndpoint(
	'deleteAssetById',
	'BORNEO_DELETE_ASSET_BY_ID',
	'borneo.assets.deleteAssetById',
);

export const filterAndSortAssetsList = createBorneoEndpoint(
	'filterAndSortAssetsList',
	'BORNEO_FILTER_AND_SORT_ASSETS_LIST',
	'borneo.assets.filterAndSortAssetsList',
);

export const retrieveAssetById = createBorneoEndpoint(
	'retrieveAssetById',
	'BORNEO_RETRIEVE_ASSET_BY_ID',
	'borneo.assets.retrieveAssetById',
);

export const updateAssetInformationById = createBorneoEndpoint(
	'updateAssetInformationById',
	'BORNEO_UPDATE_ASSET_INFORMATION_BY_ID',
	'borneo.assets.updateAssetInformationById',
);
