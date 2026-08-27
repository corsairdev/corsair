import { createBorneoEndpoint } from './factory';

export const createDashboardUser = createBorneoEndpoint(
	'createDashboardUser',
	'BORNEO_CREATE_DASHBOARD_USER',
	'borneo.dashboard.createDashboardUser',
);

export const deleteDashboardReportById = createBorneoEndpoint(
	'deleteDashboardReportById',
	'BORNEO_DELETE_DASHBOARD_REPORT_BY_ID',
	'borneo.dashboard.deleteDashboardReportById',
);

export const disableDashboardUserByUsername = createBorneoEndpoint(
	'disableDashboardUserByUsername',
	'BORNEO_DISABLE_DASHBOARD_USER_BY_USERNAME',
	'borneo.dashboard.disableDashboardUserByUsername',
);

export const downloadDashboardReport = createBorneoEndpoint(
	'downloadDashboardReport',
	'BORNEO_DOWNLOAD_DASHBOARD_REPORT',
	'borneo.dashboard.downloadDashboardReport',
);

export const downloadDashboardReportEdition = createBorneoEndpoint(
	'downloadDashboardReportEdition',
	'BORNEO_DOWNLOAD_DASHBOARD_REPORT_EDITION',
	'borneo.dashboard.downloadDashboardReportEdition',
);

export const enableDashboardUser = createBorneoEndpoint(
	'enableDashboardUser',
	'BORNEO_ENABLE_DASHBOARD_USER',
	'borneo.dashboard.enableDashboardUser',
);

export const fetchDashboardReportById = createBorneoEndpoint(
	'fetchDashboardReportById',
	'BORNEO_FETCH_DASHBOARD_REPORT_BY_ID',
	'borneo.dashboard.fetchDashboardReportById',
);

export const getDashboardReportEditionById = createBorneoEndpoint(
	'getDashboardReportEditionById',
	'BORNEO_GET_DASHBOARD_REPORT_EDITION_BY_ID',
	'borneo.dashboard.getDashboardReportEditionById',
);

export const listDashboardReportEditions = createBorneoEndpoint(
	'listDashboardReportEditions',
	'BORNEO_LIST_DASHBOARD_REPORT_EDITIONS',
	'borneo.dashboard.listDashboardReportEditions',
);

export const listDashboardReportsWithFilters = createBorneoEndpoint(
	'listDashboardReportsWithFilters',
	'BORNEO_LIST_DASHBOARD_REPORTS_WITH_FILTERS',
	'borneo.dashboard.listDashboardReportsWithFilters',
);

export const listDashboardUsersWithFilters = createBorneoEndpoint(
	'listDashboardUsersWithFilters',
	'BORNEO_LIST_DASHBOARD_USERS_WITH_FILTERS',
	'borneo.dashboard.listDashboardUsersWithFilters',
);

export const postCurrentDashboardUser = createBorneoEndpoint(
	'postCurrentDashboardUser',
	'BORNEO_POST_CURRENT_DASHBOARD_USER',
	'borneo.dashboard.postCurrentDashboardUser',
);

export const postDashboardReport = createBorneoEndpoint(
	'postDashboardReport',
	'BORNEO_POST_DASHBOARD_REPORT',
	'borneo.dashboard.postDashboardReport',
);

export const removeDashboardUserByUsername = createBorneoEndpoint(
	'removeDashboardUserByUsername',
	'BORNEO_REMOVE_DASHBOARD_USER_BY_USERNAME',
	'borneo.dashboard.removeDashboardUserByUsername',
);

export const resetDashboardUserPassword = createBorneoEndpoint(
	'resetDashboardUserPassword',
	'BORNEO_RESET_DASHBOARD_USER_PASSWORD',
	'borneo.dashboard.resetDashboardUserPassword',
);

export const triggerDashboardReportByReportId = createBorneoEndpoint(
	'triggerDashboardReportByReportId',
	'BORNEO_TRIGGER_DASHBOARD_REPORT_BY_REPORT_ID',
	'borneo.dashboard.triggerDashboardReportByReportId',
);

export const updateDashboardUserDetails = createBorneoEndpoint(
	'updateDashboardUserDetails',
	'BORNEO_UPDATE_DASHBOARD_USER_DETAILS',
	'borneo.dashboard.updateDashboardUserDetails',
);

export const updateDashboardUserRoles = createBorneoEndpoint(
	'updateDashboardUserRoles',
	'BORNEO_UPDATE_DASHBOARD_USER_ROLES',
	'borneo.dashboard.updateDashboardUserRoles',
);
