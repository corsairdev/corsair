/**
 * API v2 bodies from 2Captcha's docs (https://2captcha.com/api-docs) and from
 * a no-key probe of api.2captcha.com (`keyDoesNotExist`).
 */

export const keyDoesNotExist = {
	errorId: 1,
	errorCode: 'ERROR_KEY_DOES_NOT_EXIST',
	errorDescription:
		'The API key is missing in your request or has incorrect format.',
};

export const taskCreated = { errorId: 0, taskId: 72345678901 };

export const taskProcessing = { errorId: 0, status: 'processing' };

export const taskReady = {
	errorId: 0,
	status: 'ready',
	solution: {
		gRecaptchaResponse: '03ADUVZw...UWxTAe6ncIa',
		token: '03ADUVZw...UWxTAe6ncIa',
	},
	cost: '0.00299',
	ip: '1.2.3.4',
	createTime: 1692863536,
	endTime: 1692863556,
	solveCount: 1,
};

export const unsolvable = {
	errorId: 12,
	errorCode: 'ERROR_CAPTCHA_UNSOLVABLE',
	errorDescription: 'Workers could not solve the Captcha',
};

export const zeroBalance = {
	errorId: 10,
	errorCode: 'ERROR_ZERO_BALANCE',
	errorDescription: "You don't have funds on your account",
};

export const noSlot = {
	errorId: 2,
	errorCode: 'ERROR_NO_SLOT_AVAILABLE',
	errorDescription: 'No slot available',
};

export const balance = { errorId: 0, balance: 0.93958 };

export const reported = { errorId: 0, status: 'success' };
