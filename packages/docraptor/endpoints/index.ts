import {
	createAsync,
	createHosted,
	createHostedAsync,
	expire,
	list,
	status,
} from './documents';
import { list as listIps } from './ips';

export const Documents = {
	createAsync,
	createHosted,
	createHostedAsync,
	status,
	list,
	expire,
};

export const Ips = {
	list: listIps,
};

export * from './types';
