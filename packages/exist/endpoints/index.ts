import {
	acquire,
	list as attributesList,
	increment,
	listOwned,
	listTemplates,
	listWithValues,
	release,
	update,
} from './attributes';
import { list as averagesList } from './averages';
import { list as correlationsList } from './correlations';
import { list as insightsList } from './insights';
import { authorize } from './oauth';
import { getProfile } from './users';

export const Attributes = {
	list: attributesList,
	listTemplates,
	listWithValues,
	listOwned,
	acquire,
	release,
	increment,
	update,
};

export const Averages = {
	list: averagesList,
};

export const Correlations = {
	list: correlationsList,
};

export const Insights = {
	list: insightsList,
};

export const Oauth = {
	authorize,
};

export const Users = {
	getProfile,
};

export * from './types';
