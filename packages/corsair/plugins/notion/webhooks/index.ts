import {
	pageCreated,
	pageUpdated,
} from './database-pages';
import { verification } from './verification';

export const NotionWebhooks = {
	verification,
	pageCreated,
	pageUpdated,
};

export * from './types';
