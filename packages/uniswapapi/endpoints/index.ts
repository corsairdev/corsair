import { check as approvalCheck } from './approval';
import { check as delegationCheck } from './delegation';
import { getStatus as orderGetStatus } from './order';
import { get as quoteGet } from './quote';
import { create as swapCreate, getStatus as swapGetStatus } from './swap';
import { get as swappableTokensGet } from './swappable-tokens';
import { encode7702 as transactionEncode7702 } from './transaction';

export const Approval = {
	check: approvalCheck,
};

export const Quote = {
	get: quoteGet,
};

export const Swap = {
	create: swapCreate,
	getStatus: swapGetStatus,
};

export const Order = {
	getStatus: orderGetStatus,
};

export const Delegation = {
	check: delegationCheck,
};

export const Transaction = {
	encode7702: transactionEncode7702,
};

export const SwappableTokens = {
	get: swappableTokensGet,
};

export * from './types';
