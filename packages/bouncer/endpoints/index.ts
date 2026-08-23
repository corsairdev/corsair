import * as AccountEndpoints from './account';
import * as EmailEndpoints from './email';
import * as ToxicityEndpoints from './toxicity';

export const Email = {
	verifyEmail: EmailEndpoints.verifyEmail,
	verifyDomain: EmailEndpoints.verifyDomain,
	createBatchRequest: EmailEndpoints.createBatchRequest,
	getBatchResults: EmailEndpoints.getBatchResults,
	finishBatch: EmailEndpoints.finishBatch,
	deleteBatchRequest: EmailEndpoints.deleteBatchRequest,
};

export const Toxicity = {
	createToxicityListJob: ToxicityEndpoints.createToxicityListJob,
	checkToxicityListJobStatus: ToxicityEndpoints.checkToxicityListJobStatus,
	deleteToxicityListJob: ToxicityEndpoints.deleteToxicityListJob,
};

export const Account = {
	getCredits: AccountEndpoints.getCredits,
};

export * from './account';
export * from './email';
export * from './toxicity';
export * from './types';
