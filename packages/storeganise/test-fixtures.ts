// Fixtures built from responses the API actually sent (the public storefront
// endpoints of Storeganise's own demo instance) and from the objects the
// official help pages read.

/** A storage unit, as GET /api/v1/sites/{code}/units returned live. */
export const unit = {
	id: '5bd6e997fdacf000153b0658',
	siteId: '5bd6df7afdacf000153b060f',
	typeId: '5d69249f908780001720862c',
	name: '111',
	length: 10,
	width: 5,
	height: 8,
	measure: 'ft',
	floor: '1',
	defaultDeposit: 185,
	defaultPrice: 200,
};

/** A site, as GET /api/v1/sites/{code} returned live, plus the custom
 * fields the access-control guide stores credentials in. */
export const site = {
	id: '5bd6df7afdacf000153b060f',
	code: 'central',
	title: { en: 'Central' },
	customFields: { myAC_siteId: 'site-1' },
};

export const user = {
	id: '5bf48bd975970f170a8e42b7',
	email: 'john@example.com',
	firstName: 'John',
	lastName: 'Smith',
};

export const invoice = {
	id: '5d9f2c8bbf3e2c0017a4b1c2',
	siteId: '5bd6df7afdacf000153b060f',
};

/** A unit rental as the documented reads present it: with its unit, owner
 * and the custom fields access-control integrations write. */
export const rental = {
	id: '5d9f2c8bbf3e2c0017a4b1c3',
	unit,
	owner: user,
	customFields: { myAC_accessCode: '482913', myAC_overlocked: false },
};

/** A job, as the access-control guide reads it: job.result.siteId. */
export const job = {
	id: '5bf540e8d986a91cd713affe',
	type: 'unit_moveIn',
	result: { siteId: '5bd6df7afdacf000153b060f' },
};

/** An add-on, whose custom fields carry the operator credentials. */
export const addon = {
	id: '5bf48bd975970f170a8e42b8',
	customFields: { sgApiKey: 'addon-key' },
};

/** The documented error envelope, verified live on every admin route. */
export const unauthorized = {
	error: { type: 'Unauthorized', message: 'Not authorized' },
};

/** The documented webhook payload shape (help article 19). */
export const webhookPayload = {
	id: '5bf48bd975970f170a8e42b7',
	created: '2021-11-21T11:26:32.105Z',
	type: 'job.unit_moveIn.created',
	data: { jobId: '5bf540e8d986a91cd713affe' },
};
