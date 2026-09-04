import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { flutterwaveOperations } from './operations';
import { flutterwaveRoutes } from './routes';
import {
	FlutterwaveEndpointInputSchemas,
	FlutterwaveEndpointOutputSchemas,
} from './types';

export const flutterwaveEndpointsNested = {
	beneficiaries: {
		create: flutterwaveOperations.createBeneficiary,
		list: flutterwaveOperations.listAllBeneficiaries,
		get: flutterwaveOperations.fetchBeneficiary,
		delete: flutterwaveOperations.deleteBeneficiary,
	},
	bulkTokenizedCharges: {
		create: flutterwaveOperations.createBulkTokenizedCharge,
		get: flutterwaveOperations.getBulkTokenizedCharge,
	},
	bulkVirtualAccounts: {
		create: flutterwaveOperations.createBulkVirtualAccountNumbers,
		get: flutterwaveOperations.getBulkVirtualAccount,
	},
	paymentLinks: {
		create: flutterwaveOperations.createPaymentLink,
		disable: flutterwaveOperations.disablePaymentLink,
	},
	paymentPlans: {
		create: flutterwaveOperations.createPaymentPlan,
		list: flutterwaveOperations.getPaymentPlans,
		get: flutterwaveOperations.getPaymentPlan,
		update: flutterwaveOperations.updatePaymentPlan,
		cancel: flutterwaveOperations.cancelPaymentPlan,
	},
	refunds: {
		create: flutterwaveOperations.createRefund,
		get: flutterwaveOperations.getRefund,
		list: flutterwaveOperations.getMultipleRefundTransactions,
	},
	subaccounts: {
		create: flutterwaveOperations.createSubaccount,
		list: flutterwaveOperations.listSubaccounts,
		get: flutterwaveOperations.fetchSubaccount,
		update: flutterwaveOperations.updateSubaccount,
		delete: flutterwaveOperations.deleteSubaccount,
	},
	virtualAccounts: {
		create: flutterwaveOperations.createVirtualAccount,
		get: flutterwaveOperations.getVirtualAccountNumber,
	},
	transactions: {
		generateReference: flutterwaveOperations.generateTransactionReference,
		list: flutterwaveOperations.getAllTransactions,
		get: flutterwaveOperations.getTransaction,
		verifyByReference: flutterwaveOperations.verifyTransactionByReference,
		viewTimeline: flutterwaveOperations.viewTransactionTimeline,
		getFee: flutterwaveOperations.getTransactionFee,
	},
	subscriptions: {
		list: flutterwaveOperations.getAllSubscriptions,
	},
	wallets: {
		listBalances: flutterwaveOperations.getAllWalletBalances,
		getBalanceByCurrency: flutterwaveOperations.getBalancesPerCurrency,
		getStatement: flutterwaveOperations.getWalletStatement,
	},
	banks: {
		getBranches: flutterwaveOperations.getBankBranches,
		getByCountry: flutterwaveOperations.getBanksByCountry,
		resolveAccount: flutterwaveOperations.resolveBankAccount,
	},
	bills: {
		getCategories: flutterwaveOperations.getBillCategories,
		listBillers: flutterwaveOperations.listBillers,
		listProducts: flutterwaveOperations.listBillerProducts,
		validateItem: flutterwaveOperations.validateBillItem,
		listRecurring: flutterwaveOperations.listRecurringBills,
	},
	transfers: {
		list: flutterwaveOperations.listTransfers,
		getFee: flutterwaveOperations.getTransferFee,
		getRates: flutterwaveOperations.getTransferRates,
	},
	verification: {
		initiateBvn: flutterwaveOperations.initiateBvnVerification,
	},
	charges: {
		initiateMobileMoneyTanzania:
			flutterwaveOperations.initiateMobileMoneyTanzania,
	},
	payoutSubaccounts: {
		list: flutterwaveOperations.listPayoutSubaccounts,
		listRefunds: flutterwaveOperations.listPayoutSubaccountRefunds,
	},
	settlements: {
		list: flutterwaveOperations.listSettlements,
	},
	chargebacks: {
		list: flutterwaveOperations.listChargebacks,
	},
	cards: {
		resolveBin: flutterwaveOperations.resolveCardBin,
	},
} as const;

export const flutterwaveEndpointMeta = Object.fromEntries(
	flutterwaveRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof flutterwaveEndpointsNested>;

export const flutterwaveEndpointSchemas = Object.fromEntries(
	flutterwaveRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: FlutterwaveEndpointInputSchemas[route.key],
			output: FlutterwaveEndpointOutputSchemas[route.key],
		},
	]),
);

export { flutterwaveRoutes };
export * from './types';
