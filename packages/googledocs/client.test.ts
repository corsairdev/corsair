import { extractPlainText, findTab, listTabSummaries } from './client';
import type { Document } from './types';

const multiTabDocument: Document = {
	documentId: 'doc1',
	tabs: [
		{
			tabProperties: { tabId: 'a', title: 'First', index: 0 },
			documentTab: {
				body: {
					content: [
						{
							paragraph: {
								elements: [{ textRun: { content: 'alpha' } }],
							},
						},
					],
				},
			},
		},
		{
			tabProperties: { tabId: 'b', title: 'Second', index: 1 },
			documentTab: {
				body: {
					content: [
						{
							paragraph: {
								elements: [{ textRun: { content: 'beta' } }],
							},
						},
					],
				},
			},
		},
	],
};

describe('googledocs tab helpers', () => {
	it('findTab resolves by tabIndex on root tabs', () => {
		const tab = findTab(multiTabDocument, { tabIndex: 1 });
		expect(tab?.tabProperties?.tabId).toBe('b');
	});

	it('extractPlainText reads a single tab', () => {
		expect(extractPlainText(multiTabDocument, { tabId: 'b' })).toBe('beta');
	});

	it('extractPlainText concatenates all tabs when body is empty', () => {
		const text = extractPlainText(multiTabDocument, { allTabs: true });
		expect(text).toContain('alpha');
		expect(text).toContain('beta');
		expect(text).toContain('## First');
	});

	it('listTabSummaries walks nested tabs', () => {
		const doc: Document = {
			tabs: [
				{
					tabProperties: { tabId: 'root', title: 'Root', index: 0 },
					childTabs: [
						{
							tabProperties: {
								tabId: 'child',
								title: 'Child',
								index: 0,
								parentTabId: 'root',
								nestingLevel: 1,
							},
						},
					],
				},
			],
		};
		expect(listTabSummaries(doc)).toEqual([
			{ tabId: 'root', title: 'Root', index: 0 },
			{
				tabId: 'child',
				title: 'Child',
				index: 0,
				parentTabId: 'root',
				nestingLevel: 1,
			},
		]);
	});
});
