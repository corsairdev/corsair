import type { JsonValue } from './operation-types';

// Component types are derived from the official Simla.com OpenAPI v5 schemas.
export type OpenApiApiVersionsResponse = {
	success?: boolean;
	versions?: Array<string>;
};
export type OpenApiApiCredentialsResponse = {
	success?: boolean;
	credentials?: Array<string>;
	scopes?: Array<string>;
	siteAccess?: 'access_full' | 'access_selective';
	sitesAvailable?: Array<string>;
};
export type OpenApiCostsListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse13;
	costs?: Array<OpenApiCost>;
};
export type OpenApiCostCreateInput = {
	site?: string;
	cost?: OpenApiSerializedCost;
};
export type OpenApiCostsCreateResponse = { success?: boolean; id?: number };
export type OpenApiCostDeleteBatchInput = { ids?: Array<number> };
export type OpenApiCostDeleteBatchResponse = {
	success?: boolean;
	count?: number;
	notRemovedIds?: Array<number>;
};
export type OpenApiCostUploadInput = { costs?: Array<OpenApiSerializedCost> };
export type OpenApiCostsUploadResponse = {
	success?: boolean;
	uploadedCosts?: Array<number>;
};
export type OpenApiCostGetResponse = { success?: boolean; cost?: OpenApiCost };
export type OpenApiSimpleResponse4 = { success?: boolean };
export type OpenApiCostEditInput = {
	site?: string;
	cost?: OpenApiSerializedCost;
};
export type OpenApiCostsEditResponse = { success?: boolean; id?: number };
export type OpenApiCustomFieldsListApiDocModel = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	customFields?: Array<OpenApiCustomFieldApiDocModel>;
};
export type OpenApiCustomDictionariesList = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	customDictionaries?: Array<OpenApiCustomDictionary>;
};
export type OpenApiCustomDictionariesCreate = {
	customDictionary?: OpenApiSerializedCustomDictionary;
};
export type OpenApiCustomDictionariesCreate2 = {
	success?: boolean;
	code?: string;
};
export type OpenApiCustomDictionariesGet = {
	success?: boolean;
	customDictionary?: OpenApiCustomDictionary;
};
export type OpenApiCustomDictionariesEdit = {
	customDictionary?: OpenApiSerializedCustomDictionary2;
};
export type OpenApiCustomDictionaryEditValidation = {
	name: string;
	elements: Array<OpenApiSerializedCustomDictionaryElement>;
};
export type OpenApiCustomDictionariesEdit2 = {
	success?: boolean;
	code?: string;
};
export type OpenApiCustomFieldsCreateApiDocModel = {
	customField?: OpenApiSerializedCustomFieldApiDocModel;
};
export type OpenApiCustomFieldsCreate = { success?: boolean; code?: string };
export type OpenApiCustomFieldsGetApiDocModel = {
	success?: boolean;
	customField?: OpenApiCustomFieldApiDocModel;
};
export type OpenApiCustomFieldsEditApiDocModel = {
	customField?: OpenApiSerializedCustomFieldApiDocModel2;
};
export type OpenApiCustomFieldEditValidation = {
	name: string;
	ordering: number;
	displayArea?:
		| 'address'
		| 'customer'
		| 'delivery'
		| 'dimensions'
		| 'legal_details'
		| 'main_data'
		| 'payment'
		| 'shipment';
	viewMode?: 'editable' | 'not_editable' | 'miss';
	viewModeMobile?: 'editable' | 'not_editable' | 'miss';
};
export type OpenApiCustomFieldsEdit = { success?: boolean; code?: string };
export type OpenApiCustomersListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	customers?: Array<OpenApiCustomer>;
};
export type OpenApiCustomersCombineInput = {
	customers?: Array<OpenApiSerializedCustomerReference>;
	resultCustomer: OpenApiSerializedCustomerReference;
};
export type OpenApiSerializedCustomerReference = { id: number };
export type OpenApiSimpleResponse = { success?: boolean };
export type OpenApiCustomerCreateInput = {
	site?: string;
	customer?: OpenApiSerializedCustomer;
};
export type OpenApiCustomersCreateResponse = { success?: boolean; id?: number };
export type OpenApiCustomersFixExternalRowCollection = {
	customers?: Array<OpenApiFixExternalRow2>;
};
export type OpenApiCustomersHistoryResponseV4 = {
	success?: boolean;
	generatedAt?: string;
	history?: Array<OpenApiCustomerHistory>;
	pagination?: OpenApiPaginationResponse;
};
export type OpenApiCustomerNotesListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	notes?: Array<OpenApiCustomerNote>;
};
export type OpenApiCustomerNoteCreateInput = {
	site?: string;
	note?: OpenApiSerializedCustomerNote;
};
export type OpenApiCustomerNoteCreateResponse = {
	success?: boolean;
	id?: number;
};
export type OpenApiPushTokenResponse = {
	success?: boolean;
	pushTokens?: Array<OpenApiPushToken>;
};
export type OpenApiPushTokenInput = {
	customer: OpenApiSerializedRelationAbstractCustomer;
	token?: string;
	fid?: string;
	type: string;
	deviceType: 'android' | 'ios';
	categories?: Array<string>;
};
export type OpenApiCustomerUploadInput = {
	site?: string;
	customers?: Array<OpenApiSerializedCustomer3>;
};
export type OpenApiCustomersUploadResponse = {
	success?: boolean;
	uploadedCustomers?: Array<OpenApiFixExternalRow>;
	failedCustomers?: Array<OpenApiEntityWithExternalId>;
};
export type OpenApiCustomersGetResponse = {
	success?: boolean;
	customer?: OpenApiCustomer;
};
export type OpenApiCustomerEditInput = {
	by?: string;
	site?: string;
	customer?: OpenApiSerializedCustomer2;
};
export type OpenApiCustomersEditResponse = {
	success?: boolean;
	id?: number;
	state?: string | null;
};
export type OpenApiCustomerSubscriptionInput = {
	by?: string;
	site?: string;
	subscriptions?: Array<OpenApiSerializedSubscription2>;
};
export type OpenApiCustomersCorporateListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	customersCorporate?: Array<OpenApiCustomerCorporate>;
};
export type OpenApiSerializedCustomerCorporate = {
	externalId?: string;
	createdAt?: string;
	vip?: boolean;
	bad?: boolean;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	discountCardNumber?: string | null;
	nickName?: string;
	managerId?: number;
	customerContacts?: Array<OpenApiSerializedCustomerContact3>;
	companies?: Array<OpenApiSerializedCompany3>;
	addresses?: Array<OpenApiCustomerAddress3>;
};
export type OpenApiCustomersCorporateFixExternalRowCollection = {
	customersCorporate?: Array<OpenApiFixExternalRow2>;
};
export type OpenApiCustomersCorporateHistoryResponse = {
	success?: boolean;
	generatedAt?: string;
	history?: Array<OpenApiCustomerCorporateHistory>;
	pagination?: OpenApiPaginationResponse;
};
export type OpenApiCustomerCorporateUploadInput = {
	site?: string;
	customersCorporate?: Array<OpenApiSerializedCustomerCorporate3>;
};
export type OpenApiCustomersCorporateGetResponse = {
	success?: boolean;
	customerCorporate?: OpenApiCustomerCorporate;
};
export type OpenApiAbstractResponse = { success?: boolean };
export type OpenApiCustomerAddress = {
	id?: number;
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	isMain?: boolean;
	externalId?: string;
	name?: string;
};
export type OpenApiSerializedCustomerAddress = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	isMain?: boolean;
	externalId?: string;
	name?: string;
};
export type OpenApiModifyResponse = { success?: boolean; id?: number };
export type OpenApiSerializedCustomerAddress2 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	isMain?: boolean;
	externalId?: string;
	name?: string;
};
export type OpenApiCompany = {
	isMain?: boolean;
	id?: number;
	externalId?: string;
	customer?: OpenApiSerializedEntityCustomer | null;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiCompanyContragent | null;
	address?: OpenApiCustomerAddress2 | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	costSumm?: number | null;
	ordersCount?: number | null;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiSerializedCompany = {
	isMain?: boolean;
	externalId?: string;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiSerializedCompanyContragent;
	customFields?: Record<string, JsonValue>;
	address?: OpenApiEntityWithExternalIdInput;
};
export type OpenApiSerializedCompany2 = {
	isMain?: boolean;
	externalId?: string;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiSerializedCompanyContragent2;
	customFields?: Record<string, JsonValue>;
	address?: OpenApiEntityWithExternalIdInput2;
};
export type OpenApiCustomerContact = {
	isMain?: boolean;
	id?: number;
	customer?: OpenApiSerializedRelationAbstractCustomer2 | null;
	companies?: Array<OpenApiCustomerContactCompany>;
};
export type OpenApiSerializedCustomerContact = {
	isMain?: boolean;
	customer?: OpenApiSerializedRelationAbstractCustomer3;
	companies?: Array<OpenApiSerializedCustomerContactCompany>;
};
export type OpenApiSerializedCustomerContact2 = {
	isMain?: boolean;
	companies?: Array<OpenApiSerializedCustomerContactCompany2>;
};
export type OpenApiSerializedCustomerCorporate2 = {
	externalId?: string;
	createdAt?: string;
	vip?: boolean;
	bad?: boolean;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	discountCardNumber?: string | null;
	nickName?: string;
	managerId?: number;
};
export type OpenApiCartSetInput2 = { cart?: OpenApiSerializedCart2 };
export type OpenApiSimpleResponse2 = { success?: boolean };
export type OpenApiCartSetInput = { cart?: OpenApiSerializedCart };
export type OpenApiCartGetResponse = { success?: boolean; cart?: OpenApiCart };
export type OpenApiFavoritesListResponse = {
	success?: boolean;
	favorites?: Array<OpenApiCustomerOffer>;
};
export type OpenApiFavoriteUpdateInput = {
	favorite?: OpenApiSerializedFavorite;
};
export type OpenApiCalculateRequest = {
	deliveryTypeCodes?: Array<string>;
	order?: OpenApiSerializedOrder4;
};
export type OpenApiCalculateResponse = {
	success?: boolean;
	calculations?: Array<OpenApiDeliveryCalculation>;
	failedCalculations?: Array<OpenApiFailedDeliveryCalculation>;
};
export type OpenApiRequestStatusUpdateItem = {
	deliveryId: string;
	trackNumber?: string;
	cost?: number;
	history?: Array<OpenApiStatusInfo>;
	extraData?: { [key: string]: string | undefined } & {};
};
export type OpenApiSimpleResponse5 = { success?: boolean };
export type OpenApiApiDeliveryShipmentListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	deliveryShipments?: Array<OpenApiDeliveryShipment>;
};
export type OpenApiApiDeliveryShipmentEditRequest = {
	deliveryType?: string;
	site?: string;
	deliveryShipment?: OpenApiDeliveryShipment2;
};
export type OpenApiApiDeliveryShipmentEditResponse = {
	success?: boolean;
	id?: number;
	status?: string | null;
};
export type OpenApiApiDeliveryShipmentGetResponse = {
	success?: boolean;
	deliveryShipment?: OpenApiDeliveryShipment;
};
export type OpenApiApiDeliveryShipmentEditRequest2 = {
	site?: string;
	deliveryShipment?: OpenApiDeliveryShipment3;
};
export type OpenApiFilesListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse15;
	files?: Array<OpenApiFile>;
};
export type OpenApiFileEditResponse = {
	success?: boolean;
	file?: OpenApiFile2;
};
export type OpenApiFileGetResponse = { success?: boolean; file?: OpenApiFile };
export type OpenApiFileEditInput = { file?: OpenApiFileEditValidation };
export type OpenApiApiIntegrationModuleGetResponse = {
	success?: boolean;
	integrationModule?: OpenApiIntegrationModule3;
};
export type OpenApiIntegrationModule = {
	code: string;
	integrationCode: string;
	active?: boolean;
	name?: string;
	logo?: string;
	clientId: string;
	baseUrl?: string;
	actions?: { [key: string]: string | undefined } & {};
	availableCountries?: Record<string, JsonValue>;
	accountUrl?: string;
	integrations?: Array<{
		telephony?: OpenApiConfiguration2;
		delivery?: OpenApiConfiguration3;
		store?: OpenApiConfiguration4;
		recommendation?: OpenApiConfiguration5;
		payment?: OpenApiPaymentConfiguration;
		embedJs?: OpenApiNativeConfiguration;
		mgTransport?: OpenApiTransportConfiguration;
		mgBot?: OpenApiBotConfiguration;
	}> | null;
};
export type OpenApiApiIntegrationModuleEditResponse = {
	success?: boolean;
	info?: Record<string, JsonValue>;
};
export type OpenApiRequires = { scopes: Array<string> };
export type OpenApiApiUpdateScopesResponse = {
	success?: boolean;
	apiKey?: string;
};
export type OpenApiKnowledgeBaseDocumentListResponse = {
	success?: boolean;
	pagination?: OpenApiCursorPaginationResponse;
	documents?: Array<OpenApiKnowledgeBaseDocument>;
};
export type OpenApiKnowledgeBaseDocumentCreateInput = {
	document?: OpenApiKnowledgeBaseDocumentInput;
};
export type OpenApiSimpleIdResponse = { success?: boolean; id?: number };
export type OpenApiKnowledgeBaseDocumentHistoryResponse = {
	success?: boolean;
	generatedAt?: string;
	pagination?: OpenApiPaginationResponse12;
	history?: Array<OpenApiKnowledgeBaseDocumentHistory>;
};
export type OpenApiKnowledgeBaseDocumentResponse = {
	success?: boolean;
	document?: OpenApiKnowledgeBaseDocument;
};
export type OpenApiKnowledgeBaseDocumentEditInput = {
	by?: string;
	document?: OpenApiKnowledgeBaseDocumentEditApiDocModel;
};
export type OpenApiKnowledgeBaseSectionListResponse = {
	success?: boolean;
	sections?: Array<OpenApiKnowledgeBaseSection>;
};
export type OpenApiKnowledgeBaseSectionCreateInput = {
	section?: OpenApiKnowledgeBaseSectionInput;
};
export type OpenApiKnowledgeBaseSectionEditInput = {
	section?: OpenApiKnowledgeBaseSectionEditApiDocModel;
};
export type OpenApiLoyaltyAccountCreateInput = {
	site?: string;
	loyaltyAccount?: OpenApiSerializedCreateLoyaltyAccount;
};
export type OpenApiLoyaltyAccountInfoResponse = {
	success?: boolean;
	loyaltyAccount?: OpenApiLoyaltyAccount3;
	warnings?: Record<string, JsonValue>;
};
export type OpenApiLoyaltyAccountGetResponse = {
	success?: boolean;
	loyaltyAccount?: OpenApiLoyaltyAccount2;
};
export type OpenApiLoyaltyAccountActivationResponse = {
	success?: boolean;
	loyaltyAccount?: OpenApiLoyaltyAccount3;
	verification?: OpenApiSmsVerification;
};
export type OpenApiLoyaltyBonusChargeInput = {
	amount: number;
	comment?: string;
};
export type OpenApiLoyaltyBonusCreditInput = {
	amount: number;
	activationDate?: string;
	expireDate?: string;
	comment?: string;
};
export type OpenApiLoyaltyBonusResponse = {
	success?: boolean;
	loyaltyBonus?: OpenApiLoyaltyBonus;
};
export type OpenApiLoyaltyAccountBonusOperationsResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse18;
	bonusOperations?: Array<OpenApiOperation2>;
};
export type OpenApiLoyaltyAccountBonusResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse19;
	statistic?: OpenApiLoyaltyBonusStatisticResponse;
	bonuses?: Array<OpenApiBonusDetail>;
};
export type OpenApiLoyaltyAccountEditInput = {
	loyaltyAccount?: OpenApiSerializedEditLoyaltyAccount;
};
export type OpenApiLoyaltyAccountGetResponse2 = {
	success?: boolean;
	loyaltyAccount?: OpenApiLoyaltyAccount3;
};
export type OpenApiLoyaltyAccountsListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse17;
	loyaltyAccounts?: Array<OpenApiLoyaltyAccount>;
};
export type OpenApiLoyaltyBonusOperationsResponse = {
	success?: boolean;
	pagination?: OpenApiCursorPaginationResponse3;
	bonusOperations?: Array<OpenApiOperation>;
};
export type OpenApiCalculateInput = {
	site?: string;
	order?: OpenApiSerializedOrder5;
	bonuses?: number;
};
export type OpenApiCalculateResponse2 = {
	success?: boolean;
	order?: OpenApiSerializedLoyaltyOrder2;
	calculations?: Array<OpenApiLoyaltyCalculation>;
	loyalty?: OpenApiSerializedLoyalty;
};
export type OpenApiLoyaltyListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse16;
	loyalties?: Array<OpenApiLoyalty>;
};
export type OpenApiLoyaltyGetResponse = {
	success?: boolean;
	loyalty?: OpenApiLoyalty2;
};
export type OpenApiNotificationInput = {
	notification?: OpenApiSerializedApiNotification;
};
export type OpenApiOrdersListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse3;
	orders?: Array<OpenApiOrder>;
};
export type OpenApiOrdersCombineInput = {
	order: OpenApiSerializedOrderReference2;
	resultOrder: OpenApiSerializedOrderReference2;
	technique?: 'merge' | 'ours' | 'summ' | 'theirs';
};
export type OpenApiSerializedOrderReference = { id: number };
export type OpenApiOrdersCombineResponse = {
	success?: boolean;
	errors?: Record<string, JsonValue>;
};
export type OpenApiOrderCreateInput = {
	site?: string;
	order?: OpenApiSerializedOrder;
};
export type OpenApiOrdersCreateResponse = {
	success?: boolean;
	id?: number;
	order?: OpenApiCreateOrder;
};
export type OpenApiOrdersFixExternalRowCollection = {
	orders?: Array<OpenApiFixExternalRow2>;
};
export type OpenApiOrdersHistoryResponseV4 = {
	success?: boolean;
	generatedAt?: string;
	history?: Array<OpenApiOrderHistory>;
	pagination?: OpenApiPaginationResponse4;
};
export type OpenApiOrderLinkCreateInput = {
	site?: string;
	link?: OpenApiSerializedOrderLink;
};
export type OpenApiOrderLinkCreateResponse = { success?: boolean };
export type OpenApiApplyInput = {
	site?: string;
	order?: OpenApiSerializedEntityOrder;
	bonuses?: number;
};
export type OpenApiApplyResponse = {
	success?: boolean;
	order?: OpenApiSerializedLoyaltyOrder;
	verification?: OpenApiSmsVerification2;
};
export type OpenApiCancelBonusOperationsInput = {
	site?: string;
	order?: OpenApiSerializedEntityOrder;
};
export type OpenApiCancelBonusOperationsResponse = {
	success?: boolean;
	order?: OpenApiOrder4;
};
export type OpenApiPaymentCreateInput = {
	site?: string;
	payment?: OpenApiSerializedPayment;
};
export type OpenApiPaymentCreateResponse = { success?: boolean; id?: number };
export type OpenApiPaymentEditInput = {
	by?: string;
	site?: string;
	payment?: OpenApiSerializedPayment2;
};
export type OpenApiPaymentEditResponse = { success?: boolean; id?: number };
export type OpenApiOrdersStatusesResponse = {
	success?: boolean;
	orders?: Array<OpenApiOrderStatusItem>;
};
export type OpenApiOrderUploadInput = {
	site?: string;
	orders?: Array<OpenApiSerializedOrder3>;
};
export type OpenApiOrdersUploadResponse = {
	success?: boolean;
	uploadedOrders?: Array<OpenApiFixExternalRow>;
	failedOrders?: Array<OpenApiEntityWithExternalId>;
	orders?: Array<OpenApiOrder3> | null;
};
export type OpenApiOrdersGetResponse = {
	success?: boolean;
	order?: OpenApiOrder2;
};
export type OpenApiApiCancelDeliveryRequest = { by?: string; force?: boolean };
export type OpenApiOrderEditInput = {
	by?: string;
	site?: string;
	order?: OpenApiSerializedOrder2;
};
export type OpenApiOrdersEditResponse = {
	success?: boolean;
	id?: number;
	order?: OpenApiOrder;
	state?: string | null;
};
export type OpenApiOrderProductPacksListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse5;
	packs?: Array<OpenApiOrderProductPack>;
};
export type OpenApiOrderProductPackCreateInput = {
	pack?: OpenApiSerializedOrderProductPack;
};
export type OpenApiOrderProductPackEditResponse = {
	success?: boolean;
	id?: number;
};
export type OpenApiOrdersProductPackHistoryResponseV3 = {
	success?: boolean;
	generatedAt?: string;
	history?: Array<OpenApiOrderProductPackHistory>;
	pagination?: OpenApiPaginationResponse6;
};
export type OpenApiOrderProductPackGetResponse = {
	success?: boolean;
	pack?: OpenApiOrderProductPack;
};
export type OpenApiOrderProductPackDeleteResponse = { success?: boolean };
export type OpenApiOrderProductPackEditInput = {
	pack?: OpenApiSerializedOrderProductPack2;
};
export type OpenApiApiCheckRequest = {
	invoiceUuid: string;
	amount: number;
	currency: string;
};
export type OpenApiApiCheckResponse = {
	success?: boolean;
	result?: OpenApiApiCheckResponseResult;
};
export type OpenApiApiCreateInvoiceRequest = {
	paymentId: number;
	returnUrl?: string;
};
export type OpenApiApiCreateInvoiceResponse = {
	success?: boolean;
	result?: OpenApiApiCreateInvoiceResponseResult;
};
export type OpenApiApiImportInvoiceRequest = {
	paymentId: number;
	externalId: string;
	amount: number;
	currency: string;
	status: string;
	createdAt: string;
	paidAt: string;
	discountAmount?: number;
	refundable?: boolean;
	refunds?: Array<OpenApiApiImportInvoicePaymentRefund>;
};
export type OpenApiApiImportInvoiceResponse = {
	success?: boolean;
	invoice?: OpenApiPaymentInvoice2;
};
export type OpenApiApiGetInvoiceResponse = {
	success?: boolean;
	invoice?: OpenApiPaymentInvoice;
};
export type OpenApiApiUpdateInvoiceRequest = {
	paymentId?: string;
	invoiceUrl?: string;
	amount?: number;
	status?: string;
	paidAt?: string;
	expiredAt?: string;
	cancellationDetails?: string;
	refundable?: boolean;
	refund?: OpenApiModuleRefund | null;
	cancellable?: boolean;
	discountAmount?: number;
	invoiceUuid: string;
};
export type OpenApiApiUpdateInvoiceResponse = { success?: boolean };
export type OpenApiCostGroupsListResponse = {
	success?: boolean;
	costGroups?: Array<OpenApiCostGroup>;
};
export type OpenApiCostGroupEditInput = {
	costGroup?: OpenApiSerializedCostGroup;
};
export type OpenApiCostItemsListResponse = {
	success?: boolean;
	costItems?: Array<OpenApiCostItem>;
};
export type OpenApiCostItemEditInput = { costItem?: OpenApiSerializedCostItem };
export type OpenApiCountriesListResponse = {
	success?: boolean;
	countriesIso?: Array<string>;
};
export type OpenApiCouriersListResponse = {
	success?: boolean;
	couriers?: Array<OpenApiCourier2>;
};
export type OpenApiCourierCreateInput = { courier?: OpenApiSerializedCourier };
export type OpenApiCourier = { firstName: JsonValue };
export type OpenApiCourierEditInput = { courier?: OpenApiSerializedCourier };
export type OpenApiCurrenciesListResponse = {
	success?: boolean;
	currencies?: Array<OpenApiCurrency2>;
};
export type OpenApiCurrencyCreateInput = {
	currency?: OpenApiSerializedCurrency;
};
export type OpenApiCurrency = { code: string | null };
export type OpenApiCurrencyEditInput = { currency?: OpenApiSerializedCurrency };
export type OpenApiDeliveryServicesListResponse = {
	success?: boolean;
	deliveryServices?: {
		[key: string]: OpenApiDeliveryService2 | undefined;
	} & {};
};
export type OpenApiDeliveryServiceEditInput = {
	deliveryService?: OpenApiSerializedDeliveryService;
};
export type OpenApiDeliveryService = {
	name: string | null;
	code: string | null;
};
export type OpenApiDeliveryTypesListResponse = {
	success?: boolean;
	deliveryTypes?: { [key: string]: OpenApiDeliveryType2 | undefined } & {};
};
export type OpenApiDeliveryTypeEditInput = {
	deliveryType?: OpenApiSerializedDeliveryType;
};
export type OpenApiDeliveryType = {
	name: string;
	defaultCost: number | null;
	defaultNetCost: number | null;
	vatRate?: string | null;
};
export type OpenApiLegalEntityListResponse = {
	success?: boolean;
	legalEntities?: Array<OpenApiLegalEntity>;
};
export type OpenApiLegalEntityEditInput = {
	legalEntity?: OpenApiSerializedLegalEntity;
};
export type OpenApiMGChannelsListResponse = {
	success?: boolean;
	mgChannels?: Array<OpenApiMGChannel>;
};
export type OpenApiOrderMethodsListResponse = {
	success?: boolean;
	orderMethods?: { [key: string]: OpenApiOrderMethod2 | undefined } & {};
};
export type OpenApiOrderMethodEditInput = {
	orderMethod?: OpenApiSerializedOrderMethod;
};
export type OpenApiOrderMethod = { name: string };
export type OpenApiOrderTypesListResponse = {
	success?: boolean;
	orderTypes?: { [key: string]: OpenApiOrderType2 | undefined } & {};
};
export type OpenApiOrderTypeEditInput = {
	orderType?: OpenApiSerializedOrderType;
};
export type OpenApiOrderType = { name: string; ordering: number };
export type OpenApiPaymentStatusesListResponse = {
	success?: boolean;
	paymentStatuses?: { [key: string]: OpenApiPaymentStatus2 | undefined } & {};
};
export type OpenApiPaymentStatusEditInput = {
	paymentStatus?: OpenApiSerializedPaymentStatus;
};
export type OpenApiPaymentStatus = { name: string; ordering: number };
export type OpenApiPaymentTypesListResponse = {
	success?: boolean;
	paymentTypes?: { [key: string]: OpenApiPaymentType2 | undefined } & {};
};
export type OpenApiPaymentTypeEditInput = {
	paymentType?: OpenApiSerializedPaymentType;
};
export type OpenApiPaymentType = { name: string };
export type OpenApiPaymentTypeEditResponse = {
	success?: boolean;
	id?: number | null;
	ignoredDeliveryTypes?: Array<string>;
};
export type OpenApiPriceTypeListResponse = {
	success?: boolean;
	priceTypes?: Array<OpenApiPriceType>;
};
export type OpenApiPriceTypeEditInput = {
	priceType?: OpenApiSerializedPriceType;
};
export type OpenApiOrderProductStatusesListResponse = {
	success?: boolean;
	productStatuses?: {
		[key: string]: OpenApiOrderProductStatus2 | undefined;
	} & {};
};
export type OpenApiOrderProductStatusEditInput = {
	productStatus?: OpenApiSerializedOrderProductStatus;
};
export type OpenApiOrderProductStatus = {
	name: string;
	type?: 'product-status-type-cancel' | null;
};
export type OpenApiPushCategoriesResponse = {
	success?: boolean;
	pushCategories?: Array<OpenApiPushCategory>;
};
export type OpenApiPushCategoryInput = { name: string; active?: boolean };
export type OpenApiSitesListResponse = {
	success?: boolean;
	sites?: { [key: string]: OpenApiSite | undefined } & {};
};
export type OpenApiSiteEditInput = { site?: OpenApiSerializedSite };
export type OpenApiSiteValidation = {
	name: string;
	url?: string;
	code?: string;
	description?: string;
	phones?: string;
	address?: string;
	zip?: string;
	ymlUrl?: string;
};
export type OpenApiTrackerSiteSettingsResponse = {
	success?: boolean;
	tracker?: OpenApiTrackerSiteSettings;
};
export type OpenApiStatusGroupsListResponse = {
	success?: boolean;
	statusGroups?: { [key: string]: OpenApiStatusGroup | undefined } & {};
};
export type OpenApiStatusesListResponse = {
	success?: boolean;
	statuses?: { [key: string]: OpenApiStatus2 | undefined } & {};
};
export type OpenApiStatusEditInput = { status?: OpenApiSerializedStatus };
export type OpenApiStatus = { name: string; ordering: number; group: string };
export type OpenApiStoreListResponse = { stores?: Array<OpenApiStore2> };
export type OpenApiStoreEditInput = { store?: OpenApiSerializedStore };
export type OpenApiStore = { name: string };
export type OpenApiSubscriptionsResponse = {
	success?: boolean;
	subscriptions?: Array<OpenApiSubscription>;
};
export type OpenApiSerializedSubscription = {
	channel: 'email' | 'sms' | 'waba' | 'mg';
	name: string;
	code?: string;
	active?: boolean;
	autoSubscribe?: boolean;
	ordering: number;
};
export type OpenApiTicketChannelsListResponse = {
	success?: boolean;
	ticketChannels?: Array<OpenApiTicketChannel>;
};
export type OpenApiTicketChannelInput = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
};
export type OpenApiTicketStatusGroupsListResponse = {
	success?: boolean;
	ticketStatusGroups?: Array<OpenApiTicketStatusGroup>;
};
export type OpenApiTicketStatusGroupInput = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	color?:
		| 'custom'
		| 'custom-0'
		| 'custom-1'
		| 'custom-2'
		| 'custom-3'
		| 'custom-4'
		| 'custom-5'
		| 'custom-6'
		| 'custom-7'
		| 'custom-8'
		| 'custom-9'
		| 'custom-10'
		| 'custom-11'
		| null;
};
export type OpenApiTicketStatusesListResponse = {
	success?: boolean;
	ticketStatuses?: Array<OpenApiTicketStatus>;
};
export type OpenApiTicketStatusInput = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	group?: OpenApiTicketStatusGroupReferenceInput;
};
export type OpenApiTicketSubtopicsListResponse = {
	success?: boolean;
	ticketSubtopics?: Array<OpenApiTicketSubtopic>;
};
export type OpenApiTicketSubtopicInput = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	topic?: OpenApiTicketTopicReferenceInput;
};
export type OpenApiTicketTopicsListResponse = {
	success?: boolean;
	ticketTopics?: Array<OpenApiTicketTopic>;
};
export type OpenApiTicketTopicInput = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
};
export type OpenApiTicketTypesListResponse = {
	success?: boolean;
	ticketTypes?: Array<OpenApiTicketType>;
};
export type OpenApiTicketTypeInput = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
};
export type OpenApiUnitsListResponse = {
	success?: boolean;
	units?: { [key: string]: OpenApiSerializedUnit2 | undefined } & {};
};
export type OpenApiSerializedUnit = {
	code?: string;
	name: string;
	sym: string;
	default?: boolean;
	active?: boolean;
};
export type OpenApiSimpleResponse3 = { success?: boolean };
export type OpenApiListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	segments?: Array<OpenApiSegment>;
};
export type OpenApiSettingsResponse = {
	success?: boolean;
	settings?: OpenApiSettings;
};
export type OpenApiStoreInventoriesListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse7;
	offers?: Array<OpenApiOffer>;
};
export type OpenApiStoreInventoriesUploadInput = {
	offers?: Array<OpenApiSerializedOffer>;
	site?: string;
};
export type OpenApiStoreInventoriesUploadResponse = {
	success?: boolean;
	processedOffersCount?: number;
	notFoundOffers?: Array<OpenApiOffer2>;
};
export type OpenApiOffersListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse9;
	offers?: Array<OpenApiOffer3>;
};
export type OpenApiPriceUploadInput = {
	externalId?: string;
	xmlId?: string;
	id?: number;
	site?: string;
	prices?: Array<OpenApiPriceUploadPricesInput>;
};
export type OpenApiPriceUploadResponse = {
	success?: boolean;
	processedOffersCount?: number;
	notFoundOffers?: Array<OpenApiPriceUploadNotFoundResponse>;
};
export type OpenApiProductGroupsListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse10;
	productGroup?: Array<OpenApiProductGroup>;
};
export type OpenApiProductGroupInput = {
	productGroup?: OpenApiSerializedProductGroup;
};
export type OpenApiProductGroupCreateResponse = {
	success?: boolean;
	id?: number;
};
export type OpenApiProductGroupInput2 = {
	by?: string;
	site?: string;
	productGroup?: OpenApiSerializedProductGroup2;
};
export type OpenApiProductGroupEditResponse = {
	success?: boolean;
	id?: number;
};
export type OpenApiProductsListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse8;
	products?: Array<OpenApiProduct>;
};
export type OpenApiProductCreateInput = {
	type?: 1 | 2;
	catalogId?: number;
	article?: string;
	name: string;
	url?: string;
	imageUrl?: string;
	description?: string;
	popular?: boolean;
	stock?: boolean;
	novelty?: boolean;
	recommended?: boolean;
	groups?: Array<OpenApiProductEditGroupInput>;
	externalId?: string;
	manufacturer?: string;
	active?: boolean;
	markable?: boolean;
	markingProvider?: string;
};
export type OpenApiProductCreateResponse = {
	success?: boolean;
	processedProductsCount?: number;
	addedProducts?: Array<number>;
};
export type OpenApiProductEditInput = {
	catalogId?: number;
	id?: number;
	article?: string;
	name: string;
	url?: string;
	imageUrl?: string;
	description?: string;
	popular?: boolean;
	stock?: boolean;
	novelty?: boolean;
	recommended?: boolean;
	groups?: Array<OpenApiProductEditGroupInput>;
	externalId?: string;
	manufacturer?: string;
	active?: boolean;
	markable?: boolean;
	markingProvider?: string;
	site?: string;
};
export type OpenApiProductEditResponse = {
	success?: boolean;
	processedProductsCount?: number;
	notFoundProducts?: Array<OpenApiProductEditNotFoundResponse>;
};
export type OpenApiProductPropertiesListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	properties?: Array<OpenApiProductProperty>;
};
export type OpenApiProductPropertyValuesListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	productPropertyValues?: Array<OpenApiProductPropertyValueResponse>;
};
export type OpenApiTasksListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse11;
	tasks?: Array<OpenApiTask>;
};
export type OpenApiTaskEditInput = {
	site?: string;
	task?: OpenApiSerializedTask;
};
export type OpenApiTasksCreateResponse = { success?: boolean; id?: number };
export type OpenApiTaskHistoryResponse = {
	success?: boolean;
	generatedAt?: string;
	history?: Array<OpenApiTaskHistory>;
	pagination?: OpenApiPaginationResponse12;
};
export type OpenApiTasksGetResponse = { success?: boolean; task?: OpenApiTask };
export type OpenApiTaskCommentsListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	comments?: Array<OpenApiTaskComment>;
};
export type OpenApiTaskEditInput2 = {
	site?: string;
	task?: OpenApiSerializedTask2;
};
export type OpenApiCallEventInput = {
	event?: OpenApiCallEvent;
	phone: JsonValue;
	type: JsonValue;
	code: JsonValue;
};
export type OpenApiCallEventResponse = {
	success?: boolean;
	notExistCodes?: Record<string, JsonValue>;
	notExistUsers?: Record<string, JsonValue>;
};
export type OpenApiCallsResponse = {
	pagination?: OpenApiCallsPagination;
	calls?: Array<OpenApiSerializedCalls>;
};
export type OpenApiCallsUploadInput = { calls?: Array<OpenApiCall> };
export type OpenApiCallsUploadResponse = {
	success?: boolean;
	processedCallsCount?: number;
	duplicateCalls?: Record<string, JsonValue>;
};
export type OpenApiManagerResponse = {
	success?: boolean;
	manager?: OpenApiSerializedManager;
	customer?: OpenApiSerializedCustomer4;
	links?: OpenApiSerializedLinks;
};
export type OpenApiTicketListResponse = {
	success?: boolean;
	pagination?: OpenApiCursorPaginationResponse2;
	tickets?: Array<OpenApiTicketDto>;
};
export type OpenApiTicketCommentListResponse = {
	success?: boolean;
	pagination?: OpenApiCursorPaginationResponse;
	comments?: Array<OpenApiTicketCommentDto>;
};
export type OpenApiTicketCommentCreateInput = {
	text: string;
	ticket: OpenApiTicketReferenceInput;
	authorId?: number;
};
export type OpenApiTicketCommentInput = { text: string };
export type OpenApiTicketCreateInput = {
	number?: string;
	externalId?: string;
	description?: string;
	customer?: OpenApiCustomerReferenceInput;
	contact?: OpenApiCustomerReferenceInput;
	company?: OpenApiEntityReferenceInput;
	ticketChannel?: OpenApiIdInput;
	issues?: Array<OpenApiTicketIssueInput>;
	orders?: Array<OpenApiOrderReferenceInput>;
	orderProducts?: Array<OpenApiIdInput>;
	tags?: Array<string>;
	addTags?: Array<string>;
	removeTags?: Array<string>;
	attachedTag: string;
	customFields?: Record<string, JsonValue>;
	callIds?: Array<number>;
	dialogIds?: Array<number>;
	createdAt?: string;
};
export type OpenApiTicketWriteResponse = {
	success?: boolean;
	ticket?: OpenApiTicketDto;
	id?: number;
};
export type OpenApiTicketHistoryResponse = {
	success?: boolean;
	generatedAt?: string;
	pagination?: OpenApiPaginationResponse14;
	history?: Array<OpenApiTicketHistory>;
};
export type OpenApiTicketResponse = {
	success?: boolean;
	ticket?: OpenApiTicketDto;
};
export type OpenApiTicketInput = {
	number?: string;
	externalId?: string;
	description?: string;
	customer?: OpenApiCustomerReferenceInput;
	contact?: OpenApiCustomerReferenceInput;
	company?: OpenApiEntityReferenceInput;
	ticketChannel?: OpenApiIdInput;
	issues?: Array<OpenApiTicketIssueInput>;
	orders?: Array<OpenApiOrderReferenceInput>;
	orderProducts?: Array<OpenApiIdInput>;
	tags?: Array<string>;
	addTags?: Array<string>;
	removeTags?: Array<string>;
	attachedTag: string;
	customFields?: Record<string, JsonValue>;
	callIds?: Array<number>;
	dialogIds?: Array<number>;
};
export type OpenApiUserGroupListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	groups?: Array<OpenApiGroup>;
};
export type OpenApiUsersListResponse = {
	success?: boolean;
	pagination?: OpenApiPaginationResponse2;
	users?: Array<OpenApiSerializedUser>;
};
export type OpenApiUsersGetResponse = {
	success?: boolean;
	user?: OpenApiSerializedUser;
};
export type OpenApiSmsVerificationConfirm = { code?: string; checkId?: string };
export type OpenApiSmsVerificationResponse = {
	success?: boolean;
	verification?: OpenApiSmsVerification;
};
export type OpenApiClientIdUploadInput = { clientIds?: Array<OpenApiClientId> };
export type OpenApiClientIdUploadResponse = {
	success?: boolean;
	failedClientIds?: Array<OpenApiClientId2>;
	errorMsg?: string;
	errors?: Record<string, JsonValue>;
};
export type OpenApiSourcesUploadInput = { sources?: Array<OpenApiSource> };
export type OpenApiSourcesUploadResponse = {
	success?: boolean;
	failedSources?: Array<OpenApiSource2>;
	errorMsg?: string;
	errors?: Record<string, JsonValue>;
};
export type OpenApiVisitsUploadInput = { visits?: Array<OpenApiVisit> };
export type OpenApiVisitsUploadResponse = {
	success?: boolean;
	failedVisits?: Array<OpenApiVisit2>;
	errorMsg?: string;
	errors?: Record<string, JsonValue>;
};
export type OpenApiPaginationResponse13 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiCost = {
	currency?: string;
	source?: OpenApiSerializedSource10;
	id?: number;
	dateFrom?: string | null;
	dateTo?: string | null;
	summ?: number | null;
	costItem?: string;
	comment?: string;
	createdAt?: string;
	createdBy?: string;
	order?: OpenApiOrder7;
	userId?: number;
	sites?: Array<string>;
};
export type OpenApiSerializedCost = {
	dateFrom?: string | null;
	dateTo?: string | null;
	summ?: number | null;
	comment?: string;
	costItem?: string;
	order?: OpenApiSerializedEntityOrder6 | null;
	userId?: number;
	sites?: Record<string, JsonValue>;
	source?: OpenApiSerializedSource4 | null;
};
export type OpenApiPaginationResponse2 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiCustomFieldApiDocModel = {
	name?: string;
	code?: string;
	required?: boolean;
	inFilter?: boolean;
	inList?: boolean;
	inGroupActions?: boolean;
	type?: string | null;
	entity?: string;
	default?: string | null;
	ordering?: number;
	displayArea?: string;
	viewMode?: string;
	viewModeMobile?: string;
	dictionary?: string;
	defaultTyped?: OpenApimixed;
};
export type OpenApiCustomDictionary = {
	name: string;
	code?: string | null;
	elements: Array<OpenApiSerializedCustomDictionaryElement4>;
};
export type OpenApiSerializedCustomDictionary = {
	name: string;
	code?: string | null;
	elements: Array<OpenApiSerializedCustomDictionaryElement2>;
};
export type OpenApiSerializedCustomDictionary2 = {
	name: string;
	elements: Array<OpenApiSerializedCustomDictionaryElement3>;
};
export type OpenApiSerializedCustomDictionaryElement = {
	name: string;
	code?: string;
	ordering?: number;
};
export type OpenApiSerializedCustomFieldApiDocModel = {
	name?: string;
	code?: string;
	required?: boolean;
	inFilter?: boolean;
	inList?: boolean;
	inGroupActions?: boolean;
	type?: string | null;
	entity?: string;
	default?: string | null;
	ordering?: number;
	displayArea?: string;
	viewMode?: string;
	viewModeMobile?: string;
	dictionary?: string;
	defaultTyped?: OpenApimixed;
};
export type OpenApiSerializedCustomFieldApiDocModel2 = {
	name?: string;
	required?: boolean;
	inFilter?: boolean;
	inList?: boolean;
	inGroupActions?: boolean;
	entity?: string;
	default?: string | null;
	ordering?: number;
	displayArea?: string;
	viewMode?: string;
	viewModeMobile?: string;
	defaultTyped?: OpenApimixed;
};
export type OpenApiCustomer = {
	type?: string;
	id?: number;
	externalId?: string;
	isContact?: boolean;
	createdAt?: string;
	managerId?: number;
	vip?: boolean;
	bad?: boolean;
	site?: string;
	contragent?: OpenApiCustomerContragent;
	tags?: Array<OpenApiCustomerTagLink>;
	firstClientId?: string;
	lastClientId?: string;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	cumulativeDiscount?: number;
	discountCardNumber?: string | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	ordersCount?: number | null;
	ticketsCount?: number;
	costSumm?: number | null;
	address?: OpenApiCustomerAddress4;
	segments?: Array<OpenApiSegment>;
	maturationTime?: number;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
	sex?: string;
	presumableSex?: string;
	email?: string | null;
	emailMarketingUnsubscribedAt?: string;
	customerSubscriptions?: Array<OpenApiCustomerSubscription>;
	phones?: Array<OpenApiCustomerPhone>;
	birthday?: string | null;
	source?: OpenApiSerializedSource;
	mgCustomers?: Array<OpenApiMGCustomer>;
	photoUrl?: string;
};
export type OpenApiSerializedCustomer = {
	externalId?: string;
	isContact?: boolean;
	createdAt?: string;
	vip?: boolean;
	bad?: boolean;
	contragent?: OpenApiCustomerContragent2;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	discountCardNumber?: string | null;
	address?: OpenApiCustomerAddress5 | null;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
	email?: string | null;
	emailMarketingUnsubscribedAt?: string;
	phones?: Array<OpenApiCustomerPhone2>;
	birthday?: string | null;
	photoUrl?: string;
	managerId?: number;
	sex?: string;
	source?: OpenApiSerializedSource2;
	mgCustomerId?: OpenApiMGCustomer2;
	subscribed?: boolean;
	tags?: Array<string>;
	attachedTag?: string;
	browserId?: string;
};
export type OpenApiFixExternalRow2 = { id: number; externalId: string };
export type OpenApiCustomerHistory = {
	id?: number;
	createdAt?: string;
	created?: boolean;
	deleted?: boolean;
	source?: string;
	user?: OpenApiUser;
	field?: string;
	oldValue?: OpenApimixed;
	newValue?: OpenApimixed;
	apiKey?: OpenApiApiKey;
	customer?: OpenApiCustomer4;
	address?: OpenApiCustomerAddressWithIsMain;
	combinedTo?: OpenApiCustomer4;
	subscription?: OpenApiSubscription2;
};
export type OpenApiPaginationResponse = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiCustomerNote = {
	customer?: OpenApiSerializedEntityCustomer2;
	managerId?: number;
	id?: number;
	text?: string;
	createdAt?: string;
};
export type OpenApiSerializedCustomerNote = {
	managerId?: number;
	text?: string;
	customer?: OpenApiSerializedEntityCustomer3 | null;
};
export type OpenApiPushToken = {
	customer?: OpenApiSerializedRelationAbstractCustomer4;
	deviceType?: string;
	id?: number;
	categories?: Array<OpenApiPushCategory>;
	createdAt?: string;
};
export type OpenApiSerializedRelationAbstractCustomer = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiSerializedCustomer3 = {
	externalId?: string;
	isContact?: boolean;
	createdAt?: string;
	vip?: boolean;
	bad?: boolean;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	discountCardNumber?: string | null;
	address?: OpenApiCustomerAddress7 | null;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
	email?: string | null;
	emailMarketingUnsubscribedAt?: string;
	phones?: Array<OpenApiCustomerPhone4>;
	birthday?: string | null;
	photoUrl?: string;
	managerId?: number;
	sex?: string;
	source?: OpenApiSerializedSource4;
	mgCustomerId?: OpenApiMGCustomer4;
	subscribed?: boolean;
	tags?: Array<string>;
	attachedTag?: string;
	browserId?: string;
};
export type OpenApiFixExternalRow = { id: number; externalId: string };
export type OpenApiEntityWithExternalId = { externalId?: string };
export type OpenApiSerializedCustomer2 = {
	externalId?: string;
	isContact?: boolean;
	createdAt?: string;
	vip?: boolean;
	bad?: boolean;
	contragent?: OpenApiCustomerContragent3;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	discountCardNumber?: string | null;
	address?: OpenApiCustomerAddress6 | null;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
	email?: string | null;
	emailMarketingUnsubscribedAt?: string;
	phones?: Array<OpenApiCustomerPhone3>;
	birthday?: string | null;
	photoUrl?: string;
	managerId?: number;
	sex?: string;
	source?: OpenApiSerializedSource3;
	mgCustomerId?: OpenApiMGCustomer3;
	subscribed?: boolean;
	addTags?: Array<string>;
	removeTags?: Array<string>;
	tags?: Array<string>;
	attachedTag?: string;
	browserId?: string;
};
export type OpenApiSerializedSubscription2 = {
	channel: 'email' | 'sms' | 'waba' | 'mg';
	subscription?: string;
	active: boolean;
	messageId?: number;
};
export type OpenApiCustomerCorporate = {
	type?: string;
	id?: number;
	externalId?: string;
	mainAddress?: OpenApiEntityWithExternalIdNameOutput2;
	createdAt?: string;
	managerId?: number;
	vip?: boolean;
	bad?: boolean;
	site?: string;
	tags?: Array<OpenApiCustomerTagLink>;
	firstClientId?: string;
	lastClientId?: string;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	cumulativeDiscount?: number;
	discountCardNumber?: string | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	ordersCount?: number | null;
	ticketsCount?: number;
	costSumm?: number | null;
	mainCustomerContact?: OpenApiCustomerContact3;
	mainCompany?: OpenApiEntityWithExternalIdNameOutput2;
	nickName?: string;
};
export type OpenApiSerializedCustomerContact3 = {
	isMain?: boolean;
	customer?: OpenApiSerializedRelationAbstractCustomer5;
	companies?: Array<OpenApiSerializedCustomerContactCompany3>;
};
export type OpenApiSerializedCompany3 = {
	isMain?: boolean;
	externalId?: string;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiSerializedCompanyContragent3;
	customFields?: Record<string, JsonValue>;
	address?: OpenApiEntityWithExternalIdInput5;
};
export type OpenApiCustomerAddress3 = {
	id?: number;
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	externalId?: string;
	name?: string;
};
export type OpenApiCustomerCorporateHistory = {
	id?: number;
	createdAt?: string;
	created?: boolean;
	deleted?: boolean;
	source?: string;
	user?: OpenApiUser;
	field?: string;
	oldValue?: OpenApimixed;
	newValue?: OpenApimixed;
	apiKey?: OpenApiApiKey;
	customer?: OpenApiCustomerCorporate2;
	address?: OpenApiCustomerAddressWithIsMain;
	combinedTo?: OpenApiCustomerCorporate2;
	subscription?: OpenApiSubscription2;
	customerContact?: OpenApiCustomerContact2;
	company?: OpenApiCompany2;
};
export type OpenApiSerializedCustomerCorporate3 = {
	externalId?: string;
	createdAt?: string;
	vip?: boolean;
	bad?: boolean;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	discountCardNumber?: string | null;
	nickName?: string;
	managerId?: number;
	customerContacts?: Array<OpenApiSerializedCustomerContact4>;
	companies?: Array<OpenApiSerializedCompany4>;
	addresses?: Array<OpenApiCustomerAddress8>;
};
export type OpenApiSerializedEntityCustomer = {
	site?: string;
	id?: number;
	externalId?: string;
	type?: string;
};
export type OpenApiCompanyContragent = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiCustomerAddress2 = {
	id?: number;
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	externalId?: string;
	name?: string;
};
export type OpenApiSerializedCompanyContragent = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiEntityWithExternalIdInput = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedCompanyContragent2 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiEntityWithExternalIdInput2 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedRelationAbstractCustomer2 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiCustomerContactCompany = {
	id?: number;
	company?: OpenApiEntityWithExternalIdNameOutput | null;
};
export type OpenApiSerializedRelationAbstractCustomer3 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiSerializedCustomerContactCompany = {
	company?: OpenApiEntityWithExternalIdInput3;
};
export type OpenApiSerializedCustomerContactCompany2 = {
	company?: OpenApiEntityWithExternalIdInput4;
};
export type OpenApiSerializedCart2 = {
	clearedAt?: string;
	customer?: OpenApiSerializedRelationAbstractCustomerWithGa2;
	order?: OpenApiSerializedRelationOrder;
};
export type OpenApiSerializedCart = {
	externalId?: string;
	droppedAt?: string;
	link?: string;
	customer?: OpenApiSerializedRelationAbstractCustomerWithGa;
	items?: Array<OpenApiSerializedCartItem>;
};
export type OpenApiCart = {
	currency?: string;
	externalId?: string;
	droppedAt?: string;
	clearedAt?: string;
	link?: string;
	items?: Array<OpenApiCartItem>;
};
export type OpenApiCustomerOffer = {
	offer?: OpenApiOffer5 | null;
	createdAt?: string;
};
export type OpenApiSerializedFavorite = {
	offer: OpenApiSerializedRelationOffer;
};
export type OpenApiSerializedOrder4 = {
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	items?: Array<OpenApiSerializedOrderProduct4>;
	delivery?: OpenApiSerializedOrderDelivery7;
};
export type OpenApiDeliveryCalculation = {
	code?: string;
	available?: boolean;
	vatRate?: string | null;
	cost?: number;
};
export type OpenApiFailedDeliveryCalculation = {
	code?: string;
	reason?: string;
	message?: string;
};
export type OpenApiStatusInfo = {
	code: string;
	updatedAt: string;
	comment?: string;
};
export type OpenApiDeliveryShipment = OpenApiDeliveryShipmentGeneric;
export type OpenApiDeliveryShipment2 = OpenApiDeliveryShipmentGeneric2;
export type OpenApiDeliveryShipment3 = OpenApiDeliveryShipmentGeneric3;
export type OpenApiPaginationResponse15 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiFile = {
	id?: number;
	filename?: string;
	type?: string;
	createdAt?: string;
	size?: number;
	attachment?: Array<OpenApiAttachment>;
};
export type OpenApiFile2 = { id?: number };
export type OpenApiFileEditValidation = {
	filename?: string;
	attachment?: Array<OpenApiSerializedAttachment>;
};
export type OpenApiIntegrationModule3 = {
	code: string;
	integrationCode: string;
	active?: boolean;
	freeze?: boolean;
	name?: string;
	logo?: string;
	native?: boolean;
	baseUrl?: string;
	actions?: { [key: string]: string | undefined } & {};
	availableCountries?: Record<string, JsonValue>;
	accountUrl?: string;
	integrations?: Array<{
		telephony?: OpenApiConfiguration6;
		delivery?: OpenApiConfiguration7;
		store?: OpenApiConfiguration8;
		recommendation?: OpenApiConfiguration9;
		payment?: OpenApiPaymentConfiguration2;
		embedJs?: OpenApiNativeConfiguration2;
		mgTransport?: OpenApiTransportConfiguration2;
		mgBot?: OpenApiBotConfiguration2;
	}> | null;
};
export type OpenApiConfiguration2 = {
	makeCallUrl?: string;
	allowEdit?: boolean;
	inputEventSupported?: boolean;
	outputEventSupported?: boolean;
	hangupEventSupported?: boolean;
	changeUserStatusUrl?: string;
	additionalCodes?: Array<OpenApiSerializedAdditionalCodes>;
	externalPhones?: Array<OpenApiSerializedExternalPhones>;
};
export type OpenApiConfiguration3 = {
	description?: string;
	actions?: { [key: string]: string | undefined } & {};
	payerType?: Record<string, JsonValue>;
	platePrintLimit?: number;
	rateDeliveryCost?: boolean;
	allowPackages?: boolean;
	codAvailable?: boolean;
	selfShipmentAvailable?: boolean;
	duplicateOrderProductSupported?: boolean;
	allowTrackNumber?: boolean;
	availableCountries?: Record<string, JsonValue>;
	requiredFields?: Record<string, JsonValue>;
	statusList?: Array<OpenApiStatus3> | null;
	plateList?: Array<OpenApiPlate>;
	deliveryDataFieldList?: Array<OpenApiDeliveryDataField>;
	shipmentDataFieldList?: Array<OpenApiDeliveryDataField>;
	settings?: OpenApiSettings2;
};
export type OpenApiConfiguration4 = { actions?: Array<OpenApiAction> };
export type OpenApiConfiguration5 = {
	actions?: { recommendation: string };
	addDefaultModes?: boolean;
	modes?: Array<OpenApiMode>;
};
export type OpenApiPaymentConfiguration = {
	actions: OpenApiActions;
	currencies: Array<string>;
	invoiceTypes: Array<string>;
	shops?: Array<OpenApiShop>;
};
export type OpenApiNativeConfiguration = {
	entrypoint?: string;
	stylesheet?: string;
	runner?: 'iframe' | 'worker';
	targets?: Record<string, JsonValue> | null;
	pages?: Array<OpenApiConfigurationPage> | null;
};
export type OpenApiTransportConfiguration = {
	webhookUrl?: string;
	actions?: { visits?: string; online?: string; manualTemplatesSync?: string };
	refreshToken?: boolean;
};
export type OpenApiBotConfiguration = { refreshToken?: boolean };
export type OpenApiCursorPaginationResponse = { nextCursor?: string };
export type OpenApiKnowledgeBaseDocument = {
	id?: number;
	sectionId?: number;
	title?: string;
	content?: string;
	file?: OpenApiKnowledgeBaseDocumentFile;
	availableForCopilot?: boolean;
	externalId?: string;
	contentHash?: string;
	createdAt?: string;
	updatedAt?: string;
};
export type OpenApiKnowledgeBaseDocumentInput = {
	title: string;
	content?: string;
	sectionId?: number;
	availableForCopilot?: boolean;
	externalId?: string;
};
export type OpenApiPaginationResponse12 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiKnowledgeBaseDocumentHistory = {
	id?: number;
	createdAt?: string;
	created?: boolean;
	deleted?: boolean;
	source?: string;
	user?: OpenApiUser4;
	field?: string;
	oldValue?: OpenApimixed;
	newValue?: OpenApimixed;
	apiKey?: OpenApiApiKey3;
	document?: OpenApiKnowledgeBaseDocument2;
	file?: OpenApiKnowledgeBaseDocumentFile2;
};
export type OpenApiKnowledgeBaseDocumentEditApiDocModel = {
	title?: string;
	content?: string;
	sectionId?: number;
	availableForCopilot?: boolean;
	externalId?: string;
};
export type OpenApiKnowledgeBaseSection = {
	id?: number;
	parentId?: number;
	name?: string;
	path?: string;
	documentsCount?: number;
	createdAt?: string;
	updatedAt?: string;
};
export type OpenApiKnowledgeBaseSectionInput = {
	name: string;
	parentId?: number;
};
export type OpenApiKnowledgeBaseSectionEditApiDocModel = {
	name?: string;
	parentId?: number;
};
export type OpenApiSerializedCreateLoyaltyAccount = {
	phoneNumber?: string;
	cardNumber?: string;
	customFields?: Record<string, JsonValue>;
	customer: OpenApiSerializedEntityCustomer3 | null;
};
export type OpenApiLoyaltyAccount3 = {
	active?: boolean;
	id?: number;
	phoneNumber?: string;
	cardNumber?: string;
	amount?: number;
	level: OpenApiLoyaltyLevel3;
	createdAt?: string;
	activatedAt?: string;
	confirmedPhoneAt?: string;
	lastCheckId?: string;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiLoyaltyAccount2 = {
	active?: boolean;
	id?: number;
	loyalty: OpenApiLoyalty4;
	customer: OpenApiCustomer10;
	phoneNumber?: string;
	cardNumber?: string;
	amount?: number;
	ordersSum?: number;
	nextLevelSum?: number;
	level: OpenApiLoyaltyLevel9;
	createdAt?: string;
	activatedAt?: string;
	confirmedPhoneAt?: string;
	lastCheckId?: string;
	status?: string;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiSmsVerification = {
	createdAt?: string;
	expiredAt?: string;
	verifiedAt?: string;
	checkId?: string;
	actionType?: string;
};
export type OpenApiLoyaltyBonus = {
	amount?: number;
	activationDate?: string;
	expireDate?: string;
};
export type OpenApiPaginationResponse18 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiOperation2 = {
	type?: string;
	createdAt?: string;
	amount?: number;
	order?: OpenApiOperationOrder2;
	bonus?: OpenApiOperationBonus2;
	event?: OpenApiOperationEvent2;
	comment?: string;
};
export type OpenApiPaginationResponse19 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiLoyaltyBonusStatisticResponse = { totalAmount?: number };
export type OpenApiBonusDetail = { date?: string; amount?: number };
export type OpenApiSerializedEditLoyaltyAccount = {
	phoneNumber?: string;
	cardNumber?: string;
	customFields?: Record<string, JsonValue>;
	loyaltyLevelId?: number;
};
export type OpenApiPaginationResponse17 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiLoyaltyAccount = {
	active?: boolean;
	id?: number;
	loyalty: OpenApiLoyalty3;
	customer: OpenApiCustomer9;
	phoneNumber?: string;
	cardNumber?: string;
	amount?: number;
	ordersSum?: number;
	nextLevelSum?: number;
	level: OpenApiLoyaltyLevel8;
	createdAt?: string;
	activatedAt?: string;
	confirmedPhoneAt?: string;
	lastCheckId?: string;
	status?: string;
};
export type OpenApiCursorPaginationResponse3 = { nextCursor?: string };
export type OpenApiOperation = {
	type?: string;
	createdAt?: string;
	amount?: number;
	order?: OpenApiOperationOrder;
	bonus?: OpenApiOperationBonus;
	event?: OpenApiOperationEvent;
	loyaltyAccount?: OpenApiOperationLoyaltyAccount;
	loyalty?: OpenApiOperationLoyalty;
	comment?: string;
};
export type OpenApiSerializedOrder5 = {
	privilegeType?: string | null;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	customer?: OpenApiSerializedRelationCustomer4;
	items?: Array<OpenApiSerializedOrderProduct5>;
	delivery?: OpenApiSerializedOrderDelivery10;
	applyRound?: boolean;
};
export type OpenApiSerializedLoyaltyOrder2 = {
	bonusesCreditTotal?: number;
	bonusesChargeTotal?: number;
	currency?: string;
	privilegeType?: string | null;
	totalSumm?: number;
	personalDiscountPercent?: number;
	loyaltyAccount?: OpenApiLoyaltyAccount5;
	loyaltyLevel?: OpenApiLoyaltyLevel5;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount5;
	customer?: OpenApiCustomer8;
	delivery?: OpenApiSerializedOrderDelivery9;
	site?: string;
	items?: Array<OpenApiOrderProduct7>;
};
export type OpenApiLoyaltyCalculation = {
	privilegeType?: string;
	discount?: number;
	creditBonuses?: number;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount5;
	maxChargeBonuses?: number;
	maximum?: boolean;
};
export type OpenApiSerializedLoyalty = {
	currency?: string;
	name: string;
	chargeRate: number;
};
export type OpenApiPaginationResponse16 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiLoyalty = {
	levels?: Array<OpenApiLoyaltyLevel6>;
	active?: boolean;
	blocked?: boolean;
	currency?: string;
	id?: number;
	name: string;
	confirmSmsCharge?: boolean;
	confirmSmsRegistration?: boolean;
	minResidualCost?: number;
	createdAt?: string;
	activatedAt?: string;
	deactivatedAt?: string;
	blockedAt?: string;
};
export type OpenApiLoyalty2 = {
	levels?: Array<OpenApiLoyaltyLevel7>;
	expirePeriod?: string;
	burnSettings?: Array<OpenApiLoyaltyBurnSetting>;
	active?: boolean;
	blocked?: boolean;
	currency?: string;
	id?: number;
	name: string;
	burnType?: number;
	confirmSmsCharge?: boolean;
	confirmSmsRegistration?: boolean;
	maxChargePercent: number;
	chargeRate: number;
	minResidualCost?: number;
	events?: Array<OpenApiWelcomeLoyaltyEvent | OpenApiBirthdayLoyaltyEvent>;
	createdAt?: string;
	activatedAt?: string;
	deactivatedAt?: string;
	blockedAt?: string;
};
export type OpenApiSerializedApiNotification = {
	type: 'api.info' | 'api.error';
	message: string;
	userIds?: Record<string, JsonValue>;
	userGroups?: 'superadmins';
};
export type OpenApiPaginationResponse3 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiOrder = {
	slug?: number;
	bonusesCreditTotal?: number;
	bonusesChargeTotal?: number;
	summ?: number;
	currency?: string;
	id?: number;
	number?: string;
	externalId?: string;
	orderType?: string;
	orderMethod?: string;
	privilegeType?: string | null;
	countryIso?: string;
	createdAt?: string;
	statusUpdatedAt?: string;
	totalSumm?: number;
	prepaySum?: number;
	purchaseSumm?: number;
	personalDiscountPercent?: number;
	loyaltyLevel?: OpenApiLoyaltyLevel2;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount2;
	mark?: number;
	markDatetime?: string;
	lastName?: string;
	firstName?: string;
	patronymic?: string;
	phone?: string;
	additionalPhone?: string;
	email?: string;
	call?: boolean;
	expired?: boolean;
	customerComment?: string | null;
	managerComment?: string | null;
	managerId?: number;
	customer?: OpenApiCustomer6 | OpenApiCustomerCorporate4;
	contact?: OpenApiCustomer6;
	company?: OpenApiCompany4;
	contragent?: OpenApiOrderContragent3;
	delivery?: OpenApiSerializedOrderDelivery3;
	site?: string;
	status?: string;
	statusComment?: string;
	source?: OpenApiSerializedSource7;
	items?: Array<OpenApiOrderProduct2>;
	fullPaidAt?: string;
	payments?: { [key: string]: OpenApiPayment2 | undefined } & {};
	fromApi?: boolean;
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	shipmentStore?: string;
	shipmentDate?: string | null;
	shipped?: boolean;
	links?: Array<OpenApiOrderLink2>;
	customFields?: Record<string, JsonValue>;
	clientId?: string;
};
export type OpenApiSerializedOrderReference2 = { id: number };
export type OpenApiSerializedOrder = {
	number?: string;
	externalId?: string;
	privilegeType?: string | null;
	countryIso?: string;
	createdAt?: string;
	statusUpdatedAt?: string;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	mark?: number;
	markDatetime?: string;
	lastName?: string;
	firstName?: string;
	patronymic?: string;
	phone?: string;
	additionalPhone?: string;
	email?: string;
	call?: boolean;
	expired?: boolean;
	customerComment?: string | null;
	managerComment?: string | null;
	contragent?: OpenApiOrderContragent;
	statusComment?: string;
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	shipmentDate?: string | null;
	shipped?: boolean;
	dialogId?: OpenApiMGDialog;
	customFields?: Record<string, JsonValue>;
	orderType?: string;
	orderMethod?: string;
	customer?: OpenApiSerializedRelationCustomer;
	contact?: OpenApiSerializedRelationAbstractCustomer6;
	company?: OpenApiEntityWithExternalIdInput6;
	managerId?: number;
	status?: string;
	items?: Array<OpenApiSerializedOrderProduct>;
	delivery?: OpenApiSerializedOrderDelivery;
	source?: OpenApiSerializedSource5;
	shipmentStore?: string;
	payments?: Array<OpenApiSerializedPayment3>;
	loyaltyEventDiscountId?: number;
	applyRound?: boolean;
	isFromCart?: boolean;
};
export type OpenApiCreateOrder = {
	slug?: number;
	bonusesCreditTotal?: number;
	bonusesChargeTotal?: number;
	summ?: number;
	currency?: string;
	id?: number;
	number?: string;
	externalId?: string;
	orderType?: string;
	orderMethod?: string;
	privilegeType?: string | null;
	countryIso?: string;
	createdAt?: string;
	statusUpdatedAt?: string;
	totalSumm?: number;
	prepaySum?: number;
	purchaseSumm?: number;
	personalDiscountPercent?: number;
	loyaltyLevel?: OpenApiLoyaltyLevel;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount;
	mark?: number;
	markDatetime?: string;
	lastName?: string;
	firstName?: string;
	patronymic?: string;
	phone?: string;
	additionalPhone?: string;
	email?: string;
	call?: boolean;
	expired?: boolean;
	customerComment?: string | null;
	managerComment?: string | null;
	managerId?: number;
	customer?: OpenApiCustomer5 | OpenApiCustomerCorporate3;
	contact?: OpenApiCustomer5;
	company?: OpenApiCompany3;
	contragent?: OpenApiOrderContragent2;
	delivery?: OpenApiSerializedOrderDelivery2;
	site?: string;
	status?: string;
	statusComment?: string;
	source?: OpenApiSerializedSource6;
	items?: Array<OpenApiOrderProduct>;
	fullPaidAt?: string;
	payments?: Array<OpenApiPayment>;
	fromApi?: boolean;
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	shipmentStore?: string;
	shipmentDate?: string | null;
	shipped?: boolean;
	links?: Array<OpenApiOrderLink>;
	customFields?: Record<string, JsonValue>;
	clientId?: string;
};
export type OpenApiOrderHistory = {
	id?: number;
	createdAt?: string;
	created?: boolean;
	deleted?: boolean;
	source?: string;
	user?: OpenApiUser2;
	field?: string;
	oldValue?: OpenApimixed;
	newValue?: OpenApimixed;
	apiKey?: OpenApiApiKey2;
	order?: OpenApiOrder5;
	ancestor?: OpenApiOrder5;
	item?: OpenApiOrderProduct3;
	payment?: OpenApiPayment3;
	combinedTo?: OpenApiOrder5;
};
export type OpenApiPaginationResponse4 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiSerializedOrderLink = {
	comment?: string;
	orders?: Array<OpenApiSerializedEntityOrder3>;
};
export type OpenApiSerializedEntityOrder = {
	id?: number;
	externalId?: string;
	number?: string;
	applyRound?: boolean;
};
export type OpenApiSerializedLoyaltyOrder = {
	bonusesCreditTotal?: number;
	bonusesChargeTotal?: number;
	currency?: string;
	privilegeType?: string | null;
	totalSumm?: number;
	personalDiscountPercent?: number;
	loyaltyAccount?: OpenApiLoyaltyAccount4;
	loyaltyLevel?: OpenApiLoyaltyLevel4;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount4;
	customer?: OpenApiCustomer7;
	delivery?: OpenApiSerializedOrderDelivery8;
	site?: string;
	items?: Array<OpenApiOrderProduct6>;
};
export type OpenApiSmsVerification2 = {
	createdAt?: string;
	expiredAt?: string;
	verifiedAt?: string;
	checkId?: string;
	actionType?: string;
};
export type OpenApiOrder4 = {
	bonusesCreditTotal?: number;
	bonusesChargeTotal?: number;
	currency?: string;
	privilegeType?: string | null;
	totalSumm?: number;
	personalDiscountPercent?: number;
	loyaltyAccount?: OpenApiLoyaltyAccount5;
	loyaltyLevel?: OpenApiLoyaltyLevel5;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount5;
	delivery?: OpenApiSerializedOrderDelivery9;
	site?: string;
	items?: Array<OpenApiOrderProduct7>;
};
export type OpenApiSerializedPayment = {
	externalId?: string;
	amount?: number;
	paidAt?: string | null;
	comment?: string | null;
	order: OpenApiSerializedEntityOrder2 | null;
	type: string;
	status?: string;
};
export type OpenApiSerializedPayment2 = {
	externalId?: string;
	amount?: number;
	paidAt?: string | null;
	comment?: string | null;
	status?: string;
};
export type OpenApiOrderStatusItem = {
	id?: number;
	externalId?: string;
	status?: string;
	group?: string;
	number?: string;
};
export type OpenApiSerializedOrder3 = {
	number?: string;
	externalId?: string;
	privilegeType?: string | null;
	countryIso?: string;
	createdAt?: string;
	statusUpdatedAt?: string;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	mark?: number;
	markDatetime?: string;
	lastName?: string;
	firstName?: string;
	patronymic?: string;
	phone?: string;
	additionalPhone?: string;
	email?: string;
	call?: boolean;
	expired?: boolean;
	customerComment?: string | null;
	managerComment?: string | null;
	contragent?: OpenApiOrderContragent5;
	statusComment?: string;
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	shipmentDate?: string | null;
	shipped?: boolean;
	dialogId?: OpenApiMGDialog;
	customFields?: Record<string, JsonValue>;
	orderType?: string;
	orderMethod?: string;
	customer?: OpenApiSerializedRelationCustomer3;
	contact?: OpenApiSerializedRelationAbstractCustomer8;
	company?: OpenApiEntityWithExternalIdInput8;
	managerId?: number;
	status?: string;
	items?: Array<OpenApiSerializedOrderProduct3>;
	delivery?: OpenApiSerializedOrderDelivery5;
	source?: OpenApiSerializedSource9;
	shipmentStore?: string;
	payments?: Array<OpenApiSerializedPayment4>;
	loyaltyEventDiscountId?: number;
	applyRound?: boolean;
	isFromCart?: boolean;
};
export type OpenApiOrder3 = {
	slug?: number;
	bonusesCreditTotal?: number;
	bonusesChargeTotal?: number;
	summ?: number;
	currency?: string;
	id?: number;
	number?: string;
	externalId?: string;
	orderType?: string;
	orderMethod?: string;
	privilegeType?: string | null;
	countryIso?: string;
	createdAt?: string;
	statusUpdatedAt?: string;
	totalSumm?: number;
	prepaySum?: number;
	purchaseSumm?: number;
	personalDiscountPercent?: number;
	loyaltyLevel?: OpenApiLoyaltyLevel3;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount3;
	mark?: number;
	markDatetime?: string;
	lastName?: string;
	firstName?: string;
	patronymic?: string;
	phone?: string;
	additionalPhone?: string;
	email?: string;
	call?: boolean;
	expired?: boolean;
	customerComment?: string | null;
	managerComment?: string | null;
	managerId?: number;
	customer?: OpenApiCustomer | OpenApiCustomerCorporate;
	contact?: OpenApiCustomer;
	company?: OpenApiCompany5;
	contragent?: OpenApiOrderContragent6;
	delivery?: OpenApiSerializedOrderDelivery6;
	site?: string;
	status?: string;
	statusComment?: string;
	source?: OpenApiSerializedSource;
	items?: Array<OpenApiOrderProduct5>;
	fullPaidAt?: string;
	payments?: { [key: string]: OpenApiPayment4 | undefined } & {};
	fromApi?: boolean;
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	shipmentStore?: string;
	shipmentDate?: string | null;
	shipped?: boolean;
	links?: Array<OpenApiOrderLink3>;
	customFields?: Record<string, JsonValue>;
	clientId?: string;
};
export type OpenApiOrder2 = {
	slug?: number;
	bonusesCreditTotal?: number;
	bonusesChargeTotal?: number;
	summ?: number;
	currency?: string;
	id?: number;
	number?: string;
	externalId?: string;
	orderType?: string;
	orderMethod?: string;
	privilegeType?: string | null;
	countryIso?: string;
	createdAt?: string;
	statusUpdatedAt?: string;
	totalSumm?: number;
	prepaySum?: number;
	purchaseSumm?: number;
	personalDiscountPercent?: number;
	loyaltyLevel?: OpenApiLoyaltyLevel;
	loyaltyEventDiscount?: OpenApiLoyaltyEventDiscount;
	mark?: number;
	markDatetime?: string;
	lastName?: string;
	firstName?: string;
	patronymic?: string;
	phone?: string;
	additionalPhone?: string;
	email?: string;
	call?: boolean;
	expired?: boolean;
	customerComment?: string | null;
	managerComment?: string | null;
	managerId?: number;
	customer?: OpenApiCustomer5 | OpenApiCustomerCorporate3;
	contact?: OpenApiCustomer5;
	company?: OpenApiCompany3;
	contragent?: OpenApiOrderContragent2;
	delivery?: OpenApiSerializedOrderDelivery2;
	site?: string;
	status?: string;
	statusComment?: string;
	source?: OpenApiSerializedSource6;
	items?: Array<OpenApiOrderProduct>;
	fullPaidAt?: string;
	payments?: { [key: string]: OpenApiPayment | undefined } & {};
	fromApi?: boolean;
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	shipmentStore?: string;
	shipmentDate?: string | null;
	shipped?: boolean;
	links?: Array<OpenApiOrderLink>;
	customFields?: Record<string, JsonValue>;
	clientId?: string;
};
export type OpenApiSerializedOrder2 = {
	number?: string;
	externalId?: string;
	privilegeType?: string | null;
	countryIso?: string;
	createdAt?: string;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	mark?: number;
	markDatetime?: string;
	lastName?: string;
	firstName?: string;
	patronymic?: string;
	phone?: string;
	additionalPhone?: string;
	email?: string;
	call?: boolean;
	expired?: boolean;
	customerComment?: string | null;
	managerComment?: string | null;
	contragent?: OpenApiOrderContragent4;
	statusComment?: string;
	weight?: number | null;
	length?: number;
	width?: number;
	height?: number;
	shipmentDate?: string | null;
	shipped?: boolean;
	dialogId?: OpenApiMGDialog;
	customFields?: Record<string, JsonValue>;
	orderType?: string;
	orderMethod?: string;
	customer?: OpenApiSerializedRelationCustomer2;
	contact?: OpenApiSerializedRelationAbstractCustomer7;
	company?: OpenApiEntityWithExternalIdInput7;
	managerId?: number;
	status?: string;
	items?: Array<OpenApiSerializedOrderProduct2>;
	delivery?: OpenApiSerializedOrderDelivery4;
	source?: OpenApiSerializedSource8;
	shipmentStore?: string;
	loyaltyEventDiscountId?: number;
	applyRound?: boolean;
	isFromCart?: boolean;
};
export type OpenApiPaginationResponse5 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiOrderProductPack = {
	id?: number | null;
	purchasePrice?: number | null;
	quantity?: number | null;
	unit?: OpenApiUnit;
	store?: string;
	item?: OpenApiOrderProduct4;
	shipmentDate?: string | null;
	invoiceNumber?: string;
	deliveryNoteNumber?: string;
};
export type OpenApiSerializedOrderProductPack = {
	purchasePrice?: number | null;
	quantity?: number | null;
	store?: string;
	shipmentDate?: string | null;
	invoiceNumber?: string;
	deliveryNoteNumber?: string;
	itemId?: number;
};
export type OpenApiOrderProductPackHistory = {
	id?: number;
	createdAt?: string;
	created?: boolean;
	deleted?: boolean;
	field?: string;
	oldValue?: OpenApiHistoryField;
	newValue?: OpenApiHistoryField;
	pack?: OpenApiOrderProductPack2;
	source?: string;
	user?: OpenApiUser3 | null;
};
export type OpenApiPaginationResponse6 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiSerializedOrderProductPack2 = {
	purchasePrice?: number | null;
	quantity?: number | null;
	shipmentDate?: string | null;
	invoiceNumber?: string;
	deliveryNoteNumber?: string;
};
export type OpenApiApiCheckResponseResult = {
	success?: boolean;
	errorMsg?: string;
};
export type OpenApiApiCreateInvoiceResponseResult = { link?: string };
export type OpenApiApiImportInvoicePaymentRefund = {
	externalId: string;
	status: string;
	comment?: string;
	amount: number;
	createdAt: string;
};
export type OpenApiPaymentInvoice2 = { invoiceUuid?: string };
export type OpenApiPaymentInvoice = {
	createdAt?: string;
	customerId?: number;
	orderId?: number;
	paymentId?: number;
	amount?: string;
	currency?: string;
	email?: string;
	phone?: string;
	status?: string;
	statusMessage?: string;
	externalId?: string;
	invoiceUuid?: string;
	invoiceType?: string;
	link?: string;
	errorMsg?: string;
	paidAt?: string;
	expiredAt?: string;
	cancellationDetails?: string;
	refundable?: boolean;
	cancellable?: boolean;
	refunds?: Array<OpenApiPaymentRefund>;
	discountAmount?: string;
};
export type OpenApiModuleRefund = {
	status?: 'succeeded' | 'canceled' | 'pending' | null;
	id: string;
	comment?: string;
	amount: number;
};
export type OpenApiCostGroup = {
	code?: string;
	name?: string;
	ordering?: number;
	active?: boolean;
	color?: string;
};
export type OpenApiSerializedCostGroup = {
	code: string;
	name: string;
	ordering: number;
	active?: boolean;
	color:
		| '#ffd298'
		| '#ef8e06'
		| '#bc6b01'
		| '#19976e'
		| '#8453df'
		| '#ff8e87'
		| '#c7cdd4'
		| '#4191ff'
		| '#8a96a6'
		| '#6ce0b9';
};
export type OpenApiCostItem = {
	source?: OpenApiSerializedSource;
	code?: string;
	name?: string;
	group?: string;
	ordering?: number;
	active?: boolean;
	appliesToOrders?: boolean;
	type?: string;
	appliesToUsers?: boolean;
};
export type OpenApiSerializedCostItem = {
	code?: string;
	name?: string;
	ordering?: number;
	active?: boolean;
	appliesToOrders?: boolean;
	appliesToUsers?: boolean;
	group?: string;
	source?: OpenApiSerializedSource4 | null;
	type?: 'const' | 'var';
};
export type OpenApiCourier2 = {
	id?: number;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	active?: boolean;
	email?: string;
	phone?: OpenApiCourierPhone;
	description?: string;
};
export type OpenApiSerializedCourier = {
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	active?: boolean;
	email?: string;
	phone?: OpenApiCourierPhone2;
	description?: string;
};
export type OpenApiCurrency2 = {
	id?: number;
	code?: string | null;
	isBase?: boolean;
	isAutoConvert?: boolean;
	autoConvertExtraPercent?: number;
	manualConvertNominal?: number;
	manualConvertValue?: number;
};
export type OpenApiSerializedCurrency = {
	code?: string;
	isAutoConvert?: boolean;
	autoConvertExtraPercent?: number;
	manualConvertNominal?: 1 | 10 | 100 | 1000 | 10000;
	manualConvertValue?: number;
};
export type OpenApiDeliveryService2 = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
};
export type OpenApiSerializedDeliveryService = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
	deliveryType?: string;
};
export type OpenApiDeliveryType2 = {
	paymentTypes?: Record<string, JsonValue>;
	isDynamicCostCalculation?: boolean;
	isAutoCostCalculation?: boolean;
	isAutoNetCostCalculation?: boolean;
	isCostDependsOnRegionAndWeightAndSum?: boolean;
	isCostDependsOnDateTime?: boolean;
	costCalculationType?: string;
	netCostCalculationType?: string;
	codMarkup?: number;
	limitByRegions?: boolean;
	regionWeightCostConditions?: Record<string, JsonValue>;
	dateTimeCostConditions?: Record<string, JsonValue>;
	currency?: string;
	name?: string;
	code?: string;
	active?: boolean;
	defaultCost?: number | null;
	defaultNetCost?: number | null;
	description?: string;
	deliveryPaymentTypes?: Array<OpenApiDeliveryTypePaymentType>;
	integrationCode?: string;
	deliveryServices?: Record<string, JsonValue>;
	defaultForCrm?: boolean;
	vatRate?: string | null;
	defaultTariffCode?: string | null;
	defaultTariffType?: string | null;
	defaultTariffName?: string | null;
	sites?: Record<string, JsonValue>;
};
export type OpenApiSerializedDeliveryType = {
	paymentTypes?: Record<string, JsonValue>;
	name?: string;
	code?: string;
	active?: boolean;
	defaultCost?: number | null;
	defaultNetCost?: number | null;
	description?: string;
	defaultForCrm?: boolean;
	defaultTariffCode?: string | null;
	defaultTariffType?: string | null;
	integrationCode?: string;
	deliveryServices?: Record<string, JsonValue>;
	sites?: Record<string, JsonValue>;
};
export type OpenApiLegalEntity = {
	contragentType?: 'legal-entity' | 'enterpreneur' | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
	code?: string;
	countryIso?: string;
	vatRate?: string | null;
};
export type OpenApiSerializedLegalEntity = {
	contragentType?: 'legal-entity' | 'enterpreneur' | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
	code?: string;
	countryIso?: string;
	vatRate?: string;
};
export type OpenApiMGChannel = {
	allowedSendByPhone?: boolean;
	id?: number | null;
	externalId?: number;
	type?: string;
	active?: boolean;
	name?: string;
};
export type OpenApiOrderMethod2 = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
};
export type OpenApiSerializedOrderMethod = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
};
export type OpenApiOrderType2 = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	ordering?: number;
};
export type OpenApiSerializedOrderType = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	ordering?: number;
};
export type OpenApiPaymentStatus2 = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	paymentComplete?: boolean;
	ordering?: number;
	description?: string;
	paymentTypes?: Record<string, JsonValue>;
};
export type OpenApiSerializedPaymentStatus = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	paymentComplete?: boolean;
	ordering?: number;
	description?: string;
};
export type OpenApiPaymentType2 = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	description?: string;
	deliveryTypes?: Record<string, JsonValue>;
	paymentDeliveryTypes?: Array<OpenApiPaymentTypeDeliveryPaymentType>;
	paymentStatuses?: Record<string, JsonValue>;
	integrationModule?: OpenApiIntegrationModule4;
	sites?: Record<string, JsonValue>;
};
export type OpenApiSerializedPaymentType = {
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	description?: string;
	paymentStatuses?: Record<string, JsonValue>;
	sites?: Record<string, JsonValue>;
	paymentDeliveryTypes?: Array<OpenApiPaymentTypeDeliveryPaymentType2>;
};
export type OpenApiPriceType = {
	id?: number;
	code?: string;
	name?: string;
	active?: boolean;
	promo?: boolean;
	default?: boolean;
	description?: string;
	filterExpression?: string;
	geo?: Array<OpenApiGeoHierarchyRow>;
	groups?: Record<string, JsonValue>;
	ordering?: number;
	currency?: string;
};
export type OpenApiSerializedPriceType = {
	code?: string;
	name?: string;
	active?: boolean;
	promo?: boolean;
	description?: string;
	filterExpression?: string;
	ordering?: number;
	geo?: Array<OpenApiGeoHierarchyRow2>;
	groups?: Record<string, JsonValue>;
	currency?: string;
};
export type OpenApiOrderProductStatus2 = {
	code?: string;
	ordering?: number;
	active?: boolean;
	createdAt?: string;
	orderStatusByProductStatus?: string;
	orderStatusForProductStatus?: string;
	cancelStatus?: boolean;
	name: string;
};
export type OpenApiSerializedOrderProductStatus = {
	code?: string;
	ordering?: number;
	active?: boolean;
	cancelStatus?: boolean;
	name: string;
	orderStatusByProductStatus?: string;
	orderStatusForProductStatus?: string;
};
export type OpenApiPushCategory = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	createdAt?: string;
};
export type OpenApiSite = {
	catalogId?: string;
	isCatalogMainSite?: boolean;
	isDemo?: boolean;
	id?: number;
	name?: string;
	url?: string;
	code?: string;
	description?: string;
	phones?: string;
	address?: string;
	zip?: string;
	defaultForCrm?: boolean;
	ymlUrl?: string;
	loadFromYml?: boolean;
	catalogUpdatedAt?: string;
	catalogLoadingAt?: string;
	ordering?: number;
	contragent?: OpenApiLegalEntity;
	countryIso?: string;
	currency?: string;
	senderEmail?: string;
	senderName?: string;
	usedInSimlaweb?: boolean;
};
export type OpenApiSerializedSite = {
	name?: string;
	url?: string;
	code?: string;
	description?: string;
	phones?: string;
	address?: string;
	zip?: string;
	defaultForCrm?: boolean;
	ymlUrl?: string;
	loadFromYml?: boolean;
	countryIso?: string;
	contragentCode?: string;
	currency?: string;
};
export type OpenApiTrackerSiteSettings = {
	active?: boolean;
	token?: string | null;
	useCookieConsent?: boolean | null;
	useGpc?: boolean | null;
};
export type OpenApiStatusGroup = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	process?: boolean;
	statuses?: Record<string, JsonValue>;
};
export type OpenApiStatus2 = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	group?: string;
};
export type OpenApiSerializedStatus = {
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	group?: string;
};
export type OpenApiStore2 = {
	externalId?: string;
	xmlId?: string;
	description?: string;
	email?: string;
	type?:
		| 'store-type-retail'
		| 'store-type-online'
		| 'store-type-warehouse'
		| 'store-type-supplier';
	inventoryType?: 'available' | 'integer';
	address?: OpenApiStoreAddress;
	active?: boolean;
	ordering?: string | null;
	phone?: OpenApiStorePhone | null;
	contact?: string;
	code?: string;
	workTime?: OpenApiSerializedStoreWeekOpeningHours;
	name: string;
};
export type OpenApiSerializedStore = {
	externalId?: string;
	xmlId?: string;
	description?: string;
	email?: string;
	type?:
		| 'store-type-retail'
		| 'store-type-online'
		| 'store-type-warehouse'
		| 'store-type-supplier';
	inventoryType?: 'available' | 'integer';
	address?: OpenApiStoreAddress2;
	active?: boolean;
	phone?: OpenApiStorePhone2 | null;
	code?: string;
	name: string;
	workTime?: OpenApiSerializedStoreWeekOpeningHours2;
};
export type OpenApiSubscription = {
	id?: number;
	channel?: string;
	name?: string;
	code?: string;
	active?: boolean;
	autoSubscribe?: boolean;
	ordering?: number;
};
export type OpenApiTicketChannel = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	ordering?: number;
};
export type OpenApiTicketStatusGroup = {
	color?: string;
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
};
export type OpenApiTicketStatus = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	group?: OpenApiTicketStatusGroup;
};
export type OpenApiTicketStatusGroupReferenceInput = { id: number };
export type OpenApiTicketSubtopic = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	topic?: OpenApiTicketTopic;
};
export type OpenApiTicketTopicReferenceInput = { id: number };
export type OpenApiTicketTopic = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
};
export type OpenApiTicketType = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	ordering?: number;
};
export type OpenApiSerializedUnit2 = {
	code?: string;
	name?: string;
	sym?: string;
	default?: boolean;
	active?: boolean;
};
export type OpenApiSegment = {
	id?: number;
	code?: string;
	name?: string;
	createdAt?: string;
	isDynamic?: boolean;
	customersCount?: number;
	active?: boolean;
};
export type OpenApiSettings = {
	default_currency?: OpenApiValue;
	system_language?: OpenApiValue;
	timezone?: OpenApiValue;
	work_times?: Array<OpenApiWorkTime>;
	non_working_days?: Array<OpenApiNonWorkingDay>;
	mg?: OpenApiIntegrationData;
	order?: OpenApiOrderSettings;
};
export type OpenApiPaginationResponse7 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiOffer = {
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	site?: string;
	purchasePrice?: number;
	quantity?: number;
	stores?: Array<OpenApiInventory>;
};
export type OpenApiSerializedOffer = {
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	stores: Array<OpenApiSerializedStore2>;
};
export type OpenApiOffer2 = {
	id?: number | null;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiPaginationResponse9 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiOffer3 = {
	images?: Array<string>;
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	site?: string;
	name: string;
	article?: string;
	prices?: Array<OpenApiOfferPrice>;
	purchasePrice?: number;
	vatRate?: string;
	product?: OpenApiProduct2;
	properties?: Record<string, JsonValue>;
	quantity?: number;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	duration?: number;
	active?: boolean;
	unit?: OpenApiUnit2;
	barcode?: string;
};
export type OpenApiPriceUploadPricesInput = {
	code?: string;
	price?: number;
	remove?: boolean;
};
export type OpenApiPriceUploadNotFoundResponse = {
	id?: string;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiPaginationResponse10 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiProductGroup = {
	parentId?: number;
	site?: string;
	id?: number;
	name: string;
	lvl?: number;
	externalId?: string;
	active?: boolean;
};
export type OpenApiSerializedProductGroup = {
	parentId?: number;
	name: string;
	description?: string;
	externalId?: string;
	active?: boolean;
	parentExternalId?: string;
	site?: string;
};
export type OpenApiSerializedProductGroup2 = {
	parentId?: number;
	name: string;
	description?: string;
	externalId?: string;
	active?: boolean;
	parentExternalId?: string;
	site?: string;
};
export type OpenApiPaginationResponse8 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiProduct = {
	type?: 1 | 2;
	minPrice?: number;
	maxPrice?: number;
	catalogId?: number;
	id?: number;
	article?: string;
	name: string;
	url?: string;
	imageUrl?: string;
	description?: string;
	popular?: boolean;
	stock?: boolean;
	novelty?: boolean;
	recommended?: boolean;
	options?: Record<string, JsonValue>;
	groups?: Array<OpenApiProductGroup2>;
	externalId?: string;
	manufacturer?: string;
	offers?: Array<OpenApiOffer4>;
	updatedAt?: string;
	active?: boolean;
	quantity?: number;
	markable?: boolean;
	markingProvider?: OpenApiMarkingCodeProvider;
};
export type OpenApiProductEditGroupInput = { externalId?: string; id?: number };
export type OpenApiProductEditNotFoundResponse = {
	id?: string;
	externalId?: string;
};
export type OpenApiProductProperty = {
	sites?: Array<string>;
	groups?: Array<OpenApiProductPropertyGroup>;
	code?: string;
	name?: string;
	isNumeric?: boolean;
	visible?: boolean;
	variative?: boolean;
};
export type OpenApiProductPropertyValueResponse = {
	property?: OpenApiProductPropertyResponse;
	value?: string;
	offersCount?: number;
};
export type OpenApiPaginationResponse11 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiTask = {
	id?: number;
	text?: string;
	commentary?: string;
	priority?: string;
	datetime?: string;
	createdAt?: string;
	complete?: boolean;
	creator?: number | null;
	performer?: number;
	performerType?: string;
	customer?: OpenApiAbstractCustomer | null;
	order?: OpenApiOrder6 | null;
	ticket?: OpenApiTicket;
	phone?: string;
	phoneSite?: string;
	completedAt?: string;
};
export type OpenApiSerializedTask = {
	text?: string;
	commentary?: string;
	priority?: 'low' | 'medium' | 'high';
	datetime?: string;
	complete?: boolean;
	phone?: string;
	customer?: OpenApiSerializedEntityCustomer4 | null;
	performerId?: number;
	order?: OpenApiSerializedEntityOrder4 | null;
	ticket?: OpenApiSerializedEntityTicket;
	phoneSite?: string;
};
export type OpenApiTaskHistory = {
	id?: number;
	createdAt?: string;
	created?: boolean;
	source?: string;
	user?: OpenApiUser4;
	field?: string;
	oldValue?: OpenApimixed;
	newValue?: OpenApimixed;
	apiKey?: OpenApiApiKey3;
	task?: OpenApiTask2;
	comment?: OpenApiTaskComment2;
};
export type OpenApiTaskComment = {
	id?: number;
	creator?: number;
	text?: string;
	createdAt?: string;
	updatedAt?: string;
};
export type OpenApiSerializedTask2 = {
	text?: string;
	commentary?: string;
	priority?: 'low' | 'medium' | 'high';
	datetime?: string;
	complete?: boolean;
	phone?: string;
	customer?: OpenApiSerializedEntityCustomer5 | null;
	performerId?: number;
	order?: OpenApiSerializedEntityOrder5 | null;
	ticket?: OpenApiSerializedEntityTicket2;
	phoneSite?: string;
};
export type OpenApiCallEvent = {
	phone: string;
	type: 'in' | 'out' | 'hangup';
	codes?: Array<string>;
	userIds?: Array<number>;
	site?: string;
	hangupStatus?: 'answered' | 'no answered' | 'busy' | 'cancel' | 'failed';
	externalPhone?: string | null;
	callExternalId?: string | null;
	webAnalyticsData?: OpenApiSerializedWebAnalyticsData | null;
};
export type OpenApiCallsPagination = { limit?: number; nextCursor?: string };
export type OpenApiSerializedCalls = {
	id?: number;
	externalId?: string;
	type?: string;
	date?: string;
	code?: string;
	manager?: OpenApiSerializedManager2;
	phone?: string;
	result?: string;
	duration?: number;
	manualTags?: Array<OpenApiSerializedTag>;
	aiTags?: Array<OpenApiSerializedTag>;
	managerCriteriaTags?: Array<OpenApiSerializedTag>;
	orderNumber?: string;
	ticket?: OpenApiSerializedTicket | null;
	customer?: OpenApiSerializedCustomer5;
	transcriptStructure?: Array<OpenApiSerializedTranscriptSegment>;
	shortSummary?: string;
	fullSummary?: string;
	isMissed?: boolean;
	externalPhone?: string;
	durationWaiting?: number;
};
export type OpenApiCall = {
	date: string;
	type: 'in' | 'out';
	phone: string;
	code?: string;
	userId?: number;
	result:
		| 'unknown'
		| 'answered'
		| 'busy'
		| 'not allowed'
		| 'no answer'
		| 'failed';
	duration?: number;
	durationWaiting?: number;
	externalId: string;
	recordUrl?: string;
	source?: OpenApiSerializedSource11 | null;
	externalPhone?: string;
	site?: string | null;
	clientId?: string;
};
export type OpenApiSerializedManager = {
	id?: string;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	email?: string;
	code?: string;
};
export type OpenApiSerializedCustomer4 = {
	id?: string;
	externalId?: string;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	email?: string;
	phones?: Array<OpenApiCustomerPhone>;
};
export type OpenApiSerializedLinks = {
	newOrderLink?: string;
	lastOrderLink?: string;
	newCustomerLink?: string;
	customerLink?: string;
};
export type OpenApiCursorPaginationResponse2 = { nextCursor?: string };
export type OpenApiTicketDto = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
	description?: string;
	createdAt?: string;
	fromApi?: boolean;
	author?: number;
	customer?: OpenApiCustomerReferenceDto;
	contact?: OpenApiCustomerReferenceDto;
	company?: OpenApiCompanyReferenceDto;
	ticketChannel?: OpenApiTicketChannel;
	status?: OpenApiTicketStatus;
	sla?: OpenApiTicketSlaDto;
	issues?: Array<OpenApiTicketIssueDto2>;
	orders?: Array<OpenApiOrderReferenceDto>;
	orderProducts?: Array<OpenApiOrderProductReferenceDto>;
	tags?: Array<OpenApiTag>;
	callIds?: Array<number>;
	dialogIds?: Array<number>;
	attachedTag?: string;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiTicketCommentDto = {
	ticket?: OpenApiTicketReferenceDto;
	id?: number;
	text?: string;
	authorId?: number;
	createdAt?: string;
	updatedAt?: string;
};
export type OpenApiTicketReferenceInput = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
};
export type OpenApiCustomerReferenceInput = {
	id?: number;
	externalId?: string;
	type?: 'customer' | 'customer_corporate';
	site?: string;
};
export type OpenApiEntityReferenceInput = { id?: number; externalId?: string };
export type OpenApiIdInput = { id: number };
export type OpenApiTicketIssueInput = {
	id?: number;
	ticketType?: OpenApiIdInput;
	ticketSubtopic?: OpenApiIdInput;
	status?: OpenApiIdInput;
	responsible?: number;
};
export type OpenApiOrderReferenceInput = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
};
export type OpenApiPaginationResponse14 = {
	limit?: number;
	totalCount?: number;
	currentPage?: number;
	totalPageCount?: number;
};
export type OpenApiTicketHistory = {
	id?: number;
	createdAt?: string;
	created?: boolean;
	deleted?: boolean;
	source?: string;
	user?: OpenApiUser5;
	field?: string;
	oldValue?: OpenApimixed;
	newValue?: OpenApimixed;
	apiKey?: OpenApiApiKey4;
	ticket?: OpenApiTicketSnapshot;
	issue?: OpenApiTicketIssueDto;
	comment?: OpenApiTicketComment;
};
export type OpenApiGroup = {
	id?: number;
	name: string;
	signatureTemplate?: string;
	code?: string;
	isManager?: boolean;
	isDeliveryMen?: boolean;
	deliveryTypes?: Record<string, JsonValue>;
	breakdownOrderTypes?: Record<string, JsonValue>;
	breakdownStatusGroups?: Record<string, JsonValue>;
	breakdownSites?: Record<string, JsonValue>;
	breakdownOrderMethods?: Record<string, JsonValue>;
	grantedOrderTypes?: Record<string, JsonValue>;
	grantedStatusGroups?: Record<string, JsonValue>;
	grantedSites?: Record<string, JsonValue>;
};
export type OpenApiSerializedUser = {
	id?: number;
	createdAt?: string;
	active?: boolean;
	email?: string;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	position?: string;
	photoUrl?: string;
	phone?: string;
	status?: string;
	online?: boolean;
	lastOnline?: string;
	isAdmin?: boolean;
	isManager?: boolean;
	groups?: Array<OpenApiSerializedGroups>;
	mgUserId?: number;
	senderEmail?: string;
	senderName?: string;
	language?: string;
};
export type OpenApiClientId = {
	value?: string;
	createdAt?: string;
	order?: OpenApiSerializedEntityOrder6 | null;
	customer?: OpenApiSerializedEntityCustomer3 | null;
	site?: string;
};
export type OpenApiClientId2 = {
	value?: string;
	createdAt?: string;
	order?: OpenApiSerializedEntityOrder7 | null;
	customer?: OpenApiSerializedEntityCustomer2 | null;
	site?: string;
};
export type OpenApiSource = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
	clientId?: string;
	order?: OpenApiSerializedEntityOrder6 | null;
	customer?: OpenApiSerializedEntityCustomer3 | null;
	site?: string;
};
export type OpenApiSource2 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
	clientId?: string;
	order?: OpenApiSerializedEntityOrder7 | null;
	customer?: OpenApiSerializedEntityCustomer2 | null;
	site?: string;
};
export type OpenApiVisit = {
	createdAt?: string | null;
	visitLength?: number | null;
	exitPage?: string | null;
	landingPage?: string | null;
	pageViews?: number | null;
	pageDepth?: number | null;
	customer?: OpenApiSerializedEntityCustomer3 | null;
	source?: OpenApiSerializedSource4 | null;
	pages?: Array<OpenApiPage>;
	clientId?: string | null;
	site?: string;
};
export type OpenApiVisit2 = {
	createdAt?: string | null;
	visitLength?: number | null;
	exitPage?: string | null;
	landingPage?: string | null;
	pageViews?: number | null;
	pageDepth?: number | null;
	customer?: OpenApiSerializedEntityCustomer2 | null;
	source?: OpenApiSerializedSource | null;
	pages?: Array<OpenApiPage2>;
	clientId?: string | null;
	site?: string;
};
export type OpenApiSerializedSource10 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiOrder7 = {
	id?: number;
	number?: string;
	externalId?: string;
};
export type OpenApiSerializedEntityOrder6 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiSerializedSource4 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApimixed = JsonValue;
export type OpenApiSerializedCustomDictionaryElement4 = {
	name: string;
	code?: string;
	ordering?: number;
};
export type OpenApiSerializedCustomDictionaryElement2 = {
	name: string;
	code?: string;
	ordering?: number;
};
export type OpenApiSerializedCustomDictionaryElement3 = {
	name: string;
	code?: string;
	ordering?: number;
};
export type OpenApiCustomerContragent = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiCustomerTagLink = {
	color?: string;
	name?: string;
	colorCode?: string;
	attached?: boolean;
};
export type OpenApiCustomerAddress4 = {
	id?: number;
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	externalId?: string;
	name?: string;
};
export type OpenApiCustomerSubscription = {
	subscription?: OpenApiSubscription;
	subscribed?: boolean;
	changedAt?: string;
};
export type OpenApiCustomerPhone = { number?: string | null };
export type OpenApiSerializedSource = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiMGCustomer = {
	id?: number;
	externalId?: number;
	mgChannel?: OpenApiMGChannel;
};
export type OpenApiCustomerContragent2 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiCustomerAddress5 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiCustomerPhone2 = { number?: string | null };
export type OpenApiSerializedSource2 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiMGCustomer2 = Record<string, never>;
export type OpenApiUser = { id?: number };
export type OpenApiApiKey = { current?: boolean; id?: number };
export type OpenApiCustomer4 = {
	id?: number;
	externalId?: string;
	site?: string;
};
export type OpenApiCustomerAddressWithIsMain = {
	id?: number;
	externalId?: string;
	name?: string;
	isMain?: boolean;
};
export type OpenApiSubscription2 = {
	channel?: string;
	name?: string;
	code?: string;
};
export type OpenApiSerializedEntityCustomer2 = {
	site?: string;
	id?: number;
	externalId?: string;
	type?: string;
};
export type OpenApiSerializedEntityCustomer3 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedRelationAbstractCustomer4 = {
	id?: number;
	externalId?: string;
	browserId?: string;
};
export type OpenApiCustomerAddress7 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiCustomerPhone4 = { number?: string | null };
export type OpenApiMGCustomer4 = Record<string, never>;
export type OpenApiCustomerContragent3 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiCustomerAddress6 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiCustomerPhone3 = { number?: string | null };
export type OpenApiSerializedSource3 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiMGCustomer3 = Record<string, never>;
export type OpenApiEntityWithExternalIdNameOutput2 = {
	id?: number;
	externalId?: string;
	name?: string;
};
export type OpenApiCustomerContact3 = {
	id?: number;
	customer?: OpenApiSerializedRelationAbstractCustomer4 | null;
	companies?: Array<OpenApiCustomerContactCompany2>;
};
export type OpenApiSerializedRelationAbstractCustomer5 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiSerializedCustomerContactCompany3 = {
	company?: OpenApiEntityWithExternalIdInput5;
};
export type OpenApiSerializedCompanyContragent3 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiEntityWithExternalIdInput5 = {
	id?: number;
	externalId?: string;
};
export type OpenApiCustomerCorporate2 = {
	id?: number;
	externalId?: string;
	site?: string;
};
export type OpenApiCustomerContact2 = { id?: number };
export type OpenApiCompany2 = {
	id?: number;
	externalId?: string;
	name?: string;
};
export type OpenApiSerializedCustomerContact4 = {
	isMain?: boolean;
	customer?: OpenApiSerializedRelationAbstractCustomer9;
	companies?: Array<OpenApiSerializedCustomerContactCompany4>;
};
export type OpenApiSerializedCompany4 = {
	isMain?: boolean;
	externalId?: string;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiSerializedCompanyContragent4;
	customFields?: Record<string, JsonValue>;
	address?: OpenApiEntityWithExternalIdInput9;
};
export type OpenApiCustomerAddress8 = {
	id?: number;
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	externalId?: string;
	name?: string;
};
export type OpenApiEntityWithExternalIdNameOutput = {
	id?: number;
	externalId?: string;
	name?: string;
};
export type OpenApiEntityWithExternalIdInput3 = {
	id?: number;
	externalId?: string;
};
export type OpenApiEntityWithExternalIdInput4 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedRelationAbstractCustomerWithGa2 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	gaClientId?: string;
};
export type OpenApiSerializedRelationOrder = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiSerializedRelationAbstractCustomerWithGa = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
	gaClientId?: string;
};
export type OpenApiSerializedCartItem = {
	price?: number;
	quantity: number;
	offer: OpenApiSerializedRelationOffer;
};
export type OpenApiCartItem = {
	id?: number;
	offer?: OpenApiOffer5 | null;
	quantity?: number;
	price?: number;
};
export type OpenApiOffer5 = {
	displayName?: string;
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	name: string;
	article?: string;
	vatRate?: string;
	properties?: Record<string, JsonValue>;
	unit?: OpenApiUnit4;
	barcode?: string;
};
export type OpenApiSerializedRelationOffer = {
	id?: number;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiSerializedOrderProduct4 = {
	initialPrice?: number | null;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	quantity?: number | null;
};
export type OpenApiSerializedOrderDelivery7 = {
	date?: string;
	time?: OpenApiTimeInterval11;
	address?: OpenApiOrderDeliveryAddress7;
};
export type OpenApiDeliveryShipmentGeneric = {
	integrationCode?: string;
	id?: number;
	externalId?: string;
	deliveryType: string;
	store: string;
	managerId: number;
	status?: string;
	date: string;
	time: OpenApiTimeInterval10;
	comment?: string;
	orders?: Array<OpenApiSerializedEntityOrder7>;
	extraData?: Record<string, JsonValue>;
};
export type OpenApiDeliveryShipmentGeneric2 = {
	status?: string;
	date: string;
	time: OpenApiTimeInterval12;
	comment?: string;
	store: string;
	managerId: number;
	orders?: Array<OpenApiSerializedEntityOrder8>;
	extraData?: Record<string, JsonValue>;
};
export type OpenApiDeliveryShipmentGeneric3 = {
	status?: string;
	date: string;
	time: OpenApiTimeInterval13;
	comment?: string;
	store: string;
	managerId: number;
	orders?: Array<OpenApiSerializedEntityOrder6>;
	extraData?: Record<string, JsonValue>;
};
export type OpenApiAttachment = {
	customer?: OpenApiCustomer11 | OpenApiCustomerCorporate5;
	order?: OpenApiOrder9;
	ticket?: OpenApiTicket3;
	knowledgeBaseDocument?: OpenApiKnowledgeBaseDocument3;
};
export type OpenApiSerializedAttachment = {
	customer?: OpenApiSerializedRelationAbstractCustomer10 | null;
	order?: OpenApiSerializedRelationOrder2 | null;
	ticket?: OpenApiSerializedRelationTicket;
	knowledgeBaseDocument?: OpenApiSerializedRelationKnowledgeBaseDocument;
};
export type OpenApiConfiguration6 = {
	makeCallUrl?: string;
	allowEdit?: boolean;
	inputEventSupported?: boolean;
	outputEventSupported?: boolean;
	hangupEventSupported?: boolean;
	changeUserStatusUrl?: string;
	additionalCodes?: Array<OpenApiSerializedAdditionalCodes2>;
	externalPhones?: Array<OpenApiSerializedExternalPhones2>;
};
export type OpenApiConfiguration7 = {
	description?: string;
	actions?: { [key: string]: string | undefined } & {};
	payerType?: Record<string, JsonValue>;
	platePrintLimit?: number;
	rateDeliveryCost?: boolean;
	allowPackages?: boolean;
	codAvailable?: boolean;
	selfShipmentAvailable?: boolean;
	duplicateOrderProductSupported?: boolean;
	allowTrackNumber?: boolean;
	availableCountries?: Record<string, JsonValue>;
	requiredFields?: Record<string, JsonValue>;
	statusList?: Array<OpenApiStatus4> | null;
	plateList?: Array<OpenApiPlate2>;
	deliveryDataFieldList?: Array<OpenApiDeliveryDataField2>;
	shipmentDataFieldList?: Array<OpenApiDeliveryDataField2>;
	settings?: OpenApiSettings3;
};
export type OpenApiConfiguration8 = { actions?: Array<OpenApiAction2> };
export type OpenApiConfiguration9 = {
	actions?: { recommendation: string };
	addDefaultModes?: boolean;
	modes?: Array<OpenApiMode2>;
};
export type OpenApiPaymentConfiguration2 = {
	actions: OpenApiActions2;
	currencies: Array<string>;
	invoiceTypes: Array<string>;
	shops?: Array<OpenApiShop2>;
};
export type OpenApiNativeConfiguration2 = {
	entrypoint?: string;
	stylesheet?: string;
	runner?: 'iframe' | 'worker';
	targets?: Record<string, JsonValue> | null;
	pages?: Array<OpenApiConfigurationPage2> | null;
};
export type OpenApiTransportConfiguration2 = {
	token?: string | null;
	isActive?: boolean | null;
	webhookUrl?: string;
	actions?: { visits?: string; online?: string; manualTemplatesSync?: string };
};
export type OpenApiBotConfiguration2 = {
	isActive?: boolean;
	logo?: string;
	token?: string;
	name?: string;
};
export type OpenApiSerializedAdditionalCodes = { userId: number; code: string };
export type OpenApiSerializedExternalPhones = {
	siteCode: string;
	externalPhone: string;
};
export type OpenApiStatus3 = {
	code?: string;
	name?: string;
	isEditable?: boolean;
	isError?: boolean;
	isPreprocessing?: boolean;
};
export type OpenApiPlate = { type?: string; code?: string; label?: string };
export type OpenApiDeliveryDataField = {
	code?: string;
	label?: string;
	hint?: string;
	type?: string;
	multiple?: boolean;
	choices?: Record<string, JsonValue>;
	autocompleteUrl?: string;
	visible?: boolean;
	required?: boolean;
	affectsCost?: boolean;
	editable?: boolean;
};
export type OpenApiSettings2 = {
	defaultPayerType?: string;
	costCalculateBy?: string;
	nullDeclaredValue?: boolean;
	lockedByDefault?: boolean;
	paymentTypes?: Array<OpenApiPaymentType5>;
	shipmentPoints?: Array<OpenApiShipmentPoint>;
	statuses?: Array<OpenApiStatus5> | null;
	deliveryExtraData?: Record<string, JsonValue>;
	shipmentExtraData?: Record<string, JsonValue>;
};
export type OpenApiAction = {
	code?: string;
	url?: string;
	callPoints?: Array<string>;
};
export type OpenApiMode = {
	code?: string | null;
	names?: { [key: string]: string | undefined } & {};
};
export type OpenApiActions = {
	create: string;
	approve?: string;
	cancel?: string;
	refund?: string | null;
};
export type OpenApiShop = { code: string; name: string; active?: boolean };
export type OpenApiConfigurationPage = {
	code: string | null;
	menu?: string | null;
	parentMenuItemCode?: string | null;
	menuItemOrdering?: number | null;
	menuItemTitle?: OpenApiConfigurationTranslation | null;
	pageHelpLink?: OpenApiConfigurationTranslation | null;
	isSettingsMainPage?: boolean;
};
export type OpenApiKnowledgeBaseDocumentFile = {
	id?: number;
	name?: string;
	type?: string;
	size?: number;
	url?: string;
};
export type OpenApiUser4 = { id?: number };
export type OpenApiApiKey3 = { current?: boolean; id?: number };
export type OpenApiKnowledgeBaseDocument2 = {
	id?: number;
	externalId?: string;
};
export type OpenApiKnowledgeBaseDocumentFile2 = {
	id?: number;
	name?: string;
	type?: string;
	size?: number;
	url?: string;
};
export type OpenApiLoyaltyLevel3 = { id?: number; name: string };
export type OpenApiLoyalty4 = {
	currency?: string;
	id?: number;
	promoChargeAllowed?: boolean;
	minResidualCost?: number;
};
export type OpenApiCustomer10 = {
	id?: number;
	externalId?: string;
	site?: string;
	customFields?: Record<string, JsonValue>;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
};
export type OpenApiLoyaltyLevel9 = {
	type?: string;
	id?: number;
	name: string;
	sum?: number;
	privilegeSize?: number;
	privilegeSizePromo?: number;
	creditConditions?: Array<OpenApiLoyaltyLevelCondition2>;
};
export type OpenApiOperationOrder2 = { id?: number; externalId?: string };
export type OpenApiOperationBonus2 = {
	activationDate?: string;
	expireDate?: string;
};
export type OpenApiOperationEvent2 = { id?: number; type?: string };
export type OpenApiLoyalty3 = {
	currency?: string;
	id?: number;
	minResidualCost?: number;
};
export type OpenApiCustomer9 = {
	id?: number;
	externalId?: string;
	site?: string;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
};
export type OpenApiLoyaltyLevel8 = {
	type?: string;
	id?: number;
	name: string;
	sum?: number;
	privilegeSize?: number;
	privilegeSizePromo?: number;
};
export type OpenApiOperationOrder = { id?: number; externalId?: string };
export type OpenApiOperationBonus = {
	activationDate?: string;
	expireDate?: string;
};
export type OpenApiOperationEvent = { id?: number; type?: string };
export type OpenApiOperationLoyaltyAccount = { id?: number };
export type OpenApiOperationLoyalty = { id?: number };
export type OpenApiSerializedRelationCustomer4 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedOrderProduct5 = {
	initialPrice?: number | null;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	quantity?: number | null;
	offer?: OpenApiSerializedOrderProductOffer4 | null;
	priceType?: OpenApiPriceType10;
};
export type OpenApiSerializedOrderDelivery10 = { cost?: number };
export type OpenApiLoyaltyAccount5 = { id?: number; amount?: number };
export type OpenApiLoyaltyLevel5 = { id?: number; name: string };
export type OpenApiLoyaltyEventDiscount5 = {
	id?: number;
	loyaltyEvent?: OpenApiAbstractLoyaltyEvent2;
};
export type OpenApiCustomer8 = {
	id?: number;
	externalId?: string;
	personalDiscount?: number;
};
export type OpenApiSerializedOrderDelivery9 = { cost?: number };
export type OpenApiOrderProduct7 = {
	bonusesChargeTotal?: number;
	bonusesCreditTotal?: number;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel11>;
	priceType?: OpenApiPriceType9;
	initialPrice?: number | null;
	discounts?: Array<OpenApiAbstractDiscount6>;
	discountTotal?: number | null;
	prices?: Array<OpenApiOrderProductPriceItem5> | null;
	vatRate?: string | null;
	quantity?: number | null;
	offer?: OpenApiOffer11;
};
export type OpenApiLoyaltyLevel6 = {
	type?: string;
	id?: number;
	name: string;
	sum?: number;
	privilegeSize?: number;
	privilegeSizePromo?: number;
};
export type OpenApiLoyaltyLevel7 = {
	type?: string;
	id?: number;
	name: string;
	sum?: number;
	privilegeSize?: number;
	privilegeSizePromo?: number;
	creditConditions?: Array<OpenApiLoyaltyLevelCondition>;
};
export type OpenApiLoyaltyBurnSetting = {
	id?: number;
	period?: string;
	percent?: number;
};
export type OpenApiWelcomeLoyaltyEvent = {
	id?: number;
	privilegeType?: 'bonus' | 'discount';
	privilegeSize?: number;
	privilegeSizePromo?: number;
	expirePeriod?: string;
	activatePeriod?: 0 | 1;
	discountOneOrderOnly?: boolean;
	activatedAt?: string;
	discountForAllProducts?: boolean;
	type?: string;
	afterFirstOrder?: boolean;
};
export type OpenApiBirthdayLoyaltyEvent = {
	id?: number;
	privilegeType?: 'bonus' | 'discount';
	privilegeSize?: number;
	privilegeSizePromo?: number;
	expirePeriod?: string;
	activatePeriod?: 0 | 1;
	discountOneOrderOnly?: boolean;
	activatedAt?: string;
	discountForAllProducts?: boolean;
	type?: string;
	beforePeriod?: string;
};
export type OpenApiLoyaltyLevel2 = { id?: number; name: string };
export type OpenApiLoyaltyEventDiscount2 = { id?: number };
export type OpenApiCustomer6 = {
	type?: string;
	id?: number;
	externalId?: string;
	isContact?: boolean;
	createdAt?: string;
	managerId?: number;
	vip?: boolean;
	bad?: boolean;
	site?: string;
	contragent?: OpenApiCustomerContragent5;
	tags?: Array<OpenApiCustomerTagLink3>;
	firstClientId?: string;
	lastClientId?: string;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	cumulativeDiscount?: number;
	discountCardNumber?: string | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	ordersCount?: number | null;
	ticketsCount?: number;
	costSumm?: number | null;
	address?: OpenApiCustomerAddress10;
	segments?: Array<OpenApiSegment3>;
	maturationTime?: number;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
	sex?: string;
	presumableSex?: string;
	email?: string | null;
	emailMarketingUnsubscribedAt?: string;
	customerSubscriptions?: Array<OpenApiCustomerSubscription3>;
	phones?: Array<OpenApiCustomerPhone6>;
	birthday?: string | null;
	source?: OpenApiSerializedSource7;
	mgCustomers?: Array<OpenApiMGCustomer6>;
	photoUrl?: string;
};
export type OpenApiCustomerCorporate4 = {
	type?: string;
	id?: number;
	externalId?: string;
	mainAddress?: OpenApiEntityWithExternalIdNameOutput4;
	createdAt?: string;
	managerId?: number;
	vip?: boolean;
	bad?: boolean;
	site?: string;
	tags?: Array<OpenApiCustomerTagLink3>;
	firstClientId?: string;
	lastClientId?: string;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	cumulativeDiscount?: number;
	discountCardNumber?: string | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	ordersCount?: number | null;
	ticketsCount?: number;
	costSumm?: number | null;
	mainCustomerContact?: OpenApiCustomerContact5;
	mainCompany?: OpenApiEntityWithExternalIdNameOutput4;
	nickName?: string;
};
export type OpenApiCompany4 = {
	id?: number;
	externalId?: string;
	customer?: OpenApiSerializedEntityCustomer7 | null;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiCompanyContragent3 | null;
	address?: OpenApiCustomerAddress10 | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	costSumm?: number | null;
	ordersCount?: number | null;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiOrderContragent3 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiSerializedOrderDelivery3 = {
	code?: string;
	integrationCode?: string;
	data?:
		| OpenApiGenericData3
		| OpenApiCourierData3
		| OpenApiNewPostData3
		| OpenApiDDeliveryData3
		| OpenApiKazPostData3;
	service?: OpenApiSerializedDeliveryService4;
	cost?: number;
	netCost?: number;
	date?: string;
	time?: OpenApiTimeInterval7;
	address?: OpenApiOrderDeliveryAddress3;
	vatRate?: string | null;
};
export type OpenApiSerializedSource7 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiOrderProduct2 = {
	externalId?: string;
	bonusesChargeTotal?: number;
	bonusesCreditTotal?: number;
	markingCodes?: Array<string>;
	markingObjects?: Array<OpenApiOrderProductMarkingCode2>;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel3>;
	priceType?: OpenApiPriceType4;
	initialPrice?: number | null;
	discounts?: Array<OpenApiAbstractDiscount2>;
	discountTotal?: number | null;
	prices?: Array<OpenApiOrderProductPriceItem2> | null;
	vatRate?: string | null;
	createdAt?: string;
	quantity?: number | null;
	status?: string;
	comment?: string;
	offer?: OpenApiOffer7;
	isCanceled?: boolean;
	properties?: Array<{ code: string; name: string; value: string }>;
	purchasePrice?: number | null;
	ordering?: number;
};
export type OpenApiPayment2 = {
	id?: number;
	status?: string;
	type?: string;
	externalId?: string;
	amount?: number;
	paidAt?: string | null;
	comment?: string | null;
};
export type OpenApiOrderLink2 = {
	order?: OpenApiLinkedOrder2;
	createdAt?: string;
	comment?: string;
};
export type OpenApiOrderContragent = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiMGDialog = Record<string, never>;
export type OpenApiSerializedRelationCustomer = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
	type?: string;
	nickName?: string;
};
export type OpenApiSerializedRelationAbstractCustomer6 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiEntityWithExternalIdInput6 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedOrderProduct = {
	markingCodes?: Array<string>;
	markingObjects?: Array<OpenApiSerializedOrderProductMarkingCode>;
	initialPrice?: number | null;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	vatRate?: string | null;
	createdAt?: string;
	quantity?: number | null;
	comment?: string;
	properties?: Array<{ code: string; name: string; value: string }>;
	purchasePrice?: number;
	ordering?: number;
	offer?: OpenApiSerializedOrderProductOffer | null;
	productName?: string;
	status?: string;
	priceType?: OpenApiPriceType2;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel> | null;
};
export type OpenApiSerializedOrderDelivery = {
	code?: string;
	data?:
		| OpenApiGenericData
		| OpenApiCourierData
		| OpenApiNewPostData
		| OpenApiDDeliveryData
		| OpenApiKazPostData;
	service?: OpenApiSerializedDeliveryService2;
	cost?: number;
	netCost?: number;
	date?: string;
	time?: OpenApiTimeInterval5;
	address?: OpenApiOrderDeliveryAddress;
	vatRate?: string | null;
};
export type OpenApiSerializedSource5 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiSerializedPayment3 = {
	externalId?: string;
	amount?: number;
	paidAt?: string | null;
	comment?: string | null;
	type: string;
	status?: string;
};
export type OpenApiLoyaltyLevel = { id?: number; name: string };
export type OpenApiLoyaltyEventDiscount = { id?: number };
export type OpenApiCustomer5 = {
	type?: string;
	id?: number;
	externalId?: string;
	isContact?: boolean;
	createdAt?: string;
	managerId?: number;
	vip?: boolean;
	bad?: boolean;
	site?: string;
	contragent?: OpenApiCustomerContragent4;
	tags?: Array<OpenApiCustomerTagLink2>;
	firstClientId?: string;
	lastClientId?: string;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	cumulativeDiscount?: number;
	discountCardNumber?: string | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	ordersCount?: number | null;
	ticketsCount?: number;
	costSumm?: number | null;
	address?: OpenApiCustomerAddress9;
	segments?: Array<OpenApiSegment2>;
	maturationTime?: number;
	firstName?: string | null;
	lastName?: string | null;
	patronymic?: string | null;
	sex?: string;
	presumableSex?: string;
	email?: string | null;
	emailMarketingUnsubscribedAt?: string;
	customerSubscriptions?: Array<OpenApiCustomerSubscription2>;
	phones?: Array<OpenApiCustomerPhone5>;
	birthday?: string | null;
	source?: OpenApiSerializedSource6;
	mgCustomers?: Array<OpenApiMGCustomer5>;
	photoUrl?: string;
};
export type OpenApiCustomerCorporate3 = {
	type?: string;
	id?: number;
	externalId?: string;
	mainAddress?: OpenApiEntityWithExternalIdNameOutput3;
	createdAt?: string;
	managerId?: number;
	vip?: boolean;
	bad?: boolean;
	site?: string;
	tags?: Array<OpenApiCustomerTagLink2>;
	firstClientId?: string;
	lastClientId?: string;
	customFields?: Record<string, JsonValue>;
	personalDiscount?: number;
	cumulativeDiscount?: number;
	discountCardNumber?: string | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	ordersCount?: number | null;
	ticketsCount?: number;
	costSumm?: number | null;
	mainCustomerContact?: OpenApiCustomerContact4;
	mainCompany?: OpenApiEntityWithExternalIdNameOutput3;
	nickName?: string;
};
export type OpenApiCompany3 = {
	id?: number;
	externalId?: string;
	customer?: OpenApiSerializedEntityCustomer6 | null;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiCompanyContragent2 | null;
	address?: OpenApiCustomerAddress9 | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	costSumm?: number | null;
	ordersCount?: number | null;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiOrderContragent2 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiSerializedOrderDelivery2 = {
	code?: string;
	integrationCode?: string;
	data?:
		| OpenApiGenericData2
		| OpenApiCourierData2
		| OpenApiNewPostData2
		| OpenApiDDeliveryData2
		| OpenApiKazPostData2;
	service?: OpenApiSerializedDeliveryService3;
	cost?: number;
	netCost?: number;
	date?: string;
	time?: OpenApiTimeInterval6;
	address?: OpenApiOrderDeliveryAddress2;
	vatRate?: string | null;
};
export type OpenApiSerializedSource6 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiOrderProduct = {
	externalId?: string;
	bonusesChargeTotal?: number;
	bonusesCreditTotal?: number;
	markingCodes?: Array<string>;
	markingObjects?: Array<OpenApiOrderProductMarkingCode>;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel2>;
	priceType?: OpenApiPriceType3;
	initialPrice?: number | null;
	discounts?: Array<OpenApiAbstractDiscount>;
	discountTotal?: number | null;
	prices?: Array<OpenApiOrderProductPriceItem> | null;
	vatRate?: string | null;
	createdAt?: string;
	quantity?: number | null;
	status?: string;
	comment?: string;
	offer?: OpenApiOffer6;
	isCanceled?: boolean;
	properties?: Array<{ code: string; name: string; value: string }>;
	purchasePrice?: number | null;
	ordering?: number;
};
export type OpenApiPayment = {
	id?: number;
	status?: string;
	type?: string;
	externalId?: string;
	amount?: number;
	paidAt?: string | null;
	comment?: string | null;
};
export type OpenApiOrderLink = {
	order?: OpenApiLinkedOrder;
	createdAt?: string;
	comment?: string;
};
export type OpenApiUser2 = { id?: number };
export type OpenApiApiKey2 = { current?: boolean; id?: number };
export type OpenApiOrder5 = {
	id?: number;
	externalId?: string;
	managerId?: number;
	site?: string;
	status?: string;
};
export type OpenApiOrderProduct3 = {
	externalId?: string;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel4>;
	discounts?: Array<OpenApiAbstractDiscount3>;
	offer?: OpenApiOffer8;
	properties?: Array<{ code: string; name: string; value: string }>;
	ordering?: number;
};
export type OpenApiPayment3 = {
	id?: number;
	type?: string;
	externalId?: string;
};
export type OpenApiSerializedEntityOrder3 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiLoyaltyAccount4 = { id?: number; amount?: number };
export type OpenApiLoyaltyLevel4 = { id?: number; name: string };
export type OpenApiLoyaltyEventDiscount4 = {
	id?: number;
	loyaltyEvent?: OpenApiAbstractLoyaltyEvent;
};
export type OpenApiCustomer7 = {
	id?: number;
	externalId?: string;
	personalDiscount?: number;
};
export type OpenApiSerializedOrderDelivery8 = { cost?: number };
export type OpenApiOrderProduct6 = {
	bonusesChargeTotal?: number;
	bonusesCreditTotal?: number;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel10>;
	priceType?: OpenApiPriceType8;
	initialPrice?: number | null;
	discounts?: Array<OpenApiAbstractDiscount5>;
	discountTotal?: number | null;
	prices?: Array<OpenApiOrderProductPriceItem4> | null;
	vatRate?: string | null;
	quantity?: number | null;
	offer?: OpenApiOffer10;
};
export type OpenApiSerializedEntityOrder2 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiOrderContragent5 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiSerializedRelationCustomer3 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
	type?: string;
	nickName?: string;
};
export type OpenApiSerializedRelationAbstractCustomer8 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiEntityWithExternalIdInput8 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedOrderProduct3 = {
	markingCodes?: Array<string>;
	initialPrice?: number | null;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	vatRate?: string | null;
	createdAt?: string;
	quantity?: number | null;
	comment?: string;
	properties?: Array<{ code: string; name: string; value: string }>;
	purchasePrice?: number;
	ordering?: number;
	offer?: OpenApiSerializedOrderProductOffer3 | null;
	productName?: string;
	status?: string;
	priceType?: OpenApiPriceType6;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel7> | null;
};
export type OpenApiSerializedOrderDelivery5 = {
	code?: string;
	data?:
		| OpenApiGenericData5
		| OpenApiCourierData5
		| OpenApiNewPostData5
		| OpenApiDDeliveryData5
		| OpenApiKazPostData5;
	service?: OpenApiSerializedDeliveryService6;
	cost?: number;
	netCost?: number;
	date?: string;
	time?: OpenApiTimeInterval9;
	address?: OpenApiOrderDeliveryAddress5;
	vatRate?: string | null;
};
export type OpenApiSerializedSource9 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiSerializedPayment4 = {
	externalId?: string;
	amount?: number;
	paidAt?: string | null;
	comment?: string | null;
	type: string;
	status?: string;
};
export type OpenApiLoyaltyEventDiscount3 = { id?: number };
export type OpenApiCompany5 = {
	id?: number;
	externalId?: string;
	customer?: OpenApiSerializedEntityCustomer2 | null;
	active?: boolean;
	name?: string;
	brand?: string;
	site?: string;
	createdAt?: string;
	contragent?: OpenApiCompanyContragent4 | null;
	address?: OpenApiCustomerAddress4 | null;
	avgMarginSumm?: number | null;
	marginSumm?: number;
	totalSumm?: number;
	averageSumm?: number | null;
	costSumm?: number | null;
	ordersCount?: number | null;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiOrderContragent6 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiSerializedOrderDelivery6 = {
	code?: string;
	integrationCode?: string;
	data?:
		| OpenApiGenericData6
		| OpenApiCourierData6
		| OpenApiNewPostData6
		| OpenApiDDeliveryData6
		| OpenApiKazPostData6;
	service?: OpenApiSerializedDeliveryService7;
	cost?: number;
	netCost?: number;
	date?: string;
	time?: OpenApiTimeInterval10;
	address?: OpenApiOrderDeliveryAddress6;
	vatRate?: string | null;
};
export type OpenApiOrderProduct5 = {
	externalId?: string;
	bonusesChargeTotal?: number;
	bonusesCreditTotal?: number;
	markingCodes?: Array<string>;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel8>;
	priceType?: OpenApiPriceType7;
	initialPrice?: number | null;
	discounts?: Array<OpenApiAbstractDiscount4>;
	discountTotal?: number | null;
	prices?: Array<OpenApiOrderProductPriceItem3> | null;
	vatRate?: string | null;
	createdAt?: string;
	quantity?: number | null;
	status?: string;
	comment?: string;
	offer?: OpenApiOffer5;
	isCanceled?: boolean;
	properties?: Array<{ code: string; name: string; value: string }>;
	purchasePrice?: number | null;
	ordering?: number;
};
export type OpenApiPayment4 = {
	id?: number;
	status?: string;
	type?: string;
	externalId?: string;
	amount?: number;
	paidAt?: string | null;
	comment?: string | null;
};
export type OpenApiOrderLink3 = {
	order?: OpenApiLinkedOrder3;
	createdAt?: string;
	comment?: string;
};
export type OpenApiOrderContragent4 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiSerializedRelationCustomer2 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
	type?: string;
	nickName?: string;
};
export type OpenApiSerializedRelationAbstractCustomer7 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiEntityWithExternalIdInput7 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedOrderProduct2 = {
	markingCodes?: Array<string>;
	markingObjects?: Array<OpenApiSerializedOrderProductMarkingCode2>;
	id?: number | null;
	initialPrice?: number | null;
	discountManualAmount?: number | null;
	discountManualPercent?: number | null;
	vatRate?: string | null;
	createdAt?: string;
	quantity?: number | null;
	comment?: string;
	properties?: Array<{ code: string; name: string; value: string }>;
	purchasePrice?: number;
	ordering?: number;
	offer?: OpenApiSerializedOrderProductOffer2 | null;
	productName?: string;
	status?: string;
	priceType?: OpenApiPriceType5;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel5> | null;
};
export type OpenApiSerializedOrderDelivery4 = {
	code?: string;
	data?:
		| OpenApiGenericData4
		| OpenApiCourierData4
		| OpenApiNewPostData4
		| OpenApiDDeliveryData4
		| OpenApiKazPostData4;
	service?: OpenApiSerializedDeliveryService5;
	cost?: number;
	netCost?: number;
	date?: string;
	time?: OpenApiTimeInterval8;
	address?: OpenApiOrderDeliveryAddress4;
	vatRate?: string | null;
};
export type OpenApiSerializedSource8 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiUnit = { code?: string; name?: string; sym?: string };
export type OpenApiOrderProduct4 = {
	externalId?: string;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel6>;
	order?: OpenApiOrder8;
	offer?: OpenApiOffer9;
};
export type OpenApiHistoryField = Record<string, never>;
export type OpenApiOrderProductPack2 = {
	id?: number | null;
	purchasePrice?: number | null;
	quantity?: number | null;
	store?: OpenApiStore5 | null;
	item?: OpenApiOrderProduct8;
	shipmentDate?: string | null;
	invoiceNumber?: string;
	deliveryNoteNumber?: string;
};
export type OpenApiUser3 = { id?: number };
export type OpenApiPaymentRefund = {
	id?: number;
	status?: string;
	externalId?: string;
	comment?: string;
	amount?: string;
	createdAt?: string;
};
export type OpenApiCourierPhone = { number?: string | null };
export type OpenApiCourierPhone2 = { number?: string | null };
export type OpenApiDeliveryTypePaymentType = {
	code?: string | null;
	cod?: boolean;
};
export type OpenApiPaymentTypeDeliveryPaymentType = {
	code: string;
	cod?: boolean;
};
export type OpenApiIntegrationModule4 = {
	active?: boolean;
	name?: string;
	logo?: string;
};
export type OpenApiPaymentTypeDeliveryPaymentType2 = {
	code: string;
	cod?: boolean;
};
export type OpenApiGeoHierarchyRow = {
	country?: string | null;
	regionId?: string | null;
	region?: string | null;
	cityId?: string | null;
	city?: string | null;
};
export type OpenApiGeoHierarchyRow2 = {
	country?: string | null;
	regionId?: string | null;
	cityId?: string | null;
};
export type OpenApiStoreAddress = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	coordinates?: OpenApiPoint | null;
};
export type OpenApiStorePhone = { number?: string | null };
export type OpenApiSerializedStoreWeekOpeningHours = {
	mo?: Array<OpenApiStoreWorkTime>;
	tu?: Array<OpenApiStoreWorkTime>;
	we?: Array<OpenApiStoreWorkTime>;
	th?: Array<OpenApiStoreWorkTime>;
	fr?: Array<OpenApiStoreWorkTime>;
	sa?: Array<OpenApiStoreWorkTime>;
	su?: Array<OpenApiStoreWorkTime>;
};
export type OpenApiStoreAddress2 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	coordinates?: OpenApiPoint2 | null;
};
export type OpenApiStorePhone2 = { number?: string | null };
export type OpenApiSerializedStoreWeekOpeningHours2 = {
	mo?: Array<OpenApiStoreWorkTime2>;
	tu?: Array<OpenApiStoreWorkTime2>;
	we?: Array<OpenApiStoreWorkTime2>;
	th?: Array<OpenApiStoreWorkTime2>;
	fr?: Array<OpenApiStoreWorkTime2>;
	sa?: Array<OpenApiStoreWorkTime2>;
	su?: Array<OpenApiStoreWorkTime2>;
};
export type OpenApiValue = { value?: string; updated_at?: string | null };
export type OpenApiWorkTime = {
	day_type?: string;
	start_time?: string;
	end_time?: string;
	lunch_start_time?: string | null;
	lunch_end_time?: string | null;
};
export type OpenApiNonWorkingDay = { start_date?: string; end_date?: string };
export type OpenApiIntegrationData = {
	order_creation?: OpenApiOrderCreationSettings;
};
export type OpenApiOrderSettings = {
	allow_duplicate_order_product?: OpenApiBooleanSetting;
};
export type OpenApiInventory = {
	quantity?: number;
	purchasePrice?: number;
	store?: string;
};
export type OpenApiSerializedStore2 = {
	code: string;
	available?: number;
	purchasePrice?: number;
};
export type OpenApiOfferPrice = {
	priceType: string;
	currency?: string;
	price: number;
	ordering?: number;
};
export type OpenApiProduct2 = {
	type?: 1 | 2;
	minPrice?: number;
	maxPrice?: number;
	catalogId?: number;
	id?: number;
	article?: string;
	name: string;
	url?: string;
	imageUrl?: string;
	description?: string;
	popular?: boolean;
	stock?: boolean;
	novelty?: boolean;
	recommended?: boolean;
	options?: Record<string, JsonValue>;
	groups?: Array<OpenApiProductGroup3>;
	externalId?: string;
	manufacturer?: string;
	updatedAt?: string;
	active?: boolean;
	quantity?: number;
	markable?: boolean;
	markingProvider?: OpenApiMarkingCodeProvider;
};
export type OpenApiUnit2 = { code?: string; name?: string; sym?: string };
export type OpenApiProductGroup2 = { id?: number; externalId?: string };
export type OpenApiOffer4 = {
	name: string;
	price?: number;
	images?: Array<string>;
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	article?: string;
	prices?: Array<OpenApiOfferPrice2>;
	purchasePrice?: number;
	vatRate?: string;
	properties?: Record<string, JsonValue>;
	quantity?: number;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	duration?: number;
	active?: boolean;
	unit?: OpenApiUnit3;
	barcode?: string;
};
export type OpenApiMarkingCodeProvider = 'chestny_znak' | 'giis_dmdk';
export type OpenApiProductPropertyGroup = { id?: number; name?: string };
export type OpenApiProductPropertyResponse = { code?: string; name?: string };
export type OpenApiAbstractCustomer = {
	type?: string;
	id?: number;
	externalId?: string;
	site?: string;
};
export type OpenApiOrder6 = {
	id?: number;
	number?: string;
	externalId?: string;
	site?: string;
};
export type OpenApiTicket = {
	id?: number;
	number?: string;
	externalId?: string;
	site?: string;
};
export type OpenApiSerializedEntityCustomer4 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedEntityOrder4 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiSerializedEntityTicket = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiTask2 = { id?: number; ticket?: OpenApiTicket2 };
export type OpenApiTaskComment2 = { id?: number; text?: string };
export type OpenApiSerializedEntityCustomer5 = {
	id?: number;
	externalId?: string;
};
export type OpenApiSerializedEntityOrder5 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiSerializedEntityTicket2 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiSerializedWebAnalyticsData = {
	campaign?: OpenApiSerializedCampaign;
	queryString?: string;
};
export type OpenApiSerializedManager2 = {
	id?: string;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	email?: string;
	code?: string;
};
export type OpenApiSerializedTag = {
	id?: number;
	name?: string;
	colorCode?: string;
	color?: string;
};
export type OpenApiSerializedTicket = {
	id?: number;
	externalId?: string;
	site?: string;
	number?: string;
};
export type OpenApiSerializedCustomer5 = {
	id?: string;
	externalId?: string;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	email?: string;
	phones?: Array<OpenApiCustomerPhone7>;
};
export type OpenApiSerializedTranscriptSegment = {
	number?: number;
	start?: number;
	end?: number;
	text?: string;
};
export type OpenApiSerializedSource11 = {
	source?: string;
	medium?: string;
	campaign?: string;
	keyword?: string;
	content?: string;
};
export type OpenApiCustomerReferenceDto = {
	id?: number;
	externalId?: string;
	site?: string;
	type?: 'customer' | 'customer_corporate';
};
export type OpenApiCompanyReferenceDto = { id?: number; externalId?: string };
export type OpenApiTicketSlaDto = {
	duration?: number;
	status?: 'normal' | 'warning' | 'urgent';
	createdAt?: string;
	warningAt?: string;
	urgentAt?: string;
	closedAt?: string;
	remainingDuration?: number;
};
export type OpenApiTicketIssueDto2 = {
	id?: number;
	ticketType?: OpenApiTicketType;
	ticketSubtopic?: OpenApiTicketSubtopic;
	status?: OpenApiTicketStatus;
	responsible?: number;
	responsibleType?: 'user' | 'group';
	closedAt?: string;
	sla?: OpenApiTicketSlaDto;
};
export type OpenApiOrderReferenceDto = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
};
export type OpenApiOrderProductReferenceDto = {
	id?: number;
	externalIds?: Array<OpenApiCodeValueModel9>;
	order?: OpenApiOrderReferenceDto;
};
export type OpenApiTag = { color?: string; name?: string; colorCode?: string };
export type OpenApiTicketReferenceDto = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
};
export type OpenApiUser5 = { id?: number };
export type OpenApiApiKey4 = { current?: boolean; id?: number };
export type OpenApiTicketSnapshot = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
	description?: string;
	createdAt?: string;
	fromApi?: boolean;
	author?: number;
	customer?: OpenApiCustomerReferenceDto2;
	contact?: OpenApiCustomerReferenceDto2;
	company?: OpenApiCompanyReferenceDto2;
	ticketChannel?: OpenApiTicketChannel2;
	issues?: Array<OpenApiTicketIssueDto>;
	comments?: Array<OpenApiTicketComment>;
	tags?: Array<OpenApiTag2>;
	customFields?: Record<string, JsonValue>;
};
export type OpenApiTicketIssueDto = {
	id?: number;
	ticketType?: OpenApiTicketType2;
	ticketSubtopic?: OpenApiTicketSubtopic2;
	status?: OpenApiTicketStatus2;
	responsible?: number;
	responsibleType?: 'user' | 'group';
	closedAt?: string;
};
export type OpenApiTicketComment = {
	id?: number;
	text?: string;
	authorId?: number;
	createdAt?: string;
	updatedAt?: string;
};
export type OpenApiSerializedGroups = {
	id: number;
	name: string;
	code: string;
};
export type OpenApiSerializedEntityOrder7 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiPage = {
	url?: string;
	title?: string | null;
	countViews?: number | null;
	timeOnPage?: number | null;
};
export type OpenApiPage2 = {
	url?: string;
	title?: string | null;
	countViews?: number | null;
	timeOnPage?: number | null;
};
export type OpenApiCustomerContactCompany2 = {
	id?: number;
	company?: OpenApiEntityWithExternalIdNameOutput2 | null;
};
export type OpenApiSerializedRelationAbstractCustomer9 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiSerializedCustomerContactCompany4 = {
	company?: OpenApiEntityWithExternalIdInput9;
};
export type OpenApiSerializedCompanyContragent4 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiEntityWithExternalIdInput9 = {
	id?: number;
	externalId?: string;
};
export type OpenApiUnit4 = { code?: string; name?: string; sym?: string };
export type OpenApiTimeInterval11 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiOrderDeliveryAddress7 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
};
export type OpenApiTimeInterval10 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiTimeInterval12 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiSerializedEntityOrder8 = {
	id?: number;
	externalId?: string;
	number?: string;
};
export type OpenApiTimeInterval13 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiCustomer11 = {
	id?: number;
	externalId?: string;
	site?: string;
};
export type OpenApiCustomerCorporate5 = {
	id?: number;
	externalId?: string;
	site?: string;
};
export type OpenApiOrder9 = {
	id?: number;
	number?: string;
	externalId?: string;
	site?: string;
};
export type OpenApiTicket3 = {
	id?: number;
	number?: string;
	externalId?: string;
	site?: string;
};
export type OpenApiKnowledgeBaseDocument3 = { id?: number };
export type OpenApiSerializedRelationAbstractCustomer10 = {
	id?: number;
	externalId?: string;
	browserId?: string;
	site?: string;
};
export type OpenApiSerializedRelationOrder2 = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
};
export type OpenApiSerializedRelationTicket = {
	id?: number;
	externalId?: string;
	number?: string;
	site?: string;
};
export type OpenApiSerializedRelationKnowledgeBaseDocument = { id?: number };
export type OpenApiSerializedAdditionalCodes2 = {
	userId: number;
	code: string;
};
export type OpenApiSerializedExternalPhones2 = {
	siteCode: string;
	externalPhone: string;
};
export type OpenApiStatus4 = {
	code?: string;
	name?: string;
	isEditable?: boolean;
	isError?: boolean;
	isPreprocessing?: boolean;
};
export type OpenApiPlate2 = { type?: string; code?: string; label?: string };
export type OpenApiDeliveryDataField2 = {
	code?: string;
	label?: string;
	hint?: string;
	type?: string;
	multiple?: boolean;
	choices?: Record<string, JsonValue>;
	autocompleteUrl?: string;
	visible?: boolean;
	required?: boolean;
	affectsCost?: boolean;
	editable?: boolean;
};
export type OpenApiSettings3 = {
	defaultPayerType?: string;
	costCalculateBy?: string;
	nullDeclaredValue?: boolean;
	lockedByDefault?: boolean;
	paymentTypes?: Array<OpenApiPaymentType6>;
	shipmentPoints?: Array<OpenApiShipmentPoint2>;
	statuses?: Array<OpenApiStatus6> | null;
	deliveryExtraData?: Record<string, JsonValue>;
	shipmentExtraData?: Record<string, JsonValue>;
};
export type OpenApiAction2 = {
	code?: string;
	url?: string;
	callPoints?: Array<string>;
};
export type OpenApiMode2 = {
	code?: string | null;
	names?: { [key: string]: string | undefined } & {};
};
export type OpenApiActions2 = {
	create: string;
	approve?: string;
	cancel?: string;
	refund?: string | null;
};
export type OpenApiShop2 = { code: string; name: string; active?: boolean };
export type OpenApiConfigurationPage2 = {
	code: string | null;
	menu?: string | null;
	parentMenuItemCode?: string | null;
	menuItemOrdering?: number | null;
	menuItemTitle?: OpenApiConfigurationTranslation2 | null;
	pageHelpLink?: OpenApiConfigurationTranslation2 | null;
	isSettingsMainPage?: boolean;
};
export type OpenApiPaymentType5 = {
	code?: string;
	active?: boolean;
	cod?: boolean;
};
export type OpenApiShipmentPoint = {
	code?: string;
	shipmentPointId?: string;
	shipmentPointLabel?: string;
};
export type OpenApiStatus5 = { code?: string; trackingStatusCode?: string };
export type OpenApiConfigurationTranslation = {
	en: string | null;
	es: string | null;
	ru: string | null;
};
export type OpenApiLoyaltyLevelCondition2 = {
	id?: number;
	privilegeSize?: number;
	privilegeSizePromo?: number;
	items?: Array<
		| OpenApiLoyaltyLevelConditionItemOffer2
		| OpenApiLoyaltyLevelConditionItemProduct2
		| OpenApiLoyaltyLevelConditionItemProductGroup2
		| OpenApiLoyaltyLevelConditionItemManufacturer2
	>;
};
export type OpenApiSerializedOrderProductOffer4 = {
	id?: number;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiPriceType10 = { code?: string };
export type OpenApiAbstractLoyaltyEvent2 =
	| OpenApiBirthdayLoyaltyEvent3
	| OpenApiWelcomeLoyaltyEvent3
	| OpenApiCustomLoyaltyEvent2;
export type OpenApiCodeValueModel11 = { code?: string; value?: string };
export type OpenApiPriceType9 = { code?: string };
export type OpenApiAbstractDiscount6 = { type?: string; amount?: number };
export type OpenApiOrderProductPriceItem5 = {
	price?: number;
	quantity?: number;
};
export type OpenApiOffer11 = {
	id?: number | null;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiLoyaltyLevelCondition = {
	id?: number;
	privilegeSize?: number;
	privilegeSizePromo?: number;
	items?: Array<
		| OpenApiLoyaltyLevelConditionItemOffer
		| OpenApiLoyaltyLevelConditionItemProduct
		| OpenApiLoyaltyLevelConditionItemProductGroup
		| OpenApiLoyaltyLevelConditionItemManufacturer
	>;
};
export type OpenApiCustomerContragent5 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiCustomerTagLink3 = {
	color?: string;
	name?: string;
	colorCode?: string;
	attached?: boolean;
};
export type OpenApiCustomerAddress10 = {
	id?: number;
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	externalId?: string;
	name?: string;
};
export type OpenApiSegment3 = {
	id?: number;
	code?: string;
	name?: string;
	createdAt?: string;
	isDynamic?: boolean;
	customersCount?: number;
	active?: boolean;
};
export type OpenApiCustomerSubscription3 = {
	subscription?: OpenApiSubscription4;
	subscribed?: boolean;
	changedAt?: string;
};
export type OpenApiCustomerPhone6 = { number?: string | null };
export type OpenApiMGCustomer6 = {
	id?: number;
	externalId?: number;
	mgChannel?: OpenApiMGChannel3;
};
export type OpenApiEntityWithExternalIdNameOutput4 = {
	id?: number;
	externalId?: string;
	name?: string;
};
export type OpenApiCustomerContact5 = {
	id?: number;
	customer?: OpenApiSerializedRelationAbstractCustomer12 | null;
	companies?: Array<OpenApiCustomerContactCompany4>;
};
export type OpenApiSerializedEntityCustomer7 = {
	site?: string;
	id?: number;
	externalId?: string;
	type?: string;
};
export type OpenApiCompanyContragent3 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiGenericData3 = {
	externalId?: string;
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	pickuppointAddress?: string;
	days?: string;
	statusText?: string;
	statusDate?: string;
	tariff?: string;
	tariffName?: string;
	pickuppointId?: string;
	pickuppointSchedule?: string;
	pickuppointPhone?: string;
	payerType?: string;
	statusComment?: string;
	cost?: number | null;
	minTerm?: number;
	maxTerm?: number;
	shipmentpointId?: string;
	shipmentpointName?: string;
	shipmentpointAddress?: string;
	shipmentpointSchedule?: string;
	shipmentpointPhone?: string;
	shipmentpointCoordinateLatitude?: string;
	shipmentpointCoordinateLongitude?: string;
	pickuppointName?: string;
	pickuppointCoordinateLatitude?: string;
	pickuppointCoordinateLongitude?: string;
	extraData?: Record<string, JsonValue>;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem3>;
	packages?: Array<OpenApiPackage6> | null;
};
export type OpenApiCourierData3 = {
	locked?: boolean;
	id?: number;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	active?: boolean;
	email?: string;
	phone?: OpenApiCourierPhone4;
	description?: string;
	courierId?: number;
};
export type OpenApiNewPostData3 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	statusDate?: string;
	serviceType?: string;
	days?: string;
	pickuppoint?: string;
	pickuppointId?: string;
	receiverWarehouseTypeRef?: string;
	statusName?: string;
	price?: number | null;
	shipmentpointId?: string;
	receiverCity?: string;
	receiverCityRef?: string;
	receiverStreet?: string;
	receiverStreetRef?: string;
	seatsAmount?: number;
	cargoType?: string;
	cargoDescription?: string;
	payerType?: string;
	cashPayerType?: string;
	paymentForm?: string;
	ownershipForm?: string;
	packageNumber?: string;
	accompanyingDocument?: string;
	notes?: string;
	preferredDeliveryDate?: string | null;
	timeInterval?: string;
	saturdayDelivery?: boolean;
	deliveryDate?: string;
	denieReason?: string | null;
	backwardDelivery?: boolean;
	backwardDeliveryCargoType?: string;
	backwardDeliveryPayerType?: string;
	backwardDeliveryRedeliveryString?: string;
	afterpaymentOnGoodsCost?: number;
	declaredValue?: number;
	sendDate?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem3>;
};
export type OpenApiDDeliveryData3 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	pickuppoint?: string;
	statusText?: string;
	deliveryType?: string;
	deliveryName?: string;
	pickuppointId?: string;
	days?: string;
	pickupType?: number | null;
	cost?: number | null;
	receiverCity?: string;
	receiverCityRef?: string;
	pickuppointSchedule?: string;
	pickuppointDescription?: string;
	placesCount?: number | null;
	services?: Array<string>;
	comment?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem3>;
};
export type OpenApiKazPostData3 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	statusText?: string;
};
export type OpenApiSerializedDeliveryService4 = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
};
export type OpenApiTimeInterval7 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiOrderDeliveryAddress3 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiOrderProductMarkingCode2 = {
	code: string;
	provider?: OpenApiMarkingCodeProvider;
};
export type OpenApiCodeValueModel3 = { code?: string; value?: string };
export type OpenApiPriceType4 = { code?: string };
export type OpenApiAbstractDiscount2 = { type?: string; amount?: number };
export type OpenApiOrderProductPriceItem2 = {
	price?: number;
	quantity?: number;
};
export type OpenApiOffer7 = {
	displayName?: string;
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	name: string;
	article?: string;
	vatRate?: string;
	properties?: Record<string, JsonValue>;
	unit?: OpenApiUnit8;
	barcode?: string;
};
export type OpenApiLinkedOrder2 = {
	id?: number;
	number?: string;
	externalId?: string;
};
export type OpenApiSerializedOrderProductMarkingCode = {
	code: string;
	provider: 'chestny_znak' | 'giis_dmdk';
};
export type OpenApiSerializedOrderProductOffer = {
	id?: number;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiPriceType2 = { code?: string };
export type OpenApiCodeValueModel = { code?: string; value?: string };
export type OpenApiGenericData = {
	externalId?: string;
	trackNumber?: string;
	locked?: boolean;
	tariff?: string;
	pickuppointId?: string;
	payerType?: string;
	shipmentpointId?: string;
	extraData?: Record<string, JsonValue>;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem>;
	packages?: Array<OpenApiPackage4> | null;
};
export type OpenApiCourierData = { locked?: boolean; courierId?: number };
export type OpenApiNewPostData = {
	trackNumber?: string;
	locked?: boolean;
	serviceType?: string;
	pickuppoint?: string;
	pickuppointId?: string;
	receiverWarehouseTypeRef?: string;
	shipmentpointId?: string;
	receiverCity?: string;
	receiverCityRef?: string;
	receiverStreet?: string;
	receiverStreetRef?: string;
	seatsAmount?: number;
	cargoType?: string;
	cargoDescription?: string;
	payerType?: string;
	cashPayerType?: string;
	paymentForm?: string;
	ownershipForm?: string;
	packageNumber?: string;
	accompanyingDocument?: string;
	notes?: string;
	preferredDeliveryDate?: string | null;
	backwardDelivery?: boolean;
	backwardDeliveryCargoType?: string;
	backwardDeliveryPayerType?: string;
	backwardDeliveryRedeliveryString?: string;
	afterpaymentOnGoodsCost?: number;
	declaredValue?: number;
	sendDate?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem>;
};
export type OpenApiDDeliveryData = {
	locked?: boolean;
	deliveryType?: string;
	pickuppointId?: string;
	pickupType?: number | null;
	receiverCity?: string;
	receiverCityRef?: string;
	placesCount?: number | null;
	services?: Array<string>;
	comment?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem>;
};
export type OpenApiKazPostData = { trackNumber?: string; locked?: boolean };
export type OpenApiSerializedDeliveryService2 = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
	deliveryType?: string;
};
export type OpenApiTimeInterval5 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiOrderDeliveryAddress = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiCustomerContragent4 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiCustomerTagLink2 = {
	color?: string;
	name?: string;
	colorCode?: string;
	attached?: boolean;
};
export type OpenApiCustomerAddress9 = {
	id?: number;
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
	externalId?: string;
	name?: string;
};
export type OpenApiSegment2 = {
	id?: number;
	code?: string;
	name?: string;
	createdAt?: string;
	isDynamic?: boolean;
	customersCount?: number;
	active?: boolean;
};
export type OpenApiCustomerSubscription2 = {
	subscription?: OpenApiSubscription3;
	subscribed?: boolean;
	changedAt?: string;
};
export type OpenApiCustomerPhone5 = { number?: string | null };
export type OpenApiMGCustomer5 = {
	id?: number;
	externalId?: number;
	mgChannel?: OpenApiMGChannel2;
};
export type OpenApiEntityWithExternalIdNameOutput3 = {
	id?: number;
	externalId?: string;
	name?: string;
};
export type OpenApiCustomerContact4 = {
	id?: number;
	customer?: OpenApiSerializedRelationAbstractCustomer11 | null;
	companies?: Array<OpenApiCustomerContactCompany3>;
};
export type OpenApiSerializedEntityCustomer6 = {
	site?: string;
	id?: number;
	externalId?: string;
	type?: string;
};
export type OpenApiCompanyContragent2 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiGenericData2 = {
	externalId?: string;
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	pickuppointAddress?: string;
	days?: string;
	statusText?: string;
	statusDate?: string;
	tariff?: string;
	tariffName?: string;
	pickuppointId?: string;
	pickuppointSchedule?: string;
	pickuppointPhone?: string;
	payerType?: string;
	statusComment?: string;
	cost?: number | null;
	minTerm?: number;
	maxTerm?: number;
	shipmentpointId?: string;
	shipmentpointName?: string;
	shipmentpointAddress?: string;
	shipmentpointSchedule?: string;
	shipmentpointPhone?: string;
	shipmentpointCoordinateLatitude?: string;
	shipmentpointCoordinateLongitude?: string;
	pickuppointName?: string;
	pickuppointCoordinateLatitude?: string;
	pickuppointCoordinateLongitude?: string;
	extraData?: Record<string, JsonValue>;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem2>;
	packages?: Array<OpenApiPackage5> | null;
};
export type OpenApiCourierData2 = {
	locked?: boolean;
	id?: number;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	active?: boolean;
	email?: string;
	phone?: OpenApiCourierPhone3;
	description?: string;
	courierId?: number;
};
export type OpenApiNewPostData2 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	statusDate?: string;
	serviceType?: string;
	days?: string;
	pickuppoint?: string;
	pickuppointId?: string;
	receiverWarehouseTypeRef?: string;
	statusName?: string;
	price?: number | null;
	shipmentpointId?: string;
	receiverCity?: string;
	receiverCityRef?: string;
	receiverStreet?: string;
	receiverStreetRef?: string;
	seatsAmount?: number;
	cargoType?: string;
	cargoDescription?: string;
	payerType?: string;
	cashPayerType?: string;
	paymentForm?: string;
	ownershipForm?: string;
	packageNumber?: string;
	accompanyingDocument?: string;
	notes?: string;
	preferredDeliveryDate?: string | null;
	timeInterval?: string;
	saturdayDelivery?: boolean;
	deliveryDate?: string;
	denieReason?: string | null;
	backwardDelivery?: boolean;
	backwardDeliveryCargoType?: string;
	backwardDeliveryPayerType?: string;
	backwardDeliveryRedeliveryString?: string;
	afterpaymentOnGoodsCost?: number;
	declaredValue?: number;
	sendDate?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem2>;
};
export type OpenApiDDeliveryData2 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	pickuppoint?: string;
	statusText?: string;
	deliveryType?: string;
	deliveryName?: string;
	pickuppointId?: string;
	days?: string;
	pickupType?: number | null;
	cost?: number | null;
	receiverCity?: string;
	receiverCityRef?: string;
	pickuppointSchedule?: string;
	pickuppointDescription?: string;
	placesCount?: number | null;
	services?: Array<string>;
	comment?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem2>;
};
export type OpenApiKazPostData2 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	statusText?: string;
};
export type OpenApiSerializedDeliveryService3 = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
};
export type OpenApiTimeInterval6 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiOrderDeliveryAddress2 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiOrderProductMarkingCode = {
	code: string;
	provider?: OpenApiMarkingCodeProvider;
};
export type OpenApiCodeValueModel2 = { code?: string; value?: string };
export type OpenApiPriceType3 = { code?: string };
export type OpenApiAbstractDiscount = { type?: string; amount?: number };
export type OpenApiOrderProductPriceItem = {
	price?: number;
	quantity?: number;
};
export type OpenApiOffer6 = {
	displayName?: string;
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	name: string;
	article?: string;
	vatRate?: string;
	properties?: Record<string, JsonValue>;
	quantity?: number;
	unit?: OpenApiUnit7;
	barcode?: string;
};
export type OpenApiLinkedOrder = {
	id?: number;
	number?: string;
	externalId?: string;
};
export type OpenApiCodeValueModel4 = { code?: string; value?: string };
export type OpenApiAbstractDiscount3 = { type?: string; amount?: number };
export type OpenApiOffer8 = {
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	properties?: Record<string, JsonValue>;
};
export type OpenApiAbstractLoyaltyEvent =
	| OpenApiBirthdayLoyaltyEvent2
	| OpenApiWelcomeLoyaltyEvent2
	| OpenApiCustomLoyaltyEvent;
export type OpenApiCodeValueModel10 = { code?: string; value?: string };
export type OpenApiPriceType8 = { code?: string };
export type OpenApiAbstractDiscount5 = { type?: string; amount?: number };
export type OpenApiOrderProductPriceItem4 = {
	price?: number;
	quantity?: number;
};
export type OpenApiOffer10 = {
	id?: number | null;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiSerializedOrderProductOffer3 = {
	id?: number;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiPriceType6 = { code?: string };
export type OpenApiCodeValueModel7 = { code?: string; value?: string };
export type OpenApiGenericData5 = {
	externalId?: string;
	trackNumber?: string;
	locked?: boolean;
	tariff?: string;
	pickuppointId?: string;
	payerType?: string;
	shipmentpointId?: string;
	extraData?: Record<string, JsonValue>;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem5>;
	packages?: Array<OpenApiPackage8> | null;
};
export type OpenApiCourierData5 = { locked?: boolean; courierId?: number };
export type OpenApiNewPostData5 = {
	trackNumber?: string;
	locked?: boolean;
	serviceType?: string;
	pickuppoint?: string;
	pickuppointId?: string;
	receiverWarehouseTypeRef?: string;
	shipmentpointId?: string;
	receiverCity?: string;
	receiverCityRef?: string;
	receiverStreet?: string;
	receiverStreetRef?: string;
	seatsAmount?: number;
	cargoType?: string;
	cargoDescription?: string;
	payerType?: string;
	cashPayerType?: string;
	paymentForm?: string;
	ownershipForm?: string;
	packageNumber?: string;
	accompanyingDocument?: string;
	notes?: string;
	preferredDeliveryDate?: string | null;
	backwardDelivery?: boolean;
	backwardDeliveryCargoType?: string;
	backwardDeliveryPayerType?: string;
	backwardDeliveryRedeliveryString?: string;
	afterpaymentOnGoodsCost?: number;
	declaredValue?: number;
	sendDate?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem5>;
};
export type OpenApiDDeliveryData5 = {
	locked?: boolean;
	deliveryType?: string;
	pickuppointId?: string;
	pickupType?: number | null;
	receiverCity?: string;
	receiverCityRef?: string;
	placesCount?: number | null;
	services?: Array<string>;
	comment?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem5>;
};
export type OpenApiKazPostData5 = { trackNumber?: string; locked?: boolean };
export type OpenApiSerializedDeliveryService6 = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
	deliveryType?: string;
};
export type OpenApiTimeInterval9 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiOrderDeliveryAddress5 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiCompanyContragent4 = {
	contragentType?: string | null;
	legalName?: string;
	legalAddress?: string;
	INN?: string;
	OKPO?: string;
	KPP?: string;
	OGRN?: string;
	OGRNIP?: string;
	certificateNumber?: string;
	certificateDate?: string | null;
	BIK?: string;
	bank?: string;
	bankAddress?: string;
	corrAccount?: string;
	bankAccount?: string;
};
export type OpenApiGenericData6 = {
	externalId?: string;
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	pickuppointAddress?: string;
	days?: string;
	statusText?: string;
	statusDate?: string;
	tariff?: string;
	tariffName?: string;
	pickuppointId?: string;
	pickuppointSchedule?: string;
	pickuppointPhone?: string;
	payerType?: string;
	statusComment?: string;
	cost?: number | null;
	minTerm?: number;
	maxTerm?: number;
	shipmentpointId?: string;
	shipmentpointName?: string;
	shipmentpointAddress?: string;
	shipmentpointSchedule?: string;
	shipmentpointPhone?: string;
	shipmentpointCoordinateLatitude?: string;
	shipmentpointCoordinateLongitude?: string;
	pickuppointName?: string;
	pickuppointCoordinateLatitude?: string;
	pickuppointCoordinateLongitude?: string;
	extraData?: Record<string, JsonValue>;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem6>;
	packages?: Array<OpenApiPackage9> | null;
};
export type OpenApiCourierData6 = {
	locked?: boolean;
	id?: number;
	firstName?: string;
	lastName?: string;
	patronymic?: string;
	active?: boolean;
	email?: string;
	phone?: OpenApiCourierPhone5;
	description?: string;
	courierId?: number;
};
export type OpenApiNewPostData6 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	statusDate?: string;
	serviceType?: string;
	days?: string;
	pickuppoint?: string;
	pickuppointId?: string;
	receiverWarehouseTypeRef?: string;
	statusName?: string;
	price?: number | null;
	shipmentpointId?: string;
	receiverCity?: string;
	receiverCityRef?: string;
	receiverStreet?: string;
	receiverStreetRef?: string;
	seatsAmount?: number;
	cargoType?: string;
	cargoDescription?: string;
	payerType?: string;
	cashPayerType?: string;
	paymentForm?: string;
	ownershipForm?: string;
	packageNumber?: string;
	accompanyingDocument?: string;
	notes?: string;
	preferredDeliveryDate?: string | null;
	timeInterval?: string;
	saturdayDelivery?: boolean;
	deliveryDate?: string;
	denieReason?: string | null;
	backwardDelivery?: boolean;
	backwardDeliveryCargoType?: string;
	backwardDeliveryPayerType?: string;
	backwardDeliveryRedeliveryString?: string;
	afterpaymentOnGoodsCost?: number;
	declaredValue?: number;
	sendDate?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem6>;
};
export type OpenApiDDeliveryData6 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	pickuppoint?: string;
	statusText?: string;
	deliveryType?: string;
	deliveryName?: string;
	pickuppointId?: string;
	days?: string;
	pickupType?: number | null;
	cost?: number | null;
	receiverCity?: string;
	receiverCityRef?: string;
	pickuppointSchedule?: string;
	pickuppointDescription?: string;
	placesCount?: number | null;
	services?: Array<string>;
	comment?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem6>;
};
export type OpenApiKazPostData6 = {
	trackNumber?: string;
	status?: string;
	locked?: boolean;
	statusText?: string;
};
export type OpenApiSerializedDeliveryService7 = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
};
export type OpenApiOrderDeliveryAddress6 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiCodeValueModel8 = { code?: string; value?: string };
export type OpenApiPriceType7 = { code?: string };
export type OpenApiAbstractDiscount4 = { type?: string; amount?: number };
export type OpenApiOrderProductPriceItem3 = {
	price?: number;
	quantity?: number;
};
export type OpenApiLinkedOrder3 = {
	id?: number;
	number?: string;
	externalId?: string;
};
export type OpenApiSerializedOrderProductMarkingCode2 = {
	code: string;
	provider: 'chestny_znak' | 'giis_dmdk';
};
export type OpenApiSerializedOrderProductOffer2 = {
	id?: number;
	externalId?: string;
	xmlId?: string;
};
export type OpenApiPriceType5 = { code?: string };
export type OpenApiCodeValueModel5 = { code?: string; value?: string };
export type OpenApiGenericData4 = {
	externalId?: string;
	trackNumber?: string;
	locked?: boolean;
	tariff?: string;
	pickuppointId?: string;
	payerType?: string;
	shipmentpointId?: string;
	extraData?: Record<string, JsonValue>;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem4>;
	packages?: Array<OpenApiPackage7> | null;
};
export type OpenApiCourierData4 = { locked?: boolean; courierId?: number };
export type OpenApiNewPostData4 = {
	trackNumber?: string;
	locked?: boolean;
	serviceType?: string;
	pickuppoint?: string;
	pickuppointId?: string;
	receiverWarehouseTypeRef?: string;
	shipmentpointId?: string;
	receiverCity?: string;
	receiverCityRef?: string;
	receiverStreet?: string;
	receiverStreetRef?: string;
	seatsAmount?: number;
	cargoType?: string;
	cargoDescription?: string;
	payerType?: string;
	cashPayerType?: string;
	paymentForm?: string;
	ownershipForm?: string;
	packageNumber?: string;
	accompanyingDocument?: string;
	notes?: string;
	preferredDeliveryDate?: string | null;
	backwardDelivery?: boolean;
	backwardDeliveryCargoType?: string;
	backwardDeliveryPayerType?: string;
	backwardDeliveryRedeliveryString?: string;
	afterpaymentOnGoodsCost?: number;
	declaredValue?: number;
	sendDate?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem4>;
};
export type OpenApiDDeliveryData4 = {
	locked?: boolean;
	deliveryType?: string;
	pickuppointId?: string;
	pickupType?: number | null;
	receiverCity?: string;
	receiverCityRef?: string;
	placesCount?: number | null;
	services?: Array<string>;
	comment?: string;
	itemDeclaredValues?: Array<OpenApiDeclaredValueItem4>;
};
export type OpenApiKazPostData4 = { trackNumber?: string; locked?: boolean };
export type OpenApiSerializedDeliveryService5 = {
	name?: string | null;
	code?: string | null;
	active?: boolean;
	deliveryType?: string;
};
export type OpenApiTimeInterval8 = {
	from?: string | null;
	to?: string | null;
	custom?: string | null;
};
export type OpenApiOrderDeliveryAddress4 = {
	index?: string | null;
	countryIso?: string | null;
	region?: string | null;
	regionId?: number | null;
	city?: string | null;
	cityId?: number | null;
	cityType?: string;
	street?: string | null;
	streetId?: number | null;
	streetType?: string;
	building?: string | null;
	flat?: string | null;
	floor?: number | null;
	block?: number | null;
	house?: string | null;
	housing?: string;
	metro?: string | null;
	notes?: string | null;
	text?: string;
};
export type OpenApiCodeValueModel6 = Record<string, never>;
export type OpenApiOrder8 = { id?: number };
export type OpenApiOffer9 = { externalId?: string; xmlId?: string };
export type OpenApiStore5 = { code?: string };
export type OpenApiOrderProduct8 = {
	externalId?: string;
	id?: number | null;
	externalIds?: Array<OpenApiCodeValueModel13>;
	order?: OpenApiOrder10;
	offer?: OpenApiOffer12;
};
export type OpenApiPoint = { latitude?: number; longitude?: number };
export type OpenApiStoreWorkTime = {
	startTime?: string;
	endTime?: string;
	lunchStartTime?: string;
	lunchEndTime?: string;
};
export type OpenApiPoint2 = { latitude?: number; longitude?: number };
export type OpenApiStoreWorkTime2 = {
	startTime?: string;
	endTime?: string;
	lunchStartTime?: string;
	lunchEndTime?: string;
};
export type OpenApiOrderCreationSettings = {
	default?: OpenApiChannelSetting;
	channels?: { [key: string]: OpenApiChannelSetting | undefined } & {};
};
export type OpenApiBooleanSetting = { value?: boolean; updated_at?: string };
export type OpenApiProductGroup3 = { id?: number; externalId?: string };
export type OpenApiOfferPrice2 = {
	priceType: string;
	currency?: string;
	price: number;
	ordering?: number;
};
export type OpenApiUnit3 = { code?: string; name?: string; sym?: string };
export type OpenApiTicket2 = {
	id?: number;
	number?: string;
	externalId?: string;
	site?: string;
};
export type OpenApiSerializedCampaign = { name?: string; code?: string };
export type OpenApiCustomerPhone7 = Record<string, never>;
export type OpenApiCodeValueModel9 = { code?: string; value?: string };
export type OpenApiCustomerReferenceDto2 = {
	id?: number;
	externalId?: string;
	site?: string;
	type?: 'customer' | 'customer_corporate';
};
export type OpenApiCompanyReferenceDto2 = { id?: number; externalId?: string };
export type OpenApiTicketChannel2 = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	ordering?: number;
};
export type OpenApiTag2 = { name?: string };
export type OpenApiTicketType2 = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	defaultForCrm?: boolean;
	defaultForApi?: boolean;
	ordering?: number;
};
export type OpenApiTicketSubtopic2 = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	topic?: OpenApiTicketTopic2;
};
export type OpenApiTicketStatus2 = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
	group?: OpenApiTicketStatusGroup2;
};
export type OpenApiPaymentType6 = {
	code?: string;
	active?: boolean;
	cod?: boolean;
};
export type OpenApiShipmentPoint2 = {
	code?: string;
	shipmentPointId?: string;
	shipmentPointLabel?: string;
};
export type OpenApiStatus6 = { code?: string; trackingStatusCode?: string };
export type OpenApiConfigurationTranslation2 = {
	en: string | null;
	es: string | null;
	ru: string | null;
};
export type OpenApiLoyaltyLevelConditionItemOffer2 = {
	id?: number;
	offer?: OpenApiOffer14;
};
export type OpenApiLoyaltyLevelConditionItemProduct2 = {
	id?: number;
	product?: OpenApiProduct4;
};
export type OpenApiLoyaltyLevelConditionItemProductGroup2 = {
	id?: number;
	productGroup?: OpenApiProductGroup5;
};
export type OpenApiLoyaltyLevelConditionItemManufacturer2 = {
	id?: number;
	manufacturer?: string;
};
export type OpenApiBirthdayLoyaltyEvent3 = { type?: string };
export type OpenApiWelcomeLoyaltyEvent3 = { type?: string };
export type OpenApiCustomLoyaltyEvent2 = Record<string, never>;
export type OpenApiLoyaltyLevelConditionItemOffer = {
	id?: number;
	offer?: OpenApiOffer13;
};
export type OpenApiLoyaltyLevelConditionItemProduct = {
	id?: number;
	product?: OpenApiProduct3;
};
export type OpenApiLoyaltyLevelConditionItemProductGroup = {
	id?: number;
	productGroup?: OpenApiProductGroup4;
};
export type OpenApiLoyaltyLevelConditionItemManufacturer = {
	id?: number;
	manufacturer?: string;
};
export type OpenApiSubscription4 = {
	id?: number;
	channel?: string;
	name?: string;
	code?: string;
	active?: boolean;
	autoSubscribe?: boolean;
	ordering?: number;
};
export type OpenApiMGChannel3 = {
	allowedSendByPhone?: boolean;
	id?: number | null;
	externalId?: number;
	type?: string;
	active?: boolean;
	name?: string;
};
export type OpenApiSerializedRelationAbstractCustomer12 = {
	id?: number;
	externalId?: string;
	browserId?: string;
};
export type OpenApiCustomerContactCompany4 = {
	id?: number;
	company?: OpenApiEntityWithExternalIdNameOutput4 | null;
};
export type OpenApiDeclaredValueItem3 = {
	orderProduct?: OpenApiPackageItemOrderProduct3;
	value?: number;
};
export type OpenApiPackage6 = {
	packageId?: string;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	items?: Array<OpenApiPackageItem5> | null;
};
export type OpenApiCourierPhone4 = { number?: string | null };
export type OpenApiUnit8 = { code?: string; name?: string; sym?: string };
export type OpenApiDeclaredValueItem = {
	orderProduct?: OpenApiPackageItemOrderProduct;
	value?: number;
};
export type OpenApiPackage4 = {
	packageId?: string;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	items?: Array<OpenApiPackageItem3> | null;
};
export type OpenApiSubscription3 = {
	id?: number;
	channel?: string;
	name?: string;
	code?: string;
	active?: boolean;
	autoSubscribe?: boolean;
	ordering?: number;
};
export type OpenApiMGChannel2 = {
	allowedSendByPhone?: boolean;
	id?: number | null;
	externalId?: number;
	type?: string;
	active?: boolean;
	name?: string;
};
export type OpenApiSerializedRelationAbstractCustomer11 = {
	id?: number;
	externalId?: string;
	browserId?: string;
};
export type OpenApiCustomerContactCompany3 = {
	id?: number;
	company?: OpenApiEntityWithExternalIdNameOutput3 | null;
};
export type OpenApiDeclaredValueItem2 = {
	orderProduct?: OpenApiPackageItemOrderProduct2;
	value?: number;
};
export type OpenApiPackage5 = {
	packageId?: string;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	items?: Array<OpenApiPackageItem4> | null;
};
export type OpenApiCourierPhone3 = { number?: string | null };
export type OpenApiUnit7 = { code?: string; name?: string; sym?: string };
export type OpenApiBirthdayLoyaltyEvent2 = { type?: string };
export type OpenApiWelcomeLoyaltyEvent2 = { type?: string };
export type OpenApiCustomLoyaltyEvent = Record<string, never>;
export type OpenApiDeclaredValueItem5 = {
	orderProduct?: OpenApiPackageItemOrderProduct5;
	value?: number;
};
export type OpenApiPackage8 = {
	packageId?: string;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	items?: Array<OpenApiPackageItem7> | null;
};
export type OpenApiDeclaredValueItem6 = {
	orderProduct?: OpenApiPackageItemOrderProduct6;
	value?: number;
};
export type OpenApiPackage9 = {
	packageId?: string;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	items?: Array<OpenApiPackageItem8> | null;
};
export type OpenApiCourierPhone5 = { number?: string | null };
export type OpenApiDeclaredValueItem4 = {
	orderProduct?: OpenApiPackageItemOrderProduct4;
	value?: number;
};
export type OpenApiPackage7 = {
	packageId?: string;
	weight?: number;
	length?: number;
	width?: number;
	height?: number;
	items?: Array<OpenApiPackageItem6> | null;
};
export type OpenApiCodeValueModel13 = Record<string, never>;
export type OpenApiOrder10 = { id?: number };
export type OpenApiOffer12 = { externalId?: string; xmlId?: string };
export type OpenApiChannelSetting = {
	site?: string | null;
	order_type?: string | null;
	order_method?: string | null;
};
export type OpenApiTicketTopic2 = {
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
};
export type OpenApiTicketStatusGroup2 = {
	color?: string;
	id?: number;
	name?: string;
	code?: string;
	active?: boolean;
	ordering?: number;
};
export type OpenApiOffer14 = {
	displayName?: string;
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	name: string;
	article?: string;
	properties?: Record<string, JsonValue>;
	active?: boolean;
};
export type OpenApiProduct4 = {
	id?: number;
	name: string;
	externalId?: string;
	active?: boolean;
};
export type OpenApiProductGroup5 = {
	id?: number;
	name: string;
	externalId?: string;
	active?: boolean;
};
export type OpenApiOffer13 = {
	displayName?: string;
	id?: number | null;
	externalId?: string;
	xmlId?: string;
	name: string;
	article?: string;
	vatRate?: string;
	properties?: Record<string, JsonValue>;
	active?: boolean;
	unit?: OpenApiUnit9;
	barcode?: string;
};
export type OpenApiProduct3 = {
	id?: number;
	name: string;
	externalId?: string;
	active?: boolean;
};
export type OpenApiProductGroup4 = {
	id?: number;
	name: string;
	externalId?: string;
	active?: boolean;
};
export type OpenApiPackageItemOrderProduct3 = {
	id?: number;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel3> | null;
};
export type OpenApiPackageItem5 = {
	orderProduct?: OpenApiPackageItemOrderProduct3;
	quantity?: number;
};
export type OpenApiPackageItemOrderProduct = {
	id?: number;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel> | null;
};
export type OpenApiPackageItem3 = {
	orderProduct?: OpenApiPackageItemOrderProduct;
	quantity?: number;
};
export type OpenApiPackageItemOrderProduct2 = {
	id?: number;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel2> | null;
};
export type OpenApiPackageItem4 = {
	orderProduct?: OpenApiPackageItemOrderProduct2;
	quantity?: number;
};
export type OpenApiPackageItemOrderProduct5 = {
	id?: number;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel7> | null;
};
export type OpenApiPackageItem7 = {
	orderProduct?: OpenApiPackageItemOrderProduct5;
	quantity?: number;
};
export type OpenApiPackageItemOrderProduct6 = {
	id?: number;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel8> | null;
};
export type OpenApiPackageItem8 = {
	orderProduct?: OpenApiPackageItemOrderProduct6;
	quantity?: number;
};
export type OpenApiPackageItemOrderProduct4 = {
	id?: number;
	externalId?: string;
	externalIds?: Array<OpenApiCodeValueModel5> | null;
};
export type OpenApiPackageItem6 = {
	orderProduct?: OpenApiPackageItemOrderProduct4;
	quantity?: number;
};
export type OpenApiUnit9 = { code?: string; name?: string; sym?: string };

export type SimlaComEndpointInputs = {
	'api.apiVersions.get': {};
	'api.credentials.get': {};
	'cost.list.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[costItems][]'?: Array<string>;
			'filter[sites][]'?: Array<string>;
			'filter[createdBy][]'?: Array<number>;
			'filter[orderNumber]'?: string;
			'filter[costGroups][]'?: Array<string>;
			'filter[users][]'?: Array<number>;
			'filter[comment]'?: string;
			'filter[orderIds][]'?: Array<number>;
			'filter[orderExternalIds][]'?: Array<string>;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
			'filter[dateFrom]'?: string;
			'filter[dateTo]'?: string;
			'filter[minSumm]'?: number;
			'filter[maxSumm]'?: number;
		};
	};
	'cost.create.post': { body: OpenApiCostCreateInput };
	'cost.delete.post': { body: OpenApiCostDeleteBatchInput };
	'cost.upload.post': { body: OpenApiCostUploadInput };
	'cost.getById.get': { path: { id: number } };
	'cost.byIdDelete.post': { path: { id: number } };
	'cost.byIdEdit.post': { path: { id: string }; body: OpenApiCostEditInput };
	'customFields.list.get': {
		query?: {
			limit?: 20 | 50 | 100 | 250;
			page?: number;
			'filter[name]'?: string;
			'filter[code]'?: string;
			'filter[type]'?:
				| 'string'
				| 'text'
				| 'integer'
				| 'numeric'
				| 'boolean'
				| 'dictionary'
				| 'multiselect_dictionary'
				| 'date'
				| 'datetime'
				| 'email';
			'filter[viewMode]'?: 'editable' | 'not_editable' | 'miss';
			'filter[viewModeMobile]'?: 'editable' | 'not_editable' | 'miss';
			'filter[entity]'?:
				| 'order'
				| 'customer'
				| 'customer_corporate'
				| 'company'
				| 'loyalty_account'
				| 'ticket';
			'filter[displayArea]'?:
				| 'empty'
				| 'address'
				| 'customer'
				| 'delivery'
				| 'dimensions'
				| 'legal_details'
				| 'main_data'
				| 'payment'
				| 'shipment';
			'filter[inFilter]'?: 0 | 1;
		};
	};
	'customFields.dictionaries.get': {
		query?: {
			limit?: 20 | 50 | 100 | 250;
			page?: number;
			'filter[name]'?: string;
			'filter[code]'?: string;
		};
	};
	'customFields.dictionariesCreate.post': {
		body: OpenApiCustomDictionariesCreate;
	};
	'customFields.getDictionariesByCode.get': { path: { code: string } };
	'customFields.dictionariesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiCustomDictionariesEdit & {
			customDictionary?: OpenApiCustomDictionaryEditValidation;
		};
	};
	'customFields.byEntityCreate.post': {
		path: {
			entity:
				| 'order'
				| 'customer'
				| 'customer_corporate'
				| 'company'
				| 'ticket';
		};
		body: OpenApiCustomFieldsCreateApiDocModel;
	};
	'customFields.getByEntityByCode.get': {
		path: {
			entity:
				| 'order'
				| 'customer'
				| 'customer_corporate'
				| 'company'
				| 'ticket';
			code: string;
		};
	};
	'customFields.byEntityByCodeEdit.post': {
		path: {
			entity:
				| 'order'
				| 'customer'
				| 'customer_corporate'
				| 'company'
				| 'ticket';
			code: string;
		};
		body: OpenApiCustomFieldsEditApiDocModel & {
			customField?: OpenApiCustomFieldEditValidation;
		};
	};
	'customers.list.get': {
		query: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[externalIds][]'?: Array<string>;
			'filter[name]'?: string;
			'filter[city]'?: string;
			'filter[region]'?: string;
			'filter[sites][]'?: Array<string>;
			'filter[managers][]'?: Array<number>;
			'filter[managerGroups][]'?: Array<string>;
			'filter[notes]'?: string;
			'filter[vip]'?: boolean;
			'filter[bad]'?: boolean;
			'filter[discountCardNumber]'?: string;
			'filter[attachments]'?: 3 | 2 | 1;
			'filter[tasksCounts]'?: 1 | 2 | 3;
			'filter[email]'?: string;
			'filter[contragentName]'?: string;
			'filter[contragentTypes][]'?: Array<
				'individual' | 'legal-entity' | 'enterpreneur'
			>;
			'filter[contragentInn]'?: string;
			'filter[contragentKpp]'?: string;
			'filter[contragentBik]'?: string;
			'filter[contragentCorrAccount]'?: string;
			'filter[contragentBankAccount]'?: string;
			'filter[classSegment]'?: string;
			'filter[minOrdersCount]'?: number;
			'filter[maxOrdersCount]'?: number;
			'filter[minTicketsCount]'?: number;
			'filter[maxTicketsCount]'?: number;
			'filter[minAverageSumm]'?: number;
			'filter[maxAverageSumm]'?: number;
			'filter[minTotalSumm]'?: number;
			'filter[maxTotalSumm]'?: number;
			'filter[minCostSumm]'?: number;
			'filter[maxCostSumm]'?: number;
			'filter[dateFrom]'?: string;
			'filter[dateTo]'?: string;
			'filter[firstOrderFrom]'?: string;
			'filter[firstOrderTo]'?: string;
			'filter[lastOrderFrom]'?: string;
			'filter[lastOrderTo]'?: string;
			'filter[customFields][]'?: Array<string>;
			'filter[sex]'?:
				| 'male'
				| 'female'
				| 'male_with_presumable'
				| 'female_with_presumable';
			'filter[isContact]'?: boolean;
			'filter[subscriptions][channel]': 'email' | 'sms' | 'waba' | 'mg';
			'filter[subscriptions][subscription]'?: string;
			'filter[subscriptions][subscribed]': boolean;
			'filter[online]'?: boolean;
			'filter[segment]'?: string;
			'filter[commentary]'?: string;
			'filter[browserId]'?: string;
			'filter[mgChannels][]'?: Array<number>;
			'filter[sourceName]'?: string;
			'filter[mediumName]'?: string;
			'filter[campaignName]'?: string;
			'filter[keywordName]'?: string;
			'filter[adContentName]'?: string;
			'filter[tags][]'?: Array<string>;
			'filter[attachedTags][]'?: Array<string>;
			'filter[countries][]'?: Array<string>;
			'filter[abandonedCart]'?: boolean;
			'filter[emailMarketingUnsubscribed]'?: boolean;
			'filter[mgCustomerId]'?: number;
			'filter[firstWebVisitFrom]'?: string;
			'filter[firstWebVisitTo]'?: string;
			'filter[lastWebVisitFrom]'?: string;
			'filter[lastWebVisitTo]'?: string;
			'filter[birthdayFrom]'?: string;
			'filter[birthdayTo]'?: string;
			'filter[minAge]'?: number;
			'filter[maxAge]'?: number;
		};
	};
	'customers.combine.post': {
		body: OpenApiCustomersCombineInput & {
			resultCustomer?: OpenApiSerializedCustomerReference;
		};
	};
	'customers.create.post': { body: OpenApiCustomerCreateInput };
	'customers.fixExternalIds.post': {
		body: OpenApiCustomersFixExternalRowCollection;
	};
	'customers.history.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[startDate]'?: string;
			'filter[endDate]'?: string;
			'filter[customerId]'?: number;
			'filter[customerExternalId]'?: string;
			'filter[sinceId]'?: number;
		};
	};
	'customers.notes.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids]'?: Array<number>;
			'filter[customerIds]'?: Array<number>;
			'filter[customerExternalIds]'?: Array<string>;
			'filter[managerIds]'?: Array<number>;
			'filter[text]'?: string;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
		};
	};
	'customers.notesCreate.post': { body: OpenApiCustomerNoteCreateInput };
	'customers.notesByIdDelete.post': { path: { id: number } };
	'customers.pushTokens.get': { query?: { token?: string; fid?: string } };
	'customers.pushTokensBatch.post': {
		body: { pushTokens?: Array<OpenApiPushTokenInput> };
	};
	'customers.upload.post': { body: OpenApiCustomerUploadInput };
	'customers.getByExternalid.get': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
	};
	'customers.byExternalidEdit.post': {
		path: { externalId: string };
		body: OpenApiCustomerEditInput;
	};
	'customers.postByExternalidsubscriptions.post': {
		path: { externalId: string };
		body: OpenApiCustomerSubscriptionInput;
	};
	'corporateCustomers.list.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[externalIds][]'?: Array<string>;
			'filter[name]'?: string;
			'filter[city]'?: string;
			'filter[region]'?: string;
			'filter[sites][]'?: Array<string>;
			'filter[managers][]'?: Array<number>;
			'filter[managerGroups][]'?: Array<string>;
			'filter[notes]'?: string;
			'filter[vip]'?: boolean;
			'filter[bad]'?: boolean;
			'filter[discountCardNumber]'?: string;
			'filter[attachments]'?: 3 | 2 | 1;
			'filter[tasksCounts]'?: 1 | 2 | 3;
			'filter[email]'?: string;
			'filter[contragentName]'?: string;
			'filter[contragentTypes][]'?: Array<'legal-entity' | 'enterpreneur'>;
			'filter[contragentInn]'?: string;
			'filter[contragentKpp]'?: string;
			'filter[contragentBik]'?: string;
			'filter[contragentCorrAccount]'?: string;
			'filter[contragentBankAccount]'?: string;
			'filter[classSegment]'?: string;
			'filter[minOrdersCount]'?: number;
			'filter[maxOrdersCount]'?: number;
			'filter[minTicketsCount]'?: number;
			'filter[maxTicketsCount]'?: number;
			'filter[minAverageSumm]'?: number;
			'filter[maxAverageSumm]'?: number;
			'filter[minTotalSumm]'?: number;
			'filter[maxTotalSumm]'?: number;
			'filter[minCostSumm]'?: number;
			'filter[maxCostSumm]'?: number;
			'filter[dateFrom]'?: string;
			'filter[dateTo]'?: string;
			'filter[firstOrderFrom]'?: string;
			'filter[firstOrderTo]'?: string;
			'filter[lastOrderFrom]'?: string;
			'filter[lastOrderTo]'?: string;
			'filter[customFields][]'?: Array<string>;
			'filter[nickName][]'?: Array<string>;
			'filter[contactName]'?: string;
			'filter[addressName]'?: string;
			'filter[phone]'?: string;
			'filter[companyCustomFields][]'?: Array<string>;
			'filter[contactIds][]'?: Array<number>;
			'filter[companyName]'?: string;
		};
	};
	'corporateCustomers.combine.post': {
		body: OpenApiCustomersCombineInput & {
			resultCustomer?: OpenApiSerializedCustomerReference;
		};
	};
	'corporateCustomers.create.post': {
		body: { customerCorporate?: OpenApiSerializedCustomerCorporate };
	};
	'corporateCustomers.fixExternalIds.post': {
		body: OpenApiCustomersCorporateFixExternalRowCollection;
	};
	'corporateCustomers.history.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[startDate]'?: string;
			'filter[endDate]'?: string;
			'filter[customerId]'?: number;
			'filter[customerExternalId]'?: string;
			'filter[sinceId]'?: number;
		};
	};
	'corporateCustomers.notes.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids]'?: Array<number>;
			'filter[customerIds]'?: Array<number>;
			'filter[customerExternalIds]'?: Array<string>;
			'filter[managerIds]'?: Array<number>;
			'filter[text]'?: string;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
		};
	};
	'corporateCustomers.notesCreate.post': {
		body: OpenApiCustomerNoteCreateInput;
	};
	'corporateCustomers.notesByIdDelete.post': { path: { id: number } };
	'corporateCustomers.upload.post': {
		body: OpenApiCustomerCorporateUploadInput;
	};
	'corporateCustomers.getByExternalid.get': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
	};
	'corporateCustomers.getByExternalidaddresses.get': {
		path: { externalId: string };
		query?: {
			'filter[name]'?: string;
			'filter[city]'?: string;
			'filter[region]'?: string;
			by?: 'id' | 'externalId';
			site?: string;
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
		};
	};
	'corporateCustomers.byExternalidAddressesCreate.post': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
		body: { address?: OpenApiSerializedCustomerAddress };
	};
	'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post': {
		path: { externalId: string; entityExternalId: string };
		query?: {
			by?: 'id' | 'externalId';
			site?: string;
			entityBy?: 'id' | 'externalId';
		};
		body: { address?: OpenApiSerializedCustomerAddress2 };
	};
	'corporateCustomers.getByExternalidcompanies.get': {
		path: { externalId: string };
		query?: {
			by?: 'id' | 'externalId';
			site?: string;
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
		};
	};
	'corporateCustomers.byExternalidCompaniesCreate.post': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
		body: { company?: OpenApiSerializedCompany };
	};
	'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post': {
		path: { externalId: string; entityExternalId: string };
		query?: {
			by?: 'id' | 'externalId';
			site?: string;
			entityBy?: 'id' | 'externalId';
		};
		body: { company?: OpenApiSerializedCompany2 };
	};
	'corporateCustomers.getByExternalidcontacts.get': {
		path: { externalId: string };
		query?: {
			by?: 'id' | 'externalId';
			site?: string;
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
		};
	};
	'corporateCustomers.byExternalidContactsCreate.post': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
		body: { contact?: OpenApiSerializedCustomerContact };
	};
	'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post': {
		path: { externalId: string; entityExternalId: string };
		query?: {
			by?: 'id' | 'externalId';
			site?: string;
			entityBy?: 'id' | 'externalId';
		};
		body: { contact?: OpenApiSerializedCustomerContact2 };
	};
	'corporateCustomers.byExternalidEdit.post': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
		body: { customerCorporate?: OpenApiSerializedCustomerCorporate2 };
	};
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitecartclear.post': {
		path: { site: string };
		query?: { siteBy?: 'id' | 'code' };
		body: OpenApiCartSetInput2;
	};
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitecartset.post': {
		path: { site: string };
		query?: { siteBy?: 'id' | 'code' };
		body: OpenApiCartSetInput;
	};
	'customerActionsOnTheSiteOfTheStore.getCustomerInteractionBySitecartByCustomerid.get': {
		path: { customerId: string; site: string };
		query?: { by?: 'id' | 'externalId'; siteBy?: 'id' | 'code' };
	};
	'customerActionsOnTheSiteOfTheStore.getCustomerInteractionBySitefavoritesByCustomerid.get': {
		path: { site: string; customerId: string };
		query?: { by?: 'id' | 'externalId'; siteBy?: 'id' | 'code' };
	};
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitefavoritesByCustomeridadd.post': {
		path: { site: string; customerId: string };
		query?: { by?: 'id' | 'externalId'; siteBy?: 'id' | 'code' };
		body: OpenApiFavoriteUpdateInput;
	};
	'customerActionsOnTheSiteOfTheStore.customerInteractionBySiteFavoritesByCustomeridRemove.post': {
		path: { site: string; customerId: string };
		query?: { by?: 'id' | 'externalId'; siteBy?: 'id' | 'code' };
		body: OpenApiFavoriteUpdateInput;
	};
	'deliveries.deliveryCalculate.post': { body: OpenApiCalculateRequest };
	'deliveries.postDeliverygenericBySubcodetracking.post': {
		path: { subcode: string };
		body: { statusUpdate?: Array<OpenApiRequestStatusUpdateItem> };
	};
	'deliveries.deliveryShipments.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[externalId]'?: string;
			'filter[orderNumber]'?: string;
			'filter[deliveryTypes][]'?: Array<string>;
			'filter[managers][]'?: Array<number>;
			'filter[stores][]'?: Array<string>;
			'filter[statuses][]'?: Array<
				'created' | 'processing' | 'shipped' | 'cancelled'
			>;
			'filter[dateFrom]'?: string;
			'filter[dateTo]'?: string;
		};
	};
	'deliveries.deliveryShipmentsCreate.post': {
		body: OpenApiApiDeliveryShipmentEditRequest;
	};
	'deliveries.getDeliveryshipmentsById.get': { path: { id: number } };
	'deliveries.deliveryShipmentsByIdEdit.post': {
		path: { id: number };
		body: OpenApiApiDeliveryShipmentEditRequest2;
	};
	'files.list.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[orderIds][]'?: Array<number>;
			'filter[orderExternalIds][]'?: Array<string>;
			'filter[ticketIds][]'?: Array<number>;
			'filter[ticketExternalIds][]'?: Array<string>;
			'filter[customerIds][]'?: Array<number>;
			'filter[customerExternalIds][]'?: Array<string>;
			'filter[sites][]'?: Array<string>;
			'filter[type][]'?: Array<string>;
			'filter[filename]'?: string;
			'filter[isAttached]'?: boolean;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
			'filter[sizeFrom]'?: number;
			'filter[sizeTo]'?: number;
		};
	};
	'files.upload.post': { body: string };
	'files.getById.get': { path: { id: number } };
	'files.byIdDelete.post': { path: { id: number } };
	'files.byIdDownload.get': { path: { id: number } };
	'files.byIdEdit.post': { path: { id: number }; body: OpenApiFileEditInput };
	'integration.getIntegrationModulesByCode.get': { path: { code: string } };
	'integration.integrationModulesByCodeEdit.post': {
		path: { code: string };
		body: { integrationModule?: OpenApiIntegrationModule };
	};
	'integration.postIntegrationModulesByCodeupdateScopes.post': {
		path: { code: string };
		body: { requires?: OpenApiRequires };
	};
	'knowledgeBase.documents.get': {
		query?: {
			limit?: 20 | 50 | 100;
			cursor?: string;
			'filter[ids][]'?: Array<number>;
			'filter[sectionId]'?: number;
			'filter[directOnly]'?: boolean;
			'filter[availableForCopilot]'?: boolean;
			'filter[hasFile]'?: boolean;
			'filter[externalIds][]'?: Array<string>;
			'filter[search]'?: string;
		};
	};
	'knowledgeBase.documentsCreate.post': {
		body: OpenApiKnowledgeBaseDocumentCreateInput;
	};
	'knowledgeBase.documentsHistory.get': {
		query: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[startDate]'?: string;
			'filter[endDate]'?: string;
			'filter[documentId]': number;
			'filter[sinceId]': number;
		};
	};
	'knowledgeBase.getDocumentsById.get': {
		path: { id: string };
		query?: { by?: 'id' | 'externalId' };
	};
	'knowledgeBase.documentsByIdDelete.post': {
		path: { id: string };
		query?: { by?: 'id' | 'externalId' };
	};
	'knowledgeBase.documentsByIdEdit.post': {
		path: { id: string };
		body: OpenApiKnowledgeBaseDocumentEditInput;
	};
	'knowledgeBase.sections.get': {};
	'knowledgeBase.sectionsCreate.post': {
		body: OpenApiKnowledgeBaseSectionCreateInput;
	};
	'knowledgeBase.sectionsByIdDelete.post': { path: { id: number } };
	'knowledgeBase.sectionsByIdEdit.post': {
		path: { id: number };
		body: OpenApiKnowledgeBaseSectionEditInput;
	};
	'loyalty.accountCreate.post': { body: OpenApiLoyaltyAccountCreateInput };
	'loyalty.getAccountById.get': { path: { id: number } };
	'loyalty.postAccountByIdactivate.post': { path: { id: number } };
	'loyalty.postAccountByIdbonuscharge.post': {
		path: { id: number };
		body: OpenApiLoyaltyBonusChargeInput;
	};
	'loyalty.postAccountByIdbonuscredit.post': {
		path: { id: number };
		body: OpenApiLoyaltyBonusCreditInput;
	};
	'loyalty.getAccountByIdbonusoperations.get': {
		path: { id: number };
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
		};
	};
	'loyalty.getAccountByIdbonusByStatusdetails.get': {
		path: { id: number; status: string };
		query?: { limit?: 20 | 50 | 100; page?: number; 'filter[date]'?: string };
	};
	'loyalty.accountByIdEdit.post': {
		path: { id: number };
		body: OpenApiLoyaltyAccountEditInput;
	};
	'loyalty.accounts.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[id]'?: number;
			'filter[customer]'?: string;
			'filter[loyalties][]'?: Array<number>;
			'filter[sites][]'?: Array<string>;
			'filter[status]'?: 'not_confirmed' | 'activated' | 'deactivated';
			'filter[phoneNumber]'?: string;
			'filter[cardNumber]'?: string;
			'filter[level]'?: number;
			'filter[customerId]'?: number;
			'filter[customerExternalId]'?: string;
			'filter[customerSites][]'?: Array<string>;
			'filter[segment][]'?: Array<string>;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
			'filter[burnDateFrom]'?: string;
			'filter[burnDateTo]'?: string;
			'filter[minOrdersSum]'?: number;
			'filter[maxOrdersSum]'?: number;
			'filter[minAmount]'?: number;
			'filter[maxAmount]'?: number;
			'filter[statuses][]'?: Array<
				'not_confirmed' | 'activated' | 'deactivated'
			>;
			'filter[customFields][]'?: Array<string>;
		};
	};
	'loyalty.bonusOperations.get': {
		query?: {
			limit?: 20 | 50 | 100;
			cursor?: string;
			'filter[loyalties]'?: Array<number>;
		};
	};
	'loyalty.calculate.post': { body: OpenApiCalculateInput };
	'loyalty.loyalties.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[sites][]'?: Array<string>;
			'filter[active]'?: boolean;
			'filter[blocked]'?: boolean;
		};
	};
	'loyalty.getLoyaltiesById.get': { path: { id: number } };
	'notifications.send.post': { body: OpenApiNotificationInput };
	'orders.list.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[externalIds][]'?: Array<string>;
			'filter[numbers][]'?: Array<string>;
			'filter[customerId]'?: number;
			'filter[customerExternalId]'?: string;
			'filter[customer]'?: string;
			'filter[segment]'?: string;
			'filter[customerType]'?: 'customer' | 'customer_corporate';
			'filter[email]'?: string;
			'filter[managers][]'?: Array<number>;
			'filter[managerGroups][]'?: Array<string>;
			'filter[paymentStatuses][]'?: Array<string>;
			'filter[orderTypes][]'?: Array<string>;
			'filter[orderMethods][]'?: Array<string>;
			'filter[product]'?: string;
			'filter[productSearchType]'?: string;
			'filter[extendedStatus][]'?: Array<string>;
			'filter[statusHistorySequence][]'?: Array<string>;
			'filter[statusComment]'?: string;
			'filter[sites][]'?: Array<string>;
			'filter[vip]'?: boolean;
			'filter[bad]'?: boolean;
			'filter[expired]'?: boolean;
			'filter[call]'?: boolean;
			'filter[online]'?: boolean;
			'filter[paymentTypes][]'?: Array<string>;
			'filter[deliveryStates][]'?: Array<
				'none' | 'processing' | 'cancel' | 'cancel_force' | 'success' | 'error'
			>;
			'filter[deliveryTypes][]'?: Array<string>;
			'filter[deliveryServices][]'?: Array<string>;
			'filter[countries][]'?: Array<string>;
			'filter[region]'?: string;
			'filter[city]'?: string;
			'filter[index]'?: string;
			'filter[metro]'?: string;
			'filter[sourceName]'?: string;
			'filter[mediumName]'?: string;
			'filter[campaignName]'?: string;
			'filter[keywordName]'?: string;
			'filter[adContentName]'?: string;
			'filter[managerComment]'?: string;
			'filter[customerComment]'?: string;
			'filter[trackNumber]'?: string;
			'filter[deliveryExternalId]'?: string;
			'filter[couriers][]'?: Array<number>;
			'filter[contragentName]'?: string;
			'filter[contragentTypes][]'?: Array<
				'individual' | 'legal-entity' | 'enterpreneur'
			>;
			'filter[contragentInn]'?: string;
			'filter[contragentKpp]'?: string;
			'filter[contragentBik]'?: string;
			'filter[contragentCorrAccount]'?: string;
			'filter[contragentBankAccount]'?: string;
			'filter[companyName]'?: string;
			'filter[deliveryAddressNotes]'?: string;
			'filter[productGroups][]'?: Array<number>;
			'filter[shipmentStores][]'?: Array<string>;
			'filter[shipped]'?: boolean;
			'filter[attachments]'?: 3 | 2 | 1;
			'filter[receiptFiscalDocumentAttribute]'?: string;
			'filter[receiptStatus]'?: 'wait' | 'done' | 'fail';
			'filter[receiptOperation]'?: 'sell' | 'sell_refund';
			'filter[receiptOrderStatus]'?: 'wait' | 'done' | 'fail';
			'filter[mgChannels][]'?: Array<number>;
			'filter[tasksCounts]'?: 1 | 2 | 3;
			'filter[tags][]'?: Array<string>;
			'filter[attachedTags][]'?: Array<string>;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
			'filter[fullPaidAtFrom]'?: string;
			'filter[fullPaidAtTo]'?: string;
			'filter[deliveryDateFrom]'?: string;
			'filter[deliveryDateTo]'?: string;
			'filter[statusUpdatedAtFrom]'?: string;
			'filter[statusUpdatedAtTo]'?: string;
			'filter[shipmentDateFrom]'?: string;
			'filter[shipmentDateTo]'?: string;
			'filter[firstWebVisitFrom]'?: string;
			'filter[firstWebVisitTo]'?: string;
			'filter[lastWebVisitFrom]'?: string;
			'filter[lastWebVisitTo]'?: string;
			'filter[firstOrderFrom]'?: string;
			'filter[firstOrderTo]'?: string;
			'filter[lastOrderFrom]'?: string;
			'filter[lastOrderTo]'?: string;
			'filter[paidAtFrom]'?: string;
			'filter[paidAtTo]'?: string;
			'filter[deliveryTimeFrom]'?: string;
			'filter[deliveryTimeTo]'?: string;
			'filter[minPrice]'?: number;
			'filter[maxPrice]'?: number;
			'filter[minCostSumm]'?: number;
			'filter[maxCostSumm]'?: number;
			'filter[minPrepaySumm]'?: number;
			'filter[maxPrepaySumm]'?: number;
			'filter[minDeliveryCost]'?: number;
			'filter[maxDeliveryCost]'?: number;
			'filter[minDeliveryNetCost]'?: number;
			'filter[maxDeliveryNetCost]'?: number;
			'filter[minMarginSumm]'?: number;
			'filter[maxMarginSumm]'?: number;
			'filter[minPurchaseSumm]'?: number;
			'filter[maxPurchaseSumm]'?: number;
			'filter[customFields][]'?: Array<string>;
		};
	};
	'orders.combine.post': {
		body: OpenApiOrdersCombineInput & {
			order?: OpenApiSerializedOrderReference;
			resultOrder?: OpenApiSerializedOrderReference;
		};
	};
	'orders.create.post': { body: OpenApiOrderCreateInput };
	'orders.fixExternalIds.post': { body: OpenApiOrdersFixExternalRowCollection };
	'orders.history.get': {
		query: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[startDate]'?: string;
			'filter[endDate]'?: string;
			'filter[orderId]': number;
			'filter[orderExternalId]'?: string;
			'filter[sinceId]': number;
		};
	};
	'orders.linksCreate.post': { body: OpenApiOrderLinkCreateInput };
	'orders.loyaltyApply.post': { body: OpenApiApplyInput };
	'orders.loyaltyCancelBonusOperations.post': {
		body: OpenApiCancelBonusOperationsInput;
	};
	'orders.paymentsCreate.post': { body: OpenApiPaymentCreateInput };
	'orders.paymentsByIdDelete.post': { path: { id: number } };
	'orders.paymentsByIdEdit.post': {
		path: { id: string };
		body: OpenApiPaymentEditInput;
	};
	'orders.statuses.get': {
		query?: { ids?: Array<string>; externalIds?: Array<string> };
	};
	'orders.upload.post': { body: OpenApiOrderUploadInput };
	'orders.getByExternalid.get': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
	};
	'orders.byExternalidDeliveryCancel.post': {
		path: { externalId: string };
		body: OpenApiApiCancelDeliveryRequest;
	};
	'orders.byExternalidEdit.post': {
		path: { externalId: string };
		body: OpenApiOrderEditInput;
	};
	'orders.byExternalidPlatesByPlateidPrint.get': {
		path: { externalId: string; plateId: number };
		query?: { by?: 'id' | 'externalId'; site?: string };
	};
	'ordersPicking.packs.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids]'?: Array<number>;
			'filter[stores]'?: Array<string>;
			'filter[itemId]'?: number;
			'filter[offerXmlId]'?: string;
			'filter[offerExternalId]'?: string;
			'filter[orderId]'?: number;
			'filter[orderExternalId]'?: string;
			'filter[shipmentDateFrom]'?: string;
			'filter[shipmentDateTo]'?: string;
			'filter[invoiceNumber]'?: string;
			'filter[deliveryNoteNumber]'?: string;
		};
	};
	'ordersPicking.packsCreate.post': {
		body: OpenApiOrderProductPackCreateInput;
	};
	'ordersPicking.packsHistory.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[startDate]'?: string;
			'filter[endDate]'?: string;
			'filter[orderId]'?: number;
			'filter[orderExternalId]'?: string;
			'filter[sinceId]'?: number;
		};
	};
	'ordersPicking.getPacksById.get': { path: { id: number } };
	'ordersPicking.packsByIdDelete.post': { path: { id: number } };
	'ordersPicking.packsByIdEdit.post': {
		path: { id: number };
		body: OpenApiOrderProductPackEditInput;
	};
	'payments.paymentCheck.post': { body: { check?: OpenApiApiCheckRequest } };
	'payments.paymentCreateInvoice.post': {
		body: { createInvoice?: OpenApiApiCreateInvoiceRequest };
	};
	'payments.paymentInvoiceImport.post': {
		body: { invoice?: OpenApiApiImportInvoiceRequest };
	};
	'payments.getPaymentinvoiceByInvoiceuuid.get': {
		path: { invoiceUuid: string };
	};
	'payments.paymentUpdateInvoice.post': {
		body: { updateInvoice?: OpenApiApiUpdateInvoiceRequest };
	};
	'dataBook.referenceCostGroups.get': {};
	'dataBook.referenceCostGroupsByCodeEdit.post': {
		path: { code: string };
		body: OpenApiCostGroupEditInput;
	};
	'dataBook.referenceCostItems.get': {};
	'dataBook.referenceCostItemsByCodeEdit.post': {
		path: { code: string };
		body: OpenApiCostItemEditInput;
	};
	'dataBook.referenceCountries.get': {};
	'dataBook.referenceCouriers.get': {};
	'dataBook.referenceCouriersCreate.post': {
		body: OpenApiCourierCreateInput & { courier?: OpenApiCourier };
	};
	'dataBook.referenceCouriersByIdEdit.post': {
		path: { id: string };
		body: OpenApiCourierEditInput & { courier?: OpenApiCourier };
	};
	'dataBook.referenceCurrencies.get': {};
	'dataBook.referenceCurrenciesCreate.post': {
		body: OpenApiCurrencyCreateInput & { currency?: OpenApiCurrency };
	};
	'dataBook.referenceCurrenciesByIdEdit.post': {
		path: { id: string };
		body: OpenApiCurrencyEditInput & { currency?: OpenApiCurrency };
	};
	'dataBook.referenceDeliveryServices.get': {};
	'dataBook.referenceDeliveryServicesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiDeliveryServiceEditInput & {
			deliveryService?: OpenApiDeliveryService;
		};
	};
	'dataBook.referenceDeliveryTypes.get': {
		query?: {
			'filter[codes][]'?: Array<string>;
			includeCostSettings?: boolean;
		};
	};
	'dataBook.referenceDeliveryTypesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiDeliveryTypeEditInput & { deliveryType?: OpenApiDeliveryType };
	};
	'dataBook.referenceLegalEntities.get': {};
	'dataBook.referenceLegalEntitiesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiLegalEntityEditInput;
	};
	'dataBook.referenceMgChannels.get': {};
	'dataBook.referenceOrderMethods.get': {};
	'dataBook.referenceOrderMethodsByCodeEdit.post': {
		path: { code: string };
		body: OpenApiOrderMethodEditInput & { orderMethod?: OpenApiOrderMethod };
	};
	'dataBook.referenceOrderTypes.get': {};
	'dataBook.referenceOrderTypesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiOrderTypeEditInput & { orderType?: OpenApiOrderType };
	};
	'dataBook.referencePaymentStatuses.get': {};
	'dataBook.referencePaymentStatusesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiPaymentStatusEditInput & {
			paymentStatus?: OpenApiPaymentStatus;
		};
	};
	'dataBook.referencePaymentTypes.get': {};
	'dataBook.referencePaymentTypesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiPaymentTypeEditInput & { paymentType?: OpenApiPaymentType };
	};
	'dataBook.referencePriceTypes.get': {};
	'dataBook.referencePriceTypesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiPriceTypeEditInput;
	};
	'dataBook.referenceProductStatuses.get': {};
	'dataBook.referenceProductStatusesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiOrderProductStatusEditInput & {
			productStatus?: OpenApiOrderProductStatus;
		};
	};
	'dataBook.referencePushCategories.get': {};
	'dataBook.referencePushCategoriesByCodeEdit.post': {
		path: { code: string };
		body: { pushCategory?: OpenApiPushCategoryInput };
	};
	'dataBook.referenceSites.get': {};
	'dataBook.referenceSitesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiSiteEditInput & { site?: OpenApiSiteValidation };
	};
	'dataBook.getReferencesitesByCodetracker.get': { path: { code: string } };
	'dataBook.referenceStatusGroups.get': {};
	'dataBook.referenceStatuses.get': {};
	'dataBook.referenceStatusesByCodeEdit.post': {
		path: { code: string };
		body: OpenApiStatusEditInput & { status?: OpenApiStatus };
	};
	'dataBook.referenceStores.get': {};
	'dataBook.referenceStoresByCodeEdit.post': {
		path: { code: string };
		body: OpenApiStoreEditInput & { store?: OpenApiStore };
	};
	'dataBook.referenceSubscriptions.get': {};
	'dataBook.referenceSubscriptionsByChannelByCodeEdit.post': {
		path: { channel: string; code: string };
		body: { subscription?: OpenApiSerializedSubscription };
	};
	'dataBook.referenceTicketChannels.get': {};
	'dataBook.referenceTicketChannelsCreate.post': {
		body: { ticketChannel: OpenApiTicketChannelInput & JsonValue };
	};
	'dataBook.referenceTicketChannelsByIdEdit.post': {
		path: { id: string };
		body: { ticketChannel: OpenApiTicketChannelInput };
	};
	'dataBook.referenceTicketStatusGroups.get': {};
	'dataBook.referenceTicketStatusGroupsCreate.post': {
		body: { ticketStatusGroup: OpenApiTicketStatusGroupInput & JsonValue };
	};
	'dataBook.referenceTicketStatusGroupsByIdEdit.post': {
		path: { id: string };
		body: { ticketStatusGroup: OpenApiTicketStatusGroupInput };
	};
	'dataBook.referenceTicketStatuses.get': {};
	'dataBook.referenceTicketStatusesCreate.post': {
		body: { ticketStatus: OpenApiTicketStatusInput & JsonValue };
	};
	'dataBook.referenceTicketStatusesByIdEdit.post': {
		path: { id: string };
		body: { ticketStatus: OpenApiTicketStatusInput };
	};
	'dataBook.referenceTicketSubtopics.get': {};
	'dataBook.referenceTicketSubtopicsCreate.post': {
		body: { ticketSubtopic: OpenApiTicketSubtopicInput & JsonValue };
	};
	'dataBook.referenceTicketSubtopicsByIdEdit.post': {
		path: { id: string };
		body: { ticketSubtopic: OpenApiTicketSubtopicInput };
	};
	'dataBook.referenceTicketTopics.get': {};
	'dataBook.referenceTicketTopicsCreate.post': {
		body: { ticketTopic: OpenApiTicketTopicInput & JsonValue };
	};
	'dataBook.referenceTicketTopicsByIdEdit.post': {
		path: { id: string };
		body: { ticketTopic: OpenApiTicketTopicInput };
	};
	'dataBook.referenceTicketTypes.get': {};
	'dataBook.referenceTicketTypesCreate.post': {
		body: { ticketType: OpenApiTicketTypeInput & JsonValue };
	};
	'dataBook.referenceTicketTypesByIdEdit.post': {
		path: { id: string };
		body: { ticketType: OpenApiTicketTypeInput };
	};
	'dataBook.referenceUnits.get': {};
	'dataBook.referenceUnitsByCodeEdit.post': {
		path: { code: string };
		body: { unit?: OpenApiSerializedUnit };
	};
	'segments.list.get': {
		query?: {
			'filter[ids][]'?: Array<number>;
			'filter[name]'?: string;
			'filter[type]'?: 'dynamic' | 'static';
			'filter[isTree]'?: boolean;
			'filter[active]'?: boolean;
			'filter[dateFrom]'?: string;
			'filter[dateTo]'?: string;
			'filter[minCustomersCount]'?: number;
			'filter[maxCustomersCount]'?: number;
			limit?: 20 | 50 | 100;
			page?: number;
		};
	};
	'settings.list.get': {};
	'store.inventories.get': {
		query?: {
			limit?: 20 | 50 | 100 | 250;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[sites][]'?: Array<string>;
			'filter[catalogs][]'?: Array<number>;
			'filter[productExternalId]'?: string;
			'filter[productArticle][]'?: Array<string>;
			'filter[productActive]'?: boolean;
			'filter[offerExternalId][]'?: Array<string>;
			'filter[offerXmlId][]'?: Array<string>;
			'filter[offerArticle][]'?: Array<string>;
			'filter[offerActive]'?: boolean;
			'filter[details]'?: boolean;
			'filter[productExternalIds][]'?: Array<string>;
		};
	};
	'store.inventoriesUpload.post': { body: OpenApiStoreInventoriesUploadInput };
	'store.offers.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[externalIds][]'?: Array<string>;
			'filter[xmlIds][]'?: Array<string>;
			'filter[articles][]'?: Array<string>;
			'filter[name]'?: string;
			'filter[sites][]'?: Array<string>;
			'filter[catalogs][]'?: Array<number>;
			'filter[groups][]'?: Array<number>;
			'filter[priceType]'?: string;
			'filter[active]'?: true | false;
			'filter[properties][]'?: Array<string>;
			'filter[sinceId]'?: number;
			'filter[minPrice]'?: number;
			'filter[maxPrice]'?: number;
			'filter[minQuantity]'?: number;
			'filter[maxQuantity]'?: number;
		};
	};
	'store.pricesUpload.post': {
		body: { prices?: Array<OpenApiPriceUploadInput> };
	};
	'store.productGroups.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[name]'?: string;
			'filter[sites][]'?: Array<string>;
			'filter[catalogs][]'?: Array<number>;
			'filter[active]'?: boolean;
			'filter[parentGroupId]'?: number;
			'filter[loadFromYml]'?: boolean;
			'filter[minLevel]'?: number;
			'filter[maxLevel]'?: number;
		};
	};
	'store.productGroupsCreate.post': { body: OpenApiProductGroupInput };
	'store.productGroupsByExternalidEdit.post': {
		path: { externalId: string };
		body: OpenApiProductGroupInput2;
	};
	'store.products.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[name]'?: string;
			'filter[groups][]'?: Array<number>;
			'filter[sites][]'?: Array<string>;
			'filter[catalogs][]'?: Array<number>;
			'filter[priceType]'?: string;
			'filter[manufacturer]'?: string;
			'filter[externalId]'?: string;
			'filter[xmlId]'?: string;
			'filter[url]'?: string;
			'filter[urlLike]'?: string;
			'filter[classSegment]'?: string;
			'filter[active]'?: boolean;
			'filter[popular]'?: boolean;
			'filter[stock]'?: boolean;
			'filter[novelty]'?: boolean;
			'filter[recommended]'?: boolean;
			'filter[properties][]'?: Array<string>;
			'filter[markable]'?: boolean;
			'filter[productType]'?: number;
			'filter[offerIds][]'?: Array<number>;
			'filter[offerExternalId]'?: string;
			'filter[offerXmlId]'?: string;
			'filter[groupExternalId]'?: string;
			'filter[externalIds][]'?: Array<string>;
			'filter[articles][]'?: Array<string>;
			'filter[sinceUpdatedAt]'?: string;
			'filter[sinceId]'?: number;
			'filter[minPrice]'?: number;
			'filter[maxPrice]'?: number;
			'filter[minPurchasePrice]'?: number;
			'filter[maxPurchasePrice]'?: number;
			'filter[minQuantity]'?: number;
			'filter[maxQuantity]'?: number;
		};
	};
	'store.productsBatchCreate.post': {
		body: { products?: Array<OpenApiProductCreateInput> };
	};
	'store.productsBatchEdit.post': {
		body: { products?: Array<OpenApiProductEditInput> };
	};
	'store.productsProperties.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[name]'?: string;
			'filter[code]'?: string;
			'filter[sites][]'?: Array<string>;
			'filter[visible]'?: true | false;
			'filter[variative]'?: true | false;
			'filter[catalogs][]'?: Array<number>;
			'filter[groups][]'?: Array<number>;
		};
	};
	'store.productsPropertiesValues.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[propertyName]'?: string;
			'filter[propertyCode]'?: string;
			'filter[groups][]'?: Array<number>;
		};
	};
	'tasks.list.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[ids][]'?: Array<number>;
			'filter[orderNumber]'?: string;
			'filter[orderId]'?: number;
			'filter[ticketNumber]'?: string;
			'filter[ticketId]'?: number;
			'filter[customer]'?: string;
			'filter[customerId]'?: number;
			'filter[mgCustomerId]'?: number;
			'filter[performers][]'?: Array<number>;
			'filter[observers][]'?: Array<number>;
			'filter[status]'?: 'expired' | 'completed' | 'performing';
			'filter[creators][]'?: Array<number>;
			'filter[text]'?: string;
			'filter[priority]'?: 'low' | 'medium' | 'high';
			'filter[tagsFilter][matchMode]'?: string;
			'filter[tagsFilter][attached]'?: boolean;
			'filter[tagsFilter][without]'?: boolean;
			'filter[tags][]'?: Array<string>;
			'filter[attachedTags][]'?: Array<string>;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
			'filter[dateFrom]'?: string;
			'filter[dateTo]'?: string;
			'filter[completedAtFrom]'?: string;
			'filter[completedAtTo]'?: string;
		};
	};
	'tasks.create.post': { body?: OpenApiTaskEditInput };
	'tasks.history.get': {
		query: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[startDate]'?: string;
			'filter[endDate]'?: string;
			'filter[taskId]': number;
			'filter[sinceId]': number;
		};
	};
	'tasks.getById.get': { path: { id: number } };
	'tasks.getByIdcomments.get': {
		path: { id: number };
		query?: { limit?: 20 | 50 | 100; page?: number };
	};
	'tasks.byIdEdit.post': { path: { id: number }; body?: OpenApiTaskEditInput2 };
	'telephony.callEvent.post': { body?: OpenApiCallEventInput };
	'telephony.calls.get': {
		query?: {
			'filter[dateFrom]'?: string;
			'filter[dateTo]'?: string;
			limit?: 20 | 50 | 100;
			cursor?: string;
			'filter[type]'?: 'in' | 'out' | 'local';
			'filter[code]'?: string;
			'filter[managerId]'?: number;
			'filter[result]'?:
				| 'failed'
				| 'answered'
				| 'busy'
				| 'no answer'
				| 'not allowed'
				| 'unknown';
			'filter[includeMissed]'?: boolean;
		};
	};
	'telephony.callsUpload.post': { body?: OpenApiCallsUploadInput };
	'telephony.getCallsByIdRecord.get': { path: { id: number } };
	'telephony.manager.get': {
		query: { phone: string; details?: 0 | 1; ignoreStatus?: 0 | 1 };
	};
	'tickets.list.get': {
		query?: {
			'filter[customFields]'?: Record<string, JsonValue>;
			limit?: 20 | 50 | 100;
			cursor?: string;
			'filter[ids][]'?: Array<number>;
			'filter[responsibles][]'?: Array<number>;
			'filter[orderIds][]'?: Array<number>;
			'filter[excludedOrderIds][]'?: Array<number>;
			'filter[customerIds][]'?: Array<number>;
			'filter[externalIds][]'?: Array<string>;
			'filter[numbers][]'?: Array<string>;
			'filter[orderNumbers][]'?: Array<string>;
			'filter[customerExternalIds][]'?: Array<string>;
			'filter[customerTags][]'?: Array<string>;
			'filter[customerAttachedTags][]'?: Array<string>;
			'filter[tags][]'?: Array<string>;
			'filter[attachedTags][]'?: Array<string>;
			'filter[sites][]'?: Array<string>;
			'filter[channels][]'?: Array<string>;
			'filter[types][]'?: Array<string>;
			'filter[topics][]'?: Array<string>;
			'filter[subtopics][]'?: Array<string>;
			'filter[statuses][]'?: Array<string>;
			'filter[segment][]'?: Array<string>;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
			'filter[closedAtFrom]'?: string;
			'filter[closedAtTo]'?: string;
			'filter[ticketState]'?: 'opened' | 'completed';
			'filter[sla]'?: 'normal' | 'warning' | 'urgent';
			'filter[customer]'?: string;
			'filter[email]'?: string;
			'filter[customerType]'?: 'customer' | 'customer_corporate';
			'filter[description]'?: string;
			'filter[comments]'?: string;
			'filter[vip]'?: boolean;
			'filter[bad]'?: boolean;
			'filter[tasks]'?: 2 | 1 | 3;
		};
	};
	'tickets.comments.get': {
		query?: {
			limit?: 20 | 50 | 100;
			cursor?: string;
			'filter[ids][]'?: Array<number>;
			'filter[ticketIds][]'?: Array<number>;
			'filter[ticketExternalIds][]'?: Array<string>;
			'filter[authorIds][]'?: Array<number>;
			'filter[text]'?: string;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
			'filter[sites][]'?: Array<string>;
		};
	};
	'tickets.commentsCreate.post': {
		body?: { comment: OpenApiTicketCommentCreateInput & JsonValue };
	};
	'tickets.commentsByIdDelete.post': { path: { id: number } };
	'tickets.commentsByIdEdit.post': {
		path: { id: number };
		body?: { comment: OpenApiTicketCommentInput & JsonValue };
	};
	'tickets.create.post': {
		body?: { ticket: OpenApiTicketCreateInput & JsonValue; site?: string };
	};
	'tickets.history.get': {
		query: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[sites][]'?: Array<string>;
			'filter[startDate]'?: string;
			'filter[endDate]'?: string;
			'filter[ticketId]': number;
			'filter[ticketExternalId]'?: string;
			'filter[sinceId]': number;
		};
	};
	'tickets.getByExternalid.get': {
		path: { externalId: string };
		query?: { by?: 'id' | 'externalId'; site?: string };
	};
	'tickets.byExternalidEdit.post': {
		path: { externalId: string };
		body?: {
			ticket: OpenApiTicketInput;
			by?: 'id' | 'externalId';
			site?: string;
		};
	};
	'users.userGroups.get': { query?: { limit?: 20 | 50 | 100; page?: number } };
	'users.list.get': {
		query?: {
			limit?: 20 | 50 | 100;
			page?: number;
			'filter[email]'?: string;
			'filter[active]'?: '0' | '1';
			'filter[online]'?: '0' | '1';
			'filter[status]'?: 'free' | 'busy' | 'dinner' | 'break';
			'filter[isManager]'?: '1';
			'filter[isAdmin]'?: '0' | '1';
			'filter[groups][]'?: Array<string>;
			'filter[createdAtFrom]'?: string;
			'filter[createdAtTo]'?: string;
		};
	};
	'users.getById.get': { path: { id: number } };
	'users.postByIdstatus.post': {
		path: { id: number };
		body: { status?: 'free' | 'busy' | 'dinner' | 'break' };
	};
	'verification.smsConfirm.post': {
		body: { verification?: OpenApiSmsVerificationConfirm };
	};
	'verification.getSmsByCheckidstatus.get': { path: { checkId: string } };
	'webAnalytics.clientIdsUpload.post': { body: OpenApiClientIdUploadInput };
	'webAnalytics.sourcesUpload.post': { body: OpenApiSourcesUploadInput };
	'webAnalytics.visitsUpload.post': { body: OpenApiVisitsUploadInput };
	'statistics.statisticUpdate.get': {};
};

export type SimlaComEndpointOutputs = {
	'api.apiVersions.get': OpenApiApiVersionsResponse;
	'api.credentials.get': OpenApiApiCredentialsResponse;
	'cost.list.get': OpenApiCostsListResponse;
	'cost.create.post': OpenApiCostsCreateResponse;
	'cost.delete.post': OpenApiCostDeleteBatchResponse;
	'cost.upload.post': OpenApiCostsUploadResponse;
	'cost.getById.get': OpenApiCostGetResponse;
	'cost.byIdDelete.post': OpenApiSimpleResponse4;
	'cost.byIdEdit.post': OpenApiCostsEditResponse;
	'customFields.list.get': OpenApiCustomFieldsListApiDocModel;
	'customFields.dictionaries.get': OpenApiCustomDictionariesList;
	'customFields.dictionariesCreate.post': OpenApiCustomDictionariesCreate2;
	'customFields.getDictionariesByCode.get': OpenApiCustomDictionariesGet;
	'customFields.dictionariesByCodeEdit.post': OpenApiCustomDictionariesEdit2;
	'customFields.byEntityCreate.post': OpenApiCustomFieldsCreate;
	'customFields.getByEntityByCode.get': OpenApiCustomFieldsGetApiDocModel;
	'customFields.byEntityByCodeEdit.post': OpenApiCustomFieldsEdit;
	'customers.list.get': OpenApiCustomersListResponse;
	'customers.combine.post': OpenApiSimpleResponse;
	'customers.create.post': OpenApiCustomersCreateResponse;
	'customers.fixExternalIds.post': OpenApiSimpleResponse;
	'customers.history.get': OpenApiCustomersHistoryResponseV4;
	'customers.notes.get': OpenApiCustomerNotesListResponse;
	'customers.notesCreate.post': OpenApiCustomerNoteCreateResponse;
	'customers.notesByIdDelete.post': OpenApiSimpleResponse;
	'customers.pushTokens.get': OpenApiPushTokenResponse;
	'customers.pushTokensBatch.post': OpenApiPushTokenResponse;
	'customers.upload.post': OpenApiCustomersUploadResponse;
	'customers.getByExternalid.get': OpenApiCustomersGetResponse;
	'customers.byExternalidEdit.post': OpenApiCustomersEditResponse;
	'customers.postByExternalidsubscriptions.post': OpenApiSimpleResponse;
	'corporateCustomers.list.get': OpenApiCustomersCorporateListResponse;
	'corporateCustomers.combine.post': OpenApiSimpleResponse;
	'corporateCustomers.create.post': OpenApiCustomersCreateResponse;
	'corporateCustomers.fixExternalIds.post': OpenApiSimpleResponse;
	'corporateCustomers.history.get': OpenApiCustomersCorporateHistoryResponse;
	'corporateCustomers.notes.get': OpenApiCustomerNotesListResponse;
	'corporateCustomers.notesCreate.post': OpenApiCustomerNoteCreateResponse;
	'corporateCustomers.notesByIdDelete.post': OpenApiSimpleResponse;
	'corporateCustomers.upload.post': OpenApiCustomersUploadResponse;
	'corporateCustomers.getByExternalid.get': OpenApiCustomersCorporateGetResponse;
	'corporateCustomers.getByExternalidaddresses.get': OpenApiAbstractResponse & {
		addresses?: Array<OpenApiCustomerAddress>;
	};
	'corporateCustomers.byExternalidAddressesCreate.post': OpenApiModifyResponse;
	'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post': OpenApiModifyResponse;
	'corporateCustomers.getByExternalidcompanies.get': OpenApiAbstractResponse & {
		companies?: Array<OpenApiCompany>;
	};
	'corporateCustomers.byExternalidCompaniesCreate.post': OpenApiModifyResponse;
	'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post': OpenApiModifyResponse;
	'corporateCustomers.getByExternalidcontacts.get': OpenApiAbstractResponse & {
		contacts?: Array<OpenApiCustomerContact>;
	};
	'corporateCustomers.byExternalidContactsCreate.post': OpenApiModifyResponse;
	'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post': OpenApiModifyResponse;
	'corporateCustomers.byExternalidEdit.post': OpenApiCustomersEditResponse;
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitecartclear.post': OpenApiSimpleResponse2;
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitecartset.post': OpenApiSimpleResponse2;
	'customerActionsOnTheSiteOfTheStore.getCustomerInteractionBySitecartByCustomerid.get': OpenApiCartGetResponse;
	'customerActionsOnTheSiteOfTheStore.getCustomerInteractionBySitefavoritesByCustomerid.get': OpenApiFavoritesListResponse;
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitefavoritesByCustomeridadd.post': OpenApiSimpleResponse2;
	'customerActionsOnTheSiteOfTheStore.customerInteractionBySiteFavoritesByCustomeridRemove.post': OpenApiSimpleResponse2;
	'deliveries.deliveryCalculate.post': OpenApiCalculateResponse;
	'deliveries.postDeliverygenericBySubcodetracking.post': OpenApiSimpleResponse5;
	'deliveries.deliveryShipments.get': OpenApiApiDeliveryShipmentListResponse;
	'deliveries.deliveryShipmentsCreate.post': OpenApiApiDeliveryShipmentEditResponse;
	'deliveries.getDeliveryshipmentsById.get': OpenApiApiDeliveryShipmentGetResponse;
	'deliveries.deliveryShipmentsByIdEdit.post': OpenApiApiDeliveryShipmentEditResponse;
	'files.list.get': OpenApiFilesListResponse;
	'files.upload.post': OpenApiFileEditResponse;
	'files.getById.get': OpenApiFileGetResponse;
	'files.byIdDelete.post': OpenApiSimpleResponse;
	'files.byIdDownload.get': {
		kind: 'binary';
		contentType: string;
		base64: string;
	};
	'files.byIdEdit.post': OpenApiFileEditResponse;
	'integration.getIntegrationModulesByCode.get': OpenApiApiIntegrationModuleGetResponse;
	'integration.integrationModulesByCodeEdit.post': OpenApiApiIntegrationModuleEditResponse;
	'integration.postIntegrationModulesByCodeupdateScopes.post': OpenApiApiUpdateScopesResponse;
	'knowledgeBase.documents.get': OpenApiKnowledgeBaseDocumentListResponse;
	'knowledgeBase.documentsCreate.post': OpenApiSimpleIdResponse;
	'knowledgeBase.documentsHistory.get': OpenApiKnowledgeBaseDocumentHistoryResponse;
	'knowledgeBase.getDocumentsById.get': OpenApiKnowledgeBaseDocumentResponse;
	'knowledgeBase.documentsByIdDelete.post': OpenApiSimpleResponse2;
	'knowledgeBase.documentsByIdEdit.post': OpenApiSimpleIdResponse;
	'knowledgeBase.sections.get': OpenApiKnowledgeBaseSectionListResponse;
	'knowledgeBase.sectionsCreate.post': OpenApiSimpleIdResponse;
	'knowledgeBase.sectionsByIdDelete.post': OpenApiSimpleResponse2;
	'knowledgeBase.sectionsByIdEdit.post': OpenApiSimpleIdResponse;
	'loyalty.accountCreate.post': OpenApiLoyaltyAccountInfoResponse;
	'loyalty.getAccountById.get': OpenApiLoyaltyAccountGetResponse;
	'loyalty.postAccountByIdactivate.post': OpenApiLoyaltyAccountActivationResponse;
	'loyalty.postAccountByIdbonuscharge.post': OpenApiAbstractResponse;
	'loyalty.postAccountByIdbonuscredit.post': OpenApiLoyaltyBonusResponse;
	'loyalty.getAccountByIdbonusoperations.get': OpenApiLoyaltyAccountBonusOperationsResponse;
	'loyalty.getAccountByIdbonusByStatusdetails.get': OpenApiLoyaltyAccountBonusResponse;
	'loyalty.accountByIdEdit.post': OpenApiLoyaltyAccountGetResponse2;
	'loyalty.accounts.get': OpenApiLoyaltyAccountsListResponse;
	'loyalty.bonusOperations.get': OpenApiLoyaltyBonusOperationsResponse;
	'loyalty.calculate.post': OpenApiCalculateResponse2;
	'loyalty.loyalties.get': OpenApiLoyaltyListResponse;
	'loyalty.getLoyaltiesById.get': OpenApiLoyaltyGetResponse;
	'notifications.send.post': OpenApiSimpleResponse;
	'orders.list.get': OpenApiOrdersListResponse;
	'orders.combine.post': OpenApiOrdersCombineResponse;
	'orders.create.post': OpenApiOrdersCreateResponse;
	'orders.fixExternalIds.post': OpenApiSimpleResponse;
	'orders.history.get': OpenApiOrdersHistoryResponseV4;
	'orders.linksCreate.post': OpenApiOrderLinkCreateResponse;
	'orders.loyaltyApply.post': OpenApiApplyResponse;
	'orders.loyaltyCancelBonusOperations.post': OpenApiCancelBonusOperationsResponse;
	'orders.paymentsCreate.post': OpenApiPaymentCreateResponse;
	'orders.paymentsByIdDelete.post': OpenApiSimpleResponse;
	'orders.paymentsByIdEdit.post': OpenApiPaymentEditResponse;
	'orders.statuses.get': OpenApiOrdersStatusesResponse;
	'orders.upload.post': OpenApiOrdersUploadResponse;
	'orders.getByExternalid.get': OpenApiOrdersGetResponse;
	'orders.byExternalidDeliveryCancel.post': OpenApiSimpleResponse2;
	'orders.byExternalidEdit.post': OpenApiOrdersEditResponse;
	'orders.byExternalidPlatesByPlateidPrint.get': Record<string, JsonValue>;
	'ordersPicking.packs.get': OpenApiOrderProductPacksListResponse;
	'ordersPicking.packsCreate.post': OpenApiOrderProductPackEditResponse;
	'ordersPicking.packsHistory.get': OpenApiOrdersProductPackHistoryResponseV3;
	'ordersPicking.getPacksById.get': OpenApiOrderProductPackGetResponse;
	'ordersPicking.packsByIdDelete.post': OpenApiOrderProductPackDeleteResponse;
	'ordersPicking.packsByIdEdit.post': OpenApiOrderProductPackEditResponse;
	'payments.paymentCheck.post': OpenApiApiCheckResponse;
	'payments.paymentCreateInvoice.post': OpenApiApiCreateInvoiceResponse;
	'payments.paymentInvoiceImport.post': OpenApiApiImportInvoiceResponse;
	'payments.getPaymentinvoiceByInvoiceuuid.get': OpenApiApiGetInvoiceResponse;
	'payments.paymentUpdateInvoice.post': OpenApiApiUpdateInvoiceResponse;
	'dataBook.referenceCostGroups.get': OpenApiCostGroupsListResponse;
	'dataBook.referenceCostGroupsByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceCostItems.get': OpenApiCostItemsListResponse;
	'dataBook.referenceCostItemsByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceCountries.get': OpenApiCountriesListResponse;
	'dataBook.referenceCouriers.get': OpenApiCouriersListResponse;
	'dataBook.referenceCouriersCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceCouriersByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceCurrencies.get': OpenApiCurrenciesListResponse;
	'dataBook.referenceCurrenciesCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceCurrenciesByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceDeliveryServices.get': OpenApiDeliveryServicesListResponse;
	'dataBook.referenceDeliveryServicesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceDeliveryTypes.get': OpenApiDeliveryTypesListResponse;
	'dataBook.referenceDeliveryTypesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceLegalEntities.get': OpenApiLegalEntityListResponse;
	'dataBook.referenceLegalEntitiesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceMgChannels.get': OpenApiMGChannelsListResponse;
	'dataBook.referenceOrderMethods.get': OpenApiOrderMethodsListResponse;
	'dataBook.referenceOrderMethodsByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceOrderTypes.get': OpenApiOrderTypesListResponse;
	'dataBook.referenceOrderTypesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referencePaymentStatuses.get': OpenApiPaymentStatusesListResponse;
	'dataBook.referencePaymentStatusesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referencePaymentTypes.get': OpenApiPaymentTypesListResponse;
	'dataBook.referencePaymentTypesByCodeEdit.post': OpenApiPaymentTypeEditResponse;
	'dataBook.referencePriceTypes.get': OpenApiPriceTypeListResponse;
	'dataBook.referencePriceTypesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceProductStatuses.get': OpenApiOrderProductStatusesListResponse;
	'dataBook.referenceProductStatusesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referencePushCategories.get': OpenApiPushCategoriesResponse;
	'dataBook.referencePushCategoriesByCodeEdit.post': OpenApiSimpleIdResponse;
	'dataBook.referenceSites.get': OpenApiSitesListResponse;
	'dataBook.referenceSitesByCodeEdit.post': OpenApiSimpleIdResponse;
	'dataBook.getReferencesitesByCodetracker.get': OpenApiTrackerSiteSettingsResponse;
	'dataBook.referenceStatusGroups.get': OpenApiStatusGroupsListResponse;
	'dataBook.referenceStatuses.get': OpenApiStatusesListResponse;
	'dataBook.referenceStatusesByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceStores.get': OpenApiStoreListResponse;
	'dataBook.referenceStoresByCodeEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceSubscriptions.get': OpenApiSubscriptionsResponse;
	'dataBook.referenceSubscriptionsByChannelByCodeEdit.post': OpenApiSimpleIdResponse;
	'dataBook.referenceTicketChannels.get': OpenApiTicketChannelsListResponse;
	'dataBook.referenceTicketChannelsCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceTicketChannelsByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceTicketStatusGroups.get': OpenApiTicketStatusGroupsListResponse;
	'dataBook.referenceTicketStatusGroupsCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceTicketStatusGroupsByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceTicketStatuses.get': OpenApiTicketStatusesListResponse;
	'dataBook.referenceTicketStatusesCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceTicketStatusesByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceTicketSubtopics.get': OpenApiTicketSubtopicsListResponse;
	'dataBook.referenceTicketSubtopicsCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceTicketSubtopicsByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceTicketTopics.get': OpenApiTicketTopicsListResponse;
	'dataBook.referenceTicketTopicsCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceTicketTopicsByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceTicketTypes.get': OpenApiTicketTypesListResponse;
	'dataBook.referenceTicketTypesCreate.post': OpenApiSimpleIdResponse;
	'dataBook.referenceTicketTypesByIdEdit.post': OpenApiSimpleResponse2;
	'dataBook.referenceUnits.get': OpenApiUnitsListResponse;
	'dataBook.referenceUnitsByCodeEdit.post': OpenApiSimpleResponse3;
	'segments.list.get': OpenApiListResponse;
	'settings.list.get': OpenApiSettingsResponse;
	'store.inventories.get': OpenApiStoreInventoriesListResponse;
	'store.inventoriesUpload.post': OpenApiStoreInventoriesUploadResponse;
	'store.offers.get': OpenApiOffersListResponse;
	'store.pricesUpload.post': OpenApiPriceUploadResponse;
	'store.productGroups.get': OpenApiProductGroupsListResponse;
	'store.productGroupsCreate.post': OpenApiProductGroupCreateResponse;
	'store.productGroupsByExternalidEdit.post': OpenApiProductGroupEditResponse;
	'store.products.get': OpenApiProductsListResponse;
	'store.productsBatchCreate.post': OpenApiProductCreateResponse;
	'store.productsBatchEdit.post': OpenApiProductEditResponse;
	'store.productsProperties.get': OpenApiProductPropertiesListResponse;
	'store.productsPropertiesValues.get': OpenApiProductPropertyValuesListResponse;
	'tasks.list.get': OpenApiTasksListResponse;
	'tasks.create.post': OpenApiTasksCreateResponse;
	'tasks.history.get': OpenApiTaskHistoryResponse;
	'tasks.getById.get': OpenApiTasksGetResponse;
	'tasks.getByIdcomments.get': OpenApiTaskCommentsListResponse;
	'tasks.byIdEdit.post': OpenApiSimpleResponse2;
	'telephony.callEvent.post': OpenApiCallEventResponse;
	'telephony.calls.get': OpenApiCallsResponse;
	'telephony.callsUpload.post': OpenApiCallsUploadResponse;
	'telephony.getCallsByIdRecord.get': {
		kind: 'binary';
		contentType: string;
		base64: string;
	};
	'telephony.manager.get': OpenApiManagerResponse;
	'tickets.list.get': OpenApiTicketListResponse;
	'tickets.comments.get': OpenApiTicketCommentListResponse;
	'tickets.commentsCreate.post': OpenApiSimpleIdResponse;
	'tickets.commentsByIdDelete.post': OpenApiSimpleResponse;
	'tickets.commentsByIdEdit.post': OpenApiSimpleResponse;
	'tickets.create.post': OpenApiTicketWriteResponse;
	'tickets.history.get': OpenApiTicketHistoryResponse;
	'tickets.getByExternalid.get': OpenApiTicketResponse;
	'tickets.byExternalidEdit.post': OpenApiTicketWriteResponse;
	'users.userGroups.get': OpenApiUserGroupListResponse;
	'users.list.get': OpenApiUsersListResponse;
	'users.getById.get': OpenApiUsersGetResponse;
	'users.postByIdstatus.post': OpenApiSimpleResponse2;
	'verification.smsConfirm.post': OpenApiSmsVerificationResponse;
	'verification.getSmsByCheckidstatus.get': OpenApiSmsVerificationResponse;
	'webAnalytics.clientIdsUpload.post': OpenApiClientIdUploadResponse;
	'webAnalytics.sourcesUpload.post': OpenApiSourcesUploadResponse;
	'webAnalytics.visitsUpload.post': OpenApiVisitsUploadResponse;
	'statistics.statisticUpdate.get': OpenApiSimpleResponse2;
};

export const SIMLACOM_OPERATION_IDS = [
	'api.apiVersions.get',
	'api.credentials.get',
	'cost.list.get',
	'cost.create.post',
	'cost.delete.post',
	'cost.upload.post',
	'cost.getById.get',
	'cost.byIdDelete.post',
	'cost.byIdEdit.post',
	'customFields.list.get',
	'customFields.dictionaries.get',
	'customFields.dictionariesCreate.post',
	'customFields.getDictionariesByCode.get',
	'customFields.dictionariesByCodeEdit.post',
	'customFields.byEntityCreate.post',
	'customFields.getByEntityByCode.get',
	'customFields.byEntityByCodeEdit.post',
	'customers.list.get',
	'customers.combine.post',
	'customers.create.post',
	'customers.fixExternalIds.post',
	'customers.history.get',
	'customers.notes.get',
	'customers.notesCreate.post',
	'customers.notesByIdDelete.post',
	'customers.pushTokens.get',
	'customers.pushTokensBatch.post',
	'customers.upload.post',
	'customers.getByExternalid.get',
	'customers.byExternalidEdit.post',
	'customers.postByExternalidsubscriptions.post',
	'corporateCustomers.list.get',
	'corporateCustomers.combine.post',
	'corporateCustomers.create.post',
	'corporateCustomers.fixExternalIds.post',
	'corporateCustomers.history.get',
	'corporateCustomers.notes.get',
	'corporateCustomers.notesCreate.post',
	'corporateCustomers.notesByIdDelete.post',
	'corporateCustomers.upload.post',
	'corporateCustomers.getByExternalid.get',
	'corporateCustomers.getByExternalidaddresses.get',
	'corporateCustomers.byExternalidAddressesCreate.post',
	'corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post',
	'corporateCustomers.getByExternalidcompanies.get',
	'corporateCustomers.byExternalidCompaniesCreate.post',
	'corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post',
	'corporateCustomers.getByExternalidcontacts.get',
	'corporateCustomers.byExternalidContactsCreate.post',
	'corporateCustomers.byExternalidContactsByEntityexternalidEdit.post',
	'corporateCustomers.byExternalidEdit.post',
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitecartclear.post',
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitecartset.post',
	'customerActionsOnTheSiteOfTheStore.getCustomerInteractionBySitecartByCustomerid.get',
	'customerActionsOnTheSiteOfTheStore.getCustomerInteractionBySitefavoritesByCustomerid.get',
	'customerActionsOnTheSiteOfTheStore.postCustomerInteractionBySitefavoritesByCustomeridadd.post',
	'customerActionsOnTheSiteOfTheStore.customerInteractionBySiteFavoritesByCustomeridRemove.post',
	'deliveries.deliveryCalculate.post',
	'deliveries.postDeliverygenericBySubcodetracking.post',
	'deliveries.deliveryShipments.get',
	'deliveries.deliveryShipmentsCreate.post',
	'deliveries.getDeliveryshipmentsById.get',
	'deliveries.deliveryShipmentsByIdEdit.post',
	'files.list.get',
	'files.upload.post',
	'files.getById.get',
	'files.byIdDelete.post',
	'files.byIdDownload.get',
	'files.byIdEdit.post',
	'integration.getIntegrationModulesByCode.get',
	'integration.integrationModulesByCodeEdit.post',
	'integration.postIntegrationModulesByCodeupdateScopes.post',
	'knowledgeBase.documents.get',
	'knowledgeBase.documentsCreate.post',
	'knowledgeBase.documentsHistory.get',
	'knowledgeBase.getDocumentsById.get',
	'knowledgeBase.documentsByIdDelete.post',
	'knowledgeBase.documentsByIdEdit.post',
	'knowledgeBase.sections.get',
	'knowledgeBase.sectionsCreate.post',
	'knowledgeBase.sectionsByIdDelete.post',
	'knowledgeBase.sectionsByIdEdit.post',
	'loyalty.accountCreate.post',
	'loyalty.getAccountById.get',
	'loyalty.postAccountByIdactivate.post',
	'loyalty.postAccountByIdbonuscharge.post',
	'loyalty.postAccountByIdbonuscredit.post',
	'loyalty.getAccountByIdbonusoperations.get',
	'loyalty.getAccountByIdbonusByStatusdetails.get',
	'loyalty.accountByIdEdit.post',
	'loyalty.accounts.get',
	'loyalty.bonusOperations.get',
	'loyalty.calculate.post',
	'loyalty.loyalties.get',
	'loyalty.getLoyaltiesById.get',
	'notifications.send.post',
	'orders.list.get',
	'orders.combine.post',
	'orders.create.post',
	'orders.fixExternalIds.post',
	'orders.history.get',
	'orders.linksCreate.post',
	'orders.loyaltyApply.post',
	'orders.loyaltyCancelBonusOperations.post',
	'orders.paymentsCreate.post',
	'orders.paymentsByIdDelete.post',
	'orders.paymentsByIdEdit.post',
	'orders.statuses.get',
	'orders.upload.post',
	'orders.getByExternalid.get',
	'orders.byExternalidDeliveryCancel.post',
	'orders.byExternalidEdit.post',
	'orders.byExternalidPlatesByPlateidPrint.get',
	'ordersPicking.packs.get',
	'ordersPicking.packsCreate.post',
	'ordersPicking.packsHistory.get',
	'ordersPicking.getPacksById.get',
	'ordersPicking.packsByIdDelete.post',
	'ordersPicking.packsByIdEdit.post',
	'payments.paymentCheck.post',
	'payments.paymentCreateInvoice.post',
	'payments.paymentInvoiceImport.post',
	'payments.getPaymentinvoiceByInvoiceuuid.get',
	'payments.paymentUpdateInvoice.post',
	'dataBook.referenceCostGroups.get',
	'dataBook.referenceCostGroupsByCodeEdit.post',
	'dataBook.referenceCostItems.get',
	'dataBook.referenceCostItemsByCodeEdit.post',
	'dataBook.referenceCountries.get',
	'dataBook.referenceCouriers.get',
	'dataBook.referenceCouriersCreate.post',
	'dataBook.referenceCouriersByIdEdit.post',
	'dataBook.referenceCurrencies.get',
	'dataBook.referenceCurrenciesCreate.post',
	'dataBook.referenceCurrenciesByIdEdit.post',
	'dataBook.referenceDeliveryServices.get',
	'dataBook.referenceDeliveryServicesByCodeEdit.post',
	'dataBook.referenceDeliveryTypes.get',
	'dataBook.referenceDeliveryTypesByCodeEdit.post',
	'dataBook.referenceLegalEntities.get',
	'dataBook.referenceLegalEntitiesByCodeEdit.post',
	'dataBook.referenceMgChannels.get',
	'dataBook.referenceOrderMethods.get',
	'dataBook.referenceOrderMethodsByCodeEdit.post',
	'dataBook.referenceOrderTypes.get',
	'dataBook.referenceOrderTypesByCodeEdit.post',
	'dataBook.referencePaymentStatuses.get',
	'dataBook.referencePaymentStatusesByCodeEdit.post',
	'dataBook.referencePaymentTypes.get',
	'dataBook.referencePaymentTypesByCodeEdit.post',
	'dataBook.referencePriceTypes.get',
	'dataBook.referencePriceTypesByCodeEdit.post',
	'dataBook.referenceProductStatuses.get',
	'dataBook.referenceProductStatusesByCodeEdit.post',
	'dataBook.referencePushCategories.get',
	'dataBook.referencePushCategoriesByCodeEdit.post',
	'dataBook.referenceSites.get',
	'dataBook.referenceSitesByCodeEdit.post',
	'dataBook.getReferencesitesByCodetracker.get',
	'dataBook.referenceStatusGroups.get',
	'dataBook.referenceStatuses.get',
	'dataBook.referenceStatusesByCodeEdit.post',
	'dataBook.referenceStores.get',
	'dataBook.referenceStoresByCodeEdit.post',
	'dataBook.referenceSubscriptions.get',
	'dataBook.referenceSubscriptionsByChannelByCodeEdit.post',
	'dataBook.referenceTicketChannels.get',
	'dataBook.referenceTicketChannelsCreate.post',
	'dataBook.referenceTicketChannelsByIdEdit.post',
	'dataBook.referenceTicketStatusGroups.get',
	'dataBook.referenceTicketStatusGroupsCreate.post',
	'dataBook.referenceTicketStatusGroupsByIdEdit.post',
	'dataBook.referenceTicketStatuses.get',
	'dataBook.referenceTicketStatusesCreate.post',
	'dataBook.referenceTicketStatusesByIdEdit.post',
	'dataBook.referenceTicketSubtopics.get',
	'dataBook.referenceTicketSubtopicsCreate.post',
	'dataBook.referenceTicketSubtopicsByIdEdit.post',
	'dataBook.referenceTicketTopics.get',
	'dataBook.referenceTicketTopicsCreate.post',
	'dataBook.referenceTicketTopicsByIdEdit.post',
	'dataBook.referenceTicketTypes.get',
	'dataBook.referenceTicketTypesCreate.post',
	'dataBook.referenceTicketTypesByIdEdit.post',
	'dataBook.referenceUnits.get',
	'dataBook.referenceUnitsByCodeEdit.post',
	'segments.list.get',
	'settings.list.get',
	'store.inventories.get',
	'store.inventoriesUpload.post',
	'store.offers.get',
	'store.pricesUpload.post',
	'store.productGroups.get',
	'store.productGroupsCreate.post',
	'store.productGroupsByExternalidEdit.post',
	'store.products.get',
	'store.productsBatchCreate.post',
	'store.productsBatchEdit.post',
	'store.productsProperties.get',
	'store.productsPropertiesValues.get',
	'tasks.list.get',
	'tasks.create.post',
	'tasks.history.get',
	'tasks.getById.get',
	'tasks.getByIdcomments.get',
	'tasks.byIdEdit.post',
	'telephony.callEvent.post',
	'telephony.calls.get',
	'telephony.callsUpload.post',
	'telephony.getCallsByIdRecord.get',
	'telephony.manager.get',
	'tickets.list.get',
	'tickets.comments.get',
	'tickets.commentsCreate.post',
	'tickets.commentsByIdDelete.post',
	'tickets.commentsByIdEdit.post',
	'tickets.create.post',
	'tickets.history.get',
	'tickets.getByExternalid.get',
	'tickets.byExternalidEdit.post',
	'users.userGroups.get',
	'users.list.get',
	'users.getById.get',
	'users.postByIdstatus.post',
	'verification.smsConfirm.post',
	'verification.getSmsByCheckidstatus.get',
	'webAnalytics.clientIdsUpload.post',
	'webAnalytics.sourcesUpload.post',
	'webAnalytics.visitsUpload.post',
	'statistics.statisticUpdate.get',
] as const;
export type SimlaComOperationId = (typeof SIMLACOM_OPERATION_IDS)[number];
