import { addGiftsToBatch } from './batch';
import { getGiftById } from './gifts';
import { listMemberships } from './membership';
import { oneRosterOAuth2BaseApi } from './oneroster';
import { getPaymentTransaction } from './payments';

export const Batch = {
	addGiftsToBatch,
};

export const Gifts = {
	getGiftById,
};

export const Membership = {
	listMemberships,
};

export const Payments = {
	getPaymentTransaction,
};

export const OneRoster = {
	oneRosterOAuth2BaseApi,
};

export * from './types';
