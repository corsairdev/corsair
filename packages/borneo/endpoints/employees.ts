import { createBorneoEndpoint } from './factory';

export const createEmployeeWithJsonPayload = createBorneoEndpoint(
	'createEmployeeWithJsonPayload',
	'BORNEO_CREATE_EMPLOYEE_WITH_JSON_PAYLOAD',
	'borneo.employees.createEmployeeWithJsonPayload',
);

export const deleteEmployeeById = createBorneoEndpoint(
	'deleteEmployeeById',
	'BORNEO_DELETE_EMPLOYEE_BY_ID',
	'borneo.employees.deleteEmployeeById',
);

export const filterEmployeeList = createBorneoEndpoint(
	'filterEmployeeList',
	'BORNEO_FILTER_EMPLOYEE_LIST',
	'borneo.employees.filterEmployeeList',
);

export const listEmployeesWithFilters = createBorneoEndpoint(
	'listEmployeesWithFilters',
	'BORNEO_LIST_EMPLOYEES_WITH_FILTERS',
	'borneo.employees.listEmployeesWithFilters',
);

export const retrieveEmployeeDetailsById = createBorneoEndpoint(
	'retrieveEmployeeDetailsById',
	'BORNEO_RETRIEVE_EMPLOYEE_DETAILS_BY_ID',
	'borneo.employees.retrieveEmployeeDetailsById',
);

export const updateEmployeeById = createBorneoEndpoint(
	'updateEmployeeById',
	'BORNEO_UPDATE_EMPLOYEE_BY_ID',
	'borneo.employees.updateEmployeeById',
);
