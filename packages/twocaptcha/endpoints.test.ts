import { z } from 'zod';
import { TwoCaptchaEndpointOutputSchemas } from './endpoints/types';
import {
	balance,
	reported,
	taskCreated,
	taskNotReady,
	taskSolved,
	taskSolvedWithSolution,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a created task whose request is the task id', () => {
		const parsed =
			TwoCaptchaEndpointOutputSchemas.createTask.parse(taskCreated);
		expect(parsed.status).toBe(1);
		expect(parsed.request).toBe('734920165');
	});

	it('parses a balance answer whose request is a number', () => {
		const parsed = TwoCaptchaEndpointOutputSchemas.getBalance.parse(balance);
		expect(parsed.status).toBe(1);
		expect(parsed.request).toBe(12.3456);
	});

	it('parses the not-ready answer without losing it', () => {
		const parsed =
			TwoCaptchaEndpointOutputSchemas.getTaskResult.parse(taskNotReady);
		expect(parsed.status).toBe(0);
		expect(parsed.request).toBe('CAPCHA_NOT_READY');
	});

	it('parses a solved token', () => {
		const parsed =
			TwoCaptchaEndpointOutputSchemas.getTaskResult.parse(taskSolved);
		expect(parsed.status).toBe(1);
		expect(parsed.request).toBe('03AGdBq26_abcdefghijklmnop');
	});

	it('parses a task answer that carries a solution object', () => {
		const parsed = TwoCaptchaEndpointOutputSchemas.getTaskResult.parse(
			taskSolvedWithSolution,
		);
		expect(parsed.solution?.gRecaptchaResponse).toBe(
			'03AGdBq26_abcdefghijklmnop',
		);
	});

	it('keeps snake_case: the field is error_text, not errorText', () => {
		const parsed = TwoCaptchaEndpointOutputSchemas.createTask.parse({
			status: 0,
			request: 'ERROR_ZERO_BALANCE',
			error_text: 'Account has zero balance',
		});
		expect(parsed.error_text).toBe('Account has zero balance');
		expect(parsed).not.toHaveProperty('errorText');
	});

	it('parses a report acknowledgement', () => {
		const parsed =
			TwoCaptchaEndpointOutputSchemas.reportCorrect.parse(reported);
		expect(parsed.status).toBe(1);
		expect(parsed.request).toBe('OK');
	});

	it('parses an envelope whose request is null', () => {
		const parsed = TwoCaptchaEndpointOutputSchemas.reportCorrect.parse({
			status: 0,
			request: null,
			error_text: 'bad task id',
		});
		expect(parsed.request).toBeNull();
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects an envelope with no status', () => {
		expect(() =>
			TwoCaptchaEndpointOutputSchemas.createTask.parse({ request: '1' }),
		).toThrow(z.ZodError);
	});

	it('rejects a status sent as the string "1"', () => {
		expect(() =>
			TwoCaptchaEndpointOutputSchemas.getBalance.parse({
				status: '1',
				request: 1,
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a request that is an object', () => {
		expect(() =>
			TwoCaptchaEndpointOutputSchemas.getBalance.parse({
				status: 1,
				request: { amount: 1 },
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a solution that is a string', () => {
		expect(() =>
			TwoCaptchaEndpointOutputSchemas.getTaskResult.parse({
				status: 1,
				request: 'OK',
				solution: 'token',
			}),
		).toThrow(z.ZodError);
	});
});
