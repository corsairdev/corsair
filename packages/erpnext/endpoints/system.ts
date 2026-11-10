import { defineEndpoint } from './factory';

// The `system` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `system` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const getLoggedUser = defineEndpoint('system.getLoggedUser');
export const ping = defineEndpoint('system.ping');
export const getFrameworkVersion = defineEndpoint('system.getFrameworkVersion');
export const getAllLanguages = defineEndpoint('system.getAllLanguages');
export const getAllRoles = defineEndpoint('system.getAllRoles');
// `Has Role` keeps its literal space: it is part of the fixed resource path,
// not a path parameter, and the URL parser encodes it to %20 on the wire
// (see system-types.ts for the full note).
export const getUserRoles = defineEndpoint('system.getUserRoles');
export const getTimezones = defineEndpoint('system.getTimezones');
// `Fiscal Year` keeps its literal space for the same reason as `Has Role`
// above: it is part of the fixed resource path, not a path parameter, and the
// URL parser encodes it to %20 on the wire (see system-types.ts).
export const getFiscalYear = defineEndpoint('system.getFiscalYear');

export const endpoints = {
	getLoggedUser,
	ping,
	getFrameworkVersion,
	getAllLanguages,
	getAllRoles,
	getUserRoles,
	getTimezones,
	getFiscalYear,
} as const;
