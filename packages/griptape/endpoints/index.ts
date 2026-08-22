import { get as assistantGet } from './assistant-get';
import { list as assistantList } from './assistant-list';

export const Assistant = {
	list: assistantList,
	get: assistantGet,
};

export * from './types';
