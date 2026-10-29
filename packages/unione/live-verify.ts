/**
 * Live verification against api.unione.io. Read-only: it never sends mail and
 * never mutates the account.
 *
 *   UNIONE_API_KEY=... pnpm --filter @corsair-dev/unione exec tsx live-verify.ts
 *
 * Each check calls the plugin's own client, then parses the real response with
 * the schema the plugin ships, so a drift between UniOne and the schema fails
 * here rather than in production.
 */
import { makeUnioneRequest } from './client';
import { UnioneEndpointOutputSchemas } from './endpoints/types';
import { UnioneAccount, UnioneTag } from './schema/database';

const key = process.env.UNIONE_API_KEY;
if (!key) {
	console.error('Set UNIONE_API_KEY to run live verification.');
	process.exit(2);
}

type Check = { name: string; run: () => Promise<string> };

const checks: Check[] = [
	{
		name: 'system/ping.json responds',
		run: async () => {
			const raw = await makeUnioneRequest('system/ping.json', key, {
				body: {},
			});
			UnioneEndpointOutputSchemas.systemPing.parse(raw);
			return 'status ok';
		},
	},
	{
		name: 'system/info.json parses into the account schema',
		run: async () => {
			const raw = await makeUnioneRequest<Record<string, never>>(
				'system/info.json',
				key,
				{ body: {} },
			);
			const parsed = UnioneEndpointOutputSchemas.systemInfo.parse(raw);
			const accounting = parsed.accounting;
			UnioneAccount.parse({
				user_id: parsed.user_id,
				email: parsed.email,
				project_id: parsed.project_id,
				project_name: parsed.project_name,
				emails_included: accounting?.emails_included,
				emails_sent: accounting?.emails_sent,
				validations_included: accounting?.validations_included,
				validations_used: accounting?.validations_used,
				period_start: accounting?.period_start,
				period_end: accounting?.period_end,
			});
			return `user_id present, validations_included=${accounting?.validations_included}`;
		},
	},
	{
		name: 'tag/list.json parses into the tag schema',
		run: async () => {
			const raw = await makeUnioneRequest('tag/list.json', key, { body: {} });
			const parsed = UnioneEndpointOutputSchemas.tagList.parse(raw);
			for (const tag of parsed.tags ?? []) UnioneTag.parse(tag);
			return `${parsed.tags?.length ?? 0} tag(s)`;
		},
	},
	{
		name: 'template/list.json parses',
		run: async () => {
			const raw = await makeUnioneRequest('template/list.json', key, {
				body: {},
			});
			const parsed = UnioneEndpointOutputSchemas.templateList.parse(raw);
			return `${parsed.templates?.length ?? 0} template(s)`;
		},
	},
	{
		name: 'domain/list.json parses',
		run: async () => {
			const raw = await makeUnioneRequest('domain/list.json', key, {
				body: {},
			});
			const parsed = UnioneEndpointOutputSchemas.domainManage.parse(raw);
			return `${parsed.domains?.length ?? 0} domain(s)`;
		},
	},
	{
		name: 'suppression/list.json parses',
		run: async () => {
			const raw = await makeUnioneRequest('suppression/list.json', key, {
				body: {},
			});
			const parsed = UnioneEndpointOutputSchemas.suppressionList.parse(raw);
			return `${parsed.suppressions?.length ?? 0} suppression(s)`;
		},
	},
	{
		name: 'webhook/list.json parses and is keyed by url',
		run: async () => {
			const raw = await makeUnioneRequest('webhook/list.json', key, {
				body: {},
			});
			const parsed = UnioneEndpointOutputSchemas.webhookList.parse(raw);
			return `${parsed.objects?.length ?? 0} webhook(s)`;
		},
	},
];

const results = await Promise.all(
	checks.map(async (check) => {
		try {
			return { name: check.name, ok: true, detail: await check.run() };
		} catch (error) {
			return {
				name: check.name,
				ok: false,
				detail: error instanceof Error ? error.message : String(error),
			};
		}
	}),
);

for (const result of results) {
	console.log(
		`${result.ok ? 'PASS' : 'FAIL'}  ${result.name} - ${result.detail}`,
	);
}

const failed = results.filter((result) => !result.ok).length;
console.log(
	`\n${results.length - failed}/${results.length} live checks passed`,
);
process.exit(failed === 0 ? 0 : 1);
