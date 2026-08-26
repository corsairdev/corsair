import { get as blacklistGet } from './blacklist';
import { check as ipCheck } from './check';
import { check as blockCheck } from './check-block';
import { clear as addressClear } from './clear-address';
import { report as ipReport } from './report';
import { list as reportsList } from './reports';

export const CheckIp = {
	check: ipCheck,
};

export const Reports = {
	list: reportsList,
};

export const Blacklist = {
	get: blacklistGet,
};

export const ReportIp = {
	report: ipReport,
};

export const CheckBlock = {
	check: blockCheck,
};

export const ClearAddress = {
	clear: addressClear,
};

export * from './types';
