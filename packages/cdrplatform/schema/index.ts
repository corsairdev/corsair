import {
	CdrPlatformCertificate,
	CdrPlatformPriceQuote,
	CdrPlatformRemovalRequest,
} from './database';

export const CdrPlatformSchema = {
	version: '1.0.0',
	entities: {
		certificates: CdrPlatformCertificate,
		removalRequests: CdrPlatformRemovalRequest,
		priceQuotes: CdrPlatformPriceQuote,
	},
} as const;

export {
	CdrPlatformCertificate,
	CdrPlatformPriceQuote,
	CdrPlatformRemovalRequest,
} from './database';
