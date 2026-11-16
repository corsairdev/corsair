import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	createOperationInputSchema,
	createOperationOutputSchema,
} from './schemas';
import { createSimlaComOperationEndpoint } from './shared';
import { getSimlaComOperation } from './types';

export const simlaComEndpointsNested = {
	api: {
		apiVersions: {
			get: createSimlaComOperationEndpoint('api.apiVersions.get'),
		},
		credentials: {
			get: createSimlaComOperationEndpoint('api.credentials.get'),
		},
	},
	cost: {
		list: {
			get: createSimlaComOperationEndpoint('cost.list.get'),
		},
		create: {
			post: createSimlaComOperationEndpoint('cost.create.post'),
		},
		delete: {
			post: createSimlaComOperationEndpoint('cost.delete.post'),
		},
		upload: {
			post: createSimlaComOperationEndpoint('cost.upload.post'),
		},
		getById: {
			get: createSimlaComOperationEndpoint('cost.getById.get'),
		},
		byIdDelete: {
			post: createSimlaComOperationEndpoint('cost.byIdDelete.post'),
		},
		byIdEdit: {
			post: createSimlaComOperationEndpoint('cost.byIdEdit.post'),
		},
	},
	customFields: {
		list: {
			get: createSimlaComOperationEndpoint('customFields.list.get'),
		},
		dictionaries: {
			get: createSimlaComOperationEndpoint('customFields.dictionaries.get'),
		},
		dictionariesCreate: {
			post: createSimlaComOperationEndpoint(
				'customFields.dictionariesCreate.post',
			),
		},
		getDictionariesByCode: {
			get: createSimlaComOperationEndpoint(
				'customFields.getDictionariesByCode.get',
			),
		},
		dictionariesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'customFields.dictionariesByCodeEdit.post',
			),
		},
		byEntityCreate: {
			post: createSimlaComOperationEndpoint('customFields.byEntityCreate.post'),
		},
		getByEntityByCode: {
			get: createSimlaComOperationEndpoint(
				'customFields.getByEntityByCode.get',
			),
		},
		byEntityByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'customFields.byEntityByCodeEdit.post',
			),
		},
	},
	customers: {
		list: {
			get: createSimlaComOperationEndpoint('customers.list.get'),
		},
		combine: {
			post: createSimlaComOperationEndpoint('customers.combine.post'),
		},
		create: {
			post: createSimlaComOperationEndpoint('customers.create.post'),
		},
		fixExternalIds: {
			post: createSimlaComOperationEndpoint('customers.fixExternalIds.post'),
		},
		history: {
			get: createSimlaComOperationEndpoint('customers.history.get'),
		},
		notes: {
			get: createSimlaComOperationEndpoint('customers.notes.get'),
		},
		notesCreate: {
			post: createSimlaComOperationEndpoint('customers.notesCreate.post'),
		},
		notesByIdDelete: {
			post: createSimlaComOperationEndpoint('customers.notesByIdDelete.post'),
		},
		pushTokens: {
			get: createSimlaComOperationEndpoint('customers.pushTokens.get'),
		},
		pushTokensBatch: {
			post: createSimlaComOperationEndpoint('customers.pushTokensBatch.post'),
		},
		upload: {
			post: createSimlaComOperationEndpoint('customers.upload.post'),
		},
		getByExternalid: {
			get: createSimlaComOperationEndpoint('customers.getByExternalid.get'),
		},
		byExternalidEdit: {
			post: createSimlaComOperationEndpoint('customers.byExternalidEdit.post'),
		},
		byExternalidSubscriptions: {
			post: createSimlaComOperationEndpoint(
				'customers.byExternalidSubscriptions.post',
			),
		},
	},
	corporateCustomers: {
		list: {
			get: createSimlaComOperationEndpoint('corporateCustomers.list.get'),
		},
		combine: {
			post: createSimlaComOperationEndpoint('corporateCustomers.combine.post'),
		},
		create: {
			post: createSimlaComOperationEndpoint('corporateCustomers.create.post'),
		},
		fixExternalIds: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.fixExternalIds.post',
			),
		},
		history: {
			get: createSimlaComOperationEndpoint('corporateCustomers.history.get'),
		},
		notes: {
			get: createSimlaComOperationEndpoint('corporateCustomers.notes.get'),
		},
		notesCreate: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.notesCreate.post',
			),
		},
		notesByIdDelete: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.notesByIdDelete.post',
			),
		},
		upload: {
			post: createSimlaComOperationEndpoint('corporateCustomers.upload.post'),
		},
		getByExternalid: {
			get: createSimlaComOperationEndpoint(
				'corporateCustomers.getByExternalid.get',
			),
		},
		getByExternalidAddresses: {
			get: createSimlaComOperationEndpoint(
				'corporateCustomers.getByExternalidAddresses.get',
			),
		},
		byExternalidAddressesCreate: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.byExternalidAddressesCreate.post',
			),
		},
		byExternalidAddressesByEntityexternalidEdit: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post',
			),
		},
		getByExternalidCompanies: {
			get: createSimlaComOperationEndpoint(
				'corporateCustomers.getByExternalidCompanies.get',
			),
		},
		byExternalidCompaniesCreate: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.byExternalidCompaniesCreate.post',
			),
		},
		byExternalidCompaniesByEntityexternalidEdit: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post',
			),
		},
		getByExternalidContacts: {
			get: createSimlaComOperationEndpoint(
				'corporateCustomers.getByExternalidContacts.get',
			),
		},
		byExternalidContactsCreate: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.byExternalidContactsCreate.post',
			),
		},
		byExternalidContactsByEntityexternalidEdit: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post',
			),
		},
		byExternalidEdit: {
			post: createSimlaComOperationEndpoint(
				'corporateCustomers.byExternalidEdit.post',
			),
		},
	},
	customerInteraction: {
		cartBySiteClear: {
			post: createSimlaComOperationEndpoint(
				'customerInteraction.cartBySiteClear.post',
			),
		},
		cartBySiteSet: {
			post: createSimlaComOperationEndpoint(
				'customerInteraction.cartBySiteSet.post',
			),
		},
		getCartBySiteByCustomerid: {
			get: createSimlaComOperationEndpoint(
				'customerInteraction.getCartBySiteByCustomerid.get',
			),
		},
		getFavoritesBySiteByCustomerid: {
			get: createSimlaComOperationEndpoint(
				'customerInteraction.getFavoritesBySiteByCustomerid.get',
			),
		},
		favoritesBySiteByCustomeridAdd: {
			post: createSimlaComOperationEndpoint(
				'customerInteraction.favoritesBySiteByCustomeridAdd.post',
			),
		},
		favoritesBySiteByCustomeridRemove: {
			post: createSimlaComOperationEndpoint(
				'customerInteraction.favoritesBySiteByCustomeridRemove.post',
			),
		},
	},
	deliveries: {
		deliveryCalculate: {
			post: createSimlaComOperationEndpoint(
				'deliveries.deliveryCalculate.post',
			),
		},
		deliveryGenericBySubcodeTracking: {
			post: createSimlaComOperationEndpoint(
				'deliveries.deliveryGenericBySubcodeTracking.post',
			),
		},
		deliveryShipments: {
			get: createSimlaComOperationEndpoint('deliveries.deliveryShipments.get'),
		},
		deliveryShipmentsCreate: {
			post: createSimlaComOperationEndpoint(
				'deliveries.deliveryShipmentsCreate.post',
			),
		},
		getDeliveryShipmentsById: {
			get: createSimlaComOperationEndpoint(
				'deliveries.getDeliveryShipmentsById.get',
			),
		},
		deliveryShipmentsByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'deliveries.deliveryShipmentsByIdEdit.post',
			),
		},
	},
	files: {
		list: {
			get: createSimlaComOperationEndpoint('files.list.get'),
		},
		upload: {
			post: createSimlaComOperationEndpoint('files.upload.post'),
		},
		getById: {
			get: createSimlaComOperationEndpoint('files.getById.get'),
		},
		byIdDelete: {
			post: createSimlaComOperationEndpoint('files.byIdDelete.post'),
		},
		byIdDownload: {
			get: createSimlaComOperationEndpoint('files.byIdDownload.get'),
		},
		byIdEdit: {
			post: createSimlaComOperationEndpoint('files.byIdEdit.post'),
		},
	},
	integration: {
		getIntegrationModulesByCode: {
			get: createSimlaComOperationEndpoint(
				'integration.getIntegrationModulesByCode.get',
			),
		},
		integrationModulesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'integration.integrationModulesByCodeEdit.post',
			),
		},
	},
	knowledgeBase: {
		documents: {
			get: createSimlaComOperationEndpoint('knowledgeBase.documents.get'),
		},
		documentsCreate: {
			post: createSimlaComOperationEndpoint(
				'knowledgeBase.documentsCreate.post',
			),
		},
		documentsHistory: {
			get: createSimlaComOperationEndpoint(
				'knowledgeBase.documentsHistory.get',
			),
		},
		getDocumentsById: {
			get: createSimlaComOperationEndpoint(
				'knowledgeBase.getDocumentsById.get',
			),
		},
		documentsByIdDelete: {
			post: createSimlaComOperationEndpoint(
				'knowledgeBase.documentsByIdDelete.post',
			),
		},
		documentsByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'knowledgeBase.documentsByIdEdit.post',
			),
		},
		sections: {
			get: createSimlaComOperationEndpoint('knowledgeBase.sections.get'),
		},
		sectionsCreate: {
			post: createSimlaComOperationEndpoint(
				'knowledgeBase.sectionsCreate.post',
			),
		},
		sectionsByIdDelete: {
			post: createSimlaComOperationEndpoint(
				'knowledgeBase.sectionsByIdDelete.post',
			),
		},
		sectionsByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'knowledgeBase.sectionsByIdEdit.post',
			),
		},
	},
	loyalty: {
		accountCreate: {
			post: createSimlaComOperationEndpoint('loyalty.accountCreate.post'),
		},
		getAccountById: {
			get: createSimlaComOperationEndpoint('loyalty.getAccountById.get'),
		},
		accountByIdActivate: {
			post: createSimlaComOperationEndpoint('loyalty.accountByIdActivate.post'),
		},
		accountByIdBonusCharge: {
			post: createSimlaComOperationEndpoint(
				'loyalty.accountByIdBonusCharge.post',
			),
		},
		accountByIdBonusCredit: {
			post: createSimlaComOperationEndpoint(
				'loyalty.accountByIdBonusCredit.post',
			),
		},
		getAccountByIdBonusOperations: {
			get: createSimlaComOperationEndpoint(
				'loyalty.getAccountByIdBonusOperations.get',
			),
		},
		getAccountByIdBonusByStatusDetails: {
			get: createSimlaComOperationEndpoint(
				'loyalty.getAccountByIdBonusByStatusDetails.get',
			),
		},
		accountByIdEdit: {
			post: createSimlaComOperationEndpoint('loyalty.accountByIdEdit.post'),
		},
		accounts: {
			get: createSimlaComOperationEndpoint('loyalty.accounts.get'),
		},
		bonusOperations: {
			get: createSimlaComOperationEndpoint('loyalty.bonusOperations.get'),
		},
		calculate: {
			post: createSimlaComOperationEndpoint('loyalty.calculate.post'),
		},
		loyalties: {
			get: createSimlaComOperationEndpoint('loyalty.loyalties.get'),
		},
		getLoyaltiesById: {
			get: createSimlaComOperationEndpoint('loyalty.getLoyaltiesById.get'),
		},
	},
	notifications: {
		send: {
			post: createSimlaComOperationEndpoint('notifications.send.post'),
		},
	},
	orders: {
		list: {
			get: createSimlaComOperationEndpoint('orders.list.get'),
		},
		combine: {
			post: createSimlaComOperationEndpoint('orders.combine.post'),
		},
		create: {
			post: createSimlaComOperationEndpoint('orders.create.post'),
		},
		fixExternalIds: {
			post: createSimlaComOperationEndpoint('orders.fixExternalIds.post'),
		},
		history: {
			get: createSimlaComOperationEndpoint('orders.history.get'),
		},
		linksCreate: {
			post: createSimlaComOperationEndpoint('orders.linksCreate.post'),
		},
		loyaltyApply: {
			post: createSimlaComOperationEndpoint('orders.loyaltyApply.post'),
		},
		loyaltyCancelBonusOperations: {
			post: createSimlaComOperationEndpoint(
				'orders.loyaltyCancelBonusOperations.post',
			),
		},
		paymentsCreate: {
			post: createSimlaComOperationEndpoint('orders.paymentsCreate.post'),
		},
		paymentsByIdDelete: {
			post: createSimlaComOperationEndpoint('orders.paymentsByIdDelete.post'),
		},
		paymentsByIdEdit: {
			post: createSimlaComOperationEndpoint('orders.paymentsByIdEdit.post'),
		},
		statuses: {
			get: createSimlaComOperationEndpoint('orders.statuses.get'),
		},
		upload: {
			post: createSimlaComOperationEndpoint('orders.upload.post'),
		},
		getByExternalid: {
			get: createSimlaComOperationEndpoint('orders.getByExternalid.get'),
		},
		byExternalidDeliveryCancel: {
			post: createSimlaComOperationEndpoint(
				'orders.byExternalidDeliveryCancel.post',
			),
		},
		byExternalidEdit: {
			post: createSimlaComOperationEndpoint('orders.byExternalidEdit.post'),
		},
		byExternalidPlatesByPlateidPrint: {
			get: createSimlaComOperationEndpoint(
				'orders.byExternalidPlatesByPlateidPrint.get',
			),
		},
	},
	ordersPicking: {
		packs: {
			get: createSimlaComOperationEndpoint('ordersPicking.packs.get'),
		},
		packsCreate: {
			post: createSimlaComOperationEndpoint('ordersPicking.packsCreate.post'),
		},
		packsHistory: {
			get: createSimlaComOperationEndpoint('ordersPicking.packsHistory.get'),
		},
		getPacksById: {
			get: createSimlaComOperationEndpoint('ordersPicking.getPacksById.get'),
		},
		packsByIdDelete: {
			post: createSimlaComOperationEndpoint(
				'ordersPicking.packsByIdDelete.post',
			),
		},
		packsByIdEdit: {
			post: createSimlaComOperationEndpoint('ordersPicking.packsByIdEdit.post'),
		},
	},
	payments: {
		paymentCheck: {
			post: createSimlaComOperationEndpoint('payments.paymentCheck.post'),
		},
		paymentCreateInvoice: {
			post: createSimlaComOperationEndpoint(
				'payments.paymentCreateInvoice.post',
			),
		},
		paymentInvoiceImport: {
			post: createSimlaComOperationEndpoint(
				'payments.paymentInvoiceImport.post',
			),
		},
		getPaymentInvoiceByInvoiceuuid: {
			get: createSimlaComOperationEndpoint(
				'payments.getPaymentInvoiceByInvoiceuuid.get',
			),
		},
		paymentUpdateInvoice: {
			post: createSimlaComOperationEndpoint(
				'payments.paymentUpdateInvoice.post',
			),
		},
	},
	dataBook: {
		referenceCostGroups: {
			get: createSimlaComOperationEndpoint('dataBook.referenceCostGroups.get'),
		},
		referenceCostGroupsByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceCostGroupsByCodeEdit.post',
			),
		},
		referenceCostItems: {
			get: createSimlaComOperationEndpoint('dataBook.referenceCostItems.get'),
		},
		referenceCostItemsByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceCostItemsByCodeEdit.post',
			),
		},
		referenceCountries: {
			get: createSimlaComOperationEndpoint('dataBook.referenceCountries.get'),
		},
		referenceCouriers: {
			get: createSimlaComOperationEndpoint('dataBook.referenceCouriers.get'),
		},
		referenceCouriersCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceCouriersCreate.post',
			),
		},
		referenceCouriersByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceCouriersByIdEdit.post',
			),
		},
		referenceCurrencies: {
			get: createSimlaComOperationEndpoint('dataBook.referenceCurrencies.get'),
		},
		referenceCurrenciesCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceCurrenciesCreate.post',
			),
		},
		referenceCurrenciesByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceCurrenciesByIdEdit.post',
			),
		},
		referenceDeliveryServices: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceDeliveryServices.get',
			),
		},
		referenceDeliveryServicesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceDeliveryServicesByCodeEdit.post',
			),
		},
		referenceDeliveryTypes: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceDeliveryTypes.get',
			),
		},
		referenceDeliveryTypesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceDeliveryTypesByCodeEdit.post',
			),
		},
		referenceLegalEntities: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceLegalEntities.get',
			),
		},
		referenceLegalEntitiesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceLegalEntitiesByCodeEdit.post',
			),
		},
		referenceMgChannels: {
			get: createSimlaComOperationEndpoint('dataBook.referenceMgChannels.get'),
		},
		referenceOrderMethods: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceOrderMethods.get',
			),
		},
		referenceOrderMethodsByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceOrderMethodsByCodeEdit.post',
			),
		},
		referenceOrderTypes: {
			get: createSimlaComOperationEndpoint('dataBook.referenceOrderTypes.get'),
		},
		referenceOrderTypesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceOrderTypesByCodeEdit.post',
			),
		},
		referencePaymentStatuses: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referencePaymentStatuses.get',
			),
		},
		referencePaymentStatusesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referencePaymentStatusesByCodeEdit.post',
			),
		},
		referencePaymentTypes: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referencePaymentTypes.get',
			),
		},
		referencePaymentTypesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referencePaymentTypesByCodeEdit.post',
			),
		},
		referencePriceTypes: {
			get: createSimlaComOperationEndpoint('dataBook.referencePriceTypes.get'),
		},
		referencePriceTypesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referencePriceTypesByCodeEdit.post',
			),
		},
		referenceProductStatuses: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceProductStatuses.get',
			),
		},
		referenceProductStatusesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceProductStatusesByCodeEdit.post',
			),
		},
		referencePushCategories: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referencePushCategories.get',
			),
		},
		referencePushCategoriesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referencePushCategoriesByCodeEdit.post',
			),
		},
		referenceSites: {
			get: createSimlaComOperationEndpoint('dataBook.referenceSites.get'),
		},
		referenceSitesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceSitesByCodeEdit.post',
			),
		},
		getReferenceSitesByCodeTracker: {
			get: createSimlaComOperationEndpoint(
				'dataBook.getReferenceSitesByCodeTracker.get',
			),
		},
		referenceStatusGroups: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceStatusGroups.get',
			),
		},
		referenceStatuses: {
			get: createSimlaComOperationEndpoint('dataBook.referenceStatuses.get'),
		},
		referenceStatusesByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceStatusesByCodeEdit.post',
			),
		},
		referenceStores: {
			get: createSimlaComOperationEndpoint('dataBook.referenceStores.get'),
		},
		referenceStoresByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceStoresByCodeEdit.post',
			),
		},
		referenceSubscriptions: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceSubscriptions.get',
			),
		},
		referenceSubscriptionsByChannelByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceSubscriptionsByChannelByCodeEdit.post',
			),
		},
		referenceTicketChannels: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketChannels.get',
			),
		},
		referenceTicketChannelsCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketChannelsCreate.post',
			),
		},
		referenceTicketChannelsByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketChannelsByIdEdit.post',
			),
		},
		referenceTicketStatusGroups: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketStatusGroups.get',
			),
		},
		referenceTicketStatusGroupsCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketStatusGroupsCreate.post',
			),
		},
		referenceTicketStatusGroupsByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketStatusGroupsByIdEdit.post',
			),
		},
		referenceTicketStatuses: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketStatuses.get',
			),
		},
		referenceTicketStatusesCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketStatusesCreate.post',
			),
		},
		referenceTicketStatusesByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketStatusesByIdEdit.post',
			),
		},
		referenceTicketSubtopics: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketSubtopics.get',
			),
		},
		referenceTicketSubtopicsCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketSubtopicsCreate.post',
			),
		},
		referenceTicketSubtopicsByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketSubtopicsByIdEdit.post',
			),
		},
		referenceTicketTopics: {
			get: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketTopics.get',
			),
		},
		referenceTicketTopicsCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketTopicsCreate.post',
			),
		},
		referenceTicketTopicsByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketTopicsByIdEdit.post',
			),
		},
		referenceTicketTypes: {
			get: createSimlaComOperationEndpoint('dataBook.referenceTicketTypes.get'),
		},
		referenceTicketTypesCreate: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketTypesCreate.post',
			),
		},
		referenceTicketTypesByIdEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceTicketTypesByIdEdit.post',
			),
		},
		referenceUnits: {
			get: createSimlaComOperationEndpoint('dataBook.referenceUnits.get'),
		},
		referenceUnitsByCodeEdit: {
			post: createSimlaComOperationEndpoint(
				'dataBook.referenceUnitsByCodeEdit.post',
			),
		},
	},
	segments: {
		list: {
			get: createSimlaComOperationEndpoint('segments.list.get'),
		},
	},
	settings: {
		list: {
			get: createSimlaComOperationEndpoint('settings.list.get'),
		},
	},
	store: {
		inventories: {
			get: createSimlaComOperationEndpoint('store.inventories.get'),
		},
		inventoriesUpload: {
			post: createSimlaComOperationEndpoint('store.inventoriesUpload.post'),
		},
		offers: {
			get: createSimlaComOperationEndpoint('store.offers.get'),
		},
		pricesUpload: {
			post: createSimlaComOperationEndpoint('store.pricesUpload.post'),
		},
		productGroups: {
			get: createSimlaComOperationEndpoint('store.productGroups.get'),
		},
		productGroupsCreate: {
			post: createSimlaComOperationEndpoint('store.productGroupsCreate.post'),
		},
		productGroupsByExternalidEdit: {
			post: createSimlaComOperationEndpoint(
				'store.productGroupsByExternalidEdit.post',
			),
		},
		products: {
			get: createSimlaComOperationEndpoint('store.products.get'),
		},
		productsBatchCreate: {
			post: createSimlaComOperationEndpoint('store.productsBatchCreate.post'),
		},
		productsBatchEdit: {
			post: createSimlaComOperationEndpoint('store.productsBatchEdit.post'),
		},
		productsProperties: {
			get: createSimlaComOperationEndpoint('store.productsProperties.get'),
		},
		productsPropertiesValues: {
			get: createSimlaComOperationEndpoint(
				'store.productsPropertiesValues.get',
			),
		},
	},
	tasks: {
		list: {
			get: createSimlaComOperationEndpoint('tasks.list.get'),
		},
		create: {
			post: createSimlaComOperationEndpoint('tasks.create.post'),
		},
		history: {
			get: createSimlaComOperationEndpoint('tasks.history.get'),
		},
		getById: {
			get: createSimlaComOperationEndpoint('tasks.getById.get'),
		},
		getByIdComments: {
			get: createSimlaComOperationEndpoint('tasks.getByIdComments.get'),
		},
		byIdEdit: {
			post: createSimlaComOperationEndpoint('tasks.byIdEdit.post'),
		},
	},
	telephony: {
		callEvent: {
			post: createSimlaComOperationEndpoint('telephony.callEvent.post'),
		},
		calls: {
			get: createSimlaComOperationEndpoint('telephony.calls.get'),
		},
		callsUpload: {
			post: createSimlaComOperationEndpoint('telephony.callsUpload.post'),
		},
		getCallsByIdRecord: {
			get: createSimlaComOperationEndpoint('telephony.getCallsByIdRecord.get'),
		},
		manager: {
			get: createSimlaComOperationEndpoint('telephony.manager.get'),
		},
	},
	tickets: {
		list: {
			get: createSimlaComOperationEndpoint('tickets.list.get'),
		},
		comments: {
			get: createSimlaComOperationEndpoint('tickets.comments.get'),
		},
		commentsCreate: {
			post: createSimlaComOperationEndpoint('tickets.commentsCreate.post'),
		},
		commentsByIdDelete: {
			post: createSimlaComOperationEndpoint('tickets.commentsByIdDelete.post'),
		},
		commentsByIdEdit: {
			post: createSimlaComOperationEndpoint('tickets.commentsByIdEdit.post'),
		},
		create: {
			post: createSimlaComOperationEndpoint('tickets.create.post'),
		},
		history: {
			get: createSimlaComOperationEndpoint('tickets.history.get'),
		},
		getByExternalid: {
			get: createSimlaComOperationEndpoint('tickets.getByExternalid.get'),
		},
		byExternalidEdit: {
			post: createSimlaComOperationEndpoint('tickets.byExternalidEdit.post'),
		},
	},
	users: {
		userGroups: {
			get: createSimlaComOperationEndpoint('users.userGroups.get'),
		},
		list: {
			get: createSimlaComOperationEndpoint('users.list.get'),
		},
		getById: {
			get: createSimlaComOperationEndpoint('users.getById.get'),
		},
		byIdStatus: {
			post: createSimlaComOperationEndpoint('users.byIdStatus.post'),
		},
	},
	verification: {
		smsConfirm: {
			post: createSimlaComOperationEndpoint('verification.smsConfirm.post'),
		},
		getSmsByCheckidStatus: {
			get: createSimlaComOperationEndpoint(
				'verification.getSmsByCheckidStatus.get',
			),
		},
	},
	webAnalytics: {
		clientIdsUpload: {
			post: createSimlaComOperationEndpoint(
				'webAnalytics.clientIdsUpload.post',
			),
		},
		sourcesUpload: {
			post: createSimlaComOperationEndpoint('webAnalytics.sourcesUpload.post'),
		},
		visitsUpload: {
			post: createSimlaComOperationEndpoint('webAnalytics.visitsUpload.post'),
		},
	},
	statistics: {
		statisticUpdate: {
			get: createSimlaComOperationEndpoint('statistics.statisticUpdate.get'),
		},
	},
} as const;

export const simlaComEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof simlaComEndpointsNested
> = {
	'api.apiVersions.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('api.apiVersions.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('api.apiVersions.get'),
		),
	},
	'api.credentials.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('api.credentials.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('api.credentials.get'),
		),
	},
	'cost.list.get': {
		input: createOperationInputSchema(getSimlaComOperation('cost.list.get')),
		output: createOperationOutputSchema(getSimlaComOperation('cost.list.get')),
	},
	'cost.create.post': {
		input: createOperationInputSchema(getSimlaComOperation('cost.create.post')),
		output: createOperationOutputSchema(
			getSimlaComOperation('cost.create.post'),
		),
	},
	'cost.delete.post': {
		input: createOperationInputSchema(getSimlaComOperation('cost.delete.post')),
		output: createOperationOutputSchema(
			getSimlaComOperation('cost.delete.post'),
		),
	},
	'cost.upload.post': {
		input: createOperationInputSchema(getSimlaComOperation('cost.upload.post')),
		output: createOperationOutputSchema(
			getSimlaComOperation('cost.upload.post'),
		),
	},
	'cost.getById.get': {
		input: createOperationInputSchema(getSimlaComOperation('cost.getById.get')),
		output: createOperationOutputSchema(
			getSimlaComOperation('cost.getById.get'),
		),
	},
	'cost.byIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('cost.byIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('cost.byIdDelete.post'),
		),
	},
	'cost.byIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('cost.byIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('cost.byIdEdit.post'),
		),
	},
	'customFields.list.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.list.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.list.get'),
		),
	},
	'customFields.dictionaries.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.dictionaries.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.dictionaries.get'),
		),
	},
	'customFields.dictionariesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.dictionariesCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.dictionariesCreate.post'),
		),
	},
	'customFields.getDictionariesByCode.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.getDictionariesByCode.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.getDictionariesByCode.get'),
		),
	},
	'customFields.dictionariesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.dictionariesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.dictionariesByCodeEdit.post'),
		),
	},
	'customFields.byEntityCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.byEntityCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.byEntityCreate.post'),
		),
	},
	'customFields.getByEntityByCode.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.getByEntityByCode.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.getByEntityByCode.get'),
		),
	},
	'customFields.byEntityByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customFields.byEntityByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customFields.byEntityByCodeEdit.post'),
		),
	},
	'customers.list.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.list.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.list.get'),
		),
	},
	'customers.combine.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.combine.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.combine.post'),
		),
	},
	'customers.create.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.create.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.create.post'),
		),
	},
	'customers.fixExternalIds.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.fixExternalIds.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.fixExternalIds.post'),
		),
	},
	'customers.history.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.history.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.history.get'),
		),
	},
	'customers.notes.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.notes.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.notes.get'),
		),
	},
	'customers.notesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.notesCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.notesCreate.post'),
		),
	},
	'customers.notesByIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.notesByIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.notesByIdDelete.post'),
		),
	},
	'customers.pushTokens.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.pushTokens.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.pushTokens.get'),
		),
	},
	'customers.pushTokensBatch.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.pushTokensBatch.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.pushTokensBatch.post'),
		),
	},
	'customers.upload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.upload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.upload.post'),
		),
	},
	'customers.getByExternalid.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.getByExternalid.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.getByExternalid.get'),
		),
	},
	'customers.byExternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.byExternalidEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.byExternalidEdit.post'),
		),
	},
	'customers.byExternalidSubscriptions.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customers.byExternalidSubscriptions.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customers.byExternalidSubscriptions.post'),
		),
	},
	'corporateCustomers.list.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.list.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.list.get'),
		),
	},
	'corporateCustomers.combine.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.combine.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.combine.post'),
		),
	},
	'corporateCustomers.create.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.create.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.create.post'),
		),
	},
	'corporateCustomers.fixExternalIds.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.fixExternalIds.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.fixExternalIds.post'),
		),
	},
	'corporateCustomers.history.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.history.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.history.get'),
		),
	},
	'corporateCustomers.notes.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.notes.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.notes.get'),
		),
	},
	'corporateCustomers.notesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.notesCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.notesCreate.post'),
		),
	},
	'corporateCustomers.notesByIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.notesByIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.notesByIdDelete.post'),
		),
	},
	'corporateCustomers.upload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.upload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.upload.post'),
		),
	},
	'corporateCustomers.getByExternalid.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalid.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalid.get'),
		),
	},
	'corporateCustomers.getByExternalidAddresses.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalidAddresses.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalidAddresses.get'),
		),
	},
	'corporateCustomers.byExternalidAddressesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidAddressesCreate.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidAddressesCreate.post',
			),
		),
	},
	'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post',
			),
		),
	},
	'corporateCustomers.getByExternalidCompanies.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalidCompanies.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalidCompanies.get'),
		),
	},
	'corporateCustomers.byExternalidCompaniesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidCompaniesCreate.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidCompaniesCreate.post',
			),
		),
	},
	'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post',
			),
		),
	},
	'corporateCustomers.getByExternalidContacts.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalidContacts.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.getByExternalidContacts.get'),
		),
	},
	'corporateCustomers.byExternalidContactsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidContactsCreate.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidContactsCreate.post',
			),
		),
	},
	'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post',
			),
		),
	},
	'corporateCustomers.byExternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('corporateCustomers.byExternalidEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('corporateCustomers.byExternalidEdit.post'),
		),
	},
	'customerInteraction.cartBySiteClear.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customerInteraction.cartBySiteClear.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customerInteraction.cartBySiteClear.post'),
		),
	},
	'customerInteraction.cartBySiteSet.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('customerInteraction.cartBySiteSet.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customerInteraction.cartBySiteSet.post'),
		),
	},
	'customerInteraction.getCartBySiteByCustomerid.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('customerInteraction.getCartBySiteByCustomerid.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('customerInteraction.getCartBySiteByCustomerid.get'),
		),
	},
	'customerInteraction.getFavoritesBySiteByCustomerid.get': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'customerInteraction.getFavoritesBySiteByCustomerid.get',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'customerInteraction.getFavoritesBySiteByCustomerid.get',
			),
		),
	},
	'customerInteraction.favoritesBySiteByCustomeridAdd.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'customerInteraction.favoritesBySiteByCustomeridAdd.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'customerInteraction.favoritesBySiteByCustomeridAdd.post',
			),
		),
	},
	'customerInteraction.favoritesBySiteByCustomeridRemove.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'customerInteraction.favoritesBySiteByCustomeridRemove.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'customerInteraction.favoritesBySiteByCustomeridRemove.post',
			),
		),
	},
	'deliveries.deliveryCalculate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('deliveries.deliveryCalculate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('deliveries.deliveryCalculate.post'),
		),
	},
	'deliveries.deliveryGenericBySubcodeTracking.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('deliveries.deliveryGenericBySubcodeTracking.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('deliveries.deliveryGenericBySubcodeTracking.post'),
		),
	},
	'deliveries.deliveryShipments.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('deliveries.deliveryShipments.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('deliveries.deliveryShipments.get'),
		),
	},
	'deliveries.deliveryShipmentsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('deliveries.deliveryShipmentsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('deliveries.deliveryShipmentsCreate.post'),
		),
	},
	'deliveries.getDeliveryShipmentsById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('deliveries.getDeliveryShipmentsById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('deliveries.getDeliveryShipmentsById.get'),
		),
	},
	'deliveries.deliveryShipmentsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('deliveries.deliveryShipmentsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('deliveries.deliveryShipmentsByIdEdit.post'),
		),
	},
	'files.list.get': {
		input: createOperationInputSchema(getSimlaComOperation('files.list.get')),
		output: createOperationOutputSchema(getSimlaComOperation('files.list.get')),
	},
	'files.upload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('files.upload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('files.upload.post'),
		),
	},
	'files.getById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('files.getById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('files.getById.get'),
		),
	},
	'files.byIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('files.byIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('files.byIdDelete.post'),
		),
	},
	'files.byIdDownload.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('files.byIdDownload.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('files.byIdDownload.get'),
		),
	},
	'files.byIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('files.byIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('files.byIdEdit.post'),
		),
	},
	'integration.getIntegrationModulesByCode.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('integration.getIntegrationModulesByCode.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('integration.getIntegrationModulesByCode.get'),
		),
	},
	'integration.integrationModulesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('integration.integrationModulesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('integration.integrationModulesByCodeEdit.post'),
		),
	},
	'knowledgeBase.documents.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.documents.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.documents.get'),
		),
	},
	'knowledgeBase.documentsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.documentsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.documentsCreate.post'),
		),
	},
	'knowledgeBase.documentsHistory.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.documentsHistory.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.documentsHistory.get'),
		),
	},
	'knowledgeBase.getDocumentsById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.getDocumentsById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.getDocumentsById.get'),
		),
	},
	'knowledgeBase.documentsByIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.documentsByIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.documentsByIdDelete.post'),
		),
	},
	'knowledgeBase.documentsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.documentsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.documentsByIdEdit.post'),
		),
	},
	'knowledgeBase.sections.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.sections.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.sections.get'),
		),
	},
	'knowledgeBase.sectionsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.sectionsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.sectionsCreate.post'),
		),
	},
	'knowledgeBase.sectionsByIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.sectionsByIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.sectionsByIdDelete.post'),
		),
	},
	'knowledgeBase.sectionsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('knowledgeBase.sectionsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('knowledgeBase.sectionsByIdEdit.post'),
		),
	},
	'loyalty.accountCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.accountCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.accountCreate.post'),
		),
	},
	'loyalty.getAccountById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.getAccountById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.getAccountById.get'),
		),
	},
	'loyalty.accountByIdActivate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.accountByIdActivate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.accountByIdActivate.post'),
		),
	},
	'loyalty.accountByIdBonusCharge.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.accountByIdBonusCharge.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.accountByIdBonusCharge.post'),
		),
	},
	'loyalty.accountByIdBonusCredit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.accountByIdBonusCredit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.accountByIdBonusCredit.post'),
		),
	},
	'loyalty.getAccountByIdBonusOperations.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.getAccountByIdBonusOperations.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.getAccountByIdBonusOperations.get'),
		),
	},
	'loyalty.getAccountByIdBonusByStatusDetails.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.getAccountByIdBonusByStatusDetails.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.getAccountByIdBonusByStatusDetails.get'),
		),
	},
	'loyalty.accountByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.accountByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.accountByIdEdit.post'),
		),
	},
	'loyalty.accounts.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.accounts.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.accounts.get'),
		),
	},
	'loyalty.bonusOperations.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.bonusOperations.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.bonusOperations.get'),
		),
	},
	'loyalty.calculate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.calculate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.calculate.post'),
		),
	},
	'loyalty.loyalties.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.loyalties.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.loyalties.get'),
		),
	},
	'loyalty.getLoyaltiesById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('loyalty.getLoyaltiesById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('loyalty.getLoyaltiesById.get'),
		),
	},
	'notifications.send.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('notifications.send.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('notifications.send.post'),
		),
	},
	'orders.list.get': {
		input: createOperationInputSchema(getSimlaComOperation('orders.list.get')),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.list.get'),
		),
	},
	'orders.combine.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.combine.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.combine.post'),
		),
	},
	'orders.create.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.create.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.create.post'),
		),
	},
	'orders.fixExternalIds.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.fixExternalIds.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.fixExternalIds.post'),
		),
	},
	'orders.history.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.history.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.history.get'),
		),
	},
	'orders.linksCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.linksCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.linksCreate.post'),
		),
	},
	'orders.loyaltyApply.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.loyaltyApply.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.loyaltyApply.post'),
		),
	},
	'orders.loyaltyCancelBonusOperations.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.loyaltyCancelBonusOperations.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.loyaltyCancelBonusOperations.post'),
		),
	},
	'orders.paymentsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.paymentsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.paymentsCreate.post'),
		),
	},
	'orders.paymentsByIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.paymentsByIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.paymentsByIdDelete.post'),
		),
	},
	'orders.paymentsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.paymentsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.paymentsByIdEdit.post'),
		),
	},
	'orders.statuses.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.statuses.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.statuses.get'),
		),
	},
	'orders.upload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.upload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.upload.post'),
		),
	},
	'orders.getByExternalid.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.getByExternalid.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.getByExternalid.get'),
		),
	},
	'orders.byExternalidDeliveryCancel.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.byExternalidDeliveryCancel.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.byExternalidDeliveryCancel.post'),
		),
	},
	'orders.byExternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.byExternalidEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.byExternalidEdit.post'),
		),
	},
	'orders.byExternalidPlatesByPlateidPrint.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('orders.byExternalidPlatesByPlateidPrint.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('orders.byExternalidPlatesByPlateidPrint.get'),
		),
	},
	'ordersPicking.packs.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('ordersPicking.packs.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('ordersPicking.packs.get'),
		),
	},
	'ordersPicking.packsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('ordersPicking.packsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('ordersPicking.packsCreate.post'),
		),
	},
	'ordersPicking.packsHistory.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('ordersPicking.packsHistory.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('ordersPicking.packsHistory.get'),
		),
	},
	'ordersPicking.getPacksById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('ordersPicking.getPacksById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('ordersPicking.getPacksById.get'),
		),
	},
	'ordersPicking.packsByIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('ordersPicking.packsByIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('ordersPicking.packsByIdDelete.post'),
		),
	},
	'ordersPicking.packsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('ordersPicking.packsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('ordersPicking.packsByIdEdit.post'),
		),
	},
	'payments.paymentCheck.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('payments.paymentCheck.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('payments.paymentCheck.post'),
		),
	},
	'payments.paymentCreateInvoice.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('payments.paymentCreateInvoice.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('payments.paymentCreateInvoice.post'),
		),
	},
	'payments.paymentInvoiceImport.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('payments.paymentInvoiceImport.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('payments.paymentInvoiceImport.post'),
		),
	},
	'payments.getPaymentInvoiceByInvoiceuuid.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('payments.getPaymentInvoiceByInvoiceuuid.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('payments.getPaymentInvoiceByInvoiceuuid.get'),
		),
	},
	'payments.paymentUpdateInvoice.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('payments.paymentUpdateInvoice.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('payments.paymentUpdateInvoice.post'),
		),
	},
	'dataBook.referenceCostGroups.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCostGroups.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCostGroups.get'),
		),
	},
	'dataBook.referenceCostGroupsByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCostGroupsByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCostGroupsByCodeEdit.post'),
		),
	},
	'dataBook.referenceCostItems.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCostItems.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCostItems.get'),
		),
	},
	'dataBook.referenceCostItemsByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCostItemsByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCostItemsByCodeEdit.post'),
		),
	},
	'dataBook.referenceCountries.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCountries.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCountries.get'),
		),
	},
	'dataBook.referenceCouriers.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCouriers.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCouriers.get'),
		),
	},
	'dataBook.referenceCouriersCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCouriersCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCouriersCreate.post'),
		),
	},
	'dataBook.referenceCouriersByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCouriersByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCouriersByIdEdit.post'),
		),
	},
	'dataBook.referenceCurrencies.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCurrencies.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCurrencies.get'),
		),
	},
	'dataBook.referenceCurrenciesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCurrenciesCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCurrenciesCreate.post'),
		),
	},
	'dataBook.referenceCurrenciesByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceCurrenciesByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceCurrenciesByIdEdit.post'),
		),
	},
	'dataBook.referenceDeliveryServices.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryServices.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryServices.get'),
		),
	},
	'dataBook.referenceDeliveryServicesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryServicesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryServicesByCodeEdit.post'),
		),
	},
	'dataBook.referenceDeliveryTypes.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryTypes.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryTypes.get'),
		),
	},
	'dataBook.referenceDeliveryTypesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryTypesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceDeliveryTypesByCodeEdit.post'),
		),
	},
	'dataBook.referenceLegalEntities.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceLegalEntities.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceLegalEntities.get'),
		),
	},
	'dataBook.referenceLegalEntitiesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceLegalEntitiesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceLegalEntitiesByCodeEdit.post'),
		),
	},
	'dataBook.referenceMgChannels.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceMgChannels.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceMgChannels.get'),
		),
	},
	'dataBook.referenceOrderMethods.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceOrderMethods.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceOrderMethods.get'),
		),
	},
	'dataBook.referenceOrderMethodsByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceOrderMethodsByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceOrderMethodsByCodeEdit.post'),
		),
	},
	'dataBook.referenceOrderTypes.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceOrderTypes.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceOrderTypes.get'),
		),
	},
	'dataBook.referenceOrderTypesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceOrderTypesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceOrderTypesByCodeEdit.post'),
		),
	},
	'dataBook.referencePaymentStatuses.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePaymentStatuses.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePaymentStatuses.get'),
		),
	},
	'dataBook.referencePaymentStatusesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePaymentStatusesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePaymentStatusesByCodeEdit.post'),
		),
	},
	'dataBook.referencePaymentTypes.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePaymentTypes.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePaymentTypes.get'),
		),
	},
	'dataBook.referencePaymentTypesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePaymentTypesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePaymentTypesByCodeEdit.post'),
		),
	},
	'dataBook.referencePriceTypes.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePriceTypes.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePriceTypes.get'),
		),
	},
	'dataBook.referencePriceTypesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePriceTypesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePriceTypesByCodeEdit.post'),
		),
	},
	'dataBook.referenceProductStatuses.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceProductStatuses.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceProductStatuses.get'),
		),
	},
	'dataBook.referenceProductStatusesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceProductStatusesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceProductStatusesByCodeEdit.post'),
		),
	},
	'dataBook.referencePushCategories.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePushCategories.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePushCategories.get'),
		),
	},
	'dataBook.referencePushCategoriesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referencePushCategoriesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referencePushCategoriesByCodeEdit.post'),
		),
	},
	'dataBook.referenceSites.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceSites.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceSites.get'),
		),
	},
	'dataBook.referenceSitesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceSitesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceSitesByCodeEdit.post'),
		),
	},
	'dataBook.getReferenceSitesByCodeTracker.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.getReferenceSitesByCodeTracker.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.getReferenceSitesByCodeTracker.get'),
		),
	},
	'dataBook.referenceStatusGroups.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceStatusGroups.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceStatusGroups.get'),
		),
	},
	'dataBook.referenceStatuses.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceStatuses.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceStatuses.get'),
		),
	},
	'dataBook.referenceStatusesByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceStatusesByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceStatusesByCodeEdit.post'),
		),
	},
	'dataBook.referenceStores.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceStores.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceStores.get'),
		),
	},
	'dataBook.referenceStoresByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceStoresByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceStoresByCodeEdit.post'),
		),
	},
	'dataBook.referenceSubscriptions.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceSubscriptions.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceSubscriptions.get'),
		),
	},
	'dataBook.referenceSubscriptionsByChannelByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation(
				'dataBook.referenceSubscriptionsByChannelByCodeEdit.post',
			),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation(
				'dataBook.referenceSubscriptionsByChannelByCodeEdit.post',
			),
		),
	},
	'dataBook.referenceTicketChannels.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketChannels.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketChannels.get'),
		),
	},
	'dataBook.referenceTicketChannelsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketChannelsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketChannelsCreate.post'),
		),
	},
	'dataBook.referenceTicketChannelsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketChannelsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketChannelsByIdEdit.post'),
		),
	},
	'dataBook.referenceTicketStatusGroups.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusGroups.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusGroups.get'),
		),
	},
	'dataBook.referenceTicketStatusGroupsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusGroupsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusGroupsCreate.post'),
		),
	},
	'dataBook.referenceTicketStatusGroupsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusGroupsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusGroupsByIdEdit.post'),
		),
	},
	'dataBook.referenceTicketStatuses.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatuses.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatuses.get'),
		),
	},
	'dataBook.referenceTicketStatusesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusesCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusesCreate.post'),
		),
	},
	'dataBook.referenceTicketStatusesByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusesByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketStatusesByIdEdit.post'),
		),
	},
	'dataBook.referenceTicketSubtopics.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketSubtopics.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketSubtopics.get'),
		),
	},
	'dataBook.referenceTicketSubtopicsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketSubtopicsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketSubtopicsCreate.post'),
		),
	},
	'dataBook.referenceTicketSubtopicsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketSubtopicsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketSubtopicsByIdEdit.post'),
		),
	},
	'dataBook.referenceTicketTopics.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketTopics.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketTopics.get'),
		),
	},
	'dataBook.referenceTicketTopicsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketTopicsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketTopicsCreate.post'),
		),
	},
	'dataBook.referenceTicketTopicsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketTopicsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketTopicsByIdEdit.post'),
		),
	},
	'dataBook.referenceTicketTypes.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketTypes.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketTypes.get'),
		),
	},
	'dataBook.referenceTicketTypesCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketTypesCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketTypesCreate.post'),
		),
	},
	'dataBook.referenceTicketTypesByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceTicketTypesByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceTicketTypesByIdEdit.post'),
		),
	},
	'dataBook.referenceUnits.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceUnits.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceUnits.get'),
		),
	},
	'dataBook.referenceUnitsByCodeEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('dataBook.referenceUnitsByCodeEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('dataBook.referenceUnitsByCodeEdit.post'),
		),
	},
	'segments.list.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('segments.list.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('segments.list.get'),
		),
	},
	'settings.list.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('settings.list.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('settings.list.get'),
		),
	},
	'store.inventories.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.inventories.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.inventories.get'),
		),
	},
	'store.inventoriesUpload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.inventoriesUpload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.inventoriesUpload.post'),
		),
	},
	'store.offers.get': {
		input: createOperationInputSchema(getSimlaComOperation('store.offers.get')),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.offers.get'),
		),
	},
	'store.pricesUpload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.pricesUpload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.pricesUpload.post'),
		),
	},
	'store.productGroups.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.productGroups.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.productGroups.get'),
		),
	},
	'store.productGroupsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.productGroupsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.productGroupsCreate.post'),
		),
	},
	'store.productGroupsByExternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.productGroupsByExternalidEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.productGroupsByExternalidEdit.post'),
		),
	},
	'store.products.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.products.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.products.get'),
		),
	},
	'store.productsBatchCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.productsBatchCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.productsBatchCreate.post'),
		),
	},
	'store.productsBatchEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.productsBatchEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.productsBatchEdit.post'),
		),
	},
	'store.productsProperties.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.productsProperties.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.productsProperties.get'),
		),
	},
	'store.productsPropertiesValues.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('store.productsPropertiesValues.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('store.productsPropertiesValues.get'),
		),
	},
	'tasks.list.get': {
		input: createOperationInputSchema(getSimlaComOperation('tasks.list.get')),
		output: createOperationOutputSchema(getSimlaComOperation('tasks.list.get')),
	},
	'tasks.create.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('tasks.create.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tasks.create.post'),
		),
	},
	'tasks.history.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('tasks.history.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tasks.history.get'),
		),
	},
	'tasks.getById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('tasks.getById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tasks.getById.get'),
		),
	},
	'tasks.getByIdComments.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('tasks.getByIdComments.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tasks.getByIdComments.get'),
		),
	},
	'tasks.byIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('tasks.byIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tasks.byIdEdit.post'),
		),
	},
	'telephony.callEvent.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('telephony.callEvent.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('telephony.callEvent.post'),
		),
	},
	'telephony.calls.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('telephony.calls.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('telephony.calls.get'),
		),
	},
	'telephony.callsUpload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('telephony.callsUpload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('telephony.callsUpload.post'),
		),
	},
	'telephony.getCallsByIdRecord.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('telephony.getCallsByIdRecord.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('telephony.getCallsByIdRecord.get'),
		),
	},
	'telephony.manager.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('telephony.manager.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('telephony.manager.get'),
		),
	},
	'tickets.list.get': {
		input: createOperationInputSchema(getSimlaComOperation('tickets.list.get')),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.list.get'),
		),
	},
	'tickets.comments.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.comments.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.comments.get'),
		),
	},
	'tickets.commentsCreate.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.commentsCreate.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.commentsCreate.post'),
		),
	},
	'tickets.commentsByIdDelete.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.commentsByIdDelete.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.commentsByIdDelete.post'),
		),
	},
	'tickets.commentsByIdEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.commentsByIdEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.commentsByIdEdit.post'),
		),
	},
	'tickets.create.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.create.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.create.post'),
		),
	},
	'tickets.history.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.history.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.history.get'),
		),
	},
	'tickets.getByExternalid.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.getByExternalid.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.getByExternalid.get'),
		),
	},
	'tickets.byExternalidEdit.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('tickets.byExternalidEdit.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('tickets.byExternalidEdit.post'),
		),
	},
	'users.userGroups.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('users.userGroups.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('users.userGroups.get'),
		),
	},
	'users.list.get': {
		input: createOperationInputSchema(getSimlaComOperation('users.list.get')),
		output: createOperationOutputSchema(getSimlaComOperation('users.list.get')),
	},
	'users.getById.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('users.getById.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('users.getById.get'),
		),
	},
	'users.byIdStatus.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('users.byIdStatus.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('users.byIdStatus.post'),
		),
	},
	'verification.smsConfirm.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('verification.smsConfirm.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('verification.smsConfirm.post'),
		),
	},
	'verification.getSmsByCheckidStatus.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('verification.getSmsByCheckidStatus.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('verification.getSmsByCheckidStatus.get'),
		),
	},
	'webAnalytics.clientIdsUpload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('webAnalytics.clientIdsUpload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('webAnalytics.clientIdsUpload.post'),
		),
	},
	'webAnalytics.sourcesUpload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('webAnalytics.sourcesUpload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('webAnalytics.sourcesUpload.post'),
		),
	},
	'webAnalytics.visitsUpload.post': {
		input: createOperationInputSchema(
			getSimlaComOperation('webAnalytics.visitsUpload.post'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('webAnalytics.visitsUpload.post'),
		),
	},
	'statistics.statisticUpdate.get': {
		input: createOperationInputSchema(
			getSimlaComOperation('statistics.statisticUpdate.get'),
		),
		output: createOperationOutputSchema(
			getSimlaComOperation('statistics.statisticUpdate.get'),
		),
	},
};

export const simlaComEndpointMeta: RequiredPluginEndpointMeta<
	typeof simlaComEndpointsNested
> = {
	'api.apiVersions.get': {
		riskLevel: 'read',
		description: 'Getting the list of available api versions',
	},
	'api.credentials.get': {
		riskLevel: 'read',
		description:
			'Getting the list of available api methods and stores for current key',
	},
	'cost.list.get': {
		riskLevel: 'read',
		description: 'Getting of the cost list, adequate for the given filter',
	},
	'cost.create.post': {
		riskLevel: 'write',
		description: 'Creation of the cost',
	},
	'cost.delete.post': {
		riskLevel: 'destructive',
		description: 'Batch removing of costs',
	},
	'cost.upload.post': {
		riskLevel: 'write',
		description: 'Batch loading of costs',
	},
	'cost.getById.get': {
		riskLevel: 'read',
		description: 'Getting of cost information',
	},
	'cost.byIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Cost removing',
	},
	'cost.byIdEdit.post': {
		riskLevel: 'write',
		description: 'Cost editing',
	},
	'customFields.list.get': {
		riskLevel: 'read',
		description: 'Getting the list of custom fields',
	},
	'customFields.dictionaries.get': {
		riskLevel: 'read',
		description: 'Getting the list of custom directory',
	},
	'customFields.dictionariesCreate.post': {
		riskLevel: 'write',
		description: 'Directory fields creation',
	},
	'customFields.getDictionariesByCode.get': {
		riskLevel: 'read',
		description: 'Getting information on directory',
	},
	'customFields.dictionariesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Directory fields editing',
	},
	'customFields.byEntityCreate.post': {
		riskLevel: 'write',
		description: 'Custom fields creation',
	},
	'customFields.getByEntityByCode.get': {
		riskLevel: 'read',
		description: 'Getting information on custom fields',
	},
	'customFields.byEntityByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Custom fields editing',
	},
	'customers.list.get': {
		riskLevel: 'read',
		description: 'Getting the list of customers matched the specified filter',
	},
	'customers.combine.post': {
		riskLevel: 'destructive',
		description: 'Combining of customers',
	},
	'customers.create.post': {
		riskLevel: 'write',
		description: 'Customer creation',
	},
	'customers.fixExternalIds.post': {
		riskLevel: 'write',
		description: 'The mass recording of customers external ID',
	},
	'customers.history.get': {
		riskLevel: 'read',
		description: 'Getting the customer change history',
	},
	'customers.notes.get': {
		riskLevel: 'read',
		description: 'Getting the notes',
	},
	'customers.notesCreate.post': {
		riskLevel: 'write',
		description: 'Note creation',
	},
	'customers.notesByIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Note removing',
	},
	'customers.pushTokens.get': {
		riskLevel: 'read',
		description: 'Get customer mobile app push token data',
	},
	'customers.pushTokensBatch.post': {
		riskLevel: 'write',
		description: 'Batch create/edit customer mobile app push tokens',
	},
	'customers.upload.post': {
		riskLevel: 'write',
		description: 'Packet customers uploading',
	},
	'customers.getByExternalid.get': {
		riskLevel: 'read',
		description: 'Getting information on customer',
	},
	'customers.byExternalidEdit.post': {
		riskLevel: 'write',
		description: 'Customer editing',
	},
	'customers.byExternalidSubscriptions.post': {
		riskLevel: 'write',
		description: 'Subscribe/unsubscribe customer to mailings',
	},
	'corporateCustomers.list.get': {
		riskLevel: 'read',
		description:
			'Getting the list of corporate customers matched the specified filter',
	},
	'corporateCustomers.combine.post': {
		riskLevel: 'destructive',
		description: 'Combining of corporate customers',
	},
	'corporateCustomers.create.post': {
		riskLevel: 'write',
		description: 'Corporate customer creation',
	},
	'corporateCustomers.fixExternalIds.post': {
		riskLevel: 'write',
		description: 'The mass recording of corporate customers external ID',
	},
	'corporateCustomers.history.get': {
		riskLevel: 'read',
		description: 'Getting the corporate customer change history',
	},
	'corporateCustomers.notes.get': {
		riskLevel: 'read',
		description: 'Getting the notes',
	},
	'corporateCustomers.notesCreate.post': {
		riskLevel: 'write',
		description: 'Note creation',
	},
	'corporateCustomers.notesByIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Note removing',
	},
	'corporateCustomers.upload.post': {
		riskLevel: 'write',
		description: 'Packet corporate customers uploading',
	},
	'corporateCustomers.getByExternalid.get': {
		riskLevel: 'read',
		description: 'Getting information on corporate customer',
	},
	'corporateCustomers.getByExternalidAddresses.get': {
		riskLevel: 'read',
		description: 'List of addresses for a corporate customer',
	},
	'corporateCustomers.byExternalidAddressesCreate.post': {
		riskLevel: 'write',
		description: 'Creating an address for a corporate customer',
	},
	'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post': {
		riskLevel: 'write',
		description: 'Editing the address of the corporate customer',
	},
	'corporateCustomers.getByExternalidCompanies.get': {
		riskLevel: 'read',
		description: 'List of companies of a contact person',
	},
	'corporateCustomers.byExternalidCompaniesCreate.post': {
		riskLevel: 'write',
		description: 'Creating a company for a corporate customer',
	},
	'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post': {
		riskLevel: 'write',
		description: 'Editing the company of the corporate customer',
	},
	'corporateCustomers.getByExternalidContacts.get': {
		riskLevel: 'read',
		description: 'List of contact persons of the corporate customer',
	},
	'corporateCustomers.byExternalidContactsCreate.post': {
		riskLevel: 'write',
		description:
			'Creating a link between a corporate customer and a contact person',
	},
	'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post': {
		riskLevel: 'write',
		description:
			'Editing the link between the corporate customer and the contact person',
	},
	'corporateCustomers.byExternalidEdit.post': {
		riskLevel: 'write',
		description: 'Corporate customer editing',
	},
	'customerInteraction.cartBySiteClear.post': {
		riskLevel: 'destructive',
		description: 'Cleaning the current cart of the customer',
	},
	'customerInteraction.cartBySiteSet.post': {
		riskLevel: 'write',
		description: 'Creating or overwriting cart data',
	},
	'customerInteraction.getCartBySiteByCustomerid.get': {
		riskLevel: 'read',
		description: 'Getting the current cart of the customer',
	},
	'customerInteraction.getFavoritesBySiteByCustomerid.get': {
		riskLevel: 'read',
		description: 'Getting a list of favorites for the customer',
	},
	'customerInteraction.favoritesBySiteByCustomeridAdd.post': {
		riskLevel: 'write',
		description: "Adding a product offer to the customer's list of favorites",
	},
	'customerInteraction.favoritesBySiteByCustomeridRemove.post': {
		riskLevel: 'write',
		description:
			"Deleting a product offer from the customer's list of favorites",
	},
	'deliveries.deliveryCalculate.post': {
		riskLevel: 'read',
		description: 'Calculation of the delivery cost',
	},
	'deliveries.deliveryGenericBySubcodeTracking.post': {
		riskLevel: 'write',
		description: 'Updating of delivery statuses',
	},
	'deliveries.deliveryShipments.get': {
		riskLevel: 'read',
		description: 'Getting the list of shipments to delivery services',
	},
	'deliveries.deliveryShipmentsCreate.post': {
		riskLevel: 'destructive',
		description: 'Shipment creation',
	},
	'deliveries.getDeliveryShipmentsById.get': {
		riskLevel: 'read',
		description: 'Getting information on shipment',
	},
	'deliveries.deliveryShipmentsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Shipment editing',
	},
	'files.list.get': {
		riskLevel: 'read',
		description: 'Getting the list of files according to the selected filter',
	},
	'files.upload.post': {
		riskLevel: 'write',
		description: 'Uploading the file to server',
	},
	'files.getById.get': {
		riskLevel: 'read',
		description: 'Getting information about the file',
	},
	'files.byIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Deleting the file',
	},
	'files.byIdDownload.get': {
		riskLevel: 'read',
		description: 'File downloading',
	},
	'files.byIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing the file',
	},
	'integration.getIntegrationModulesByCode.get': {
		riskLevel: 'read',
		description: 'Getting the integration module',
	},
	'integration.integrationModulesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Integration module creation/editing',
	},
	'knowledgeBase.documents.get': {
		riskLevel: 'read',
		description:
			'Getting the list of knowledge base documents matching the filter',
	},
	'knowledgeBase.documentsCreate.post': {
		riskLevel: 'write',
		description: 'Knowledge base document creation',
	},
	'knowledgeBase.documentsHistory.get': {
		riskLevel: 'read',
		description: 'Getting the change history of knowledge base documents',
	},
	'knowledgeBase.getDocumentsById.get': {
		riskLevel: 'read',
		description: 'Getting a knowledge base document',
	},
	'knowledgeBase.documentsByIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Knowledge base document deletion',
	},
	'knowledgeBase.documentsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Knowledge base document editing',
	},
	'knowledgeBase.sections.get': {
		riskLevel: 'read',
		description: 'Getting the list of knowledge base sections',
	},
	'knowledgeBase.sectionsCreate.post': {
		riskLevel: 'write',
		description: 'Knowledge base section creation',
	},
	'knowledgeBase.sectionsByIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Knowledge base section deletion',
	},
	'knowledgeBase.sectionsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Knowledge base section editing',
	},
	'loyalty.accountCreate.post': {
		riskLevel: 'write',
		description: 'Adding a customer to the loyalty program',
	},
	'loyalty.getAccountById.get': {
		riskLevel: 'read',
		description:
			'Getting information about participation in the loyalty program',
	},
	'loyalty.accountByIdActivate.post': {
		riskLevel: 'write',
		description: 'Activation of participation in the loyalty program',
	},
	'loyalty.accountByIdBonusCharge.post': {
		riskLevel: 'destructive',
		description: 'Charging off bonuses to a loyalty program participant',
	},
	'loyalty.accountByIdBonusCredit.post': {
		riskLevel: 'destructive',
		description: 'Accrual of bonuses for participation in the loyalty program',
	},
	'loyalty.getAccountByIdBonusOperations.get': {
		riskLevel: 'read',
		description: 'History of the bonus account for a specific participation',
	},
	'loyalty.getAccountByIdBonusByStatusDetails.get': {
		riskLevel: 'read',
		description: 'Getting details on the bonus account',
	},
	'loyalty.accountByIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing participation in the loyalty program',
	},
	'loyalty.accounts.get': {
		riskLevel: 'read',
		description: 'List participation in the loyalty program',
	},
	'loyalty.bonusOperations.get': {
		riskLevel: 'read',
		description: 'History of the bonus account for all participations',
	},
	'loyalty.calculate.post': {
		riskLevel: 'read',
		description: 'Calculation of a maximum discount',
	},
	'loyalty.loyalties.get': {
		riskLevel: 'read',
		description: 'List of loyalty programs',
	},
	'loyalty.getLoyaltiesById.get': {
		riskLevel: 'read',
		description: 'Getting information about the loyalty program',
	},
	'notifications.send.post': {
		riskLevel: 'destructive',
		description: 'Sending notification',
	},
	'orders.list.get': {
		riskLevel: 'read',
		description: 'Getting the list of orders matched the specified filter',
	},
	'orders.combine.post': {
		riskLevel: 'destructive',
		description: 'Combining of orders',
	},
	'orders.create.post': {
		riskLevel: 'write',
		description: 'Order creation',
	},
	'orders.fixExternalIds.post': {
		riskLevel: 'write',
		description: 'The mass recording of orders external ID',
	},
	'orders.history.get': {
		riskLevel: 'read',
		description: 'Getting the order change history',
	},
	'orders.linksCreate.post': {
		riskLevel: 'write',
		description: 'Creating a link between orders',
	},
	'orders.loyaltyApply.post': {
		riskLevel: 'destructive',
		description: 'Applying bonuses according to the loyalty program',
	},
	'orders.loyaltyCancelBonusOperations.post': {
		riskLevel: 'destructive',
		description: 'Cancellation of bonus operations on the Loyalty Program',
	},
	'orders.paymentsCreate.post': {
		riskLevel: 'write',
		description: 'Payment creation',
	},
	'orders.paymentsByIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Payment removing',
	},
	'orders.paymentsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Payment editing',
	},
	'orders.statuses.get': {
		riskLevel: 'read',
		description: 'Getting the list of order statuses',
	},
	'orders.upload.post': {
		riskLevel: 'write',
		description: 'Packet orders uploading',
	},
	'orders.getByExternalid.get': {
		riskLevel: 'read',
		description: 'Getting information on order',
	},
	'orders.byExternalidDeliveryCancel.post': {
		riskLevel: 'destructive',
		description: 'Cancellation of the integrated delivery',
	},
	'orders.byExternalidEdit.post': {
		riskLevel: 'write',
		description: 'Order editing',
	},
	'orders.byExternalidPlatesByPlateidPrint.get': {
		riskLevel: 'read',
		description: 'Getting the file of the printed form for the order',
	},
	'ordersPicking.packs.get': {
		riskLevel: 'read',
		description: 'Getting the list of packs matched the specified filter',
	},
	'ordersPicking.packsCreate.post': {
		riskLevel: 'write',
		description: 'Pack creation',
	},
	'ordersPicking.packsHistory.get': {
		riskLevel: 'read',
		description: 'Getting the history of order packing',
	},
	'ordersPicking.getPacksById.get': {
		riskLevel: 'read',
		description: 'Getting information on pack',
	},
	'ordersPicking.packsByIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Pack removing',
	},
	'ordersPicking.packsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Pack editing',
	},
	'payments.paymentCheck.post': {
		riskLevel: 'read',
		description: 'Checking the invoice',
	},
	'payments.paymentCreateInvoice.post': {
		riskLevel: 'destructive',
		description: 'Creating an invoice',
	},
	'payments.paymentInvoiceImport.post': {
		riskLevel: 'write',
		description: 'Import the invoice',
	},
	'payments.getPaymentInvoiceByInvoiceuuid.get': {
		riskLevel: 'read',
		description: 'Get the invoice',
	},
	'payments.paymentUpdateInvoice.post': {
		riskLevel: 'destructive',
		description: 'Changing the invoice',
	},
	'dataBook.referenceCostGroups.get': {
		riskLevel: 'read',
		description: 'Getting of the costs groups list',
	},
	'dataBook.referenceCostGroupsByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Editing costs groups',
	},
	'dataBook.referenceCostItems.get': {
		riskLevel: 'read',
		description: 'Getting of the costs items list',
	},
	'dataBook.referenceCostItemsByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Editing costs items',
	},
	'dataBook.referenceCountries.get': {
		riskLevel: 'read',
		description: 'Getting the list of available country codes',
	},
	'dataBook.referenceCouriers.get': {
		riskLevel: 'read',
		description: 'Getting the list of couriers',
	},
	'dataBook.referenceCouriersCreate.post': {
		riskLevel: 'write',
		description: 'Courier creation',
	},
	'dataBook.referenceCouriersByIdEdit.post': {
		riskLevel: 'write',
		description: 'Courier editing',
	},
	'dataBook.referenceCurrencies.get': {
		riskLevel: 'read',
		description: 'Getting the list of currencies',
	},
	'dataBook.referenceCurrenciesCreate.post': {
		riskLevel: 'write',
		description: 'Currency creation',
	},
	'dataBook.referenceCurrenciesByIdEdit.post': {
		riskLevel: 'write',
		description: 'Currency editing',
	},
	'dataBook.referenceDeliveryServices.get': {
		riskLevel: 'read',
		description: 'Getting the list of delivery services',
	},
	'dataBook.referenceDeliveryServicesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Delivery service creation/editing',
	},
	'dataBook.referenceDeliveryTypes.get': {
		riskLevel: 'read',
		description: 'Getting the list of delivery types',
	},
	'dataBook.referenceDeliveryTypesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Delivery type creation/editing',
	},
	'dataBook.referenceLegalEntities.get': {
		riskLevel: 'read',
		description: 'Getting the list of legal entities',
	},
	'dataBook.referenceLegalEntitiesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Editing of information on legal entity',
	},
	'dataBook.referenceMgChannels.get': {
		riskLevel: 'read',
		description: 'Getting a list of MessageGateway channels',
	},
	'dataBook.referenceOrderMethods.get': {
		riskLevel: 'read',
		description: 'Getting the list of order methods',
	},
	'dataBook.referenceOrderMethodsByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Order method creation/editing',
	},
	'dataBook.referenceOrderTypes.get': {
		riskLevel: 'read',
		description: 'Getting the list of order types',
	},
	'dataBook.referenceOrderTypesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Order type creation/editing',
	},
	'dataBook.referencePaymentStatuses.get': {
		riskLevel: 'read',
		description: 'Getting the list of payment statuses',
	},
	'dataBook.referencePaymentStatusesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Payment status creation/editing',
	},
	'dataBook.referencePaymentTypes.get': {
		riskLevel: 'read',
		description: 'Getting the list of payment types',
	},
	'dataBook.referencePaymentTypesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Payment type creation/editing',
	},
	'dataBook.referencePriceTypes.get': {
		riskLevel: 'read',
		description: 'Getting the list of price types',
	},
	'dataBook.referencePriceTypesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Price type creation/editing',
	},
	'dataBook.referenceProductStatuses.get': {
		riskLevel: 'read',
		description: 'Getting the list of item statuses in order',
	},
	'dataBook.referenceProductStatusesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Item status creation/editing',
	},
	'dataBook.referencePushCategories.get': {
		riskLevel: 'read',
		description: 'Get customer mobile push notification categories',
	},
	'dataBook.referencePushCategoriesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Create/edit customer mobile push notification category',
	},
	'dataBook.referenceSites.get': {
		riskLevel: 'read',
		description: 'Getting the stores list',
	},
	'dataBook.referenceSitesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Store creation/editing',
	},
	'dataBook.getReferenceSitesByCodeTracker.get': {
		riskLevel: 'read',
		description: 'Getting store tracker settings',
	},
	'dataBook.referenceStatusGroups.get': {
		riskLevel: 'read',
		description: 'Getting the list of order status groups',
	},
	'dataBook.referenceStatuses.get': {
		riskLevel: 'read',
		description: 'Getting the list of order statuses',
	},
	'dataBook.referenceStatusesByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Order status creation/editing',
	},
	'dataBook.referenceStores.get': {
		riskLevel: 'read',
		description: 'Getting the list of warehouses',
	},
	'dataBook.referenceStoresByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Creation/editing of information on warehouse',
	},
	'dataBook.referenceSubscriptions.get': {
		riskLevel: 'read',
		description: 'Subscription categories list',
	},
	'dataBook.referenceSubscriptionsByChannelByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Create/edit subscription category',
	},
	'dataBook.referenceTicketChannels.get': {
		riskLevel: 'read',
		description: 'Getting ticket channel list',
	},
	'dataBook.referenceTicketChannelsCreate.post': {
		riskLevel: 'write',
		description: 'Creating a ticket channel',
	},
	'dataBook.referenceTicketChannelsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing a ticket channel',
	},
	'dataBook.referenceTicketStatusGroups.get': {
		riskLevel: 'read',
		description: 'Getting ticket status group list',
	},
	'dataBook.referenceTicketStatusGroupsCreate.post': {
		riskLevel: 'write',
		description: 'Creating a ticket status group',
	},
	'dataBook.referenceTicketStatusGroupsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing a ticket status group',
	},
	'dataBook.referenceTicketStatuses.get': {
		riskLevel: 'read',
		description: 'Getting ticket status list',
	},
	'dataBook.referenceTicketStatusesCreate.post': {
		riskLevel: 'write',
		description: 'Creating a ticket status',
	},
	'dataBook.referenceTicketStatusesByIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing a ticket status',
	},
	'dataBook.referenceTicketSubtopics.get': {
		riskLevel: 'read',
		description: 'Getting ticket subtopic list',
	},
	'dataBook.referenceTicketSubtopicsCreate.post': {
		riskLevel: 'write',
		description: 'Creating a ticket subtopic',
	},
	'dataBook.referenceTicketSubtopicsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing a ticket subtopic',
	},
	'dataBook.referenceTicketTopics.get': {
		riskLevel: 'read',
		description: 'Getting ticket topic list',
	},
	'dataBook.referenceTicketTopicsCreate.post': {
		riskLevel: 'write',
		description: 'Creating a ticket topic',
	},
	'dataBook.referenceTicketTopicsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing a ticket topic',
	},
	'dataBook.referenceTicketTypes.get': {
		riskLevel: 'read',
		description: 'Getting ticket type list',
	},
	'dataBook.referenceTicketTypesCreate.post': {
		riskLevel: 'write',
		description: 'Creating a ticket type',
	},
	'dataBook.referenceTicketTypesByIdEdit.post': {
		riskLevel: 'write',
		description: 'Editing a ticket type',
	},
	'dataBook.referenceUnits.get': {
		riskLevel: 'read',
		description: 'Getting the list of units',
	},
	'dataBook.referenceUnitsByCodeEdit.post': {
		riskLevel: 'write',
		description: 'Unit creation/edition',
	},
	'segments.list.get': {
		riskLevel: 'read',
		description: 'Getting the list of customer segments',
	},
	'settings.list.get': {
		riskLevel: 'read',
		description: 'Getting system settings',
	},
	'store.inventories.get': {
		riskLevel: 'read',
		description: 'Getting the leftover stocks and purchasing prices',
	},
	'store.inventoriesUpload.post': {
		riskLevel: 'write',
		description: 'Updating the leftover stocks and purchasing prices',
	},
	'store.offers.get': {
		riskLevel: 'read',
		description: 'Getting a list of offers that meet the specified filter',
	},
	'store.pricesUpload.post': {
		riskLevel: 'write',
		description: 'SKU prices updating',
	},
	'store.productGroups.get': {
		riskLevel: 'read',
		description: 'Getting the list of product groups',
	},
	'store.productGroupsCreate.post': {
		riskLevel: 'write',
		description: 'Adding a product group',
	},
	'store.productGroupsByExternalidEdit.post': {
		riskLevel: 'write',
		description: 'Editing a product group',
	},
	'store.products.get': {
		riskLevel: 'read',
		description: 'Getting the list of products and SKU',
	},
	'store.productsBatchCreate.post': {
		riskLevel: 'write',
		description: 'Batch adding of products and services',
	},
	'store.productsBatchEdit.post': {
		riskLevel: 'write',
		description: 'Batch editing of products and services',
	},
	'store.productsProperties.get': {
		riskLevel: 'read',
		description:
			'Getting the list of item properties, matching the specified filter',
	},
	'store.productsPropertiesValues.get': {
		riskLevel: 'read',
		description:
			'Getting a list of property values for products or services that match the specified filters',
	},
	'tasks.list.get': {
		riskLevel: 'read',
		description: 'Getting the task list',
	},
	'tasks.create.post': {
		riskLevel: 'write',
		description: 'Task creation',
	},
	'tasks.history.get': {
		riskLevel: 'read',
		description: 'Getting the task change history',
	},
	'tasks.getById.get': {
		riskLevel: 'read',
		description: 'Getting information on task',
	},
	'tasks.getByIdComments.get': {
		riskLevel: 'read',
		description: 'Receiving comments on the task',
	},
	'tasks.byIdEdit.post': {
		riskLevel: 'write',
		description: 'Task editing',
	},
	'telephony.callEvent.post': {
		riskLevel: 'write',
		description: 'Call events',
	},
	'telephony.calls.get': {
		riskLevel: 'read',
		description: 'Getting a call list',
	},
	'telephony.callsUpload.post': {
		riskLevel: 'write',
		description: 'Calls uploading',
	},
	'telephony.getCallsByIdRecord.get': {
		riskLevel: 'read',
		description: 'Getting call recording',
	},
	'telephony.manager.get': {
		riskLevel: 'read',
		description: 'Getting the responsible manager',
	},
	'tickets.list.get': {
		riskLevel: 'read',
		description: 'get_intaro_crm_api_tickets_list_v5',
	},
	'tickets.comments.get': {
		riskLevel: 'read',
		description: 'Get ticket comments',
	},
	'tickets.commentsCreate.post': {
		riskLevel: 'write',
		description: 'Create a ticket comment',
	},
	'tickets.commentsByIdDelete.post': {
		riskLevel: 'destructive',
		description: 'Delete a ticket comment',
	},
	'tickets.commentsByIdEdit.post': {
		riskLevel: 'write',
		description: 'Edit a ticket comment',
	},
	'tickets.create.post': {
		riskLevel: 'write',
		description: 'Creating a ticket',
	},
	'tickets.history.get': {
		riskLevel: 'read',
		description: 'Getting ticket change history',
	},
	'tickets.getByExternalid.get': {
		riskLevel: 'read',
		description: 'Get a ticket',
	},
	'tickets.byExternalidEdit.post': {
		riskLevel: 'write',
		description: 'Editing a ticket',
	},
	'users.userGroups.get': {
		riskLevel: 'read',
		description: 'Getting the list of user groups',
	},
	'users.list.get': {
		riskLevel: 'read',
		description: 'Getting the list of users matched the specified filter',
	},
	'users.getById.get': {
		riskLevel: 'read',
		description: 'Getting information on user',
	},
	'users.byIdStatus.post': {
		riskLevel: 'write',
		description: 'Change user status',
	},
	'verification.smsConfirm.post': {
		riskLevel: 'write',
		description: 'Confirmation of verification',
	},
	'verification.getSmsByCheckidStatus.get': {
		riskLevel: 'read',
		description: 'Checking the verification status',
	},
	'webAnalytics.clientIdsUpload.post': {
		riskLevel: 'write',
		description: 'Batch uploading of web analytics clientId',
	},
	'webAnalytics.sourcesUpload.post': {
		riskLevel: 'write',
		description: 'Batch uploading of sources',
	},
	'webAnalytics.visitsUpload.post': {
		riskLevel: 'write',
		description: 'Batch uploading of visits',
	},
	'statistics.statisticUpdate.get': {
		riskLevel: 'read',
		description: 'Statistics updating',
	},
};
