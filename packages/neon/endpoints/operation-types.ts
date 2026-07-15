import type { EndpointRiskLevel } from 'corsair/core';

export type NeonMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type NeonOperation = {
	key: string;
	group: string;
	name: string;
	method: NeonMethod;
	path: string;
	description: string;
	pathParams?: readonly string[];
	riskLevel: EndpointRiskLevel;
	irreversible?: boolean;
};
