import { operationDefinitions, operationKeys } from './definitions';
import type { ForceManagerRoute } from './types';

// The official contract has 305 methods; five hooks and login are not in operationDefinitions.
// These five remaining operations are intentionally not exposed: three need a separate binary PUT,
// and two target hard-coded record IDs.
const OUT_OF_SCOPE_OPERATIONS = new Set([
	'addDocument',
	'addDocumentToAResource',
	'addPicture',
	'deleteProductFamily',
	'deleteUserType',
]);

// ForceManager uses two documented headers for entity counts; preserve the exact per-operation spelling.
const COUNT_HEADERS = {
	listAccounts: 'Count',
	getAccount: 'X-FM-Entity-Count',
	listAccountTypes: 'Count',
	listAccountSegments: 'Count',
	listAccountStatuses: 'Count',
	listActivities: 'Count',
	getActivity: 'X-FM-Entity-Count',
	listActivityTypes: 'Count',
	listCalls: 'Count',
	listCampaigns: 'Count',
	listOpportunityTypes: 'Count',
	listCampaignStatuses: 'Count',
	listCampaignAccounts: 'Count',
	listCampaignQuestions: 'Count',
	listQuestionAnswers: 'Count',
	listQuestionValues: 'Count',
	listContacts: 'Count',
	listContactTypes: 'X-FM-Entity-Count',
	listDocuments: 'Count',
	listDocumentsOfAResource: 'Count',
	listFolders: 'Count',
	listFoldersOfAResource: 'Count',
	listEmails: 'Count',
	listCalendar: 'Count',
	listOpportunities: 'Count',
	getOpportunity: 'X-FM-Entity-Count',
	listOrderHeaders: 'Count',
	getOrderHeader: 'X-FM-Entity-Count',
	listOrderLines: 'Count',
	getOrderLine: 'X-FM-Entity-Count',
	listOrderStatuses: 'X-FM-Entity-Count',
	listOrderTypes: 'X-FM-Entity-Count',
	listProducts: 'Count',
	getProduct: 'X-FM-Entity-Count',
	productFamiliesSchema: 'X-FM-Entity-Count',
	listProductFamilies: 'Count',
	productCategoriesSchema: 'X-FM-Entity-Count',
	listProductCategories: 'Count',
	productRatesSchema: 'X-FM-Entity-Count',
	listProductRates: 'Count',
	listRates: 'Count',
	listRelatedAccounts: 'Count',
	relatedAccountTypesSchema: 'X-FM-Entity-Count',
	listRelatedAccountTypes: 'Count',
	getResources: 'X-FM-Entity-Count',
	listRoles: 'Count',
	getRole: 'X-FM-Entity-Count',
	listRolesOfUser: 'X-FM-Entity-Count',
	addRolesInUser: 'X-FM-Entity-Count',
	deleteRolesInUser: 'X-FM-Entity-Count',
	listUsersInRole: 'X-FM-Entity-Count',
	salesSchema: 'count',
	listSales: 'Count',
	listUsers: 'Count',
	createUser: 'X-FM-Entity-Count',
	getUser: 'X-FM-Entity-Count',
	updateUser: 'X-FM-Entity-Count',
	listUserHierarchy: 'X-FM-Entity-Count',
	userTypesSchema: 'X-FM-Entity-Count',
	listUserTypes: 'Count',
} as const satisfies Partial<Record<keyof typeof operationDefinitions, string>>;

export const forceManagerRoutes: readonly ForceManagerRoute[] = operationKeys
	.filter((name) => !OUT_OF_SCOPE_OPERATIONS.has(name))
	.map((name) => {
		const definition = operationDefinitions[name];
		const countHeader = Object.entries(COUNT_HEADERS).find(
			([operation]) => operation === name,
		)?.[1];
		return {
			name,
			group: definition.group,
			method: definition.method,
			path: definition.path,
			pathParams: definition.pathKeys,
			summary: definition.summary,
			...(countHeader ? { countHeader } : {}),
		};
	});
