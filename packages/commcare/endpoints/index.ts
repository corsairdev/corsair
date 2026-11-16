import {
	bulkFetch as casesBulkFetch,
	get as casesGet,
	getByExternalId as casesGetByExternalId,
	list as casesList,
} from './cases';
import { restore as otaRestore, submit as submissionsSubmit } from './device';
import {
	listDetExports as detExportsList,
	getFixtureItem as fixturesGetItem,
	listFixtures as fixturesList,
	getLocation as locationsGet,
	listLocations as locationsList,
	getLocationType as locationTypesGet,
	listLocationTypes as locationTypesList,
	getLookupTable as lookupTablesGet,
	listLookupTables as lookupTablesList,
	getReportData as reportsGetData,
	listReports as reportsList,
	listWebUsers as webUsersList,
} from './directory';
import {
	bulkAction as formsBulkAction,
	bulkActionStatus as formsBulkActionStatus,
	get as formsGet,
	list as formsList,
} from './forms';
import {
	create as groupsCreate,
	get as groupsGet,
	list as groupsList,
	update as groupsUpdate,
} from './groups';
import {
	create as usersCreate,
	get as usersGet,
	list as usersList,
	remove as usersRemove,
	sendPasswordReset as usersSendPasswordReset,
	update as usersUpdate,
} from './users';

/** Form operations. */
export const Forms = {
	list: formsList,
	get: formsGet,
	bulkAction: formsBulkAction,
	bulkActionStatus: formsBulkActionStatus,
};

/** Case operations (Case Data API v2). */
export const Cases = {
	list: casesList,
	get: casesGet,
	bulkFetch: casesBulkFetch,
	getByExternalId: casesGetByExternalId,
};

/** Mobile worker operations. */
export const Users = {
	list: usersList,
	get: usersGet,
	create: usersCreate,
	update: usersUpdate,
	delete: usersRemove,
	sendPasswordReset: usersSendPasswordReset,
};

/** Group operations. */
export const Groups = {
	list: groupsList,
	get: groupsGet,
	create: groupsCreate,
	update: groupsUpdate,
};

/** Web user, location, fixture, lookup-table and report listing operations. */
export const Directory = {
	listWebUsers: webUsersList,
	listLocations: locationsList,
	getLocation: locationsGet,
	listLocationTypes: locationTypesList,
	getLocationType: locationTypesGet,
	listFixtures: fixturesList,
	getFixtureItem: fixturesGetItem,
	listLookupTables: lookupTablesList,
	getLookupTable: lookupTablesGet,
	listReports: reportsList,
	getReportData: reportsGetData,
	listDetExports: detExportsList,
};

/** Device-facing operations (OTA restore, OpenRosa submissions). */
export const Device = {
	restore: otaRestore,
	submit: submissionsSubmit,
};

export * from './types';
