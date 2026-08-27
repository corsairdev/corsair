import { createBorneoEndpoint } from './factory';

export const createDomainWithPollingFrequency = createBorneoEndpoint(
	'createDomainWithPollingFrequency',
	'BORNEO_CREATE_DOMAIN_WITH_POLLING_FREQUENCY',
	'borneo.domains.createDomainWithPollingFrequency',
);

export const deleteDomainById = createBorneoEndpoint(
	'deleteDomainById',
	'BORNEO_DELETE_DOMAIN_BY_ID',
	'borneo.domains.deleteDomainById',
);

export const getDomainById = createBorneoEndpoint(
	'getDomainById',
	'BORNEO_GET_DOMAIN_BY_ID',
	'borneo.domains.getDomainById',
);

export const listDomainsWithPaginationAndSorting = createBorneoEndpoint(
	'listDomainsWithPaginationAndSorting',
	'BORNEO_LIST_DOMAINS_WITH_PAGINATION_AND_SORTING',
	'borneo.domains.listDomainsWithPaginationAndSorting',
);

export const pollDomainById = createBorneoEndpoint(
	'pollDomainById',
	'BORNEO_POLL_DOMAIN_BY_ID',
	'borneo.domains.pollDomainById',
);

export const updateDomainDetails = createBorneoEndpoint(
	'updateDomainDetails',
	'BORNEO_UPDATE_DOMAIN_DETAILS',
	'borneo.domains.updateDomainDetails',
);
