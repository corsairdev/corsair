import { get as companyFind } from './company-find';
import { stream as companyStream } from './company-stream';
import { find as ipFind } from './ip-find';

export const Company = {
	find: companyFind,
	stream: companyStream,
};

export const Ip = {
	find: ipFind,
};

export * from './types';
