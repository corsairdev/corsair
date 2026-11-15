import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	CategoriesEndpoints,
	CommentsEndpoints,
	CurrenciesEndpoints,
	ExpensesEndpoints,
	FriendsEndpoints,
	GroupsEndpoints,
	NotificationsEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	SplitwiseEndpointInputs,
	SplitwiseEndpointOutputs,
} from './endpoints/types';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SplitwiseSchema } from './schema';

export type SplitwisePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSplitwisePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof splitwiseEndpointsNested>;
};

export type SplitwiseContext = CorsairPluginContext<
	typeof SplitwiseSchema,
	SplitwisePluginOptions
>;

export type SplitwiseKeyBuilderContext =
	KeyBuilderContext<SplitwisePluginOptions>;

export type SplitwiseBoundEndpoints = BindEndpoints<
	typeof splitwiseEndpointsNested
>;

type SplitwiseEndpoint<K extends keyof SplitwiseEndpointOutputs> =
	CorsairEndpoint<
		SplitwiseContext,
		SplitwiseEndpointInputs[K],
		SplitwiseEndpointOutputs[K]
	>;

export type SplitwiseEndpoints = {
	usersGetCurrentUser: SplitwiseEndpoint<'getCurrentUser'>;
	usersGet: SplitwiseEndpoint<'getUser'>;
	usersUpdate: SplitwiseEndpoint<'updateUser'>;
	groupsList: SplitwiseEndpoint<'listGroups'>;
	groupsGet: SplitwiseEndpoint<'getGroup'>;
	groupsCreate: SplitwiseEndpoint<'createGroup'>;
	groupsDelete: SplitwiseEndpoint<'deleteGroup'>;
	groupsUndelete: SplitwiseEndpoint<'undeleteGroup'>;
	groupsAddUser: SplitwiseEndpoint<'addUserToGroup'>;
	groupsRemoveUser: SplitwiseEndpoint<'removeUserFromGroup'>;
	friendsList: SplitwiseEndpoint<'listFriends'>;
	friendsGet: SplitwiseEndpoint<'getFriend'>;
	friendsAdd: SplitwiseEndpoint<'addFriend'>;
	friendsAddMany: SplitwiseEndpoint<'addFriends'>;
	friendsDelete: SplitwiseEndpoint<'deleteFriend'>;
	expensesList: SplitwiseEndpoint<'listExpenses'>;
	expensesGet: SplitwiseEndpoint<'getExpense'>;
	expensesCreate: SplitwiseEndpoint<'createExpense'>;
	expensesUpdate: SplitwiseEndpoint<'updateExpense'>;
	expensesDelete: SplitwiseEndpoint<'deleteExpense'>;
	expensesUndelete: SplitwiseEndpoint<'undeleteExpense'>;
	commentsList: SplitwiseEndpoint<'listComments'>;
	commentsCreate: SplitwiseEndpoint<'createComment'>;
	commentsDelete: SplitwiseEndpoint<'deleteComment'>;
	notificationsList: SplitwiseEndpoint<'listNotifications'>;
	currenciesList: SplitwiseEndpoint<'listCurrencies'>;
	categoriesList: SplitwiseEndpoint<'listCategories'>;
};

const splitwiseEndpointsNested = {
	users: {
		getCurrentUser: UsersEndpoints.getCurrentUser,
		get: UsersEndpoints.get,
		update: UsersEndpoints.update,
	},
	groups: {
		list: GroupsEndpoints.list,
		get: GroupsEndpoints.get,
		create: GroupsEndpoints.create,
		delete: GroupsEndpoints.delete,
		undelete: GroupsEndpoints.undelete,
		addUser: GroupsEndpoints.addUser,
		removeUser: GroupsEndpoints.removeUser,
	},
	friends: {
		list: FriendsEndpoints.list,
		get: FriendsEndpoints.get,
		add: FriendsEndpoints.add,
		addMany: FriendsEndpoints.addMany,
		delete: FriendsEndpoints.delete,
	},
	expenses: {
		list: ExpensesEndpoints.list,
		get: ExpensesEndpoints.get,
		create: ExpensesEndpoints.create,
		update: ExpensesEndpoints.update,
		delete: ExpensesEndpoints.delete,
		undelete: ExpensesEndpoints.undelete,
	},
	comments: {
		list: CommentsEndpoints.list,
		create: CommentsEndpoints.create,
		delete: CommentsEndpoints.delete,
	},
	notifications: {
		list: NotificationsEndpoints.list,
	},
	currencies: {
		list: CurrenciesEndpoints.list,
	},
	categories: {
		list: CategoriesEndpoints.list,
	},
} as const;

export const splitwiseEndpointSchemas = {
	'users.getCurrentUser': {
		input: SplitwiseEndpointInputSchemas.getCurrentUser,
		output: SplitwiseEndpointOutputSchemas.getCurrentUser,
	},
	'users.get': {
		input: SplitwiseEndpointInputSchemas.getUser,
		output: SplitwiseEndpointOutputSchemas.getUser,
	},
	'users.update': {
		input: SplitwiseEndpointInputSchemas.updateUser,
		output: SplitwiseEndpointOutputSchemas.updateUser,
	},
	'groups.list': {
		input: SplitwiseEndpointInputSchemas.listGroups,
		output: SplitwiseEndpointOutputSchemas.listGroups,
	},
	'groups.get': {
		input: SplitwiseEndpointInputSchemas.getGroup,
		output: SplitwiseEndpointOutputSchemas.getGroup,
	},
	'groups.create': {
		input: SplitwiseEndpointInputSchemas.createGroup,
		output: SplitwiseEndpointOutputSchemas.createGroup,
	},
	'groups.delete': {
		input: SplitwiseEndpointInputSchemas.deleteGroup,
		output: SplitwiseEndpointOutputSchemas.deleteGroup,
	},
	'groups.undelete': {
		input: SplitwiseEndpointInputSchemas.undeleteGroup,
		output: SplitwiseEndpointOutputSchemas.undeleteGroup,
	},
	'groups.addUser': {
		input: SplitwiseEndpointInputSchemas.addUserToGroup,
		output: SplitwiseEndpointOutputSchemas.addUserToGroup,
	},
	'groups.removeUser': {
		input: SplitwiseEndpointInputSchemas.removeUserFromGroup,
		output: SplitwiseEndpointOutputSchemas.removeUserFromGroup,
	},
	'friends.list': {
		input: SplitwiseEndpointInputSchemas.listFriends,
		output: SplitwiseEndpointOutputSchemas.listFriends,
	},
	'friends.get': {
		input: SplitwiseEndpointInputSchemas.getFriend,
		output: SplitwiseEndpointOutputSchemas.getFriend,
	},
	'friends.add': {
		input: SplitwiseEndpointInputSchemas.addFriend,
		output: SplitwiseEndpointOutputSchemas.addFriend,
	},
	'friends.addMany': {
		input: SplitwiseEndpointInputSchemas.addFriends,
		output: SplitwiseEndpointOutputSchemas.addFriends,
	},
	'friends.delete': {
		input: SplitwiseEndpointInputSchemas.deleteFriend,
		output: SplitwiseEndpointOutputSchemas.deleteFriend,
	},
	'expenses.list': {
		input: SplitwiseEndpointInputSchemas.listExpenses,
		output: SplitwiseEndpointOutputSchemas.listExpenses,
	},
	'expenses.get': {
		input: SplitwiseEndpointInputSchemas.getExpense,
		output: SplitwiseEndpointOutputSchemas.getExpense,
	},
	'expenses.create': {
		input: SplitwiseEndpointInputSchemas.createExpense,
		output: SplitwiseEndpointOutputSchemas.createExpense,
	},
	'expenses.update': {
		input: SplitwiseEndpointInputSchemas.updateExpense,
		output: SplitwiseEndpointOutputSchemas.updateExpense,
	},
	'expenses.delete': {
		input: SplitwiseEndpointInputSchemas.deleteExpense,
		output: SplitwiseEndpointOutputSchemas.deleteExpense,
	},
	'expenses.undelete': {
		input: SplitwiseEndpointInputSchemas.undeleteExpense,
		output: SplitwiseEndpointOutputSchemas.undeleteExpense,
	},
	'comments.list': {
		input: SplitwiseEndpointInputSchemas.listComments,
		output: SplitwiseEndpointOutputSchemas.listComments,
	},
	'comments.create': {
		input: SplitwiseEndpointInputSchemas.createComment,
		output: SplitwiseEndpointOutputSchemas.createComment,
	},
	'comments.delete': {
		input: SplitwiseEndpointInputSchemas.deleteComment,
		output: SplitwiseEndpointOutputSchemas.deleteComment,
	},
	'notifications.list': {
		input: SplitwiseEndpointInputSchemas.listNotifications,
		output: SplitwiseEndpointOutputSchemas.listNotifications,
	},
	'currencies.list': {
		input: SplitwiseEndpointInputSchemas.listCurrencies,
		output: SplitwiseEndpointOutputSchemas.listCurrencies,
	},
	'categories.list': {
		input: SplitwiseEndpointInputSchemas.listCategories,
		output: SplitwiseEndpointOutputSchemas.listCategories,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof splitwiseEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const splitwiseEndpointMeta = {
	'users.getCurrentUser': {
		riskLevel: 'read',
		description:
			'Get the user the key belongs to, with its notification settings and unread count',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Get another user by ID; Splitwise only answers for people you share a group or expense with',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			"Change a user's name, email, password, locale or default currency",
	},
	'groups.list': {
		riskLevel: 'read',
		description:
			'List the current user groups with their members, balances and simplified debts; expenses outside a group appear as group 0',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Get one group with its members, balances and debts',
	},
	'groups.create': {
		riskLevel: 'write',
		description:
			'Create a group and add members by user ID or by name and email; the current user is added automatically',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a group and every expense in it; the group can be restored with `groups.undelete`',
	},
	'groups.undelete': {
		riskLevel: 'write',
		description: 'Restore a deleted group',
	},
	'groups.addUser': {
		riskLevel: 'write',
		description:
			'Add a Splitwise user, or a new person by name and email, to a group',
	},
	'groups.removeUser': {
		riskLevel: 'write',
		description:
			'Remove a user from a group; Splitwise refuses while that user has a non-zero balance',
	},
	'friends.list': {
		riskLevel: 'read',
		description:
			'List the current user friends with the balance owed either way',
	},
	'friends.get': {
		riskLevel: 'read',
		description: 'Get one friend with their balances and shared groups',
	},
	'friends.add': {
		riskLevel: 'write',
		description:
			'Add a friend by email; a first name is needed when the person has no Splitwise account yet',
	},
	'friends.addMany': {
		riskLevel: 'write',
		description:
			'Add several friends in one call, returning each result alongside any errors',
	},
	'friends.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Break off the friendship; Splitwise keeps the expenses but the friend is removed from the list and there is no undelete call',
	},
	'expenses.list': {
		riskLevel: 'read',
		description:
			'List the current user expenses, filtered by group, friend or date, with limit and offset paging',
	},
	'expenses.get': {
		riskLevel: 'read',
		description: 'Get one expense with its shares, repayments and comments',
	},
	'expenses.create': {
		riskLevel: 'write',
		description:
			'Record an expense, split either equally across a group or by an explicit paid and owed share per person',
	},
	'expenses.update': {
		riskLevel: 'write',
		description:
			'Change an expense; passing any share replaces every share on it',
	},
	'expenses.delete': {
		riskLevel: 'destructive',
		description:
			'Delete an expense; it can be restored with `expenses.undelete`',
	},
	'expenses.undelete': {
		riskLevel: 'write',
		description: 'Restore a deleted expense',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List the comments on an expense',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Post a comment on an expense',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment; this cannot be undone',
	},
	'notifications.list': {
		riskLevel: 'read',
		description:
			'List recent activity on the account, newest first, optionally after a given time',
	},
	'currencies.list': {
		riskLevel: 'read',
		description: 'List the currency codes Splitwise accepts',
	},
	'categories.list': {
		riskLevel: 'read',
		description:
			'List expense categories with their subcategories; an expense must use a subcategory',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof splitwiseEndpointsNested
>;

export type BaseSplitwisePlugin<T extends SplitwisePluginOptions> =
	CorsairPlugin<
		'splitwise',
		typeof SplitwiseSchema,
		typeof splitwiseEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSplitwisePlugin =
	BaseSplitwisePlugin<SplitwisePluginOptions>;

export type ExternalSplitwisePlugin<T extends SplitwisePluginOptions> =
	BaseSplitwisePlugin<T>;

export function splitwise<const T extends SplitwisePluginOptions>(
	incomingOptions: SplitwisePluginOptions & T = {} as SplitwisePluginOptions &
		T,
): ExternalSplitwisePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'splitwise',
		schema: SplitwiseSchema,
		options: options,
		hooks: options.hooks,
		endpoints: splitwiseEndpointsNested,
		webhooks: {},
		endpointMeta: splitwiseEndpointMeta,
		endpointSchemas: splitwiseEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SplitwiseKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('splitwise', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSplitwisePlugin;
}

export { SplitwiseAPIError, SplitwiseOperationError } from './client';

export type {
	AddFriendInput,
	AddFriendsInput,
	AddUserToGroupInput,
	CreateCommentInput,
	CreateExpenseInput,
	CreateGroupInput,
	GetCurrentUserOutput,
	GetExpenseOutput,
	GetFriendOutput,
	GetGroupOutput,
	GetUserOutput,
	ListCategoriesOutput,
	ListCommentsOutput,
	ListCurrenciesOutput,
	ListExpensesOutput,
	ListFriendsOutput,
	ListGroupsOutput,
	ListNotificationsOutput,
	RemoveUserFromGroupInput,
	SplitwiseEndpointInputs,
	SplitwiseEndpointOutputs,
	SuccessOutput,
	UpdateExpenseInput,
	UpdateUserInput,
	UserIdInput,
} from './endpoints/types';
