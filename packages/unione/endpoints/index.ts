import { manage } from './domain';
import {
	cancel,
	eventGet,
	get,
	list,
	resend,
	resume,
	schedule,
	smtp,
	statistics,
	subscribe,
	unsubscribe,
} from './email';
import { batch, retry } from './email-validation';
import {
	create as eventDumpCreate,
	remove as eventDumpDelete,
	get as eventDumpGet,
	list as eventDumpList,
} from './event-dump';
import {
	remove as suppressionDelete,
	get as suppressionGet,
	list as suppressionList,
} from './suppression';
import { info as systemInfo } from './system';
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
	set as webhookSet,
	types as webhookTypes,
} from './webhook';

export const Email = {
	schedule,
	get,
	eventGet,
	cancel,
	resume,
	resend,
	list,
	statistics,
	smtp,
	subscribe,
	unsubscribe,
};

export const EmailValidation = {
	batch,
	retry,
};

export const EventDump = {
	create: eventDumpCreate,
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
};

export const System = {
	info: systemInfo,
};

export * from './types';
