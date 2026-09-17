import {
	DovetailChannel,
	DovetailContact,
	DovetailData,
	DovetailDataPoint,
	DovetailDoc,
	DovetailFile,
	DovetailFolder,
	DovetailHighlight,
	DovetailInsight,
	DovetailNote,
	DovetailProject,
	DovetailSchema,
	DovetailTag,
	DovetailTopic,
} from './schema';

describe('Dovetail schema', () => {
	it('declares a semver version', () => {
		expect(DovetailSchema.version).toBeDefined();
		expect(DovetailSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all 13 Dovetail entities', () => {
		expect(typeof DovetailSchema.entities).toBe('object');
		expect(DovetailSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(DovetailSchema.entities);
		expect(entityKeys).toContain('projects');
		expect(entityKeys).toContain('data');
		expect(entityKeys).toContain('docs');
		expect(entityKeys).toContain('insights');
		expect(entityKeys).toContain('notes');
		expect(entityKeys).toContain('channels');
		expect(entityKeys).toContain('topics');
		expect(entityKeys).toContain('dataPoints');
		expect(entityKeys).toContain('contacts');
		expect(entityKeys).toContain('folders');
		expect(entityKeys).toContain('files');
		expect(entityKeys).toContain('highlights');
		expect(entityKeys).toContain('tags');
	});

	it('validates channel and topic entities', () => {
		const channel = DovetailChannel.parse({
			id: 'chn_1',
			title: 'NPS Channel',
			content_type: 'NPS_FEEDBACK',
			project_category_id: 'cat_1',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(channel.id).toBe('chn_1');
		expect(channel.title).toBe('NPS Channel');

		const topic = DovetailTopic.parse({
			id: 'top_1',
			channel_id: 'chn_1',
			title: 'Usability Issues',
			description: 'Topics regarding UX bugs',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(topic.id).toBe('top_1');
		expect(topic.title).toBe('Usability Issues');

		const dataPoint = DovetailDataPoint.parse({
			id: 'dp_1',
			channel_id: 'chn_1',
			text: 'App crashed on login',
			timestamp: '2025-01-01T00:00:00Z',
			source_title: 'App Store',
			source_url: 'https://example.com/review/1',
			created_at: '2025-01-01T00:00:00Z',
		});
		expect(dataPoint.id).toBe('dp_1');
		expect(dataPoint.text).toBe('App crashed on login');
	});

	it('validates contact, folder, and file entities', () => {
		const contact = DovetailContact.parse({
			id: 'cnt_1',
			name: 'Jane Doe',
			email: 'jane@example.com',
			avatar_url: 'https://example.com/avatar.png',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(contact.name).toBe('Jane Doe');

		const folder = DovetailFolder.parse({
			id: 'fld_1',
			title: 'Quarterly Research',
			parent_folder_id: null,
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(folder.title).toBe('Quarterly Research');

		const file = DovetailFile.parse({
			id: 'fil_1',
			name: 'recording.mp4',
			size: 1048576,
			mime_type: 'video/mp4',
			status: 'ready',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(file.mime_type).toBe('video/mp4');
	});

	it('validates data, doc, insight, and note entities', () => {
		const data = DovetailData.parse({
			id: 'dat_1',
			project_id: 'prj_1',
			title: 'Customer Interview 1',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(data.id).toBe('dat_1');

		const doc = DovetailDoc.parse({
			id: 'doc_1',
			project_id: 'prj_1',
			title: 'Synthesis Doc',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(doc.id).toBe('doc_1');

		const insight = DovetailInsight.parse({
			id: 'ins_1',
			project_id: 'prj_1',
			title: 'Users struggle with navigation',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(insight.id).toBe('ins_1');
		expect(insight.title).toBe('Users struggle with navigation');

		const note = DovetailNote.parse({
			id: 'not_1',
			project_id: 'prj_1',
			title: 'Quick Scratchpad',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(note.id).toBe('not_1');
	});

	it('validates project, highlight, and tag entities', () => {
		const project = DovetailProject.parse({
			id: 'prj_1',
			title: 'Mobile App Redesign',
			folder_id: 'fld_1',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(project.title).toBe('Mobile App Redesign');

		const highlight = DovetailHighlight.parse({
			id: 'hl_1',
			project_id: 'prj_1',
			note_id: 'not_1',
			tag_id: 'tag_1',
			text: 'Checkout button was not visible',
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(highlight.text).toBe('Checkout button was not visible');

		const tag = DovetailTag.parse({
			id: 'tag_1',
			project_id: 'prj_1',
			title: 'Pain Point',
			color: '#FF0000',
			highlight_count: 5,
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-02T00:00:00Z',
		});
		expect(tag.title).toBe('Pain Point');
	});
});
