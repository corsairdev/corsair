import { getAccount, listAccounts } from './accounts';
import {
	getBuy,
	getExchangeRates,
	getSell,
	getSpot,
	getTime,
	listCurrencies,
} from './data';
import { listPaymentMethods } from './payment-methods';
import { getTransaction, listTransactions } from './transactions';
import { getUser } from './user';

export const Prices = {
	getSpot,
	getBuy,
	getSell,
};

export const Data = {
	getExchangeRates,
	listCurrencies,
	getTime,
};

export const User = {
	get: getUser,
};

export const Accounts = {
	list: listAccounts,
	get: getAccount,
};

export const Transactions = {
	list: listTransactions,
	get: getTransaction,
};

export const PaymentMethods = {
	list: listPaymentMethods,
};

export * from './types';
