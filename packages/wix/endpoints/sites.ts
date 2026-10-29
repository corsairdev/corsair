import { defineOp } from './factory';

export const getProperties = defineOp('getSiteProperties');
export const updateBusinessContact = defineOp('updateBusinessContact');
export const updateBusinessProfile = defineOp('updateBusinessProfile');
export const updateBusinessSchedule = defineOp('updateBusinessSchedule');
export const updateLocaleSettings = defineOp('updateLocaleSettings');
export const checkDomainAvailability = defineOp('checkDomainAvailability');
export const getFolderBySite = defineOp('getFolderBySite');
export const queryFolders = defineOp('querySiteFolders');
export const queryLocations = defineOp('queryLocations');
export const getSitePluginsPlacementStatus = defineOp(
	'getSitePluginsPlacementStatus',
);

export const SitesEndpoints = {
	getProperties,
	updateBusinessContact,
	updateBusinessProfile,
	updateBusinessSchedule,
	updateLocaleSettings,
	checkDomainAvailability,
	getFolderBySite,
	queryFolders,
	queryLocations,
	getSitePluginsPlacementStatus,
} as const;
