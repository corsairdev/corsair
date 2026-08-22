import {
	batchCompleted as bannerBatchCompleted,
	created as bannerCreated,
} from './banners';
import { statusChanged as designStatusChanged } from './designs';
import { completed as exportCompleted } from './exports';

export const BannerWebhooks = {
	created: bannerCreated,
	batchCompleted: bannerBatchCompleted,
};

export const DesignWebhooks = {
	statusChanged: designStatusChanged,
};

export const ExportWebhooks = {
	completed: exportCompleted,
};

export * from './types';
