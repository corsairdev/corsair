/**
 * Shapes from the live API. The error envelope below is exactly what a probe
 * with a malformed key returned; the success envelopes follow the documented
 * `{ status, request, error_text }` form.
 */

/** A key that is not 32 characters, answered on HTTP 200. */
export const wrongKeyFormat = {
	status: 0,
	request: 'ERROR_WRONG_USER_KEY',
	error_text:
		"You've provided key parameter value in incorrect format, it should contain 32 symbols.",
};

export const keyDoesNotExist = {
	status: 0,
	request: 'ERROR_KEY_DOES_NOT_EXIST',
	error_text: 'Account does not exist',
};

/** A task that was accepted: `request` holds the task id. */
export const taskCreated = { status: 1, request: '734920165' };

export const taskNotReady = { status: 0, request: 'CAPCHA_NOT_READY' };

/** A solved reCAPTCHA: `request` holds the token. */
export const taskSolved = {
	status: 1,
	request: '03AGdBq26_abcdefghijklmnop',
};

/** A solved task created with `task: task`, which answers a solution object. */
export const taskSolvedWithSolution = {
	status: 1,
	request: 'OK',
	solution: {
		gRecaptchaResponse: '03AGdBq26_abcdefghijklmnop',
		token: null,
	},
};

export const unsolvable = {
	status: 0,
	request: 'ERROR_CAPTCHA_UNSOLVABLE',
	error_text: 'Captcha could not be solved',
};

export const zeroBalance = {
	status: 0,
	request: 'ERROR_ZERO_BALANCE',
	error_text: 'Account has zero balance',
};

export const noSlot = {
	status: 0,
	request: 'ERROR_NO_SLOT_AVAILABLE',
	error_text: 'No slot available at the moment',
};

export const badParameters = {
	status: 0,
	request: 'ERROR_BAD_PARAMETERS',
	error_text: 'One or more parameters are missing or wrong',
};

/** A balance answer: `request` holds the amount as a number. */
export const balance = { status: 1, request: 12.3456 };

/** A report acknowledgement. */
export const reported = { status: 1, request: 'OK' };
