import { Account, getAccountInfo } from './account';
import { Broadcasts, getBroadcastById, getBroadcasts } from './broadcasts';
import {
	addContact,
	Contacts,
	getContacts,
	getMessagesOfContact,
} from './contacts';
import { deleteSegment, getSegments, Segments } from './segments';
import {
	deleteServiceCategory,
	getServiceCategories,
	ServiceCategories,
} from './service-categories';
import {
	getServiceById,
	getServices,
	Services,
	updateService,
} from './services';
import {
	getStaffAvailabilityBlocks,
	getStaffById,
	getStaffs,
	Staff,
} from './staff';
import { getAllWebhooks, Webhooks } from './webhooks';

export {
	addContact,
	getContacts,
	getMessagesOfContact,
	Contacts,
	getSegments,
	deleteSegment,
	Segments,
	getServiceCategories,
	deleteServiceCategory,
	ServiceCategories,
	getAccountInfo,
	Account,
	getAllWebhooks,
	Webhooks,
	getBroadcasts,
	getBroadcastById,
	Broadcasts,
	getServices,
	getServiceById,
	updateService,
	Services,
	getStaffs,
	getStaffById,
	getStaffAvailabilityBlocks,
	Staff,
};

export * from './types';
