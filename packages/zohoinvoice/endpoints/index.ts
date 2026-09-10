import { Customers, Estimates, Invoices, Items, Payments } from './resources';

export const Example = {
	get: Customers.get,
};

export { Customers, Estimates, Invoices, Items, Payments };

export * from './types';
