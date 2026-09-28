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

export * from './types';
export {
	Account,
	addContact,
	Broadcasts,
	Contacts,
	deleteSegment,
	deleteServiceCategory,
	getAccountInfo,
	getAllWebhooks,
	getBroadcastById,
	getBroadcasts,
	getContacts,
	getMessagesOfContact,
	getSegments,
	getServiceById,
	getServiceCategories,
	getServices,
	getStaffAvailabilityBlocks,
	getStaffById,
	getStaffs,
	Segments,
	ServiceCategories,
	Services,
	Staff,
	updateService,
	Webhooks,
};
