import { BORNEO_TOOL_RISK } from './operation-risk';
import {
	BORNEO_OPERATION_COUNT,
	BORNEO_OPERATION_IDS,
	BORNEO_OPERATIONS,
	BORNEO_TOOLKIT_VERSION,
} from './operations';

describe('Borneo operation inventory', () => {
	it('contains exactly 153 operations', () => {
		expect(BORNEO_OPERATION_COUNT).toBe(153);
		expect(BORNEO_OPERATION_IDS).toHaveLength(153);
	});

	it('contains no duplicate operation IDs or names', () => {
		expect(new Set(BORNEO_OPERATION_IDS).size).toBe(153);
		expect(
			new Set(BORNEO_OPERATIONS.map((operation) => operation.name)).size,
		).toBe(153);
	});

	it('pins the public Borneo toolkit version', () => {
		expect(BORNEO_TOOLKIT_VERSION).toBe('20260429_00');
	});

	it('classifies list and filter POST tools as read', () => {
		const readPostIds = [
			'BORNEO_POST_ACCOUNTS_WITH_FILTER_AND_SORT_OPTIONS',
			'BORNEO_POST_CLASSIFICATION_STATS',
			'BORNEO_POST_CONNECTOR_WITH_FILTERING_OPTIONS',
			'BORNEO_POST_CURRENT_DASHBOARD_USER',
			'BORNEO_POST_DISCOVERED_RECIPIENT_BY_ID',
			'BORNEO_POST_FILTERED_ACCESS_LOGS',
			'BORNEO_POST_LOG_AUDIT_RECORDS_WITH_FILTER_CRITERIA',
			'BORNEO_POST_RESOURCE_LINEAGE_FILTER',
			'BORNEO_POST_RESOURCE_STATS_WITH_DELETED_RESOURCES',
			'BORNEO_POST_SCAN_RESOURCE_STATUS',
		];

		for (const id of readPostIds) {
			const operation = BORNEO_OPERATIONS.find((entry) => entry.id === id);
			expect(operation?.riskLevel).toBe('read');
			expect(BORNEO_TOOL_RISK[id as keyof typeof BORNEO_TOOL_RISK]).toBe(
				'read',
			);
		}
	});

	it('classifies archive as destructive', () => {
		const operation = BORNEO_OPERATIONS.find(
			(entry) => entry.id === 'BORNEO_ARCHIVE_DISCOVERED_RECIPIENT',
		);

		expect(operation?.riskLevel).toBe('destructive');
		expect(BORNEO_TOOL_RISK.BORNEO_ARCHIVE_DISCOVERED_RECIPIENT).toBe(
			'destructive',
		);
	});

	it('keeps mutating POST tools as write', () => {
		expect(BORNEO_TOOL_RISK.BORNEO_POST_DASHBOARD_REPORT).toBe('write');
		expect(BORNEO_TOOL_RISK.BORNEO_POST_DATA_BREACH_INFORMATION).toBe('write');
		expect(BORNEO_TOOL_RISK.BORNEO_POST_SUPPORT_CHAT_QUERY).toBe('write');
	});

	it('keeps the transport risk map aligned with the operation inventory', () => {
		for (const operation of BORNEO_OPERATIONS) {
			expect(BORNEO_TOOL_RISK[operation.id]).toBe(operation.riskLevel);
		}

		expect(Object.keys(BORNEO_TOOL_RISK)).toHaveLength(153);
	});
});
