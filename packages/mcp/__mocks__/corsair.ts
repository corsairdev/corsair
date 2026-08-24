let isReadonlyScopeActive = false;

export const runReadonly = async (fn: () => any) => {
	const prev = isReadonlyScopeActive;
	isReadonlyScopeActive = true;
	try {
		return await fn();
	} finally {
		isReadonlyScopeActive = prev;
	}
};

export class AuthMissingError extends Error {}
export class PermissionRequiredError extends Error {}
export class ReadonlyForbiddenError extends Error {
	constructor() {
		super('ReadonlyForbiddenError');
		this.name = 'ReadonlyForbiddenError';
	}
}

export const assertReadonlyAllowed = (path: string, type: string) => {
	if (isReadonlyScopeActive) {
		throw new ReadonlyForbiddenError();
	}
};

export const listOperations = (_corsair: any) => [];
