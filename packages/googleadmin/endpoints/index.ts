import * as Domains from './domains';
import * as Groups from './groups';
import * as Members from './members';
import * as OrgUnits from './org-units';
import * as Users from './users';

export const UsersEndpoints = {
	list: Users.list,
	get: Users.get,
	insert: Users.insert,
	update: Users.update,
	delete: Users.remove,
	undelete: Users.undelete,
	makeAdmin: Users.makeAdmin,
	signOut: Users.signOut,
	aliasesList: Users.aliasesList,
	aliasesInsert: Users.aliasesInsert,
	aliasesDelete: Users.aliasesDelete,
	photosGet: Users.photosGet,
	photosUpdate: Users.photosUpdate,
	photosDelete: Users.photosDelete,
} as const;

export const UserAliasesEndpoints = {
	list: Users.aliasesList,
	insert: Users.aliasesInsert,
	delete: Users.aliasesDelete,
} as const;

export const UserPhotosEndpoints = {
	get: Users.photosGet,
	update: Users.photosUpdate,
	delete: Users.photosDelete,
} as const;

export const GroupsEndpoints = {
	list: Groups.list,
	get: Groups.get,
	insert: Groups.insert,
	update: Groups.update,
	delete: Groups.remove,
} as const;

export const GroupAliasesEndpoints = {
	list: Groups.aliasesList,
	insert: Groups.aliasesInsert,
	delete: Groups.aliasesDelete,
} as const;

export const MembersEndpoints = {
	list: Members.list,
	get: Members.get,
	hasMember: Members.hasMember,
	insert: Members.insert,
	update: Members.update,
	delete: Members.remove,
} as const;

export const OrgUnitsEndpoints = {
	list: OrgUnits.list,
	get: OrgUnits.get,
	insert: OrgUnits.insert,
	update: OrgUnits.update,
	delete: OrgUnits.remove,
} as const;

export const DomainsEndpoints = {
	list: Domains.list,
	get: Domains.get,
	aliasesList: Domains.aliasesList,
} as const;

export const CustomersEndpoints = {
	get: Domains.customerGet,
} as const;

export * from './types';
