import { createBorneoEndpoint } from './factory';

export const accessScanIterationById = createBorneoEndpoint(
	'accessScanIterationById',
	'BORNEO_ACCESS_SCAN_ITERATION_BY_ID',
	'borneo.scans.accessScanIterationById',
);

export const createAndScheduleCloudResourceScan = createBorneoEndpoint(
	'createAndScheduleCloudResourceScan',
	'BORNEO_CREATE_AND_SCHEDULE_CLOUD_RESOURCE_SCAN',
	'borneo.scans.createAndScheduleCloudResourceScan',
);

export const exportInsightPageUsingScanId = createBorneoEndpoint(
	'exportInsightPageUsingScanId',
	'BORNEO_EXPORT_INSIGHT_PAGE_USING_SCAN_ID',
	'borneo.scans.exportInsightPageUsingScanId',
);

export const filterAndListInspectionResults = createBorneoEndpoint(
	'filterAndListInspectionResults',
	'BORNEO_FILTER_AND_LIST_INSPECTION_RESULTS',
	'borneo.scans.filterAndListInspectionResults',
);

export const getInsightByTypeAndId = createBorneoEndpoint(
	'getInsightByTypeAndId',
	'BORNEO_GET_INSIGHT_BY_TYPE_AND_ID',
	'borneo.scans.getInsightByTypeAndId',
);

export const getScanByScanId = createBorneoEndpoint(
	'getScanByScanId',
	'BORNEO_GET_SCAN_BY_SCAN_ID',
	'borneo.scans.getScanByScanId',
);

export const listErrorDetailsFromFilteredScanIterations = createBorneoEndpoint(
	'listErrorDetailsFromFilteredScanIterations',
	'BORNEO_LIST_ERROR_DETAILS_FROM_FILTERED_SCAN_ITERATIONS',
	'borneo.scans.listErrorDetailsFromFilteredScanIterations',
);

export const listInsightFilters = createBorneoEndpoint(
	'listInsightFilters',
	'BORNEO_LIST_INSIGHT_FILTERS',
	'borneo.scans.listInsightFilters',
);

export const listScanExecutionResults = createBorneoEndpoint(
	'listScanExecutionResults',
	'BORNEO_LIST_SCAN_EXECUTION_RESULTS',
	'borneo.scans.listScanExecutionResults',
);

export const listScanIterationsWithFilter = createBorneoEndpoint(
	'listScanIterationsWithFilter',
	'BORNEO_LIST_SCAN_ITERATIONS_WITH_FILTER',
	'borneo.scans.listScanIterationsWithFilter',
);

export const listScansWithFilters = createBorneoEndpoint(
	'listScansWithFilters',
	'BORNEO_LIST_SCANS_WITH_FILTERS',
	'borneo.scans.listScansWithFilters',
);

export const markScanFalsePositivesById = createBorneoEndpoint(
	'markScanFalsePositivesById',
	'BORNEO_MARK_SCAN_FALSE_POSITIVES_BY_ID',
	'borneo.scans.markScanFalsePositivesById',
);

export const pauseScanById = createBorneoEndpoint(
	'pauseScanById',
	'BORNEO_PAUSE_SCAN_BY_ID',
	'borneo.scans.pauseScanById',
);

export const postScanResourceStatus = createBorneoEndpoint(
	'postScanResourceStatus',
	'BORNEO_POST_SCAN_RESOURCE_STATUS',
	'borneo.scans.postScanResourceStatus',
);

export const resumeScanById = createBorneoEndpoint(
	'resumeScanById',
	'BORNEO_RESUME_SCAN_BY_ID',
	'borneo.scans.resumeScanById',
);

export const scanLegalDocumentById = createBorneoEndpoint(
	'scanLegalDocumentById',
	'BORNEO_SCAN_LEGAL_DOCUMENT_BY_ID',
	'borneo.scans.scanLegalDocumentById',
);

export const stopScanViaScanId = createBorneoEndpoint(
	'stopScanViaScanId',
	'BORNEO_STOP_SCAN_VIA_SCAN_ID',
	'borneo.scans.stopScanViaScanId',
);

export const submitDetailedScanResults = createBorneoEndpoint(
	'submitDetailedScanResults',
	'BORNEO_SUBMIT_DETAILED_SCAN_RESULTS',
	'borneo.scans.submitDetailedScanResults',
);
