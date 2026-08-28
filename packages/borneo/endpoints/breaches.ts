import { createBorneoEndpoint } from './factory';

export const deleteDataBreachById = createBorneoEndpoint(
	'deleteDataBreachById',
	'BORNEO_DELETE_DATA_BREACH_BY_ID',
	'borneo.breaches.deleteDataBreachById',
);

export const evaluateDataBreachImpact = createBorneoEndpoint(
	'evaluateDataBreachImpact',
	'BORNEO_EVALUATE_DATA_BREACH_IMPACT',
	'borneo.breaches.evaluateDataBreachImpact',
);

export const fetchDataBreachEvaluation = createBorneoEndpoint(
	'fetchDataBreachEvaluation',
	'BORNEO_FETCH_DATA_BREACH_EVALUATION',
	'borneo.breaches.fetchDataBreachEvaluation',
);

export const listDataBreachFilters = createBorneoEndpoint(
	'listDataBreachFilters',
	'BORNEO_LIST_DATA_BREACH_FILTERS',
	'borneo.breaches.listDataBreachFilters',
);

export const listDataBreachesWithFilters = createBorneoEndpoint(
	'listDataBreachesWithFilters',
	'BORNEO_LIST_DATA_BREACHES_WITH_FILTERS',
	'borneo.breaches.listDataBreachesWithFilters',
);

export const postDataBreachInformation = createBorneoEndpoint(
	'postDataBreachInformation',
	'BORNEO_POST_DATA_BREACH_INFORMATION',
	'borneo.breaches.postDataBreachInformation',
);

export const retrieveDataBreachById = createBorneoEndpoint(
	'retrieveDataBreachById',
	'BORNEO_RETRIEVE_DATA_BREACH_BY_ID',
	'borneo.breaches.retrieveDataBreachById',
);

export const updateDataBreachEntry = createBorneoEndpoint(
	'updateDataBreachEntry',
	'BORNEO_UPDATE_DATA_BREACH_ENTRY',
	'borneo.breaches.updateDataBreachEntry',
);
