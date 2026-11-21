import { makeZohoBooksRequest } from './client';
import { zohoBooksOperations } from './openapi';
import type { ZohoBooksRegion } from './schema/openapi-types';
import {
	isZohoBooksBinaryOutput,
	isZohoBooksJsonObject,
} from './schema/openapi-validation';

const accessToken = process.env.ZOHOBOOKS_ACCESS_TOKEN;
const configuredRegion = process.env.ZOHOBOOKS_REGION;
const supportedRegions: readonly string[] = [
	'us',
	'eu',
	'in',
	'au',
	'jp',
	'ca',
	'cn',
	'sa',
	'ae',
];

function isRegion(value: string | undefined): value is ZohoBooksRegion {
	return value !== undefined && supportedRegions.includes(value);
}

const region =
	configuredRegion === undefined
		? 'us'
		: isRegion(configuredRegion)
			? configuredRegion
			: undefined;

if (!accessToken) {
	console.warn(
		'Skipping Zoho Books live smoke test: set ZOHOBOOKS_ACCESS_TOKEN to run it; ZOHOBOOKS_REGION is optional and defaults to us.',
	);
} else if (!region) {
	console.warn(
		'Skipping Zoho Books live smoke test: ZOHOBOOKS_REGION must match a supported Books data center.',
	);
}

const liveTest = accessToken && region ? test : test.skip;

liveTest(
	'lists Zoho Books organizations with the configured data center',
	async () => {
		const operation = zohoBooksOperations.find(
			(candidate) => candidate.id === 'list_organizations',
		);
		if (!operation)
			throw new Error(
				'The documented organization listing operation is missing.',
			);
		const response = await makeZohoBooksRequest(
			{ key: accessToken ?? '', options: { region: region ?? 'us' } },
			operation,
			{},
		);
		if (isZohoBooksBinaryOutput(response))
			throw new Error('Organization discovery unexpectedly returned a file.');
		if (!isZohoBooksJsonObject(response))
			throw new Error('Organization discovery did not return a JSON object.');
		expect(isZohoBooksJsonObject(response)).toBe(true);
		expect(Array.isArray(response.organizations)).toBe(true);
	},
);
