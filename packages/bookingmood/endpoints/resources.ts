export type EntityName =
	| 'organizations'
	| 'bookings'
	| 'products'
	| 'members'
	| 'contacts'
	| 'widgets'
	| 'calendar_events'
	| 'invoices'
	| 'payments';

export type Resource = {
	group: string;
	path: string;
	entity?: EntityName;
	list?: boolean;
	create?: boolean;
	update?: boolean;
	delete?: boolean;
};

/** Official PostgREST tables matching the Bookingmood API reference. */
export const RESOURCES = [
	{
		group: 'organizations',
		path: 'organizations',
		entity: 'organizations',
		list: true,
	},
	{
		group: 'bookings',
		path: 'bookings',
		entity: 'bookings',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'products',
		path: 'products',
		entity: 'products',
		list: true,
		create: true,
		update: true,
		delete: true,
	},
	{
		group: 'members',
		path: 'members',
		entity: 'members',
		list: true,
		delete: true,
	},
	{
		group: 'contacts',
		path: 'contacts',
		entity: 'contacts',
		list: true,
		create: true,
		update: true,
		delete: true,
	},
	{
		group: 'widgets',
		path: 'widgets',
		entity: 'widgets',
		list: true,
		create: true,
		update: true,
		delete: true,
	},
	{
		group: 'calendarEvents',
		path: 'calendar_events',
		entity: 'calendar_events',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'invoices',
		path: 'invoices',
		entity: 'invoices',
		list: true,
		delete: true,
	},
	{
		group: 'payments',
		path: 'payments',
		entity: 'payments',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'attributes',
		path: 'attributes',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'attributeOptions',
		path: 'attribute_options',
		list: true,
		update: true,
	},
	{
		group: 'bookingDetails',
		path: 'booking_details',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'bookingUpdates', path: 'booking_updates', list: true },
	{
		group: 'calendarEventNotes',
		path: 'calendar_event_notes',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'calendarEventUpdates', path: 'calendar_event_updates', list: true },
	{
		group: 'capacities',
		path: 'capacities',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'capacityGroupDeps',
		path: 'capacity_group_dependencies',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'capacityGroups',
		path: 'capacity_groups',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'contactBookings',
		path: 'contact_bookings',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'couponProducts',
		path: 'coupon_products',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'couponServices',
		path: 'coupon_services',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'couponUses',
		path: 'coupon_uses',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'coupons', path: 'coupons', list: true, update: true, delete: true },
	{
		group: 'externalCalendars',
		path: 'external_calendars',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'lineItemTaxes',
		path: 'line_item_taxes',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'lineItems',
		path: 'line_items',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'paddleSubscriptions', path: 'paddle_subscriptions', list: true },
	{
		group: 'permissions',
		path: 'permissions',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'pricingWidgets',
		path: 'pricing_widgets',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'productAttrOptions',
		path: 'product_attribute_options',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'productCalendarLogs', path: 'product_calendar_logs', list: true },
	{
		group: 'productReplyAddrs',
		path: 'product_reply_to_addresses',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'productServices',
		path: 'product_services',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'replyToAddresses',
		path: 'reply_to_addresses',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'reviewProducts',
		path: 'review_products',
		list: true,
		update: true,
		delete: true,
	},
	{
		group: 'reviewWidgetListings',
		path: 'review_widget_listings',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'reviewWidgets', path: 'review_widgets', list: true, update: true },
	{ group: 'reviews', path: 'reviews', list: true, update: true, delete: true },
	{ group: 'seasons', path: 'seasons', list: true },
	{
		group: 'services',
		path: 'services',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'siteListings', path: 'site_listings', list: true, update: true },
	{
		group: 'sitePages',
		path: 'site_pages',
		list: true,
		create: true,
		update: true,
		delete: true,
	},
	{ group: 'siteViews', path: 'site_views', list: true },
	{ group: 'sites', path: 'sites', list: true, update: true },
	{ group: 'taxes', path: 'taxes', list: true, update: true, delete: true },
	{ group: 'userProfiles', path: 'user_profiles', list: true, update: true },
	{ group: 'webhookNotifications', path: 'webhook_notifications', list: true },
	{
		group: 'webhooks',
		path: 'webhooks',
		list: true,
		update: true,
		delete: true,
	},
	{ group: 'widgetAnalytics', path: 'widget_analytics', list: true },
	{
		group: 'widgetListings',
		path: 'widget_listings',
		list: true,
		update: true,
		delete: true,
	},
] satisfies Resource[];
