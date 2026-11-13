import { operations } from './operations';

/** Runtime schemas are defined beside each fixed GraphQL operation. */
export const FlyEndpointInputSchemas = Object.fromEntries(
	Object.entries(operations).flatMap(([group, entries]) =>
		Object.entries(entries).map(([name, definition]) => [
			`${group}.${name}`,
			definition.input,
		]),
	),
);
export const FlyEndpointOutputSchemas = Object.fromEntries(
	Object.entries(operations).flatMap(([group, entries]) =>
		Object.entries(entries).map(([name, definition]) => [
			`${group}.${name}`,
			definition.output,
		]),
	),
);
