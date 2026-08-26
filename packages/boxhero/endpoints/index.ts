import { getItemAttribute, listItemAttributes } from './item-attributes';
import { deleteItem, getItem, listItems } from './items';
import { listLocation } from './location-transactions';
import { deleteLocation, getLocation, listLocations } from './locations';
import { getMember, listMembers } from './members';
import { listPartners } from './partners';
import { getTeamInfo } from './teams';
import { listBasic } from './transactions';

export const Locations = {
	list: listLocations,
	get: getLocation,
	delete: deleteLocation,
};

export const Transactions = {
	listBasic,
	listLocation,
};

export const Partners = {
	list: listPartners,
};

export const Items = {
	list: listItems,
	get: getItem,
	delete: deleteItem,
};

export const ItemAttributes = {
	list: listItemAttributes,
	get: getItemAttribute,
};

export const Teams = {
	getInfo: getTeamInfo,
};

export const Members = {
	list: listMembers,
	get: getMember,
};

export * from './types';
