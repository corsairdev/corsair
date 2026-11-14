import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Voucher = {
	voucherFactorySaveVoucher: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.voucherFactorySaveVoucher'],
		SevdeskEndpointOutputSchemas['voucher.voucherFactorySaveVoucher'],
		'voucher.voucherFactorySaveVoucher',
		'POST',
		'/Voucher/Factory/saveVoucher',
	),
	getVouchers: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.getVouchers'],
		SevdeskEndpointOutputSchemas['voucher.getVouchers'],
		'voucher.getVouchers',
		'GET',
		'/Voucher',
	),
	getVoucherById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.getVoucherById'],
		SevdeskEndpointOutputSchemas['voucher.getVoucherById'],
		'voucher.getVoucherById',
		'GET',
		'/Voucher/{voucherId}',
	),
	updateVoucher: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.updateVoucher'],
		SevdeskEndpointOutputSchemas['voucher.updateVoucher'],
		'voucher.updateVoucher',
		'PUT',
		'/Voucher/{voucherId}',
	),
	voucherEnshrine: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.voucherEnshrine'],
		SevdeskEndpointOutputSchemas['voucher.voucherEnshrine'],
		'voucher.voucherEnshrine',
		'PUT',
		'/Voucher/{voucherId}/enshrine',
	),
	bookVoucher: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.bookVoucher'],
		SevdeskEndpointOutputSchemas['voucher.bookVoucher'],
		'voucher.bookVoucher',
		'PUT',
		'/Voucher/{voucherId}/bookAmount',
	),
	voucherResetToOpen: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.voucherResetToOpen'],
		SevdeskEndpointOutputSchemas['voucher.voucherResetToOpen'],
		'voucher.voucherResetToOpen',
		'PUT',
		'/Voucher/{voucherId}/resetToOpen',
	),
	voucherResetToDraft: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.voucherResetToDraft'],
		SevdeskEndpointOutputSchemas['voucher.voucherResetToDraft'],
		'voucher.voucherResetToDraft',
		'PUT',
		'/Voucher/{voucherId}/resetToDraft',
	),
	forAllAccounts: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.forAllAccounts'],
		SevdeskEndpointOutputSchemas['voucher.forAllAccounts'],
		'voucher.forAllAccounts',
		'GET',
		'/ReceiptGuidance/forAllAccounts',
	),
	forAccountNumber: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.forAccountNumber'],
		SevdeskEndpointOutputSchemas['voucher.forAccountNumber'],
		'voucher.forAccountNumber',
		'GET',
		'/ReceiptGuidance/forAccountNumber',
	),
	forTaxRule: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.forTaxRule'],
		SevdeskEndpointOutputSchemas['voucher.forTaxRule'],
		'voucher.forTaxRule',
		'GET',
		'/ReceiptGuidance/forTaxRule',
	),
	forRevenue: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.forRevenue'],
		SevdeskEndpointOutputSchemas['voucher.forRevenue'],
		'voucher.forRevenue',
		'GET',
		'/ReceiptGuidance/forRevenue',
	),
	forExpense: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucher.forExpense'],
		SevdeskEndpointOutputSchemas['voucher.forExpense'],
		'voucher.forExpense',
		'GET',
		'/ReceiptGuidance/forExpense',
	),
} as const;
