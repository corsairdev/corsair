export const FIREBERRY_RECORD_ROUTES = {
	account: {
		list: '/api/record/account',
		get: '/api/record/account/{id}',
		create: '/api/record/account',
		update: '/api/record/account/{id}',
		delete: '/api/record/account/{id}',
	},
	activitylog: {
		list: '/api/record/activitylog',
		get: '/api/record/activitylog/{id}',
		create: '/api/record/activitylog',
		update: '/api/record/activitylog/{id}',
		delete: '/api/record/activitylog/{id}',
	},
	asset: {
		list: '/api/record/accountproduct',
		get: '/api/record/accountproduct/{id}',
		create: '/api/record/accountproduct',
		update: '/api/record/accountproduct/{id}',
		delete: '/api/record/accountproduct/{id}',
	},
	article: {
		list: '/api/record/article',
		get: '/api/record/article/{id}',
		create: '/api/record/article',
		update: '/api/record/article/{id}',
		delete: '/api/record/article/{id}',
	},
	businessunit: {
		list: '/api/record/businessunit',
		get: '/api/record/businessunit/{id}',
		create: '/api/record/businessunit',
		update: '/api/record/businessunit/{id}',
		delete: '/api/record/businessunit/{id}',
	},
	campaign: {
		list: '/api/record/campaign',
		get: '/api/record/campaign/{id}',
		create: '/api/record/campaign',
		update: '/api/record/campaign/{id}',
		delete: '/api/record/campaign/{id}',
	},
	contact: {
		list: '/api/record/contact',
		get: '/api/record/contact/{id}',
		create: '/api/record/contact',
		update: '/api/record/contact/{id}',
		delete: '/api/record/contact/{id}',
	},
	competitor: {
		list: '/api/record/competitor',
		get: '/api/record/competitor/{id}',
		create: '/api/record/competitor',
		update: '/api/record/competitor/{id}',
		delete: '/api/record/competitor/{id}',
	},
	contract: {
		list: '/api/record/contract',
		get: '/api/record/contract/{id}',
		create: '/api/record/Contract',
		update: '/api/record/Contract/{id}',
		delete: '/api/record/contract/{id}',
	},
	creditInvoice: {
		list: '/api/record/invoicecredit',
		get: '/api/record/invoicecredit/{id}',
		create: '/api/record/invoicecredit',
		update: '/api/record/invoicecredit/{id}',
	},
	deliveryInvoice: {
		list: '/api/record/invoicedelivery',
		get: '/api/record/invoicedelivery/{id}',
		create: '/api/record/invoicedelivery',
		update: '/api/record/invoicedelivery/{id}',
	},
	draftInvoice: {
		list: '/api/record/invoicedraft',
		get: '/api/record/invoicedraft/{id}',
		create: '/api/record/invoicedraft',
		update: '/api/record/invoicedraft/{id}',
	},
	invoice: {
		list: '/api/record/invoiceno',
		get: '/api/record/invoiceno/{id}',
		create: '/api/record/invoiceno',
		update: '/api/record/invoiceno/{id}',
	},
	invoiceReceipt: {
		list: '/api/record/invoicereno',
		get: '/api/record/invoicereno/{id}',
		create: '/api/record/invoicereno',
		update: '/api/record/invoicereno/{id}',
	},
	meeting: {
		list: '/api/record/activity',
		get: '/api/record/activity/{id}',
		create: '/api/record/activity',
		update: '/api/record/activity/{id}',
		delete: '/api/record/activity/{id}',
	},
	note: {
		list: '/api/record/note',
		get: '/api/record/note/{id}',
		create: '/api/record/note',
		delete: '/api/record/note/{id}',
	},
	opportunity: {
		list: '/api/record/opportunity',
		get: '/api/record/opportunity/{id}',
		create: '/api/record/opportunity',
		update: '/api/record/opportunity/{id}',
		delete: '/api/record/opportunity/{id}',
	},
	order: {
		list: '/api/record/crmorder',
		get: '/api/record/crmorder/{id}',
		create: '/api/record/crmorder',
		update: '/api/record/crmorder/{id}',
	},
	orderItem: {
		list: '/api/record/crmorderitem',
		get: '/api/record/crmorderitem/{id}',
		create: '/api/record/crmorderitem',
		update: '/api/record/crmorderitem/{id}',
		delete: '/api/record/crmorderitem/{id}',
	},
	phoneCall: {
		list: '/api/record/calllog',
		get: '/api/record/calllog/{id}',
		create: '/api/record/calllog',
		update: '/api/record/calllog/{id}',
		delete: '/api/record/calllog/{id}',
	},
	product: {
		list: '/api/record/product',
		get: '/api/record/product/{id}',
		create: '/api/record/product',
		update: '/api/record/product/{id}',
		delete: '/api/record/product/{id}',
	},
	project: {
		list: '/api/record/project',
		get: '/api/record/project/{id}',
		create: '/api/record/project',
		update: '/api/record/project/{id}',
		delete: '/api/record/project/{id}',
	},
	receipt: {
		list: '/api/record/invoicereceipt',
		get: '/api/record/invoicereceipt/{id}',
		create: '/api/record/invoicereceipt',
		update: '/api/record/invoicereceipt/{id}',
	},
	task: {
		list: '/api/record/task',
		get: '/api/record/task/{id}',
		create: '/api/record/task',
		update: '/api/record/task/{id}',
		delete: '/api/record/task/{id}',
	},
	transaction: { list: '/api/record/invoice', get: '/api/record/invoice/{id}' },
	transactionItem: {
		list: '/api/record/transactionitem',
		get: '/api/record/transactionItem/{id}',
	},
	ticket: {
		list: '/api/record/cases',
		get: '/api/record/cases/{id}',
		create: '/api/record/cases',
		update: '/api/record/cases/{id}',
		delete: '/api/record/cases/{id}',
	},
	user: {
		list: '/api/record/crmuser',
		get: '/api/record/crmuser/{id}',
		update: '/api/record/crmuser/{id}',
	},
} as const;

export type FireberryRecordResource = keyof typeof FIREBERRY_RECORD_ROUTES;

export function isFireberryRecordResource(
	value: string,
): value is FireberryRecordResource {
	return Object.hasOwn(FIREBERRY_RECORD_ROUTES, value);
}

export function getFireberryRecordPath(
	resource: string,
	action: 'list' | 'get' | 'create' | 'update' | 'delete',
	id?: string,
): string {
	let template: string | undefined;
	if (isFireberryRecordResource(resource)) {
		const routes = FIREBERRY_RECORD_ROUTES[resource];
		if (action === 'list') template = routes.list;
		if (action === 'get') template = routes.get;
		if (action === 'create' && 'create' in routes) template = routes.create;
		if (action === 'update' && 'update' in routes) template = routes.update;
		if (action === 'delete' && 'delete' in routes) template = routes.delete;
	} else if (/^\d+$/.test(resource)) {
		if (action === 'list' || action === 'create') {
			template = `/api/record/${resource}`;
		} else {
			template = `/api/record/${resource}/{id}`;
		}
	}
	if (!template) {
		throw new Error(`Unsupported Fireberry ${action} operation for resource`);
	}
	return template.replace('{id}', encodeURIComponent(id ?? ''));
}
