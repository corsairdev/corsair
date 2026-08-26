import { remove as domainDelete, manage } from './domain';
import {
	list,
	schedule,
	send,
	statistics,
	subscribe,
	unsubscribe,
} from './email';
import { batch } from './email-validation';
import {
	create as eventDumpCreate,
	createForJob as eventDumpCreateForJob,
	remove as eventDumpDelete,
	get as eventDumpGet,
	list as eventDumpList,
} from './event-dump';
import {
	remove as suppressionDelete,
	get as suppressionGet,
	list as suppressionList,
} from './suppression';
import { info as systemInfo, ping as systemPing } from './system';
import { remove as tagDelete, list as tagList } from './tag';
import {
	remove as templateDelete,
	get as templateGet,
	list as templateList,
	set as templateSet,
} from './template';
import {
	remove as webhookDelete,
	get as webhookGet,
	list as webhookList,
	set as webhookSet,
	types as webhookTypes,
} from './webhook';

export const Email = {
	send,
	schedule,
	list,
	statistics,
	subscribe,
	unsubscribe,
};

export const EmailValidation = {
	batch,
};

export const EventDump = {
	create: eventDumpCreate,
	createForJob: eventDumpCreateForJob,
	get: eventDumpGet,
	list: eventDumpList,
	delete: eventDumpDelete,
};

export const Tag = {
	list: tagList,
	delete: tagDelete,
};

export const Template = {
	set: templateSet,
	get: templateGet,
	list: templateList,
	delete: templateDelete,
};

export const Webhook = {
	set: webhookSet,
	get: webhookGet,
	list: webhookList,
	delete: webhookDelete,
	types: webhookTypes,
};

export const Suppression = {
	get: suppressionGet,
	list: suppressionList,
	delete: suppressionDelete,
};

export const Domain = {
	manage,
	delete: domainDelete,
};

export const System = {
	info: systemInfo,
	ping: systemPing,
};

export * from './types';
