import { create as createUrl } from './create';
import { list as listUrls } from './list';

export const Urls = {
	create: createUrl,
	list: listUrls,
};

export * from './types';
