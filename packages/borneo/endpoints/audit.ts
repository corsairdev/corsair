import { createBorneoEndpoint } from './factory';

export const listEventsWithFilters = createBorneoEndpoint(
	'listEventsWithFilters',
	'BORNEO_LIST_EVENTS_WITH_FILTERS',
	'borneo.audit.listEventsWithFilters',
);

export const postFilteredAccessLogs = createBorneoEndpoint(
	'postFilteredAccessLogs',
	'BORNEO_POST_FILTERED_ACCESS_LOGS',
	'borneo.audit.postFilteredAccessLogs',
);

export const postLogAuditRecordsWithFilterCriteria = createBorneoEndpoint(
	'postLogAuditRecordsWithFilterCriteria',
	'BORNEO_POST_LOG_AUDIT_RECORDS_WITH_FILTER_CRITERIA',
	'borneo.audit.postLogAuditRecordsWithFilterCriteria',
);
