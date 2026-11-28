import {
	create,
	createAsync,
	createHosted,
	createHostedAsync,
	download,
	expire,
	list,
	status,
} from './documents';
import { list as listIps } from './ips';

export const Documents = {
	create,
	createAsync,
	createHosted,
	createHostedAsync,
	status,
	download,
	list,
	expire,
};

export const Ips = {
	list: listIps,
};

export * from './types';
