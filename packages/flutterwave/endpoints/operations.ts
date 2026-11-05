import type { FlutterwaveEndpoint } from './factory';
import { executeFlutterwaveOperation, getRoute } from './factory';

function createOperation(routeKey: string): FlutterwaveEndpoint {
	const route = getRoute(routeKey);
	return async (ctx, input = {}) => {
		return executeFlutterwaveOperation(ctx, input, route);
	};
}

export const flutterwaveOperations = {
	cancelPaymentPlan: createOperation('cancelPaymentPlan'),
	createBeneficiary: createOperation('createBeneficiary'),
	createBulkTokenizedCharge: createOperation('createBulkTokenizedCharge'),
	createBulkVirtualAccountNumbers: createOperation(
		'createBulkVirtualAccountNumbers',
	),
	createPaymentLink: createOperation('createPaymentLink'),
	createPaymentPlan: createOperation('createPaymentPlan'),
	createRefund: createOperation('createRefund'),
	createSubaccount: createOperation('createSubaccount'),
	createVirtualAccount: createOperation('createVirtualAccount'),
	deleteBeneficiary: createOperation('deleteBeneficiary'),
	deleteSubaccount: createOperation('deleteSubaccount'),
	disablePaymentLink: createOperation('disablePaymentLink'),
	fetchBeneficiary: createOperation('fetchBeneficiary'),
	fetchSubaccount: createOperation('fetchSubaccount'),
	generateTransactionReference: createOperation('generateTransactionReference'),
	getAllSubscriptions: createOperation('getAllSubscriptions'),
	getAllWalletBalances: createOperation('getAllWalletBalances'),
	getBalancesPerCurrency: createOperation('getBalancesPerCurrency'),
	getBankBranches: createOperation('getBankBranches'),
	getBanksByCountry: createOperation('getBanksByCountry'),
	getBillCategories: createOperation('getBillCategories'),
	getBulkTokenizedCharge: createOperation('getBulkTokenizedCharge'),
	getBulkVirtualAccount: createOperation('getBulkVirtualAccount'),
	getMultipleRefundTransactions: createOperation(
		'getMultipleRefundTransactions',
	),
	getPaymentPlan: createOperation('getPaymentPlan'),
	getPaymentPlans: createOperation('getPaymentPlans'),
	getRefund: createOperation('getRefund'),
	getTransaction: createOperation('getTransaction'),
	getTransactionFee: createOperation('getTransactionFee'),
	getTransferFee: createOperation('getTransferFee'),
	getTransferRates: createOperation('getTransferRates'),
	getVirtualAccountNumber: createOperation('getVirtualAccountNumber'),
	getWalletStatement: createOperation('getWalletStatement'),
	initiateBvnVerification: createOperation('initiateBvnVerification'),
	initiateMobileMoneyTanzania: createOperation('initiateMobileMoneyTanzania'),
	listAllBeneficiaries: createOperation('listAllBeneficiaries'),
	listSubaccounts: createOperation('listSubaccounts'),
	listBillerProducts: createOperation('listBillerProducts'),
	listBillers: createOperation('listBillers'),
	listChargebacks: createOperation('listChargebacks'),
	listPayoutSubaccountRefunds: createOperation('listPayoutSubaccountRefunds'),
	listPayoutSubaccounts: createOperation('listPayoutSubaccounts'),
	listRecurringBills: createOperation('listRecurringBills'),
	listTransfers: createOperation('listTransfers'),
	listSettlements: createOperation('listSettlements'),
	resolveBankAccount: createOperation('resolveBankAccount'),
	resolveCardBin: createOperation('resolveCardBin'),
	getAllTransactions: createOperation('getAllTransactions'),
	updatePaymentPlan: createOperation('updatePaymentPlan'),
	updateSubaccount: createOperation('updateSubaccount'),
	validateBillItem: createOperation('validateBillItem'),
	verifyTransactionByReference: createOperation('verifyTransactionByReference'),
	viewTransactionTimeline: createOperation('viewTransactionTimeline'),
} as const;
