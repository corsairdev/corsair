import { createBorneoEndpoint } from './factory';

export const getCloudAccountById = createBorneoEndpoint(
	'getCloudAccountById',
	'BORNEO_GET_CLOUD_ACCOUNT_BY_ID',
	'borneo.accounts.getCloudAccountById',
);

export const postAccountsWithFilterAndSortOptions = createBorneoEndpoint(
	'postAccountsWithFilterAndSortOptions',
	'BORNEO_POST_ACCOUNTS_WITH_FILTER_AND_SORT_OPTIONS',
	'borneo.accounts.postAccountsWithFilterAndSortOptions',
);

export const retrieveAccountDetailsById = createBorneoEndpoint(
	'retrieveAccountDetailsById',
	'BORNEO_RETRIEVE_ACCOUNT_DETAILS_BY_ID',
	'borneo.accounts.retrieveAccountDetailsById',
);
