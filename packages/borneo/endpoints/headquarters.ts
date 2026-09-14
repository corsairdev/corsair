import { createBorneoEndpoint } from './factory';

export const createHeadquarterEntry = createBorneoEndpoint(
	'createHeadquarterEntry',
	'BORNEO_CREATE_HEADQUARTER_ENTRY',
	'borneo.headquarters.createHeadquarterEntry',
);

export const deleteHeadquartersById = createBorneoEndpoint(
	'deleteHeadquartersById',
	'BORNEO_DELETE_HEADQUARTERS_BY_ID',
	'borneo.headquarters.deleteHeadquartersById',
);

export const getHeadquartersById = createBorneoEndpoint(
	'getHeadquartersById',
	'BORNEO_GET_HEADQUARTERS_BY_ID',
	'borneo.headquarters.getHeadquartersById',
);

export const listHeadquartersWithSorting = createBorneoEndpoint(
	'listHeadquartersWithSorting',
	'BORNEO_LIST_HEADQUARTERS_WITH_SORTING',
	'borneo.headquarters.listHeadquartersWithSorting',
);

export const updateHeadquarterDetailsById = createBorneoEndpoint(
	'updateHeadquarterDetailsById',
	'BORNEO_UPDATE_HEADQUARTER_DETAILS_BY_ID',
	'borneo.headquarters.updateHeadquarterDetailsById',
);
