// Generated from the official D2L HTTP Routing Table and linked resource pages.
export type D2lRouteDefinition = {
	routeId: string;
	group: string;
	groupKey: string;
	operationKey: string;
	operationPath: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
	path: string;
	pathParams: readonly string[];
	queryParams: readonly string[];
	jsonParams: readonly string[];
	jsonParamDetails: readonly {
		name: string;
		type: string;
		required: boolean;
		repeatable: boolean;
		description: string;
	}[];
	formDetails: readonly {
		name: string;
		type: string;
		required: boolean;
		repeatable: boolean;
		description: string;
	}[];
	formFields: readonly string[];
	requiredFormFields: readonly string[];
	queryDetails: readonly {
		name: string;
		type: string;
		required: boolean;
		repeatable: boolean;
		description: string;
	}[];
	requiredQueryParams: readonly string[];
	oauthScopes: readonly string[];
	summary: string;
	doc: string;
	inputDescription: string;
	returnDescription: string;
	apiVersions: string;
	statusCodes: readonly number[];
	requestMode: 'json' | 'form' | 'multipart' | 'resumable';
	multipartFormat: 'form-data' | 'mixed';
	filePartNames: readonly string[];
	filesRequired: boolean;
	filePartNumbered: boolean;
	responseMode: 'json' | 'binary' | 'binary_or_json';
	coverageStatus:
		| 'excluded'
		| 'wrapper_only'
		| 'schema_audited'
		| 'transport_modeled'
		| 'transport_pending';
	coverageReason: string;
};

import { D2L_ROUTE_PART_1 } from './route-definitions-1';
import { D2L_ROUTE_PART_2 } from './route-definitions-2';

export const D2L_ROUTES: readonly D2lRouteDefinition[] = [
	...D2L_ROUTE_PART_1,
	...D2L_ROUTE_PART_2,
];

export function getD2lRoute(index: number): D2lRouteDefinition {
	const route = D2L_ROUTES[index];
	if (!route) throw new Error(`Unknown D2L route index ${index}.`);
	return route;
}
