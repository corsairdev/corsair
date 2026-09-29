import { createBorneoEndpoint } from './factory';

export const addDiscoveredRecipients = createBorneoEndpoint(
	'addDiscoveredRecipients',
	'BORNEO_ADD_DISCOVERED_RECIPIENTS',
	'borneo.recipients.addDiscoveredRecipients',
);

export const archiveDiscoveredRecipient = createBorneoEndpoint(
	'archiveDiscoveredRecipient',
	'BORNEO_ARCHIVE_DISCOVERED_RECIPIENT',
	'borneo.recipients.archiveDiscoveredRecipient',
);

export const createRecipientWithDetails = createBorneoEndpoint(
	'createRecipientWithDetails',
	'BORNEO_CREATE_RECIPIENT_WITH_DETAILS',
	'borneo.recipients.createRecipientWithDetails',
);

export const deleteRecipientById = createBorneoEndpoint(
	'deleteRecipientById',
	'BORNEO_DELETE_RECIPIENT_BY_ID',
	'borneo.recipients.deleteRecipientById',
);

export const exportRecipientsListWithFilter = createBorneoEndpoint(
	'exportRecipientsListWithFilter',
	'BORNEO_EXPORT_RECIPIENTS_LIST_WITH_FILTER',
	'borneo.recipients.exportRecipientsListWithFilter',
);

export const filterRecipientsList = createBorneoEndpoint(
	'filterRecipientsList',
	'BORNEO_FILTER_RECIPIENTS_LIST',
	'borneo.recipients.filterRecipientsList',
);

export const listDiscoveredRecipients = createBorneoEndpoint(
	'listDiscoveredRecipients',
	'BORNEO_LIST_DISCOVERED_RECIPIENTS',
	'borneo.recipients.listDiscoveredRecipients',
);

export const listFilterOptionsForRecipients = createBorneoEndpoint(
	'listFilterOptionsForRecipients',
	'BORNEO_LIST_FILTER_OPTIONS_FOR_RECIPIENTS',
	'borneo.recipients.listFilterOptionsForRecipients',
);

export const listOrFilterRecipients = createBorneoEndpoint(
	'listOrFilterRecipients',
	'BORNEO_LIST_OR_FILTER_RECIPIENTS',
	'borneo.recipients.listOrFilterRecipients',
);

export const postDiscoveredRecipientById = createBorneoEndpoint(
	'postDiscoveredRecipientById',
	'BORNEO_POST_DISCOVERED_RECIPIENT_BY_ID',
	'borneo.recipients.postDiscoveredRecipientById',
);

export const retrieveDiscoveredRecipientById = createBorneoEndpoint(
	'retrieveDiscoveredRecipientById',
	'BORNEO_RETRIEVE_DISCOVERED_RECIPIENT_BY_ID',
	'borneo.recipients.retrieveDiscoveredRecipientById',
);

export const retrieveRecipientDetails = createBorneoEndpoint(
	'retrieveRecipientDetails',
	'BORNEO_RETRIEVE_RECIPIENT_DETAILS',
	'borneo.recipients.retrieveRecipientDetails',
);

export const retrieveRecipientProcessingActivities = createBorneoEndpoint(
	'retrieveRecipientProcessingActivities',
	'BORNEO_RETRIEVE_RECIPIENT_PROCESSING_ACTIVITIES',
	'borneo.recipients.retrieveRecipientProcessingActivities',
);

export const updateDashboardReportFrequencyAndRecipients = createBorneoEndpoint(
	'updateDashboardReportFrequencyAndRecipients',
	'BORNEO_UPDATE_DASHBOARD_REPORT_FREQUENCY_AND_RECIPIENTS',
	'borneo.recipients.updateDashboardReportFrequencyAndRecipients',
);

export const updateRecipientDetailsById = createBorneoEndpoint(
	'updateRecipientDetailsById',
	'BORNEO_UPDATE_RECIPIENT_DETAILS_BY_ID',
	'borneo.recipients.updateRecipientDetailsById',
);

export const updateRecipientStatusViaId = createBorneoEndpoint(
	'updateRecipientStatusViaId',
	'BORNEO_UPDATE_RECIPIENT_STATUS_VIA_ID',
	'borneo.recipients.updateRecipientStatusViaId',
);
