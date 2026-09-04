import {
	addCustomerToGroup,
	createCustomerGroup,
	createThread,
	deleteCustomer,
	deleteUser,
	fetchCompany,
	fetchIssues,
	fetchTier,
	getCustomerByEmail,
	getCustomerById,
	getCustomers,
	getThreadById,
	getUserById,
	listCustomerGroups,
	listThreadsDeprecated,
	listTiers,
	queryThreads,
	removeCustomerFromGroup,
	runGraphqlQuery,
	sendMessage,
	updateCompany,
	updateThread,
	upsertCustomer,
} from './operations';

export const Customers = {
	getById: getCustomerById,
	getByEmail: getCustomerByEmail,
	list: getCustomers,
	upsert: upsertCustomer,
	delete: deleteCustomer,
};

export const Threads = {
	create: createThread,
	getById: getThreadById,
	query: queryThreads,
	listDeprecated: listThreadsDeprecated,
	fetchIssues,
	sendMessage,
	update: updateThread,
};

export const Users = {
	getById: getUserById,
	delete: deleteUser,
};

export const Companies = {
	fetch: fetchCompany,
	update: updateCompany,
};

export const Tiers = {
	fetch: fetchTier,
	list: listTiers,
};

export const CustomerGroups = {
	create: createCustomerGroup,
	list: listCustomerGroups,
	addCustomer: addCustomerToGroup,
	removeCustomer: removeCustomerFromGroup,
};

export const GraphQL = {
	run: runGraphqlQuery,
};

export * from './types';
