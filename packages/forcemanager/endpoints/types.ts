import type { z } from 'zod';
import type { operationDefinitions } from './definitions';

type OperationKey = keyof typeof operationDefinitions;

export type ForceManagerEndpointInputSchemas = {
	[K in OperationKey]: (typeof operationDefinitions)[K]['input'];
};

export type ForceManagerEndpointOutputSchemas = {
	[K in OperationKey]: (typeof operationDefinitions)[K]['output'];
};

export type ForceManagerRoute = {
	name: OperationKey;
	group: (typeof operationDefinitions)[OperationKey]['group'];
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	pathParams: readonly string[];
	summary: string;
	countHeader?: string;
};

export type ForceManagerEndpointInputs = {
	accountAddressesSchema: z.infer<
		(typeof operationDefinitions)['accountAddressesSchema']['input']
	>;
	listAccountAddresses: z.infer<
		(typeof operationDefinitions)['listAccountAddresses']['input']
	>;
	createAccountAddress: z.infer<
		(typeof operationDefinitions)['createAccountAddress']['input']
	>;
	getAccountAddress: z.infer<
		(typeof operationDefinitions)['getAccountAddress']['input']
	>;
	updateAccountAddress: z.infer<
		(typeof operationDefinitions)['updateAccountAddress']['input']
	>;
	deleteAccountAddress: z.infer<
		(typeof operationDefinitions)['deleteAccountAddress']['input']
	>;
	accountsSchema: z.infer<
		(typeof operationDefinitions)['accountsSchema']['input']
	>;
	listAccounts: z.infer<(typeof operationDefinitions)['listAccounts']['input']>;
	createAccount: z.infer<
		(typeof operationDefinitions)['createAccount']['input']
	>;
	getAccount: z.infer<(typeof operationDefinitions)['getAccount']['input']>;
	updateAccount: z.infer<
		(typeof operationDefinitions)['updateAccount']['input']
	>;
	deleteAccount: z.infer<
		(typeof operationDefinitions)['deleteAccount']['input']
	>;
	accountTypesSchema: z.infer<
		(typeof operationDefinitions)['accountTypesSchema']['input']
	>;
	listAccountTypes: z.infer<
		(typeof operationDefinitions)['listAccountTypes']['input']
	>;
	createAccountType: z.infer<
		(typeof operationDefinitions)['createAccountType']['input']
	>;
	getAccountType: z.infer<
		(typeof operationDefinitions)['getAccountType']['input']
	>;
	updateAccountType: z.infer<
		(typeof operationDefinitions)['updateAccountType']['input']
	>;
	deleteAccountType: z.infer<
		(typeof operationDefinitions)['deleteAccountType']['input']
	>;
	accountSegmentsSchema: z.infer<
		(typeof operationDefinitions)['accountSegmentsSchema']['input']
	>;
	listAccountSegments: z.infer<
		(typeof operationDefinitions)['listAccountSegments']['input']
	>;
	createAccountSegment: z.infer<
		(typeof operationDefinitions)['createAccountSegment']['input']
	>;
	getAccountSegment: z.infer<
		(typeof operationDefinitions)['getAccountSegment']['input']
	>;
	updateAccountSegment: z.infer<
		(typeof operationDefinitions)['updateAccountSegment']['input']
	>;
	deleteAccountSegment: z.infer<
		(typeof operationDefinitions)['deleteAccountSegment']['input']
	>;
	accountStatusesSchema: z.infer<
		(typeof operationDefinitions)['accountStatusesSchema']['input']
	>;
	listAccountStatuses: z.infer<
		(typeof operationDefinitions)['listAccountStatuses']['input']
	>;
	createAccountStatus: z.infer<
		(typeof operationDefinitions)['createAccountStatus']['input']
	>;
	getAccountStatus: z.infer<
		(typeof operationDefinitions)['getAccountStatus']['input']
	>;
	updateAccountStatus: z.infer<
		(typeof operationDefinitions)['updateAccountStatus']['input']
	>;
	deleteAccountStatus: z.infer<
		(typeof operationDefinitions)['deleteAccountStatus']['input']
	>;
	activitiesSchema: z.infer<
		(typeof operationDefinitions)['activitiesSchema']['input']
	>;
	listActivities: z.infer<
		(typeof operationDefinitions)['listActivities']['input']
	>;
	createActivity: z.infer<
		(typeof operationDefinitions)['createActivity']['input']
	>;
	getActivity: z.infer<(typeof operationDefinitions)['getActivity']['input']>;
	updateActivity: z.infer<
		(typeof operationDefinitions)['updateActivity']['input']
	>;
	deleteActivity: z.infer<
		(typeof operationDefinitions)['deleteActivity']['input']
	>;
	activityTypesSchema: z.infer<
		(typeof operationDefinitions)['activityTypesSchema']['input']
	>;
	listActivityTypes: z.infer<
		(typeof operationDefinitions)['listActivityTypes']['input']
	>;
	createActivityType: z.infer<
		(typeof operationDefinitions)['createActivityType']['input']
	>;
	getActivityType: z.infer<
		(typeof operationDefinitions)['getActivityType']['input']
	>;
	updateActivityType: z.infer<
		(typeof operationDefinitions)['updateActivityType']['input']
	>;
	deleteActivityType: z.infer<
		(typeof operationDefinitions)['deleteActivityType']['input']
	>;
	listActivityPoints: z.infer<
		(typeof operationDefinitions)['listActivityPoints']['input']
	>;
	updateActivityPoints: z.infer<
		(typeof operationDefinitions)['updateActivityPoints']['input']
	>;
	branchesSchema: z.infer<
		(typeof operationDefinitions)['branchesSchema']['input']
	>;
	listBranches: z.infer<(typeof operationDefinitions)['listBranches']['input']>;
	getBranch: z.infer<(typeof operationDefinitions)['getBranch']['input']>;
	deleteBranch: z.infer<(typeof operationDefinitions)['deleteBranch']['input']>;
	bulkCreateResources: z.infer<
		(typeof operationDefinitions)['bulkCreateResources']['input']
	>;
	bulkUpdateResources: z.infer<
		(typeof operationDefinitions)['bulkUpdateResources']['input']
	>;
	bulkDeleteResources: z.infer<
		(typeof operationDefinitions)['bulkDeleteResources']['input']
	>;
	listCalls: z.infer<(typeof operationDefinitions)['listCalls']['input']>;
	createCallByUserId: z.infer<
		(typeof operationDefinitions)['createCallByUserId']['input']
	>;
	createCallByUserPhoneNumber: z.infer<
		(typeof operationDefinitions)['createCallByUserPhoneNumber']['input']
	>;
	getCall: z.infer<(typeof operationDefinitions)['getCall']['input']>;
	updateCall: z.infer<(typeof operationDefinitions)['updateCall']['input']>;
	deleteCall: z.infer<(typeof operationDefinitions)['deleteCall']['input']>;
	getResourcesByPhoneNumber: z.infer<
		(typeof operationDefinitions)['getResourcesByPhoneNumber']['input']
	>;
	listCampaigns: z.infer<
		(typeof operationDefinitions)['listCampaigns']['input']
	>;
	createCampaign: z.infer<
		(typeof operationDefinitions)['createCampaign']['input']
	>;
	getCampaign: z.infer<(typeof operationDefinitions)['getCampaign']['input']>;
	updateCampaign: z.infer<
		(typeof operationDefinitions)['updateCampaign']['input']
	>;
	deleteCampaign: z.infer<
		(typeof operationDefinitions)['deleteCampaign']['input']
	>;
	listOpportunityTypes: z.infer<
		(typeof operationDefinitions)['listOpportunityTypes']['input']
	>;
	createOpportunityType: z.infer<
		(typeof operationDefinitions)['createOpportunityType']['input']
	>;
	listCampaignStatuses: z.infer<
		(typeof operationDefinitions)['listCampaignStatuses']['input']
	>;
	listCampaignAccounts: z.infer<
		(typeof operationDefinitions)['listCampaignAccounts']['input']
	>;
	createCampaignAccount: z.infer<
		(typeof operationDefinitions)['createCampaignAccount']['input']
	>;
	getCampaignAccount: z.infer<
		(typeof operationDefinitions)['getCampaignAccount']['input']
	>;
	updateCampaignAccount: z.infer<
		(typeof operationDefinitions)['updateCampaignAccount']['input']
	>;
	deleteCampaignAccount: z.infer<
		(typeof operationDefinitions)['deleteCampaignAccount']['input']
	>;
	listCampaignQuestions: z.infer<
		(typeof operationDefinitions)['listCampaignQuestions']['input']
	>;
	createCampaignQuestion: z.infer<
		(typeof operationDefinitions)['createCampaignQuestion']['input']
	>;
	getCampaignQuestion: z.infer<
		(typeof operationDefinitions)['getCampaignQuestion']['input']
	>;
	updateCampaignQuestion: z.infer<
		(typeof operationDefinitions)['updateCampaignQuestion']['input']
	>;
	deleteCampaignQuestion: z.infer<
		(typeof operationDefinitions)['deleteCampaignQuestion']['input']
	>;
	listQuestionAnswers: z.infer<
		(typeof operationDefinitions)['listQuestionAnswers']['input']
	>;
	createQuestionAnswer: z.infer<
		(typeof operationDefinitions)['createQuestionAnswer']['input']
	>;
	getQuestionAnswer: z.infer<
		(typeof operationDefinitions)['getQuestionAnswer']['input']
	>;
	updateQuestionAnswer: z.infer<
		(typeof operationDefinitions)['updateQuestionAnswer']['input']
	>;
	deleteQuestionAnswer: z.infer<
		(typeof operationDefinitions)['deleteQuestionAnswer']['input']
	>;
	listQuestionValues: z.infer<
		(typeof operationDefinitions)['listQuestionValues']['input']
	>;
	createQuestionValue: z.infer<
		(typeof operationDefinitions)['createQuestionValue']['input']
	>;
	getQuestionValue: z.infer<
		(typeof operationDefinitions)['getQuestionValue']['input']
	>;
	updateQuestionValue: z.infer<
		(typeof operationDefinitions)['updateQuestionValue']['input']
	>;
	deleteQuestionValue: z.infer<
		(typeof operationDefinitions)['deleteQuestionValue']['input']
	>;
	contactsSchema: z.infer<
		(typeof operationDefinitions)['contactsSchema']['input']
	>;
	listContacts: z.infer<(typeof operationDefinitions)['listContacts']['input']>;
	createContact: z.infer<
		(typeof operationDefinitions)['createContact']['input']
	>;
	getContact: z.infer<(typeof operationDefinitions)['getContact']['input']>;
	updateContact: z.infer<
		(typeof operationDefinitions)['updateContact']['input']
	>;
	deleteContact: z.infer<
		(typeof operationDefinitions)['deleteContact']['input']
	>;
	contactTypesSchema: z.infer<
		(typeof operationDefinitions)['contactTypesSchema']['input']
	>;
	listContactTypes: z.infer<
		(typeof operationDefinitions)['listContactTypes']['input']
	>;
	createContactType: z.infer<
		(typeof operationDefinitions)['createContactType']['input']
	>;
	getContactType: z.infer<
		(typeof operationDefinitions)['getContactType']['input']
	>;
	updateContactType: z.infer<
		(typeof operationDefinitions)['updateContactType']['input']
	>;
	deleteContactType: z.infer<
		(typeof operationDefinitions)['deleteContactType']['input']
	>;
	countriesSchema: z.infer<
		(typeof operationDefinitions)['countriesSchema']['input']
	>;
	listCountries: z.infer<
		(typeof operationDefinitions)['listCountries']['input']
	>;
	currenciesSchema: z.infer<
		(typeof operationDefinitions)['currenciesSchema']['input']
	>;
	listCurrencies: z.infer<
		(typeof operationDefinitions)['listCurrencies']['input']
	>;
	listDocuments: z.infer<
		(typeof operationDefinitions)['listDocuments']['input']
	>;
	listDocumentsOfAResource: z.infer<
		(typeof operationDefinitions)['listDocumentsOfAResource']['input']
	>;
	deletePicture: z.infer<
		(typeof operationDefinitions)['deletePicture']['input']
	>;
	listFolders: z.infer<(typeof operationDefinitions)['listFolders']['input']>;
	createFolder: z.infer<(typeof operationDefinitions)['createFolder']['input']>;
	listFoldersOfAResource: z.infer<
		(typeof operationDefinitions)['listFoldersOfAResource']['input']
	>;
	createFolderForAResource: z.infer<
		(typeof operationDefinitions)['createFolderForAResource']['input']
	>;
	emailsSchema: z.infer<(typeof operationDefinitions)['emailsSchema']['input']>;
	listEmails: z.infer<(typeof operationDefinitions)['listEmails']['input']>;
	createEmail: z.infer<(typeof operationDefinitions)['createEmail']['input']>;
	getEmail: z.infer<(typeof operationDefinitions)['getEmail']['input']>;
	entityContactsSchema: z.infer<
		(typeof operationDefinitions)['entityContactsSchema']['input']
	>;
	listEntityContacts: z.infer<
		(typeof operationDefinitions)['listEntityContacts']['input']
	>;
	entityOwnersSchema: z.infer<
		(typeof operationDefinitions)['entityOwnersSchema']['input']
	>;
	listEntityOwners: z.infer<
		(typeof operationDefinitions)['listEntityOwners']['input']
	>;
	calendarSchema: z.infer<
		(typeof operationDefinitions)['calendarSchema']['input']
	>;
	listCalendar: z.infer<(typeof operationDefinitions)['listCalendar']['input']>;
	createCalendar: z.infer<
		(typeof operationDefinitions)['createCalendar']['input']
	>;
	getCalendar: z.infer<(typeof operationDefinitions)['getCalendar']['input']>;
	updateCalendar: z.infer<
		(typeof operationDefinitions)['updateCalendar']['input']
	>;
	deleteCalendar: z.infer<
		(typeof operationDefinitions)['deleteCalendar']['input']
	>;
	extraFieldsSchemaByResource: z.infer<
		(typeof operationDefinitions)['extraFieldsSchemaByResource']['input']
	>;
	listExtraFieldsByResource: z.infer<
		(typeof operationDefinitions)['listExtraFieldsByResource']['input']
	>;
	createExtraFieldForResource: z.infer<
		(typeof operationDefinitions)['createExtraFieldForResource']['input']
	>;
	listTabs: z.infer<(typeof operationDefinitions)['listTabs']['input']>;
	createTabs: z.infer<(typeof operationDefinitions)['createTabs']['input']>;
	getTabs: z.infer<(typeof operationDefinitions)['getTabs']['input']>;
	updateTabs: z.infer<(typeof operationDefinitions)['updateTabs']['input']>;
	deleteTabs: z.infer<(typeof operationDefinitions)['deleteTabs']['input']>;
	getForm: z.infer<(typeof operationDefinitions)['getForm']['input']>;
	getFormState: z.infer<(typeof operationDefinitions)['getFormState']['input']>;
	getFormTemplate: z.infer<
		(typeof operationDefinitions)['getFormTemplate']['input']
	>;
	listNews: z.infer<(typeof operationDefinitions)['listNews']['input']>;
	opportunitiesSchema: z.infer<
		(typeof operationDefinitions)['opportunitiesSchema']['input']
	>;
	listOpportunities: z.infer<
		(typeof operationDefinitions)['listOpportunities']['input']
	>;
	createOpportunity: z.infer<
		(typeof operationDefinitions)['createOpportunity']['input']
	>;
	getOpportunity: z.infer<
		(typeof operationDefinitions)['getOpportunity']['input']
	>;
	updateOpportunity: z.infer<
		(typeof operationDefinitions)['updateOpportunity']['input']
	>;
	deleteOpportunity: z.infer<
		(typeof operationDefinitions)['deleteOpportunity']['input']
	>;
	opportunityTypesSchema: z.infer<
		(typeof operationDefinitions)['opportunityTypesSchema']['input']
	>;
	getOpportunityTypes: z.infer<
		(typeof operationDefinitions)['getOpportunityTypes']['input']
	>;
	updateOpportunityType: z.infer<
		(typeof operationDefinitions)['updateOpportunityType']['input']
	>;
	deleteOpportunityType: z.infer<
		(typeof operationDefinitions)['deleteOpportunityType']['input']
	>;
	opportunityStatusesSchema: z.infer<
		(typeof operationDefinitions)['opportunityStatusesSchema']['input']
	>;
	listOpportunityStatuses: z.infer<
		(typeof operationDefinitions)['listOpportunityStatuses']['input']
	>;
	createOpportunityStatus: z.infer<
		(typeof operationDefinitions)['createOpportunityStatus']['input']
	>;
	getOpportunityStatus: z.infer<
		(typeof operationDefinitions)['getOpportunityStatus']['input']
	>;
	updateOpportunityStatus: z.infer<
		(typeof operationDefinitions)['updateOpportunityStatus']['input']
	>;
	deleteOpportunityStatus: z.infer<
		(typeof operationDefinitions)['deleteOpportunityStatus']['input']
	>;
	orderHeadersSchema: z.infer<
		(typeof operationDefinitions)['orderHeadersSchema']['input']
	>;
	listOrderHeaders: z.infer<
		(typeof operationDefinitions)['listOrderHeaders']['input']
	>;
	createOrderHeader: z.infer<
		(typeof operationDefinitions)['createOrderHeader']['input']
	>;
	getOrderHeader: z.infer<
		(typeof operationDefinitions)['getOrderHeader']['input']
	>;
	updateOrderHeader: z.infer<
		(typeof operationDefinitions)['updateOrderHeader']['input']
	>;
	deleteOrderHeader: z.infer<
		(typeof operationDefinitions)['deleteOrderHeader']['input']
	>;
	orderLinesSchema: z.infer<
		(typeof operationDefinitions)['orderLinesSchema']['input']
	>;
	listOrderLines: z.infer<
		(typeof operationDefinitions)['listOrderLines']['input']
	>;
	createOrderLine: z.infer<
		(typeof operationDefinitions)['createOrderLine']['input']
	>;
	getOrderLine: z.infer<(typeof operationDefinitions)['getOrderLine']['input']>;
	updateOrderLine: z.infer<
		(typeof operationDefinitions)['updateOrderLine']['input']
	>;
	deleteOrderLine: z.infer<
		(typeof operationDefinitions)['deleteOrderLine']['input']
	>;
	orderStatusesSchema: z.infer<
		(typeof operationDefinitions)['orderStatusesSchema']['input']
	>;
	listOrderStatuses: z.infer<
		(typeof operationDefinitions)['listOrderStatuses']['input']
	>;
	createOrderStatus: z.infer<
		(typeof operationDefinitions)['createOrderStatus']['input']
	>;
	getOrderStatus: z.infer<
		(typeof operationDefinitions)['getOrderStatus']['input']
	>;
	updateOrderStatus: z.infer<
		(typeof operationDefinitions)['updateOrderStatus']['input']
	>;
	deleteOrderStatus: z.infer<
		(typeof operationDefinitions)['deleteOrderStatus']['input']
	>;
	orderTypesSchema: z.infer<
		(typeof operationDefinitions)['orderTypesSchema']['input']
	>;
	listOrderTypes: z.infer<
		(typeof operationDefinitions)['listOrderTypes']['input']
	>;
	createOrderTypes: z.infer<
		(typeof operationDefinitions)['createOrderTypes']['input']
	>;
	getOrderTypes: z.infer<
		(typeof operationDefinitions)['getOrderTypes']['input']
	>;
	updateOrderTypes: z.infer<
		(typeof operationDefinitions)['updateOrderTypes']['input']
	>;
	deleteOrderTypes: z.infer<
		(typeof operationDefinitions)['deleteOrderTypes']['input']
	>;
	productsSchema: z.infer<
		(typeof operationDefinitions)['productsSchema']['input']
	>;
	listProducts: z.infer<(typeof operationDefinitions)['listProducts']['input']>;
	createProduct: z.infer<
		(typeof operationDefinitions)['createProduct']['input']
	>;
	getProduct: z.infer<(typeof operationDefinitions)['getProduct']['input']>;
	updateProduct: z.infer<
		(typeof operationDefinitions)['updateProduct']['input']
	>;
	deleteProduct: z.infer<
		(typeof operationDefinitions)['deleteProduct']['input']
	>;
	bulkCreateProducts: z.infer<
		(typeof operationDefinitions)['bulkCreateProducts']['input']
	>;
	bulkUpdateProducts: z.infer<
		(typeof operationDefinitions)['bulkUpdateProducts']['input']
	>;
	bulkDeleteProducts: z.infer<
		(typeof operationDefinitions)['bulkDeleteProducts']['input']
	>;
	productFamiliesSchema: z.infer<
		(typeof operationDefinitions)['productFamiliesSchema']['input']
	>;
	listProductFamilies: z.infer<
		(typeof operationDefinitions)['listProductFamilies']['input']
	>;
	createProductFamily: z.infer<
		(typeof operationDefinitions)['createProductFamily']['input']
	>;
	getProductFamily: z.infer<
		(typeof operationDefinitions)['getProductFamily']['input']
	>;
	updateProductFamily: z.infer<
		(typeof operationDefinitions)['updateProductFamily']['input']
	>;
	productUnitsOfMeasureSchema: z.infer<
		(typeof operationDefinitions)['productUnitsOfMeasureSchema']['input']
	>;
	listProductUnitsOfMeasure: z.infer<
		(typeof operationDefinitions)['listProductUnitsOfMeasure']['input']
	>;
	createProductUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['createProductUnitOfMeasure']['input']
	>;
	getProductUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['getProductUnitOfMeasure']['input']
	>;
	updateProductUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['updateProductUnitOfMeasure']['input']
	>;
	deleteProductUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['deleteProductUnitOfMeasure']['input']
	>;
	unitsOfMeasureSchema: z.infer<
		(typeof operationDefinitions)['unitsOfMeasureSchema']['input']
	>;
	listUnitsOfMeasure: z.infer<
		(typeof operationDefinitions)['listUnitsOfMeasure']['input']
	>;
	createUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['createUnitOfMeasure']['input']
	>;
	getUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['getUnitOfMeasure']['input']
	>;
	updateUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['updateUnitOfMeasure']['input']
	>;
	deleteUnitOfMeasure: z.infer<
		(typeof operationDefinitions)['deleteUnitOfMeasure']['input']
	>;
	taxRatesSchema: z.infer<
		(typeof operationDefinitions)['taxRatesSchema']['input']
	>;
	listTaxRates: z.infer<(typeof operationDefinitions)['listTaxRates']['input']>;
	createTaxRate: z.infer<
		(typeof operationDefinitions)['createTaxRate']['input']
	>;
	getTaxRate: z.infer<(typeof operationDefinitions)['getTaxRate']['input']>;
	updateTaxRate: z.infer<
		(typeof operationDefinitions)['updateTaxRate']['input']
	>;
	deleteTaxRate: z.infer<
		(typeof operationDefinitions)['deleteTaxRate']['input']
	>;
	taxProfilesSchema: z.infer<
		(typeof operationDefinitions)['taxProfilesSchema']['input']
	>;
	listTaxProfiles: z.infer<
		(typeof operationDefinitions)['listTaxProfiles']['input']
	>;
	getTaxProfile: z.infer<
		(typeof operationDefinitions)['getTaxProfile']['input']
	>;
	productFamiliesBranchesSchema: z.infer<
		(typeof operationDefinitions)['productFamiliesBranchesSchema']['input']
	>;
	listProductFamiliesBranches: z.infer<
		(typeof operationDefinitions)['listProductFamiliesBranches']['input']
	>;
	createProductFamiliesBranch: z.infer<
		(typeof operationDefinitions)['createProductFamiliesBranch']['input']
	>;
	getProductFamiliesBranch: z.infer<
		(typeof operationDefinitions)['getProductFamiliesBranch']['input']
	>;
	updateProductFamiliesBranch: z.infer<
		(typeof operationDefinitions)['updateProductFamiliesBranch']['input']
	>;
	deleteProductFamiliesBranch: z.infer<
		(typeof operationDefinitions)['deleteProductFamiliesBranch']['input']
	>;
	productEnvironmentsSchema: z.infer<
		(typeof operationDefinitions)['productEnvironmentsSchema']['input']
	>;
	listProductEnvironments: z.infer<
		(typeof operationDefinitions)['listProductEnvironments']['input']
	>;
	createProductEnvironment: z.infer<
		(typeof operationDefinitions)['createProductEnvironment']['input']
	>;
	getProductEnvironment: z.infer<
		(typeof operationDefinitions)['getProductEnvironment']['input']
	>;
	updateProductEnvironment: z.infer<
		(typeof operationDefinitions)['updateProductEnvironment']['input']
	>;
	deleteProductEnvironment: z.infer<
		(typeof operationDefinitions)['deleteProductEnvironment']['input']
	>;
	productCategoriesSchema: z.infer<
		(typeof operationDefinitions)['productCategoriesSchema']['input']
	>;
	listProductCategories: z.infer<
		(typeof operationDefinitions)['listProductCategories']['input']
	>;
	createProductCategory: z.infer<
		(typeof operationDefinitions)['createProductCategory']['input']
	>;
	getProductCategory: z.infer<
		(typeof operationDefinitions)['getProductCategory']['input']
	>;
	updateProductCategory: z.infer<
		(typeof operationDefinitions)['updateProductCategory']['input']
	>;
	deleteProductCategory: z.infer<
		(typeof operationDefinitions)['deleteProductCategory']['input']
	>;
	productRatesSchema: z.infer<
		(typeof operationDefinitions)['productRatesSchema']['input']
	>;
	listProductRates: z.infer<
		(typeof operationDefinitions)['listProductRates']['input']
	>;
	createProductRate: z.infer<
		(typeof operationDefinitions)['createProductRate']['input']
	>;
	getProductRate: z.infer<
		(typeof operationDefinitions)['getProductRate']['input']
	>;
	updateProductRate: z.infer<
		(typeof operationDefinitions)['updateProductRate']['input']
	>;
	deleteProductRate: z.infer<
		(typeof operationDefinitions)['deleteProductRate']['input']
	>;
	ratesSchema: z.infer<(typeof operationDefinitions)['ratesSchema']['input']>;
	listRates: z.infer<(typeof operationDefinitions)['listRates']['input']>;
	createRate: z.infer<(typeof operationDefinitions)['createRate']['input']>;
	getRate: z.infer<(typeof operationDefinitions)['getRate']['input']>;
	updateRate: z.infer<(typeof operationDefinitions)['updateRate']['input']>;
	deleteRate: z.infer<(typeof operationDefinitions)['deleteRate']['input']>;
	relatedAccountsSchema: z.infer<
		(typeof operationDefinitions)['relatedAccountsSchema']['input']
	>;
	listRelatedAccounts: z.infer<
		(typeof operationDefinitions)['listRelatedAccounts']['input']
	>;
	createRelatedAccount: z.infer<
		(typeof operationDefinitions)['createRelatedAccount']['input']
	>;
	retrieveRelatedAccount: z.infer<
		(typeof operationDefinitions)['retrieveRelatedAccount']['input']
	>;
	updateRelatedAccount: z.infer<
		(typeof operationDefinitions)['updateRelatedAccount']['input']
	>;
	deleteRelatedAccount: z.infer<
		(typeof operationDefinitions)['deleteRelatedAccount']['input']
	>;
	relatedAccountTypesSchema: z.infer<
		(typeof operationDefinitions)['relatedAccountTypesSchema']['input']
	>;
	listRelatedAccountTypes: z.infer<
		(typeof operationDefinitions)['listRelatedAccountTypes']['input']
	>;
	createRelatedAccountType: z.infer<
		(typeof operationDefinitions)['createRelatedAccountType']['input']
	>;
	retrieveRelatedAccountType: z.infer<
		(typeof operationDefinitions)['retrieveRelatedAccountType']['input']
	>;
	updateRelatedAccountType: z.infer<
		(typeof operationDefinitions)['updateRelatedAccountType']['input']
	>;
	deleteRelatedAccountType: z.infer<
		(typeof operationDefinitions)['deleteRelatedAccountType']['input']
	>;
	getResources: z.infer<(typeof operationDefinitions)['getResources']['input']>;
	rolesSchema: z.infer<(typeof operationDefinitions)['rolesSchema']['input']>;
	listRoles: z.infer<(typeof operationDefinitions)['listRoles']['input']>;
	getRole: z.infer<(typeof operationDefinitions)['getRole']['input']>;
	listRolesOfUser: z.infer<
		(typeof operationDefinitions)['listRolesOfUser']['input']
	>;
	addRolesInUser: z.infer<
		(typeof operationDefinitions)['addRolesInUser']['input']
	>;
	deleteRolesInUser: z.infer<
		(typeof operationDefinitions)['deleteRolesInUser']['input']
	>;
	listUsersInRole: z.infer<
		(typeof operationDefinitions)['listUsersInRole']['input']
	>;
	salesSchema: z.infer<(typeof operationDefinitions)['salesSchema']['input']>;
	listSales: z.infer<(typeof operationDefinitions)['listSales']['input']>;
	createSale: z.infer<(typeof operationDefinitions)['createSale']['input']>;
	getSale: z.infer<(typeof operationDefinitions)['getSale']['input']>;
	updateSale: z.infer<(typeof operationDefinitions)['updateSale']['input']>;
	deleteSale: z.infer<(typeof operationDefinitions)['deleteSale']['input']>;
	listTimezones: z.infer<
		(typeof operationDefinitions)['listTimezones']['input']
	>;
	usersSchema: z.infer<(typeof operationDefinitions)['usersSchema']['input']>;
	listUsers: z.infer<(typeof operationDefinitions)['listUsers']['input']>;
	createUser: z.infer<(typeof operationDefinitions)['createUser']['input']>;
	getUser: z.infer<(typeof operationDefinitions)['getUser']['input']>;
	updateUser: z.infer<(typeof operationDefinitions)['updateUser']['input']>;
	deleteUser: z.infer<(typeof operationDefinitions)['deleteUser']['input']>;
	listUserHierarchy: z.infer<
		(typeof operationDefinitions)['listUserHierarchy']['input']
	>;
	listUsersScores: z.infer<
		(typeof operationDefinitions)['listUsersScores']['input']
	>;
	userTypesSchema: z.infer<
		(typeof operationDefinitions)['userTypesSchema']['input']
	>;
	listUserTypes: z.infer<
		(typeof operationDefinitions)['listUserTypes']['input']
	>;
	createUserType: z.infer<
		(typeof operationDefinitions)['createUserType']['input']
	>;
	getUserType: z.infer<(typeof operationDefinitions)['getUserType']['input']>;
	updateUserType: z.infer<
		(typeof operationDefinitions)['updateUserType']['input']
	>;
	listLists: z.infer<(typeof operationDefinitions)['listLists']['input']>;
	createList: z.infer<(typeof operationDefinitions)['createList']['input']>;
	updateList: z.infer<(typeof operationDefinitions)['updateList']['input']>;
	deleteList: z.infer<(typeof operationDefinitions)['deleteList']['input']>;
	listValues: z.infer<(typeof operationDefinitions)['listValues']['input']>;
	createValue: z.infer<(typeof operationDefinitions)['createValue']['input']>;
	valuesListSchema: z.infer<
		(typeof operationDefinitions)['valuesListSchema']['input']
	>;
	getValue: z.infer<(typeof operationDefinitions)['getValue']['input']>;
	updateValue: z.infer<(typeof operationDefinitions)['updateValue']['input']>;
	deleteValue: z.infer<(typeof operationDefinitions)['deleteValue']['input']>;
	listWarningsOfAResource: z.infer<
		(typeof operationDefinitions)['listWarningsOfAResource']['input']
	>;
	createWarningForAResourceCopy: z.infer<
		(typeof operationDefinitions)['createWarningForAResourceCopy']['input']
	>;
	updateWarningOfAResource: z.infer<
		(typeof operationDefinitions)['updateWarningOfAResource']['input']
	>;
	deleteWarningOfAResource: z.infer<
		(typeof operationDefinitions)['deleteWarningOfAResource']['input']
	>;
};

/**
 * The type of a parsed response. It mirrors `toResponseSchema` in runtime.ts, which checks responses
 * more loosely than the OpenAPI-derived schemas: every known field may be missing or null, a scalar
 * field may hold any JSON scalar (ForceManager sends numbers and booleans where its examples show
 * strings), and unknown fields pass through.
 */
export type ForceManagerResponse<T> = T extends string | number | boolean
	? string | number | boolean
	: T extends readonly (infer E)[]
		? ForceManagerResponse<E>[]
		: T extends object
			? { [K in keyof T]?: ForceManagerResponse<T[K]> | null } & {
					[key: string]: unknown;
				}
			: T;

export type ForceManagerEndpointOutputs = {
	accountAddressesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['accountAddressesSchema']['output']>
	>;
	listAccountAddresses: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listAccountAddresses']['output']>
	>;
	createAccountAddress: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createAccountAddress']['output']>
	>;
	getAccountAddress: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getAccountAddress']['output']>
	>;
	updateAccountAddress: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateAccountAddress']['output']>
	>;
	deleteAccountAddress: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteAccountAddress']['output']>
	>;
	accountsSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['accountsSchema']['output']>
	>;
	listAccounts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listAccounts']['output']>
	>;
	createAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createAccount']['output']>
	>;
	getAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getAccount']['output']>
	>;
	updateAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateAccount']['output']>
	>;
	deleteAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteAccount']['output']>
	>;
	accountTypesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['accountTypesSchema']['output']>
	>;
	listAccountTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listAccountTypes']['output']>
	>;
	createAccountType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createAccountType']['output']>
	>;
	getAccountType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getAccountType']['output']>
	>;
	updateAccountType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateAccountType']['output']>
	>;
	deleteAccountType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteAccountType']['output']>
	>;
	accountSegmentsSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['accountSegmentsSchema']['output']>
	>;
	listAccountSegments: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listAccountSegments']['output']>
	>;
	createAccountSegment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createAccountSegment']['output']>
	>;
	getAccountSegment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getAccountSegment']['output']>
	>;
	updateAccountSegment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateAccountSegment']['output']>
	>;
	deleteAccountSegment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteAccountSegment']['output']>
	>;
	accountStatusesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['accountStatusesSchema']['output']>
	>;
	listAccountStatuses: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listAccountStatuses']['output']>
	>;
	createAccountStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createAccountStatus']['output']>
	>;
	getAccountStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getAccountStatus']['output']>
	>;
	updateAccountStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateAccountStatus']['output']>
	>;
	deleteAccountStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteAccountStatus']['output']>
	>;
	activitiesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['activitiesSchema']['output']>
	>;
	listActivities: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listActivities']['output']>
	>;
	createActivity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createActivity']['output']>
	>;
	getActivity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getActivity']['output']>
	>;
	updateActivity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateActivity']['output']>
	>;
	deleteActivity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteActivity']['output']>
	>;
	activityTypesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['activityTypesSchema']['output']>
	>;
	listActivityTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listActivityTypes']['output']>
	>;
	createActivityType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createActivityType']['output']>
	>;
	getActivityType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getActivityType']['output']>
	>;
	updateActivityType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateActivityType']['output']>
	>;
	deleteActivityType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteActivityType']['output']>
	>;
	listActivityPoints: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listActivityPoints']['output']>
	>;
	updateActivityPoints: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateActivityPoints']['output']>
	>;
	branchesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['branchesSchema']['output']>
	>;
	listBranches: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listBranches']['output']>
	>;
	getBranch: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getBranch']['output']>
	>;
	deleteBranch: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteBranch']['output']>
	>;
	bulkCreateResources: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['bulkCreateResources']['output']>
	>;
	bulkUpdateResources: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['bulkUpdateResources']['output']>
	>;
	bulkDeleteResources: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['bulkDeleteResources']['output']>
	>;
	listCalls: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCalls']['output']>
	>;
	createCallByUserId: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createCallByUserId']['output']>
	>;
	createCallByUserPhoneNumber: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['createCallByUserPhoneNumber']['output']
		>
	>;
	getCall: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getCall']['output']>
	>;
	updateCall: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateCall']['output']>
	>;
	deleteCall: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteCall']['output']>
	>;
	getResourcesByPhoneNumber: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['getResourcesByPhoneNumber']['output']
		>
	>;
	listCampaigns: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCampaigns']['output']>
	>;
	createCampaign: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createCampaign']['output']>
	>;
	getCampaign: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getCampaign']['output']>
	>;
	updateCampaign: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateCampaign']['output']>
	>;
	deleteCampaign: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteCampaign']['output']>
	>;
	listOpportunityTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listOpportunityTypes']['output']>
	>;
	createOpportunityType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createOpportunityType']['output']>
	>;
	listCampaignStatuses: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCampaignStatuses']['output']>
	>;
	listCampaignAccounts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCampaignAccounts']['output']>
	>;
	createCampaignAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createCampaignAccount']['output']>
	>;
	getCampaignAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getCampaignAccount']['output']>
	>;
	updateCampaignAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateCampaignAccount']['output']>
	>;
	deleteCampaignAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteCampaignAccount']['output']>
	>;
	listCampaignQuestions: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCampaignQuestions']['output']>
	>;
	createCampaignQuestion: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createCampaignQuestion']['output']>
	>;
	getCampaignQuestion: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getCampaignQuestion']['output']>
	>;
	updateCampaignQuestion: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateCampaignQuestion']['output']>
	>;
	deleteCampaignQuestion: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteCampaignQuestion']['output']>
	>;
	listQuestionAnswers: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listQuestionAnswers']['output']>
	>;
	createQuestionAnswer: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createQuestionAnswer']['output']>
	>;
	getQuestionAnswer: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getQuestionAnswer']['output']>
	>;
	updateQuestionAnswer: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateQuestionAnswer']['output']>
	>;
	deleteQuestionAnswer: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteQuestionAnswer']['output']>
	>;
	listQuestionValues: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listQuestionValues']['output']>
	>;
	createQuestionValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createQuestionValue']['output']>
	>;
	getQuestionValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getQuestionValue']['output']>
	>;
	updateQuestionValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateQuestionValue']['output']>
	>;
	deleteQuestionValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteQuestionValue']['output']>
	>;
	contactsSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['contactsSchema']['output']>
	>;
	listContacts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listContacts']['output']>
	>;
	createContact: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createContact']['output']>
	>;
	getContact: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getContact']['output']>
	>;
	updateContact: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateContact']['output']>
	>;
	deleteContact: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteContact']['output']>
	>;
	contactTypesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['contactTypesSchema']['output']>
	>;
	listContactTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listContactTypes']['output']>
	>;
	createContactType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createContactType']['output']>
	>;
	getContactType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getContactType']['output']>
	>;
	updateContactType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateContactType']['output']>
	>;
	deleteContactType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteContactType']['output']>
	>;
	countriesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['countriesSchema']['output']>
	>;
	listCountries: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCountries']['output']>
	>;
	currenciesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['currenciesSchema']['output']>
	>;
	listCurrencies: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCurrencies']['output']>
	>;
	listDocuments: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listDocuments']['output']>
	>;
	listDocumentsOfAResource: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listDocumentsOfAResource']['output']>
	>;
	deletePicture: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deletePicture']['output']>
	>;
	listFolders: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listFolders']['output']>
	>;
	createFolder: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createFolder']['output']>
	>;
	listFoldersOfAResource: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listFoldersOfAResource']['output']>
	>;
	createFolderForAResource: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createFolderForAResource']['output']>
	>;
	emailsSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['emailsSchema']['output']>
	>;
	listEmails: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listEmails']['output']>
	>;
	createEmail: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createEmail']['output']>
	>;
	getEmail: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getEmail']['output']>
	>;
	entityContactsSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['entityContactsSchema']['output']>
	>;
	listEntityContacts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listEntityContacts']['output']>
	>;
	entityOwnersSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['entityOwnersSchema']['output']>
	>;
	listEntityOwners: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listEntityOwners']['output']>
	>;
	calendarSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['calendarSchema']['output']>
	>;
	listCalendar: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listCalendar']['output']>
	>;
	createCalendar: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createCalendar']['output']>
	>;
	getCalendar: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getCalendar']['output']>
	>;
	updateCalendar: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateCalendar']['output']>
	>;
	deleteCalendar: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteCalendar']['output']>
	>;
	extraFieldsSchemaByResource: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['extraFieldsSchemaByResource']['output']
		>
	>;
	listExtraFieldsByResource: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['listExtraFieldsByResource']['output']
		>
	>;
	createExtraFieldForResource: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['createExtraFieldForResource']['output']
		>
	>;
	listTabs: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listTabs']['output']>
	>;
	createTabs: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createTabs']['output']>
	>;
	getTabs: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getTabs']['output']>
	>;
	updateTabs: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateTabs']['output']>
	>;
	deleteTabs: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteTabs']['output']>
	>;
	getForm: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getForm']['output']>
	>;
	getFormState: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getFormState']['output']>
	>;
	getFormTemplate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getFormTemplate']['output']>
	>;
	listNews: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listNews']['output']>
	>;
	opportunitiesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['opportunitiesSchema']['output']>
	>;
	listOpportunities: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listOpportunities']['output']>
	>;
	createOpportunity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createOpportunity']['output']>
	>;
	getOpportunity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getOpportunity']['output']>
	>;
	updateOpportunity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateOpportunity']['output']>
	>;
	deleteOpportunity: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteOpportunity']['output']>
	>;
	opportunityTypesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['opportunityTypesSchema']['output']>
	>;
	getOpportunityTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getOpportunityTypes']['output']>
	>;
	updateOpportunityType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateOpportunityType']['output']>
	>;
	deleteOpportunityType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteOpportunityType']['output']>
	>;
	opportunityStatusesSchema: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['opportunityStatusesSchema']['output']
		>
	>;
	listOpportunityStatuses: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listOpportunityStatuses']['output']>
	>;
	createOpportunityStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createOpportunityStatus']['output']>
	>;
	getOpportunityStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getOpportunityStatus']['output']>
	>;
	updateOpportunityStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateOpportunityStatus']['output']>
	>;
	deleteOpportunityStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteOpportunityStatus']['output']>
	>;
	orderHeadersSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['orderHeadersSchema']['output']>
	>;
	listOrderHeaders: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listOrderHeaders']['output']>
	>;
	createOrderHeader: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createOrderHeader']['output']>
	>;
	getOrderHeader: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getOrderHeader']['output']>
	>;
	updateOrderHeader: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateOrderHeader']['output']>
	>;
	deleteOrderHeader: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteOrderHeader']['output']>
	>;
	orderLinesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['orderLinesSchema']['output']>
	>;
	listOrderLines: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listOrderLines']['output']>
	>;
	createOrderLine: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createOrderLine']['output']>
	>;
	getOrderLine: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getOrderLine']['output']>
	>;
	updateOrderLine: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateOrderLine']['output']>
	>;
	deleteOrderLine: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteOrderLine']['output']>
	>;
	orderStatusesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['orderStatusesSchema']['output']>
	>;
	listOrderStatuses: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listOrderStatuses']['output']>
	>;
	createOrderStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createOrderStatus']['output']>
	>;
	getOrderStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getOrderStatus']['output']>
	>;
	updateOrderStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateOrderStatus']['output']>
	>;
	deleteOrderStatus: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteOrderStatus']['output']>
	>;
	orderTypesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['orderTypesSchema']['output']>
	>;
	listOrderTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listOrderTypes']['output']>
	>;
	createOrderTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createOrderTypes']['output']>
	>;
	getOrderTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getOrderTypes']['output']>
	>;
	updateOrderTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateOrderTypes']['output']>
	>;
	deleteOrderTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteOrderTypes']['output']>
	>;
	productsSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['productsSchema']['output']>
	>;
	listProducts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listProducts']['output']>
	>;
	createProduct: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createProduct']['output']>
	>;
	getProduct: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getProduct']['output']>
	>;
	updateProduct: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateProduct']['output']>
	>;
	deleteProduct: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteProduct']['output']>
	>;
	bulkCreateProducts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['bulkCreateProducts']['output']>
	>;
	bulkUpdateProducts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['bulkUpdateProducts']['output']>
	>;
	bulkDeleteProducts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['bulkDeleteProducts']['output']>
	>;
	productFamiliesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['productFamiliesSchema']['output']>
	>;
	listProductFamilies: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listProductFamilies']['output']>
	>;
	createProductFamily: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createProductFamily']['output']>
	>;
	getProductFamily: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getProductFamily']['output']>
	>;
	updateProductFamily: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateProductFamily']['output']>
	>;
	productUnitsOfMeasureSchema: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['productUnitsOfMeasureSchema']['output']
		>
	>;
	listProductUnitsOfMeasure: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['listProductUnitsOfMeasure']['output']
		>
	>;
	createProductUnitOfMeasure: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['createProductUnitOfMeasure']['output']
		>
	>;
	getProductUnitOfMeasure: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getProductUnitOfMeasure']['output']>
	>;
	updateProductUnitOfMeasure: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['updateProductUnitOfMeasure']['output']
		>
	>;
	deleteProductUnitOfMeasure: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['deleteProductUnitOfMeasure']['output']
		>
	>;
	unitsOfMeasureSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['unitsOfMeasureSchema']['output']>
	>;
	listUnitsOfMeasure: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listUnitsOfMeasure']['output']>
	>;
	createUnitOfMeasure: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createUnitOfMeasure']['output']>
	>;
	getUnitOfMeasure: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getUnitOfMeasure']['output']>
	>;
	updateUnitOfMeasure: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateUnitOfMeasure']['output']>
	>;
	deleteUnitOfMeasure: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteUnitOfMeasure']['output']>
	>;
	taxRatesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['taxRatesSchema']['output']>
	>;
	listTaxRates: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listTaxRates']['output']>
	>;
	createTaxRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createTaxRate']['output']>
	>;
	getTaxRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getTaxRate']['output']>
	>;
	updateTaxRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateTaxRate']['output']>
	>;
	deleteTaxRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteTaxRate']['output']>
	>;
	taxProfilesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['taxProfilesSchema']['output']>
	>;
	listTaxProfiles: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listTaxProfiles']['output']>
	>;
	getTaxProfile: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getTaxProfile']['output']>
	>;
	productFamiliesBranchesSchema: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['productFamiliesBranchesSchema']['output']
		>
	>;
	listProductFamiliesBranches: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['listProductFamiliesBranches']['output']
		>
	>;
	createProductFamiliesBranch: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['createProductFamiliesBranch']['output']
		>
	>;
	getProductFamiliesBranch: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getProductFamiliesBranch']['output']>
	>;
	updateProductFamiliesBranch: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['updateProductFamiliesBranch']['output']
		>
	>;
	deleteProductFamiliesBranch: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['deleteProductFamiliesBranch']['output']
		>
	>;
	productEnvironmentsSchema: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['productEnvironmentsSchema']['output']
		>
	>;
	listProductEnvironments: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listProductEnvironments']['output']>
	>;
	createProductEnvironment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createProductEnvironment']['output']>
	>;
	getProductEnvironment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getProductEnvironment']['output']>
	>;
	updateProductEnvironment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateProductEnvironment']['output']>
	>;
	deleteProductEnvironment: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteProductEnvironment']['output']>
	>;
	productCategoriesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['productCategoriesSchema']['output']>
	>;
	listProductCategories: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listProductCategories']['output']>
	>;
	createProductCategory: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createProductCategory']['output']>
	>;
	getProductCategory: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getProductCategory']['output']>
	>;
	updateProductCategory: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateProductCategory']['output']>
	>;
	deleteProductCategory: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteProductCategory']['output']>
	>;
	productRatesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['productRatesSchema']['output']>
	>;
	listProductRates: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listProductRates']['output']>
	>;
	createProductRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createProductRate']['output']>
	>;
	getProductRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getProductRate']['output']>
	>;
	updateProductRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateProductRate']['output']>
	>;
	deleteProductRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteProductRate']['output']>
	>;
	ratesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['ratesSchema']['output']>
	>;
	listRates: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listRates']['output']>
	>;
	createRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createRate']['output']>
	>;
	getRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getRate']['output']>
	>;
	updateRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateRate']['output']>
	>;
	deleteRate: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteRate']['output']>
	>;
	relatedAccountsSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['relatedAccountsSchema']['output']>
	>;
	listRelatedAccounts: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listRelatedAccounts']['output']>
	>;
	createRelatedAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createRelatedAccount']['output']>
	>;
	retrieveRelatedAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['retrieveRelatedAccount']['output']>
	>;
	updateRelatedAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateRelatedAccount']['output']>
	>;
	deleteRelatedAccount: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteRelatedAccount']['output']>
	>;
	relatedAccountTypesSchema: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['relatedAccountTypesSchema']['output']
		>
	>;
	listRelatedAccountTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listRelatedAccountTypes']['output']>
	>;
	createRelatedAccountType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createRelatedAccountType']['output']>
	>;
	retrieveRelatedAccountType: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['retrieveRelatedAccountType']['output']
		>
	>;
	updateRelatedAccountType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateRelatedAccountType']['output']>
	>;
	deleteRelatedAccountType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteRelatedAccountType']['output']>
	>;
	getResources: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getResources']['output']>
	>;
	rolesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['rolesSchema']['output']>
	>;
	listRoles: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listRoles']['output']>
	>;
	getRole: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getRole']['output']>
	>;
	listRolesOfUser: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listRolesOfUser']['output']>
	>;
	addRolesInUser: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['addRolesInUser']['output']>
	>;
	deleteRolesInUser: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteRolesInUser']['output']>
	>;
	listUsersInRole: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listUsersInRole']['output']>
	>;
	salesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['salesSchema']['output']>
	>;
	listSales: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listSales']['output']>
	>;
	createSale: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createSale']['output']>
	>;
	getSale: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getSale']['output']>
	>;
	updateSale: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateSale']['output']>
	>;
	deleteSale: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteSale']['output']>
	>;
	listTimezones: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listTimezones']['output']>
	>;
	usersSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['usersSchema']['output']>
	>;
	listUsers: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listUsers']['output']>
	>;
	createUser: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createUser']['output']>
	>;
	getUser: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getUser']['output']>
	>;
	updateUser: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateUser']['output']>
	>;
	deleteUser: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteUser']['output']>
	>;
	listUserHierarchy: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listUserHierarchy']['output']>
	>;
	listUsersScores: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listUsersScores']['output']>
	>;
	userTypesSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['userTypesSchema']['output']>
	>;
	listUserTypes: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listUserTypes']['output']>
	>;
	createUserType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createUserType']['output']>
	>;
	getUserType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getUserType']['output']>
	>;
	updateUserType: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateUserType']['output']>
	>;
	listLists: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listLists']['output']>
	>;
	createList: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createList']['output']>
	>;
	updateList: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateList']['output']>
	>;
	deleteList: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteList']['output']>
	>;
	listValues: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listValues']['output']>
	>;
	createValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['createValue']['output']>
	>;
	valuesListSchema: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['valuesListSchema']['output']>
	>;
	getValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['getValue']['output']>
	>;
	updateValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateValue']['output']>
	>;
	deleteValue: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteValue']['output']>
	>;
	listWarningsOfAResource: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['listWarningsOfAResource']['output']>
	>;
	createWarningForAResourceCopy: ForceManagerResponse<
		z.infer<
			(typeof operationDefinitions)['createWarningForAResourceCopy']['output']
		>
	>;
	updateWarningOfAResource: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['updateWarningOfAResource']['output']>
	>;
	deleteWarningOfAResource: ForceManagerResponse<
		z.infer<(typeof operationDefinitions)['deleteWarningOfAResource']['output']>
	>;
};
