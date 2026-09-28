import { createBorneoEndpoint } from './factory';

export const createNewInfotypeCategory = createBorneoEndpoint(
	'createNewInfotypeCategory',
	'BORNEO_CREATE_NEW_INFOTYPE_CATEGORY',
	'borneo.categories.createNewInfotypeCategory',
);

export const deleteCategoryByLabel = createBorneoEndpoint(
	'deleteCategoryByLabel',
	'BORNEO_DELETE_CATEGORY_BY_LABEL',
	'borneo.categories.deleteCategoryByLabel',
);

export const getCategoryByLabel = createBorneoEndpoint(
	'getCategoryByLabel',
	'BORNEO_GET_CATEGORY_BY_LABEL',
	'borneo.categories.getCategoryByLabel',
);

export const updateCategoryInfotypes = createBorneoEndpoint(
	'updateCategoryInfotypes',
	'BORNEO_UPDATE_CATEGORY_INFOTYPES',
	'borneo.categories.updateCategoryInfotypes',
);
