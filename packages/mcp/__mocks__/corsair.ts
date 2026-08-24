import { AsyncLocalStorage } from 'node:async_hooks';

const readonlyScope = new AsyncLocalStorage<true>();

export const runReadonly = <T>(fn: () => T): T => {
	return readonlyScope.run(true, fn);
};

export class AuthMissingError extends Error {}
export class PermissionRequiredError extends Error {}
export class ReadonlyForbiddenError extends Error {
	constructor() {
		super('ReadonlyForbiddenError');
		this.name = 'ReadonlyForbiddenError';
	}
}

export const assertReadonlyAllowed = (_path: string, _type: string) => {
	if (readonlyScope.getStore()) {
		throw new ReadonlyForbiddenError();
	}
};

export const listOperations = (_corsair: any) => [];
