import { createBorneoEndpoint } from './factory';

export const createDepartmentWithTranslations = createBorneoEndpoint(
	'createDepartmentWithTranslations',
	'BORNEO_CREATE_DEPARTMENT_WITH_TRANSLATIONS',
	'borneo.departments.createDepartmentWithTranslations',
);

export const deleteDepartmentById = createBorneoEndpoint(
	'deleteDepartmentById',
	'BORNEO_DELETE_DEPARTMENT_BY_ID',
	'borneo.departments.deleteDepartmentById',
);

export const getDepartmentFilterList = createBorneoEndpoint(
	'getDepartmentFilterList',
	'BORNEO_GET_DEPARTMENT_FILTER_LIST',
	'borneo.departments.getDepartmentFilterList',
);

export const listDepartmentsWithSortAndPagination = createBorneoEndpoint(
	'listDepartmentsWithSortAndPagination',
	'BORNEO_LIST_DEPARTMENTS_WITH_SORT_AND_PAGINATION',
	'borneo.departments.listDepartmentsWithSortAndPagination',
);

export const retrieveDepartmentInformation = createBorneoEndpoint(
	'retrieveDepartmentInformation',
	'BORNEO_RETRIEVE_DEPARTMENT_INFORMATION',
	'borneo.departments.retrieveDepartmentInformation',
);

export const updateDepartmentName = createBorneoEndpoint(
	'updateDepartmentName',
	'BORNEO_UPDATE_DEPARTMENT_NAME',
	'borneo.departments.updateDepartmentName',
);
