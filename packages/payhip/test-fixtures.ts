/**
 * Response fixtures shaped after the examples in the Payhip API reference
 * (payhip.com/api-reference).
 */

export const authFail = {
	code: 'authentication_fail',
	message: 'failed to authenticate',
	success: false,
};

export const coupon = {
	amount_off: null,
	code: 'example123',
	collection_id: null,
	coupon_type: 'single',
	end_date: null,
	id: 1495522137,
	minimum_purchase_amount: null,
	notes: null,
	percent_off: 50,
	product_key: 'PtRJw',
	start_date: null,
	usage_limit: null,
};

export const couponsList = {
	data: {
		coupons: [coupon],
	},
};

export const licenseKey = {
	data: {
		enabled: true,
		product_link: 'mVT0',
		license_key: 'WTKP4-66NL5-HMKQW-GFSCZ',
		buyer_email: 'contact@payhip.com',
		uses: 0,
		product_name: 'Example Product',
		variant_name: 'Standard License',
		variant_id: '1556',
	},
};

export const disabledLicenseKey = {
	data: {
		...licenseKey.data,
		enabled: false,
	},
};

export const usedLicenseKey = {
	data: {
		...licenseKey.data,
		uses: 2,
	},
};

/** A license route's answer to an unknown key (live, 2026-11-21). */
export const licenseNotFound = { data: [], error: true };
