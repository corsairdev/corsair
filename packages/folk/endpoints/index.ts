import * as CompaniesModule from './companies';
import * as CreditsModule from './credits';
import * as GroupMembersModule from './group-members';
import * as GroupsModule from './groups';
import * as InteractionsModule from './interactions';
import * as NotesModule from './notes';
import * as PeopleModule from './people';
import * as UsersModule from './users';

export const People = {
	list: PeopleModule.list,
	get: PeopleModule.get,
	create: PeopleModule.create,
	update: PeopleModule.update,
	delete: PeopleModule.deletePerson,
};

export const Companies = {
	list: CompaniesModule.list,
	get: CompaniesModule.get,
	create: CompaniesModule.create,
	update: CompaniesModule.update,
	delete: CompaniesModule.deleteCompany,
};

export const Groups = {
	list: GroupsModule.list,
	create: GroupsModule.create,
	update: GroupsModule.update,
};

export const GroupMembers = {
	list: GroupMembersModule.list,
	add: GroupMembersModule.add,
	update: GroupMembersModule.update,
	remove: GroupMembersModule.remove,
};

export const Interactions = {
	list: InteractionsModule.list,
	listPast: InteractionsModule.listPast,
	listUpcoming: InteractionsModule.listUpcoming,
	get: InteractionsModule.get,
	create: InteractionsModule.create,
	update: InteractionsModule.update,
	delete: InteractionsModule.deleteInteraction,
};

export const Notes = {
	list: NotesModule.list,
	get: NotesModule.get,
	create: NotesModule.create,
	update: NotesModule.update,
	delete: NotesModule.deleteNote,
};

export const Users = {
	list: UsersModule.list,
	getCurrentUser: UsersModule.getCurrentUser,
	get: UsersModule.get,
};

export const Credits = {
	get: CreditsModule.get,
};

export * from './types';
