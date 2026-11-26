import * as Batch from './batch';
import * as Conditions from './conditions';
import * as Correspondence from './correspondence';
import * as EventTypes from './event-types';
import * as Recipients from './recipients';
import * as SearchFilters from './search-filters';
import * as Templates from './templates';
import * as TransactionTypes from './transaction-types';

export const CorrespondenceEndpoints = {
	send: Correspondence.send,
	deliver: Correspondence.deliver,
	status: Correspondence.status,
	retry: Correspondence.retry,
	search: Correspondence.search,
};

export const BatchEndpoints = {
	send: Batch.send,
	status: Batch.status,
};

export const TransactionTypesEndpoints = {
	list: TransactionTypes.list,
	get: TransactionTypes.get,
	create: TransactionTypes.create,
	update: TransactionTypes.update,
	delete: TransactionTypes.remove,
};

export const EventTypesEndpoints = {
	list: EventTypes.list,
	get: EventTypes.get,
	create: EventTypes.create,
	update: EventTypes.update,
	delete: EventTypes.remove,
};

export const RecipientsEndpoints = {
	list: Recipients.list,
	get: Recipients.get,
	create: Recipients.create,
	update: Recipients.update,
	delete: Recipients.remove,
};

export const ConditionsEndpoints = {
	list: Conditions.list,
	get: Conditions.get,
	create: Conditions.create,
	update: Conditions.update,
	delete: Conditions.remove,
};

export const SearchFiltersEndpoints = {
	list: SearchFilters.list,
	get: SearchFilters.get,
	create: SearchFilters.create,
	update: SearchFilters.update,
	delete: SearchFilters.remove,
};

export const TemplatesEndpoints = {
	list: Templates.list,
	get: Templates.get,
	create: Templates.create,
	update: Templates.update,
	delete: Templates.remove,
	uploadContent: Templates.uploadContent,
};

export * from './types';
