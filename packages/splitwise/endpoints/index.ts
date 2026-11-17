import * as Comments from './comments';
import * as Expenses from './expenses';
import * as Friends from './friends';
import * as Groups from './groups';
import * as Notifications from './notifications';
import * as Categories from './reference';
import * as Currencies from './reference';
import * as Users from './users';

export const UsersEndpoints = {
	getCurrentUser: Users.getCurrentUser,
	get: Users.getUser,
	update: Users.update,
};

export const GroupsEndpoints = {
	list: Groups.list,
	get: Groups.get,
	create: Groups.create,
	delete: Groups.remove,
	undelete: Groups.undelete,
	addUser: Groups.addUser,
	removeUser: Groups.removeUser,
};

export const FriendsEndpoints = {
	list: Friends.list,
	get: Friends.get,
	add: Friends.add,
	addMany: Friends.addMany,
	delete: Friends.remove,
};

export const ExpensesEndpoints = {
	list: Expenses.list,
	get: Expenses.get,
	create: Expenses.create,
	update: Expenses.update,
	delete: Expenses.remove,
	undelete: Expenses.undelete,
};

export const CommentsEndpoints = {
	list: Comments.list,
	create: Comments.create,
	delete: Comments.remove,
};

export const NotificationsEndpoints = {
	list: Notifications.list,
};

export const CurrenciesEndpoints = {
	list: Currencies.listCurrencies,
};

export const CategoriesEndpoints = {
	list: Categories.listCategories,
};

export * from './types';
