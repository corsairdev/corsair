import { billing as accountBilling } from './account';
import { upload as filesUpload } from './files';
import {
	estimateCost as modelsEstimateCost,
	pricing as modelsPricing,
	run as modelsRun,
	search as modelsSearch,
} from './models';
import {
	cancel as queueCancel,
	result as queueResult,
	status as queueStatus,
	submit as queueSubmit,
} from './queue';
import {
	deletePayloads as requestsDeletePayloads,
	list as requestsList,
} from './requests';
import { billingEvents as usageBillingEvents, get as usageGet } from './usage';

export const Queue = {
	submit: queueSubmit,
	status: queueStatus,
	result: queueResult,
	cancel: queueCancel,
};

export const Models = {
	run: modelsRun,
	search: modelsSearch,
	pricing: modelsPricing,
	estimateCost: modelsEstimateCost,
};

export const Requests = {
	list: requestsList,
	deletePayloads: requestsDeletePayloads,
};

export const Usage = {
	get: usageGet,
	billingEvents: usageBillingEvents,
};

export const Account = {
	billing: accountBilling,
};

export const Files = {
	upload: filesUpload,
};

export * from './types';
