import {
	create as domainsCreate,
	deleteDomain,
	get as domainsGet,
	list as domainsList,
	verify as domainsVerify,
} from './domains';
import { get as emailsGet, list as emailsList, send as emailsSend } from './emails';

export const Emails = {
	send: emailsSend,
	get: emailsGet,
	list: emailsList,
};

export const Domains = {
	create: domainsCreate,
	get: domainsGet,
	list: domainsList,
	delete: deleteDomain,
	verify: domainsVerify,
};

export * from './types';
