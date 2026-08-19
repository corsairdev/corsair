export const listOperations = () => 'mocked';
export const runReadonly = async (fn: () => any) => fn();
export class AuthMissingError extends Error {}
export class PermissionRequiredError extends Error {}
