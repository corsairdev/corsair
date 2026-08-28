import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from potential root / demo / local locations
dotenv.config({ path: '.env' });
dotenv.config({ path: '../.env' });
dotenv.config({ path: '../../.env' });

import { betterproposals } from '@corsair-dev/betterproposals';
import { createCorsair } from 'corsair';

const apiKey =
	process.env.BETTER_PROPOSALS_API_KEY ||
	process.env.BETTERPROPOSALS_API_KEY ||
	process.env.BP_TOKEN ||
	process.env.BP_API_KEY;

if (!apiKey) {
	console.error(
		'FAIL: BETTER_PROPOSALS_API_KEY environment variable is not set.',
	);
	console.log('\nSummary:');
	console.log('Passed: 0');
	console.log('Failed: 1');
	console.log('Skipped: 19');
	process.exit(1);
}

const corsair = createCorsair({
	multiTenancy: false,
	plugins: [
		betterproposals({
			key: apiKey,
		}),
	],
});

interface TestResult {
	name: string;
	status: 'PASS' | 'FAIL' | 'SKIPPED';
	message?: string;
}

const results: TestResult[] = [];

function recordResult(
	name: string,
	status: 'PASS' | 'FAIL' | 'SKIPPED',
	message?: string,
) {
	results.push({ name, status, message });
	if (status === 'PASS') {
		console.log(`PASS ${name}`);
	} else if (status === 'SKIPPED') {
		console.log(`SKIPPED ${name}${message ? ` (${message})` : ''}`);
	} else {
		console.log(`FAIL ${name}${message ? `: ${message}` : ''}`);
	}
}

function sanitizeError(error: unknown): string {
	if (error instanceof Error) {
		let msg = error.message;
		if (apiKey) {
			msg = msg.split(apiKey).join('[REDACTED]');
		}
		return msg;
	}
	return String(error);
}

async function runLiveTests() {
	let sampleProposalId: string | number | undefined;
	let sampleTemplateId: string | number | undefined;
	let sampleQuoteId: string | number | undefined;
	let sampleCompanyId: string | number | undefined;
	let sampleCurrencyId: string | number | undefined;

	// 1. proposals.list
	try {
		const res = await corsair.betterproposals.api.proposals.list({
			page: 1,
			per_page: 5,
		});
		recordResult('proposals.list', 'PASS');
		if (res.data && res.data.length > 0 && res.data[0].ID) {
			sampleProposalId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('proposals.list', 'FAIL', sanitizeError(error));
	}

	// 2. proposals.getNew
	try {
		const res = await corsair.betterproposals.api.proposals.getNew({
			page: 1,
			per_page: 5,
		});
		recordResult('proposals.getNew', 'PASS');
		if (
			!sampleProposalId &&
			res.data &&
			res.data.length > 0 &&
			res.data[0].ID
		) {
			sampleProposalId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('proposals.getNew', 'FAIL', sanitizeError(error));
	}

	// 3. proposals.getOpened
	try {
		const res = await corsair.betterproposals.api.proposals.getOpened({
			page: 1,
			per_page: 5,
		});
		recordResult('proposals.getOpened', 'PASS');
		if (
			!sampleProposalId &&
			res.data &&
			res.data.length > 0 &&
			res.data[0].ID
		) {
			sampleProposalId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('proposals.getOpened', 'FAIL', sanitizeError(error));
	}

	// 4. proposals.getSent
	try {
		const res = await corsair.betterproposals.api.proposals.getSent({
			page: 1,
			per_page: 5,
		});
		recordResult('proposals.getSent', 'PASS');
		if (
			!sampleProposalId &&
			res.data &&
			res.data.length > 0 &&
			res.data[0].ID
		) {
			sampleProposalId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('proposals.getSent', 'FAIL', sanitizeError(error));
	}

	// 5. proposals.getSigned
	try {
		const res = await corsair.betterproposals.api.proposals.getSigned({
			page: 1,
			per_page: 5,
		});
		recordResult('proposals.getSigned', 'PASS');
		if (
			!sampleProposalId &&
			res.data &&
			res.data.length > 0 &&
			res.data[0].ID
		) {
			sampleProposalId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('proposals.getSigned', 'FAIL', sanitizeError(error));
	}

	// 6. proposals.getPaid
	try {
		const res = await corsair.betterproposals.api.proposals.getPaid({
			page: 1,
			per_page: 5,
		});
		recordResult('proposals.getPaid', 'PASS');
		if (
			!sampleProposalId &&
			res.data &&
			res.data.length > 0 &&
			res.data[0].ID
		) {
			sampleProposalId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('proposals.getPaid', 'FAIL', sanitizeError(error));
	}

	// 7. proposals.get
	if (sampleProposalId) {
		try {
			await corsair.betterproposals.api.proposals.get({
				proposal_id: sampleProposalId,
			});
			recordResult('proposals.get', 'PASS');
		} catch (error) {
			recordResult('proposals.get', 'FAIL', sanitizeError(error));
		}
	} else {
		recordResult('proposals.get', 'SKIPPED', 'No proposals found in account');
	}

	// 8. proposals.getCount
	try {
		await corsair.betterproposals.api.proposals.getCount({});
		recordResult('proposals.getCount', 'PASS');
	} catch (error) {
		recordResult('proposals.getCount', 'FAIL', sanitizeError(error));
	}

	// 9. templates.list
	try {
		const res = await corsair.betterproposals.api.templates.list({
			page: 1,
			per_page: 5,
		});
		recordResult('templates.list', 'PASS');
		if (res.data && res.data.length > 0 && res.data[0].ID) {
			sampleTemplateId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('templates.list', 'FAIL', sanitizeError(error));
	}

	// 10. templates.get
	if (sampleTemplateId) {
		try {
			await corsair.betterproposals.api.templates.get({
				template_id: sampleTemplateId,
			});
			recordResult('templates.get', 'PASS');
		} catch (error) {
			recordResult('templates.get', 'FAIL', sanitizeError(error));
		}
	} else {
		recordResult('templates.get', 'SKIPPED', 'No templates found in account');
	}

	// 11. documentTypes.list
	try {
		await corsair.betterproposals.api.documentTypes.list({
			page: 1,
			per_page: 5,
		});
		recordResult('documentTypes.list', 'PASS');
	} catch (error) {
		recordResult('documentTypes.list', 'FAIL', sanitizeError(error));
	}

	// 12. quotes.list
	try {
		const res = await corsair.betterproposals.api.quotes.list({
			page: 1,
			per_page: 5,
		});
		recordResult('quotes.list', 'PASS');
		if (res.data && res.data.length > 0 && res.data[0].ID) {
			sampleQuoteId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('quotes.list', 'FAIL', sanitizeError(error));
	}

	// 13. quotes.get
	if (sampleQuoteId) {
		try {
			await corsair.betterproposals.api.quotes.get({
				quote_id: sampleQuoteId,
			});
			recordResult('quotes.get', 'PASS');
		} catch (error) {
			recordResult('quotes.get', 'FAIL', sanitizeError(error));
		}
	} else {
		recordResult('quotes.get', 'SKIPPED', 'No quotes found in account');
	}

	// 14. companies.list
	try {
		const res = await corsair.betterproposals.api.companies.list({
			page: 1,
			per_page: 5,
		});
		recordResult('companies.list', 'PASS');
		if (res.data && res.data.length > 0 && res.data[0].ID) {
			sampleCompanyId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('companies.list', 'FAIL', sanitizeError(error));
	}

	// 15. companies.get
	if (sampleCompanyId) {
		try {
			await corsair.betterproposals.api.companies.get({
				company_id: sampleCompanyId,
			});
			recordResult('companies.get', 'PASS');
		} catch (error) {
			recordResult('companies.get', 'FAIL', sanitizeError(error));
		}
	} else {
		recordResult('companies.get', 'SKIPPED', 'No companies found in account');
	}

	// 16. currencies.list
	try {
		const res = await corsair.betterproposals.api.currencies.list({
			page: 1,
			per_page: 5,
		});
		recordResult('currencies.list', 'PASS');
		if (res.data && res.data.length > 0 && res.data[0].ID) {
			sampleCurrencyId = res.data[0].ID;
		}
	} catch (error) {
		recordResult('currencies.list', 'FAIL', sanitizeError(error));
	}

	// 17. currencies.get
	if (sampleCurrencyId) {
		try {
			await corsair.betterproposals.api.currencies.get({
				currency_id: sampleCurrencyId,
			});
			recordResult('currencies.get', 'PASS');
		} catch (error) {
			recordResult('currencies.get', 'FAIL', sanitizeError(error));
		}
	} else {
		recordResult('currencies.get', 'SKIPPED', 'No currencies found in account');
	}

	// 18. settings.get
	try {
		await corsair.betterproposals.api.settings.get({});
		recordResult('settings.get', 'PASS');
	} catch (error) {
		recordResult('settings.get', 'FAIL', sanitizeError(error));
	}

	// 19. settings.getBrand
	try {
		await corsair.betterproposals.api.settings.getBrand({});
		recordResult('settings.getBrand', 'PASS');
	} catch (error) {
		recordResult('settings.getBrand', 'FAIL', sanitizeError(error));
	}

	// 20. settings.listMergeTags
	try {
		await corsair.betterproposals.api.settings.listMergeTags({
			page: 1,
			per_page: 5,
		});
		recordResult('settings.listMergeTags', 'PASS');
	} catch (error) {
		recordResult('settings.listMergeTags', 'FAIL', sanitizeError(error));
	}

	// Summary
	const passed = results.filter((r) => r.status === 'PASS').length;
	const failed = results.filter((r) => r.status === 'FAIL').length;
	const skipped = results.filter((r) => r.status === 'SKIPPED').length;

	console.log('\nSummary:');
	console.log(`Passed: ${passed}`);
	console.log(`Failed: ${failed}`);
	console.log(`Skipped: ${skipped}`);

	if (failed > 0) {
		process.exitCode = 1;
	}
}

runLiveTests().catch((err) => {
	console.error('Fatal execution error:', sanitizeError(err));
	process.exit(1);
});
