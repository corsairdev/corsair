// Response bodies copied from the examples on https://moceanapi.com/docs,
// with made-up people and numbers. The 401 bodies were captured from the
// live API unauthenticated.

export const smsSent = {
	messages: [
		{ status: 0, receiver: '60123456789', msgid: 'cust20013050311050614001' },
		{ status: 0, receiver: '60198765432', msgid: 'cust20013050311050614002' },
	],
};

/** One failed receiver inside an otherwise accepted batch. */
export const smsPartiallyFailed = {
	messages: [
		{ status: 0, receiver: '60123456789', msgid: 'cust20013050311050614001' },
		{ status: 28, err_msg: 'Invalid+destination+number' },
	],
};

export const messageStatus = {
	status: 0,
	message_status: 1,
	msgid: 'cust20013050311050614001',
	credit_deducted: '1',
};

export const balance = { status: 0, value: 100.0 };

export const pricing = {
	status: 0,
	destinations: [
		{
			country: 'Default',
			operator: 'Default',
			mcc: 'Default',
			mnc: 'Default',
			price: '0.0100',
			currency: 'MYR',
		},
		{
			country: 'Malaysia',
			operator: 'Celcom',
			mcc: '502',
			mnc: '13,19',
			price: '0.0020',
			currency: 'MYR',
		},
	],
};

export const verifyRequested = {
	reqid: 'moceanq5672285037',
	status: 0,
	to: '60123456789',
	is_number_reachable: 'unknown',
};

export const verifyResent = {
	reqid: 'moceanq5672285037',
	status: 0,
	to: '60123456789',
	is_number_reachable: 'unknown',
	resend_number: '2',
};

export const verifyChecked = { reqid: 'moceanq5672285037', status: 0 };

export const lookupSync = {
	status: 0,
	msgid: 'test0412143224000022.0002',
	to: '60123456789',
	current_carrier: {
		country: 'MY',
		name: 'U Mobile',
		network_code: 50218,
		mcc: '502',
		mnc: '18',
	},
	original_carrier: {
		country: 'MY',
		name: 'Maxis Mobile',
		network_code: 50212,
		mcc: '502',
		mnc: '12',
	},
	ported: 'ported',
};

/** The async answer when mocean_nl_url is given: the result arrives later. */
export const lookupAsync = {
	status: 0,
	msgid: 'test0412143224000022.0002',
	to: '60123456789',
};

/** A 2xx body whose status says the request failed (JSON form). */
export const authFailedBody = { status: 1, err_msg: 'Authorization failed' };

export const verifyAuthFailedBody = {
	status: 2,
	err_msg: 'Invalid credentials were provided',
};

export const throttledBody = { status: 32, err_msg: 'Message throttled.' };

export const maintenanceBody = {
	status: 40,
	err_msg: 'System down for maintenance',
};

/** The 401 body the API answers with when JSON was not honoured. */
export const authFailedXml = `<?xml version="1.0"?>
<result>
<status>1</status><err_msg>Authorization+failed</err_msg></result>`;
