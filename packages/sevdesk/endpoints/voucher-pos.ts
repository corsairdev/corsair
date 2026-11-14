import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const VoucherPos = {
	getVoucherPositions: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['voucherPos.getVoucherPositions'],
		SevdeskEndpointOutputSchemas['voucherPos.getVoucherPositions'],
		'voucherPos.getVoucherPositions',
		'GET',
		'/VoucherPos',
	),
} as const;
