import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	makeActiveCampaignGraphQLRequest,
	makeActiveCampaignRequest,
} from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignAddress,
	ActiveCampaignCalendar,
	ActiveCampaignConnection,
	ActiveCampaignCustomObjectSchema,
	ActiveCampaignEcomCustomer,
	ActiveCampaignEventTrackingEvent,
	ActiveCampaignGroup,
	ActiveCampaignUser,
	ActiveCampaignWebhook,
} from '../schema/database';
import { auditPayload, listAuditPayload } from './logging';
import { makeResource } from './resource';
import {
	buildPaginationQuery,
	compactBody,
	compactQuery,
	resolveAccount,
} from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

/**
 * E-commerce, custom objects, tracking, webhooks and account administration.
 *
 * The e-commerce catalog (products, bulk order upsert, recurring payments,
 * browse sessions) is GraphQL rather than REST, so those operations use the
 * GraphQL transport. Everything else here is standard v3 REST.
 */

// ---------------------------------------------------------------------------
// E-commerce, REST
// ---------------------------------------------------------------------------

const connections = makeResource({
	path: 'connections',
	one: 'connection',
	many: 'connections',
	event: 'activecampaign.connections',
	entity: ActiveCampaignConnection,
	store: 'connections',
	label: 'connection',
	logKeys: ['id', 'limit', 'offset', 'service', 'externalid'],
	bodyKeys: ['service', 'externalid', 'name', 'logoUrl', 'linkUrl'],
});

const ecomCustomers = makeResource({
	path: 'ecomCustomers',
	one: 'ecomCustomer',
	many: 'ecomCustomers',
	event: 'activecampaign.ecomCustomers',
	entity: ActiveCampaignEcomCustomer,
	store: 'ecomCustomers',
	label: 'ecomCustomer',
	// `email` is the customer's own data and is never logged by value.
	logKeys: ['id', 'limit', 'offset', 'connectionid', 'externalid'],
	bodyKeys: ['connectionid', 'externalid', 'email', 'acceptsMarketing'],
});

/**
 * Orders are transactional - appended continuously and only meaningful against
 * a date range - so they are returned but never mirrored.
 */
const ecomOrders = makeResource({
	path: 'ecomOrders',
	one: 'ecomOrder',
	many: 'ecomOrders',
	event: 'activecampaign.ecomOrders',
	label: 'ecomOrder',
	logKeys: ['id', 'limit', 'offset', 'connectionid', 'customerid'],
	bodyKeys: [
		'externalid',
		'source',
		'email',
		'orderProducts',
		'orderDiscounts',
		'totalPrice',
		'shippingAmount',
		'taxAmount',
		'discountAmount',
		'currency',
		'orderDate',
		'externalUpdatedDate',
		'abandonedDate',
		'externalcheckoutid',
		'connectionid',
		'customerid',
		'orderNumber',
		'shippingMethod',
	],
});

const ecomOrderProducts = makeResource({
	path: 'ecomOrderProducts',
	one: 'ecomOrderProduct',
	many: 'ecomOrderProducts',
	event: 'activecampaign.ecomOrderProducts',
	label: 'ecomOrderProduct',
});

// ---------------------------------------------------------------------------
// Custom objects, tracking, webhooks, administration
// ---------------------------------------------------------------------------

const customObjects = makeResource({
	path: 'customObjects/schemas',
	one: 'schema',
	many: 'schemas',
	event: 'activecampaign.customObjectSchemas',
	entity: ActiveCampaignCustomObjectSchema,
	store: 'customObjectSchemas',
	label: 'customObjectSchema',
	bodyKeys: [
		'slug',
		'name',
		'description',
		'labels',
		'fields',
		'relationships',
	],
});

const webhooks = makeResource({
	path: 'webhooks',
	one: 'webhook',
	many: 'webhooks',
	event: 'activecampaign.webhooks',
	entity: ActiveCampaignWebhook,
	store: 'webhooks',
	label: 'webhook',
	logKeys: ['id', 'limit', 'offset', 'listid'],
	bodyKeys: ['name', 'url', 'events', 'sources', 'listid'],
});

const users = makeResource({
	path: 'users',
	one: 'user',
	many: 'users',
	event: 'activecampaign.users',
	entity: ActiveCampaignUser,
	store: 'users',
	label: 'user',
	// email, firstName, lastName and phone are staff personal data.
	logKeys: ['id', 'limit', 'offset', 'group'],
	bodyKeys: [
		'username',
		'email',
		'firstName',
		'lastName',
		'password',
		'group',
		'phone',
		'signature',
		'lang',
		'localZoneid',
	],
});

const groups = makeResource({
	path: 'groups',
	one: 'group',
	many: 'groups',
	event: 'activecampaign.groups',
	entity: ActiveCampaignGroup,
	store: 'groups',
	label: 'group',
	bodyKeys: ['title', 'descript'],
});

const addresses = makeResource({
	path: 'addresses',
	one: 'address',
	many: 'addresses',
	event: 'activecampaign.addresses',
	entity: ActiveCampaignAddress,
	store: 'addresses',
	label: 'address',
	// Street address fields are personal data on a sole-trader account.
	logKeys: ['id', 'limit', 'offset', 'country'],
	bodyKeys: [
		'companyName',
		'address1',
		'address2',
		'city',
		'state',
		'zip',
		'country',
		'allgroups',
		'groupid',
	],
});

const calendars = makeResource({
	path: 'calendars',
	one: 'calendar',
	many: 'calendars',
	event: 'activecampaign.calendars',
	entity: ActiveCampaignCalendar,
	store: 'calendars',
	label: 'calendar',
	bodyKeys: ['title', 'type', 'description', 'isglobal', 'inviteusers'],
});

const eventTrackingEvents = makeResource({
	path: 'eventTrackingEvents',
	one: 'eventTrackingEvent',
	many: 'eventTrackingEvents',
	event: 'activecampaign.eventTrackingEvents',
	entity: ActiveCampaignEventTrackingEvent,
	store: 'eventTrackingEvents',
	label: 'eventTrackingEvent',
	bodyKeys: ['name'],
});

// --- e-commerce REST exports ------------------------------------------------
export const listConnections =
	connections.list as ActiveCampaignEndpoints['connectionsList'];
export const getConnection =
	connections.get as ActiveCampaignEndpoints['connectionsGet'];
export const createConnection =
	connections.create as ActiveCampaignEndpoints['connectionsCreate'];
export const updateConnection =
	connections.update as ActiveCampaignEndpoints['connectionsUpdate'];
export const removeConnection =
	connections.remove as ActiveCampaignEndpoints['connectionsDelete'];

export const listCustomers =
	ecomCustomers.list as ActiveCampaignEndpoints['ecomCustomersList'];
export const getCustomer =
	ecomCustomers.get as ActiveCampaignEndpoints['ecomCustomersGet'];
export const createCustomer =
	ecomCustomers.create as ActiveCampaignEndpoints['ecomCustomersCreate'];
export const updateCustomer =
	ecomCustomers.update as ActiveCampaignEndpoints['ecomCustomersUpdate'];
export const removeCustomer =
	ecomCustomers.remove as ActiveCampaignEndpoints['ecomCustomersDelete'];

export const listOrders =
	ecomOrders.list as ActiveCampaignEndpoints['ecomOrdersList'];
export const getOrder =
	ecomOrders.get as ActiveCampaignEndpoints['ecomOrdersGet'];
export const createOrder =
	ecomOrders.create as ActiveCampaignEndpoints['ecomOrdersCreate'];
export const updateOrder =
	ecomOrders.update as ActiveCampaignEndpoints['ecomOrdersUpdate'];
export const removeOrder =
	ecomOrders.remove as ActiveCampaignEndpoints['ecomOrdersDelete'];

export const listOrderProducts =
	ecomOrderProducts.list as ActiveCampaignEndpoints['ecomOrderProductsList'];
export const getOrderProduct =
	ecomOrderProducts.get as ActiveCampaignEndpoints['ecomOrderProductsGet'];

// --- custom objects, webhooks, admin exports --------------------------------
export const listSchemas =
	customObjects.list as ActiveCampaignEndpoints['customObjectSchemasList'];
export const getSchema =
	customObjects.get as ActiveCampaignEndpoints['customObjectSchemasGet'];
export const createSchema =
	customObjects.create as ActiveCampaignEndpoints['customObjectSchemasCreate'];
export const updateSchema =
	customObjects.update as ActiveCampaignEndpoints['customObjectSchemasUpdate'];
export const removeSchema =
	customObjects.remove as ActiveCampaignEndpoints['customObjectSchemasDelete'];

export const listWebhooks =
	webhooks.list as ActiveCampaignEndpoints['webhooksList'];
export const getWebhook =
	webhooks.get as ActiveCampaignEndpoints['webhooksGet'];
export const createWebhook =
	webhooks.create as ActiveCampaignEndpoints['webhooksCreate'];
export const updateWebhook =
	webhooks.update as ActiveCampaignEndpoints['webhooksUpdate'];
export const removeWebhook =
	webhooks.remove as ActiveCampaignEndpoints['webhooksDelete'];

export const listUsers = users.list as ActiveCampaignEndpoints['usersList'];
export const getUser = users.get as ActiveCampaignEndpoints['usersGet'];
export const createUser =
	users.create as ActiveCampaignEndpoints['usersCreate'];
export const updateUser =
	users.update as ActiveCampaignEndpoints['usersUpdate'];
export const removeUser =
	users.remove as ActiveCampaignEndpoints['usersDelete'];

export const listGroups = groups.list as ActiveCampaignEndpoints['groupsList'];
export const getGroup = groups.get as ActiveCampaignEndpoints['groupsGet'];
export const createGroup =
	groups.create as ActiveCampaignEndpoints['groupsCreate'];
export const updateGroup =
	groups.update as ActiveCampaignEndpoints['groupsUpdate'];
export const removeGroup =
	groups.remove as ActiveCampaignEndpoints['groupsDelete'];

export const listAddresses =
	addresses.list as ActiveCampaignEndpoints['addressesList'];
export const getAddress =
	addresses.get as ActiveCampaignEndpoints['addressesGet'];
export const createAddress =
	addresses.create as ActiveCampaignEndpoints['addressesCreate'];
export const updateAddress =
	addresses.update as ActiveCampaignEndpoints['addressesUpdate'];
export const removeAddress =
	addresses.remove as ActiveCampaignEndpoints['addressesDelete'];

export const listCalendars =
	calendars.list as ActiveCampaignEndpoints['calendarsList'];
export const getCalendar =
	calendars.get as ActiveCampaignEndpoints['calendarsGet'];
export const createCalendar =
	calendars.create as ActiveCampaignEndpoints['calendarsCreate'];
export const updateCalendar =
	calendars.update as ActiveCampaignEndpoints['calendarsUpdate'];
export const removeCalendar =
	calendars.remove as ActiveCampaignEndpoints['calendarsDelete'];

export const listEvents =
	eventTrackingEvents.list as ActiveCampaignEndpoints['eventTrackingEventsList'];
export const createEvent =
	eventTrackingEvents.create as ActiveCampaignEndpoints['eventTrackingEventsCreate'];
export const removeEvent =
	eventTrackingEvents.remove as ActiveCampaignEndpoints['eventTrackingEventsDelete'];

// ---------------------------------------------------------------------------
// GraphQL: products, bulk orders, recurring payments, browse sessions
// ---------------------------------------------------------------------------

/**
 * Runs a GraphQL document and unwraps the named field from `data`.
 *
 * The eComm GraphQL API answers 200 with an `errors` array rather than an HTTP
 * error status, so a GraphQL-level failure would otherwise pass silently
 * through the status-based error handlers. That is raised here instead.
 */
async function graphql<T>(
	ctx: {
		key: string;
		options: { account?: string };
		keys: { get_account: () => Promise<string | null | undefined> };
	},
	query: string,
	variables: Record<string, unknown>,
): Promise<T> {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignGraphQLRequest<{
		data?: T;
		errors?: Array<{ message?: string }>;
	}>(query, ctx.key, account, variables);

	if (response.errors?.length) {
		const detail = response.errors
			.map((e) => e.message ?? 'unknown error')
			.join('; ');
		throw new Error(`ActiveCampaign GraphQL error: ${detail}`);
	}
	return (response.data ?? {}) as T;
}

const PRODUCT_FIELDS =
	'id name description imageUrl productUrl price currency sku isVariant';

export const searchProducts: ActiveCampaignEndpoints['productsSearch'] = async (
	ctx,
	input,
) => {
	const data = await graphql<ActiveCampaignEndpointOutputs['productsSearch']>(
		ctx,
		`query SearchProducts($filter: ProductFilter, $limit: Int, $offset: Int) {
			products(filter: $filter, limit: $limit, offset: $offset) { ${PRODUCT_FIELDS} }
		}`,
		compactBody({
			filter: input.filter,
			limit: input.limit,
			offset: input.offset,
		}),
	);

	await logEventFromContext(
		ctx,
		'activecampaign.products.search',
		auditPayload(input, ['limit', 'offset']),
		'completed',
	);
	return data;
};

export const getProduct: ActiveCampaignEndpoints['productsGet'] = async (
	ctx,
	input,
) => {
	const data = await graphql<ActiveCampaignEndpointOutputs['productsGet']>(
		ctx,
		`query GetProduct($id: ID!) { product(id: $id) { ${PRODUCT_FIELDS} } }`,
		{ id: input.id },
	);

	await logEventFromContext(
		ctx,
		'activecampaign.products.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return data;
};

export const createProduct: ActiveCampaignEndpoints['productsCreate'] = async (
	ctx,
	input,
) => {
	const data = await graphql<ActiveCampaignEndpointOutputs['productsCreate']>(
		ctx,
		`mutation CreateProduct($input: CreateProductInput!) {
			createProduct(input: $input) { ${PRODUCT_FIELDS} }
		}`,
		{ input: compactBody({ ...input }) },
	);

	await logEventFromContext(
		ctx,
		'activecampaign.products.create',
		auditPayload(input, ['legacyConnectionId', 'sku', 'currency']),
		'completed',
	);
	return data;
};

export const updateProduct: ActiveCampaignEndpoints['productsUpdate'] = async (
	ctx,
	input,
) => {
	const data = await graphql<ActiveCampaignEndpointOutputs['productsUpdate']>(
		ctx,
		`mutation UpdateProduct($input: UpdateProductInput!) {
			updateProduct(input: $input) { ${PRODUCT_FIELDS} }
		}`,
		{ input: compactBody({ ...input }) },
	);

	await logEventFromContext(
		ctx,
		'activecampaign.products.update',
		auditPayload(input, ['id', 'legacyConnectionId', 'sku']),
		'completed',
	);
	return data;
};

export const removeProduct: ActiveCampaignEndpoints['productsDelete'] = async (
	ctx,
	input,
) => {
	const data = await graphql<ActiveCampaignEndpointOutputs['productsDelete']>(
		ctx,
		'mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) { id } }',
		{ id: input.id },
	);

	await logEventFromContext(
		ctx,
		'activecampaign.products.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return data;
};

export const upsertProductsBulk: ActiveCampaignEndpoints['productsUpsertBulk'] =
	async (ctx, input) => {
		const data = await graphql<
			ActiveCampaignEndpointOutputs['productsUpsertBulk']
		>(
			ctx,
			`mutation BulkUpsertProducts($input: BulkUpsertProductsInput!) {
				bulkUpsertProducts(input: $input) { id }
			}`,
			{ input: { products: input.products } },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.products.upsertBulk',
			{ productCount: input.products.length, fields: ['products'] },
			'completed',
		);
		return data;
	};

/**
 * Bulk order upsert. Orders are matched on `storeOrderId` within a connection.
 *
 * The async variant writes to the data store in the background and is what
 * ActiveCampaign recommends for any store of real volume; the synchronous one
 * is kept for callers that need the write confirmed before returning.
 */
function bulkUpsertOrders<
	K extends 'ordersUpsertBulk' | 'ordersUpsertBulkAsync',
>(mutation: string, event: string): ActiveCampaignEndpoints[K] {
	return (async (
		ctx: Parameters<ActiveCampaignEndpoints[K]>[0],
		input: { orders: unknown[] },
	) => {
		const data = await graphql<ActiveCampaignEndpointOutputs[K]>(
			ctx,
			`mutation UpsertOrders($input: ${mutation}Input!) {
				${mutation}(input: $input) { id }
			}`,
			{ input: { orders: input.orders } },
		);

		await logEventFromContext(
			ctx,
			event,
			{ orderCount: input.orders.length, fields: ['orders'] },
			'completed',
		);
		return data;
	}) as ActiveCampaignEndpoints[K];
}

export const upsertOrdersBulk = bulkUpsertOrders<'ordersUpsertBulk'>(
	'bulkUpsertOrders',
	'activecampaign.orders.upsertBulk',
);
export const upsertOrdersBulkAsync = bulkUpsertOrders<'ordersUpsertBulkAsync'>(
	'bulkUpsertOrdersAsync',
	'activecampaign.orders.upsertBulkAsync',
);

export const searchRecurringPayments: ActiveCampaignEndpoints['recurringPaymentsSearch'] =
	async (ctx, input) => {
		const data = await graphql<
			ActiveCampaignEndpointOutputs['recurringPaymentsSearch']
		>(
			ctx,
			`query SearchRecurringPayments($filter: RecurringPaymentFilter, $limit: Int, $offset: Int) {
				recurringPayments(filter: $filter, limit: $limit, offset: $offset) {
					id status currency amount
				}
			}`,
			compactBody({
				filter: input.filter,
				limit: input.limit,
				offset: input.offset,
			}),
		);

		await logEventFromContext(
			ctx,
			'activecampaign.recurringPayments.search',
			auditPayload(input, ['limit', 'offset']),
			'completed',
		);
		return data;
	};

export const upsertRecurringPaymentsBulk: ActiveCampaignEndpoints['recurringPaymentsUpsertBulk'] =
	async (ctx, input) => {
		const data = await graphql<
			ActiveCampaignEndpointOutputs['recurringPaymentsUpsertBulk']
		>(
			ctx,
			`mutation BulkUpsertRecurringPayments($input: BulkUpsertRecurringPaymentsInput!) {
				bulkUpsertRecurringPayments(input: $input) { id }
			}`,
			{ input: { recurringPayments: input.recurringPayments } },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.recurringPayments.upsertBulk',
			{
				paymentCount: input.recurringPayments.length,
				fields: ['recurringPayments'],
			},
			'completed',
		);
		return data;
	};

export const searchBrowseSessions: ActiveCampaignEndpoints['browseSessionsSearch'] =
	async (ctx, input) => {
		const data = await graphql<
			ActiveCampaignEndpointOutputs['browseSessionsSearch']
		>(
			ctx,
			`query SearchBrowseSessions($filter: BrowseSessionFilter!) {
				browseSessions(filter: $filter) { id status addedToCart }
			}`,
			{ filter: compactBody({ ...input }) },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.browseSessions.search',
			auditPayload(input, ['connectionId', 'status']),
			'completed',
		);
		return data;
	};

export const saveBrowseSession: ActiveCampaignEndpoints['browseSessionsSave'] =
	async (ctx, input) => {
		const data = await graphql<
			ActiveCampaignEndpointOutputs['browseSessionsSave']
		>(
			ctx,
			`mutation SaveBrowseSession($input: SaveBrowseSessionInput!) {
				saveBrowseSession(input: $input) { id status }
			}`,
			{ input: compactBody({ ...input }) },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.browseSessions.save',
			auditPayload(input, ['connectionId', 'status']),
			'completed',
		);
		return data;
	};

export const addBrowseSessionToCart: ActiveCampaignEndpoints['browseSessionsAddToCart'] =
	async (ctx, input) => {
		const data = await graphql<
			ActiveCampaignEndpointOutputs['browseSessionsAddToCart']
		>(
			ctx,
			`mutation AddBrowseSessionToCart($input: AddToCartInput!) {
				addBrowseSessionToCart(input: $input) { id addedToCart }
			}`,
			{ input: compactBody({ ...input }) },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.browseSessions.addToCart',
			auditPayload(input, ['connectionId']),
			'completed',
		);
		return data;
	};

// ---------------------------------------------------------------------------
// Tracking and account settings
// ---------------------------------------------------------------------------

/**
 * Site and event tracking status. Both are singleton settings rather than
 * collections, so neither takes an id.
 */
function trackingStatus<
	K extends 'trackingGetSiteStatus' | 'trackingGetEventStatus',
>(path: string, event: string): ActiveCampaignEndpoints[K] {
	return (async (ctx: Parameters<ActiveCampaignEndpoints[K]>[0]) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs[K]
		>(path, ctx.key, account, { method: 'GET' });

		await logEventFromContext(ctx, event, {}, 'completed');
		return response;
	}) as ActiveCampaignEndpoints[K];
}

export const getSiteTrackingStatus = trackingStatus<'trackingGetSiteStatus'>(
	'siteTracking',
	'activecampaign.tracking.getSiteStatus',
);
export const getEventTrackingStatus = trackingStatus<'trackingGetEventStatus'>(
	'eventTracking',
	'activecampaign.tracking.getEventStatus',
);

function setTrackingStatus<
	K extends 'trackingSetSiteStatus' | 'trackingSetEventStatus',
>(path: string, envelope: string, event: string): ActiveCampaignEndpoints[K] {
	return (async (
		ctx: Parameters<ActiveCampaignEndpoints[K]>[0],
		input: { enabled: boolean },
	) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs[K]
		>(path, ctx.key, account, {
			method: 'PUT',
			body: { [envelope]: { enabled: input.enabled } },
		});

		await logEventFromContext(
			ctx,
			event,
			auditPayload(input, ['enabled']),
			'completed',
		);
		return response;
	}) as ActiveCampaignEndpoints[K];
}

export const setSiteTrackingStatus = setTrackingStatus<'trackingSetSiteStatus'>(
	'siteTracking',
	'siteTracking',
	'activecampaign.tracking.setSiteStatus',
);
export const setEventTrackingStatus =
	setTrackingStatus<'trackingSetEventStatus'>(
		'eventTracking',
		'eventTracking',
		'activecampaign.tracking.setEventStatus',
	);

/**
 * Records a custom event against a contact.
 *
 * Event tracking uses a separate host and form encoding rather than the v3
 * JSON API, and needs the account's event key alongside the actor id. Both are
 * caller-supplied because neither is derivable from the API token.
 */
export const trackEvent: ActiveCampaignEndpoints['trackingTrackEvent'] = async (
	ctx,
	input,
) => {
	const body = new URLSearchParams({
		actid: input.actid,
		key: input.key,
		event: input.event,
		visit: JSON.stringify({ email: input.email }),
		...(input.eventdata !== undefined && { eventdata: input.eventdata }),
	});

	const res = await fetch('https://trackcmp.net/event', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body,
		signal: AbortSignal.timeout(20000),
	});
	if (!res.ok) {
		const body = await res.text();
		throw new ApiError(
			{ method: 'POST', url: 'https://trackcmp.net/event' },
			{
				url: 'https://trackcmp.net/event',
				ok: false,
				status: res.status,
				statusText: res.statusText,
				body,
			},
			`ActiveCampaign tracking request failed: ${res.status}`,
		);
	}
	const parsed =
		(await res.json()) as ActiveCampaignEndpointOutputs['trackingTrackEvent'];

	// The event name and contact email are caller data; only the outcome and
	// the field names are recorded.
	await logEventFromContext(
		ctx,
		'activecampaign.tracking.trackEvent',
		{ status: res.status, fields: ['actid', 'key', 'event', 'email'] },
		'completed',
	);
	return parsed;
};

export const listWhitelistedDomains: ActiveCampaignEndpoints['trackingListWhitelist'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['trackingListWhitelist']
		>('siteTrackingWhitelist', ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.tracking.listWhitelist',
			listAuditPayload(
				input,
				['limit', 'offset'],
				response.siteTrackingWhitelist?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

export const addWhitelistedDomain: ActiveCampaignEndpoints['trackingAddWhitelist'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['trackingAddWhitelist']
		>('siteTracking/whitelist', ctx.key, account, {
			method: 'POST',
			body: { siteTrackingWhitelist: { name: input.name } },
		});

		await logEventFromContext(
			ctx,
			'activecampaign.tracking.addWhitelist',
			auditPayload(input, ['name']),
			'completed',
		);
		return response;
	};

export const removeWhitelistedDomain: ActiveCampaignEndpoints['trackingRemoveWhitelist'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		await makeActiveCampaignRequest<unknown>(
			`siteTracking/whitelist/${input.id}`,
			ctx.key,
			account,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.tracking.removeWhitelist',
			auditPayload(input, ['id']),
			'completed',
		);
		return { id: input.id };
	};

// --- misc account settings --------------------------------------------------

export const getLoggedInUser: ActiveCampaignEndpoints['usersGetMe'] = async (
	ctx,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['usersGetMe']
	>('users/me', ctx.key, account, { method: 'GET' });

	await logEventFromContext(ctx, 'activecampaign.users.getMe', {}, 'completed');
	return response;
};

export const getUserByUsername: ActiveCampaignEndpoints['usersGetByUsername'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['usersGetByUsername']
		>(
			`users/username/${encodeURIComponent(input.username)}`,
			ctx.key,
			account,
			{
				method: 'GET',
			},
		);

		// The username identifies a person, so only the field name is logged.
		await logEventFromContext(
			ctx,
			'activecampaign.users.getByUsername',
			{ fields: ['username'] },
			'completed',
		);
		return response;
	};

export const listGroupLimits: ActiveCampaignEndpoints['groupLimitsList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['groupLimitsList']
		>('groupLimits', ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.groupLimits.list',
			listAuditPayload(
				input,
				['limit', 'offset'],
				response.groupLimits?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

export const listScores: ActiveCampaignEndpoints['scoresList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['scoresList']
	>('scores', ctx.key, account, {
		method: 'GET',
		query: buildPaginationQuery(input),
	});

	await logEventFromContext(
		ctx,
		'activecampaign.scores.list',
		listAuditPayload(input, ['limit', 'offset'], response.scores?.length ?? 0),
		'completed',
	);
	return response;
};

/**
 * Email activity is transactional and can be very large, so ActiveCampaign
 * expects a subscriber or deal filter. Neither is required by the API, but
 * omitting both degrades badly, so the input documents that.
 */
export const listEmailActivities: ActiveCampaignEndpoints['emailActivitiesList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['emailActivitiesList']
		>('emailActivities', ctx.key, account, {
			method: 'GET',
			query: {
				...buildPaginationQuery(input),
				...compactQuery({
					'filters[subscriberid]': input.subscriberid,
					'filters[dealId]': input.dealId,
				}),
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.emailActivities.list',
			listAuditPayload(
				input,
				['subscriberid', 'dealId', 'limit', 'offset'],
				response.emailActivities?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

export const getBranding: ActiveCampaignEndpoints['brandingsGet'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['brandingsGet']
	>(`brandings/${input.id}`, ctx.key, account, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'activecampaign.brandings.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

export const updateBranding: ActiveCampaignEndpoints['brandingsUpdate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['brandingsUpdate']
		>(`brandings/${input.id}`, ctx.key, account, {
			method: 'PUT',
			body: {
				branding: compactBody({
					siteName: input.siteName,
					siteLogo: input.siteLogo,
					favicon: input.favicon,
					copyright: input.copyright,
				}),
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.brandings.update',
			auditPayload(input, ['id']),
			'completed',
		);
		return response;
	};

export const updateConfig: ActiveCampaignEndpoints['configsUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['configsUpdate']
	>(`configs/${input.id}`, ctx.key, account, {
		method: 'PUT',
		body: { config: { value: input.value } },
	});

	await logEventFromContext(
		ctx,
		'activecampaign.configs.update',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

/** Custom object records, keyed either by internal id or by external id. */
export const upsertRecord: ActiveCampaignEndpoints['customObjectRecordsUpsert'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['customObjectRecordsUpsert']
		>(`customObjects/records/${input.schemaId}`, ctx.key, account, {
			method: 'POST',
			body: compactBody({
				externalId: input.externalId,
				fields: input.fields,
			}),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.customObjectRecords.upsert',
			auditPayload(input, ['schemaId', 'externalId']),
			'completed',
		);
		return response;
	};

export const listRecords: ActiveCampaignEndpoints['customObjectRecordsList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['customObjectRecordsList']
		>(`customObjects/records/${input.schemaId}`, ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.customObjectRecords.list',
			auditPayload(input, ['schemaId', 'limit', 'offset']),
			'completed',
		);
		return response;
	};

function recordByKey<
	K extends
		| 'customObjectRecordsGet'
		| 'customObjectRecordsGetByExternalId'
		| 'customObjectRecordsDelete'
		| 'customObjectRecordsDeleteByExternalId',
>(
	segment: 'id' | 'externalId',
	method: 'GET' | 'DELETE',
	event: string,
): ActiveCampaignEndpoints[K] {
	return (async (
		ctx: Parameters<ActiveCampaignEndpoints[K]>[0],
		input: { schemaId: string; id?: string; externalId?: string },
	) => {
		const account = await resolveAccount(ctx);
		const key = segment === 'id' ? input.id : input.externalId;
		if (typeof key !== 'string' || key.length === 0) {
			throw new Error(
				segment === 'id'
					? 'A custom object record id is required'
					: 'A custom object record externalId is required',
			);
		}
		const path =
			segment === 'id'
				? `customObjects/records/${input.schemaId}/${encodeURIComponent(key)}`
				: `customObjects/records/${input.schemaId}/externalid/${encodeURIComponent(key)}`;

		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs[K]
		>(path, ctx.key, account, { method });

		await logEventFromContext(
			ctx,
			event,
			auditPayload(input, ['schemaId', 'id', 'externalId']),
			'completed',
		);
		return method === 'DELETE'
			? ({
					schemaId: input.schemaId,
					...(segment === 'id' ? { id: key } : { externalId: key }),
				} as ActiveCampaignEndpointOutputs[K])
			: response;
	}) as ActiveCampaignEndpoints[K];
}

export const getRecord = recordByKey<'customObjectRecordsGet'>(
	'id',
	'GET',
	'activecampaign.customObjectRecords.get',
);
export const getRecordByExternalId =
	recordByKey<'customObjectRecordsGetByExternalId'>(
		'externalId',
		'GET',
		'activecampaign.customObjectRecords.getByExternalId',
	);
export const removeRecord = recordByKey<'customObjectRecordsDelete'>(
	'id',
	'DELETE',
	'activecampaign.customObjectRecords.delete',
);
export const removeRecordByExternalId =
	recordByKey<'customObjectRecordsDeleteByExternalId'>(
		'externalId',
		'DELETE',
		'activecampaign.customObjectRecords.deleteByExternalId',
	);

// ---------------------------------------------------------------------------
// SMS
//
// SMS lives under `sms/*` rather than the `smsBroadcasts` collection the
// naming elsewhere would suggest - confirmed against the live API on
// 2026-08-14. `sms/broadcasts/metrics` answered 503 on that account rather
// than 404, so the route exists but the service was unavailable; it is
// implemented and its shape is left unmodelled.
// ---------------------------------------------------------------------------

export const listSmsBroadcasts: ActiveCampaignEndpoints['smsBroadcastsList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['smsBroadcastsList']
		>('sms/broadcasts', ctx.key, account, {
			method: 'GET',
			query: {
				...buildPaginationQuery(input),
				...compactQuery({ name: input.name, status: input.status }),
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.smsBroadcasts.list',
			listAuditPayload(
				input,
				['limit', 'offset', 'status'],
				response.broadcasts?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

export const getSmsCredits: ActiveCampaignEndpoints['smsCreditsGet'] = async (
	ctx,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['smsCreditsGet']
	>('sms/credits', ctx.key, account, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'activecampaign.smsCredits.get',
		{},
		'completed',
	);
	return response;
};

export const getSmsMetricsSnapshot: ActiveCampaignEndpoints['smsBroadcastsGetSnapshot'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['smsBroadcastsGetSnapshot']
		>('sms/broadcasts/metrics/snapshot', ctx.key, account, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'activecampaign.smsBroadcasts.getSnapshot',
			{},
			'completed',
		);
		return response;
	};

export const createSmsMetricsSnapshot: ActiveCampaignEndpoints['smsBroadcastsCreateSnapshot'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['smsBroadcastsCreateSnapshot']
		>('sms/broadcasts/metrics/snapshot', ctx.key, account, {
			method: 'POST',
			body: { broadcastIds: input.broadcastIds },
		});

		await logEventFromContext(
			ctx,
			'activecampaign.smsBroadcasts.createSnapshot',
			{ broadcastCount: input.broadcastIds.length },
			'completed',
		);
		return response;
	};

export const getSmsMetrics: ActiveCampaignEndpoints['smsBroadcastsGetMetrics'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['smsBroadcastsGetMetrics']
		>('sms/broadcasts/metrics', ctx.key, account, {
			method: 'GET',
			query: compactQuery({ broadcastIds: input.broadcastIds?.join(',') }),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.smsBroadcasts.getMetrics',
			{ broadcastCount: input.broadcastIds?.length ?? 0 },
			'completed',
		);
		return response;
	};

export const getSmsFailures: ActiveCampaignEndpoints['smsBroadcastsGetFailures'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['smsBroadcastsGetFailures']
		>('sms/broadcasts/metrics/failures', ctx.key, account, {
			method: 'GET',
			query: compactQuery({
				broadcastId: input.broadcastId,
				startDate: input.startDate,
				endDate: input.endDate,
			}),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.smsBroadcasts.getFailures',
			auditPayload(input, ['broadcastId', 'startDate', 'endDate']),
			'completed',
		);
		return response;
	};

/**
 * Recipients of one SMS broadcast. Rows carry phone numbers, so only the
 * returned count reaches the event log.
 */
export const getSmsRecipients: ActiveCampaignEndpoints['smsBroadcastsGetRecipients'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['smsBroadcastsGetRecipients']
		>(`sms/broadcasts/${input.id}/recipients`, ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.smsBroadcasts.getRecipients',
			listAuditPayload(input, ['id', 'limit', 'offset'], 0),
			'completed',
		);
		return response;
	};

/**
 * The JavaScript snippet to embed for site tracking. Lives at
 * `siteTracking/code`, not the `siteTrackingCode` the naming would suggest.
 */
export const getSiteTrackingCode: ActiveCampaignEndpoints['trackingGetCode'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['trackingGetCode']
		>('siteTracking/code', ctx.key, account, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'activecampaign.tracking.getCode',
			{},
			'completed',
		);
		return response;
	};

// ---------------------------------------------------------------------------
// Late additions - routes confirmed on 2026-08-14 after an initial probe of a
// wrong path suggested they were unavailable.
// ---------------------------------------------------------------------------

/** SMS broadcast lists live at `sms/lists`, under the `lists` envelope. */
export const listSmsBroadcastLists: ActiveCampaignEndpoints['smsBroadcastListsList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['smsBroadcastListsList']
		>('sms/lists', ctx.key, account, {
			method: 'GET',
			query: {
				...buildPaginationQuery(input),
				...compactQuery({ name: input.name }),
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.smsBroadcastLists.list',
			listAuditPayload(input, ['limit', 'offset'], response.lists?.length ?? 0),
			'completed',
		);
		return response;
	};

export const removeAddressGroup: ActiveCampaignEndpoints['addressGroupsDelete'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		await makeActiveCampaignRequest<unknown>(
			`addressGroups/${input.id}`,
			ctx.key,
			account,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.addressGroups.delete',
			auditPayload(input, ['id']),
			'completed',
		);
		return { id: input.id };
	};

/**
 * Finds one order by the identifiers the source system knows it by.
 *
 * ActiveCampaign has no route taking a store order id directly, so the
 * collection is filtered on `externalid` within a connection, and an exact
 * comparison decides - the filter is not guaranteed to be exact.
 */
export const findOrder: ActiveCampaignEndpoints['ecomOrdersFind'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<{
		ecomOrders?: Array<{ externalid?: string }>;
	}>('ecomOrders', ctx.key, account, {
		method: 'GET',
		query: compactQuery({
			'filters[externalid]': input.storeOrderId,
			'filters[connectionid]': input.connectionId,
		}),
	});

	const match = (response.ecomOrders ?? []).find(
		(o) => o.externalid === input.storeOrderId,
	);

	await logEventFromContext(
		ctx,
		'activecampaign.ecomOrders.find',
		{
			connectionId: input.connectionId,
			matched: match !== undefined,
			fields: ['storeOrderId'],
		},
		'completed',
	);
	return {
		ecomOrder: match ?? null,
	} as ActiveCampaignEndpointOutputs['ecomOrdersFind'];
};

/**
 * Creates an order, or updates the existing one with the same store order id
 * within the connection.
 *
 * Lookup and write are separate requests, so concurrent calls for the same
 * connectionid and externalid can both miss and POST duplicates. Callers must
 * serialize those upserts, or use orders.upsertBulk which matches server-side.
 *
 * The lookup is a read, so a transport failure before the write is safe to
 * replay; the write half is listed as non-idempotent.
 */
export const upsertOrder: ActiveCampaignEndpoints['ecomOrdersUpsert'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);

	const found = await makeActiveCampaignRequest<{
		ecomOrders?: Array<{ id?: string; externalid?: string }>;
	}>('ecomOrders', ctx.key, account, {
		method: 'GET',
		query: compactQuery({
			'filters[externalid]': input.externalid,
			'filters[connectionid]': input.connectionid,
		}),
	});

	const existing = (found.ecomOrders ?? []).find(
		(o) => o.externalid === input.externalid,
	);

	const body = { ecomOrder: compactBody({ ...input }) };

	const response = existing?.id
		? await makeActiveCampaignRequest<
				ActiveCampaignEndpointOutputs['ecomOrdersUpsert']
			>(`ecomOrders/${existing.id}`, ctx.key, account, { method: 'PUT', body })
		: await makeActiveCampaignRequest<
				ActiveCampaignEndpointOutputs['ecomOrdersUpsert']
			>('ecomOrders', ctx.key, account, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'activecampaign.ecomOrders.upsert',
		{
			connectionid: input.connectionid,
			created: existing?.id === undefined,
			fields: ['externalid', 'email'],
		},
		'completed',
	);
	return response;
};

/** The product lines belonging to one order, filtered on the collection. */
export const listProductsForOrder: ActiveCampaignEndpoints['ecomOrderProductsListForOrder'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['ecomOrderProductsListForOrder']
		>('ecomOrderProducts', ctx.key, account, {
			method: 'GET',
			query: {
				...buildPaginationQuery(input),
				...compactQuery({ 'filters[orderid]': input.orderId }),
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.ecomOrderProducts.listForOrder',
			listAuditPayload(
				input,
				['orderId', 'limit', 'offset'],
				response.ecomOrderProducts?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

/**
 * Creates a reminder on a deal task.
 *
 * The route is `taskNotifications`, not the `taskReminders` the catalog name
 * suggests - confirmed 200 against a live account on 2026-08-14. `interval` is
 * minutes before the due date.
 */
export const createTaskReminder: ActiveCampaignEndpoints['taskRemindersCreate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['taskRemindersCreate']
		>('taskNotifications', ctx.key, account, {
			method: 'POST',
			body: {
				taskNotification: {
					dealTask: input.dealTask,
					interval: input.interval,
				},
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.taskReminders.create',
			auditPayload(input, ['dealTask', 'interval']),
			'completed',
		);
		return response;
	};

/**
 * Creates a child schema under a public parent schema.
 *
 * Posts to the same `customObjects/schemas` collection the other schema
 * operations use - that route is confirmed - with the parent identifiers
 * added. The child-specific body fields themselves are from the documentation
 * rather than a captured request, since the development account has no public
 * parent schema to create a child of.
 */
export const createChildSchema: ActiveCampaignEndpoints['customObjectSchemasCreateChild'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['customObjectSchemasCreateChild']
		>('customObjects/schemas', ctx.key, account, {
			method: 'POST',
			body: compactBody({
				parentId: input.parentId,
				applicationId: input.applicationId,
				slug: input.slug,
				name: input.name,
				description: input.description,
			}),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.customObjectSchemas.createChild',
			auditPayload(input, ['parentId', 'applicationId', 'slug']),
			'completed',
		);
		return response;
	};

/**
 * Aggregate bulk-import progress across all batches.
 *
 * ROUTE UNVERIFIED: `import/bulk_import/aggregate` and every variant tried
 * answered 404 on the development account, while `import/bulk_import` itself
 * answers 200. The path below follows the documented shape; see
 * UNVERIFIED_ROUTES in `segments-v2.ts` for the same caveat applied to the V2
 * segments surface.
 */
export const listImportAggregate: ActiveCampaignEndpoints['importsListAggregate'] =
	async (ctx) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['importsListAggregate']
		>('import/bulk_import/aggregate', ctx.key, account, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'activecampaign.imports.listAggregate',
			{},
			'completed',
		);
		return response;
	};

/**
 * Simulates a tracking event through the browse-session system, returning the
 * debug output that shows how a URL would be matched to a product.
 *
 * ROUTE UNVERIFIED: the mutation name follows the documented shape but could
 * not be exercised - the development account has no e-commerce connection.
 */
export const testTrackingEvent: ActiveCampaignEndpoints['browseSessionsTestEvent'] =
	async (ctx, input) => {
		const data = await graphql<
			ActiveCampaignEndpointOutputs['browseSessionsTestEvent']
		>(
			ctx,
			`mutation TestTrackingEvent($input: TestTrackingEventInput!) {
				testTrackingEvent(input: $input) { matched debug }
			}`,
			{ input: compactBody({ ...input }) },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.browseSessions.testEvent',
			auditPayload(input, ['connectionId']),
			'completed',
		);
		return data;
	};
