// Bodies captured from the live Mocean API on 11-24 (trial account) where
// the route could be called for free; the send and call bodies are the
// examples on https://moceanapi.com/docs with made-up numbers.

export const smsSent = {
	messages: [
		{ status: 0, receiver: '60123456789', msgid: 'cust20013050311050614001' },
		{ status: 28, err_msg: 'Invalid+destination+number' },
	],
};

/** Live: an unknown msgid answers status 0 with message_status 5. */
export const messageStatus = {
	status: 0,
	message_status: 5,
	msgid: 'nonexistent123',
	credit_deducted: 0.0,
};

/** Live: the trial account's balance. */
export const balance = { status: 0, value: 20.0 };

/** Live: prices come back as numbers although the reference says strings. */
export const pricing = {
	status: 0,
	destinations: [
		{
			country: 'Default',
			operator: 'Default',
			mcc: 'Default',
			mnc: 'Default',
			price: 1.0,
			currency: 'CREDIT',
		},
	],
};

export const verifySent = {
	reqid: 'CPASS_restapi_C0000002737000000.0002',
	status: 0,
	to: '60123456789',
	is_number_reachable: 'reachable',
};

export const verifyChecked = {
	reqid: 'CPASS_restapi_C0000002737000000.0002',
	status: 0,
};

export const lookup = {
	status: 0,
	msgid: 'CPASS_restapi_C0000002737000000.0002',
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

export const callStarted = {
	calls: [
		{
			status: 0,
			receiver: '60123456789',
			session_uuid: 'xxx-xxx-xxx-xxx',
			call_uuid: 'xxx-xxx-xxx-xxx',
		},
	],
};

export const hungUp = {
	status: 0,
	session_uuid: 'xxx-xxx-xxx-xxx',
	call_uuid: 'xxx-xxx-xxx-xxx',
};

export const whatsappSent = {
	status: 0,
	message_id: 'd2eaf858-1b0e-11ee-a06f-891a3eb010d6',
};

export const template = {
	id: '5653923468721315',
	name: 'mocean_template_example',
	language: 'en_US',
	category: 'UTILITY',
	status: 'APPROVED',
	components: [{ type: 'BODY', text: 'Your order {{1}} is ready' }],
};
