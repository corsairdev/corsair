import { emailStatus, spamBlock } from './handlers';

export const UnioneInboundWebhooks = {
	emailStatus,
	spamBlock,
};

export * from './tenant-matcher';
export * from './types';
