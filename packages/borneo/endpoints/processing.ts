import { createBorneoEndpoint } from './factory';

export const createDpiaForProcessingActivity = createBorneoEndpoint(
	'createDpiaForProcessingActivity',
	'BORNEO_CREATE_DPIA_FOR_PROCESSING_ACTIVITY',
	'borneo.processing.createDpiaForProcessingActivity',
);

export const createProcessingActivity = createBorneoEndpoint(
	'createProcessingActivity',
	'BORNEO_CREATE_PROCESSING_ACTIVITY',
	'borneo.processing.createProcessingActivity',
);

export const createProcessingActivityThreshold = createBorneoEndpoint(
	'createProcessingActivityThreshold',
	'BORNEO_CREATE_PROCESSING_ACTIVITY_THRESHOLD',
	'borneo.processing.createProcessingActivityThreshold',
);

export const createThresholdForProcessingActivity = createBorneoEndpoint(
	'createThresholdForProcessingActivity',
	'BORNEO_CREATE_THRESHOLD_FOR_PROCESSING_ACTIVITY',
	'borneo.processing.createThresholdForProcessingActivity',
);

export const deleteDpiaById = createBorneoEndpoint(
	'deleteDpiaById',
	'BORNEO_DELETE_DPIA_BY_ID',
	'borneo.processing.deleteDpiaById',
);

export const deleteLopdpThresholdById = createBorneoEndpoint(
	'deleteLopdpThresholdById',
	'BORNEO_DELETE_LOPDP_THRESHOLD_BY_ID',
	'borneo.processing.deleteLopdpThresholdById',
);

export const deleteProcessingActivityById = createBorneoEndpoint(
	'deleteProcessingActivityById',
	'BORNEO_DELETE_PROCESSING_ACTIVITY_BY_ID',
	'borneo.processing.deleteProcessingActivityById',
);

export const deleteThresholdById = createBorneoEndpoint(
	'deleteThresholdById',
	'BORNEO_DELETE_THRESHOLD_BY_ID',
	'borneo.processing.deleteThresholdById',
);

export const exportProcessingActivitiesList = createBorneoEndpoint(
	'exportProcessingActivitiesList',
	'BORNEO_EXPORT_PROCESSING_ACTIVITIES_LIST',
	'borneo.processing.exportProcessingActivitiesList',
);

export const getThresholdById = createBorneoEndpoint(
	'getThresholdById',
	'BORNEO_GET_THRESHOLD_BY_ID',
	'borneo.processing.getThresholdById',
);

export const listProcessingActivities = createBorneoEndpoint(
	'listProcessingActivities',
	'BORNEO_LIST_PROCESSING_ACTIVITIES',
	'borneo.processing.listProcessingActivities',
);

export const listProcessingActivitiesFilters = createBorneoEndpoint(
	'listProcessingActivitiesFilters',
	'BORNEO_LIST_PROCESSING_ACTIVITIES_FILTERS',
	'borneo.processing.listProcessingActivitiesFilters',
);

export const listTomsWithFilterAndPaginationOptions = createBorneoEndpoint(
	'listTomsWithFilterAndPaginationOptions',
	'BORNEO_LIST_TOMS_WITH_FILTER_AND_PAGINATION_OPTIONS',
	'borneo.processing.listTomsWithFilterAndPaginationOptions',
);

export const putTomStatusAndNote = createBorneoEndpoint(
	'putTomStatusAndNote',
	'BORNEO_PUT_TOM_STATUS_AND_NOTE',
	'borneo.processing.putTomStatusAndNote',
);

export const retrieveDpiaById = createBorneoEndpoint(
	'retrieveDpiaById',
	'BORNEO_RETRIEVE_DPIA_BY_ID',
	'borneo.processing.retrieveDpiaById',
);

export const retrieveLopdpThresholdById = createBorneoEndpoint(
	'retrieveLopdpThresholdById',
	'BORNEO_RETRIEVE_LOPDP_THRESHOLD_BY_ID',
	'borneo.processing.retrieveLopdpThresholdById',
);

export const retrieveProcessingActivityById = createBorneoEndpoint(
	'retrieveProcessingActivityById',
	'BORNEO_RETRIEVE_PROCESSING_ACTIVITY_BY_ID',
	'borneo.processing.retrieveProcessingActivityById',
);

export const retrieveTomById = createBorneoEndpoint(
	'retrieveTomById',
	'BORNEO_RETRIEVE_TOM_BY_ID',
	'borneo.processing.retrieveTomById',
);

export const updateDpiaById = createBorneoEndpoint(
	'updateDpiaById',
	'BORNEO_UPDATE_DPIA_BY_ID',
	'borneo.processing.updateDpiaById',
);

export const updateLopdpThresholdById = createBorneoEndpoint(
	'updateLopdpThresholdById',
	'BORNEO_UPDATE_LOPDP_THRESHOLD_BY_ID',
	'borneo.processing.updateLopdpThresholdById',
);

export const updateProcessingActivityDetails = createBorneoEndpoint(
	'updateProcessingActivityDetails',
	'BORNEO_UPDATE_PROCESSING_ACTIVITY_DETAILS',
	'borneo.processing.updateProcessingActivityDetails',
);

export const updateThresholdById = createBorneoEndpoint(
	'updateThresholdById',
	'BORNEO_UPDATE_THRESHOLD_BY_ID',
	'borneo.processing.updateThresholdById',
);
