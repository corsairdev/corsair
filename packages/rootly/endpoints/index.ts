import {
	actionItemsDelete,
	actionItemsGet,
	actionItemsList,
	incidentsDelete,
	incidentsGet,
	incidentsUpdate,
} from './rootly';

export const ActionItems = {
	list: actionItemsList,
	get: actionItemsGet,
	delete: actionItemsDelete,
};

export const Incidents = {
	get: incidentsGet,
	update: incidentsUpdate,
	delete: incidentsDelete,
};

export * from './types';
