import {
	createUploadUrl as filesCreateUploadUrl,
	upload as filesUpload,
} from './files';
import {
	estimate as generationsEstimate,
	run as generationsRun,
	submit as generationsSubmit,
} from './generations';
import { get as modelsGet, list as modelsList } from './models';
import {
	cancel as requestsCancel,
	deleteRequest as requestsDelete,
	status as requestsStatus,
} from './requests';
import { get as usageGet } from './usage';

export const Generations = {
	submit: generationsSubmit,
	run: generationsRun,
	estimate: generationsEstimate,
};

export const Requests = {
	status: requestsStatus,
	cancel: requestsCancel,
	delete: requestsDelete,
};

export const Files = {
	createUploadUrl: filesCreateUploadUrl,
	upload: filesUpload,
};

export const Models = {
	list: modelsList,
	get: modelsGet,
};

export const Usage = {
	get: usageGet,
};

export * from './types';
