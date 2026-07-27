import { CanvaEndpointOutputSchemas } from './endpoints/types';

describe('Canva API response schemas', () => {
	it('validates designs list response from Canva docs example', () => {
		const result = CanvaEndpointOutputSchemas.designsList.parse({
			continuation:
				'RkFGMgXlsVTDbMd:MR3L0QjiaUzycIAjx0yMyuNiV0OildoiOwL0x32G4NjNu4FwtAQNxowUQNMMYN',
			items: [
				{
					id: 'DAFVztcvd9z',
					title: 'My summer holiday',
					owner: {
						user_id: 'auDAbliZ2rQNNOsUl5OLu',
						team_id: 'Oi2RJILTrKk0KRhRUZozX',
					},
					thumbnail: {
						width: 595,
						height: 335,
						url: 'https://document-export.canva.com/Vczz9/zF9vzVtdADc/2/thumbnail/0001.png?query',
					},
					urls: {
						edit_url: 'https://www.canva.com/api/design/example/edit',
						view_url: 'https://www.canva.com/api/design/example/view',
					},
					created_at: 1377396000,
					updated_at: 1692928800,
					page_count: 5,
					design_types: ['presentation'],
				},
			],
		});

		expect(result.items).toHaveLength(1);
		expect(result.items[0]?.id).toBe('DAFVztcvd9z');
		expect(result.items[0]?.owner.user_id).toBe('auDAbliZ2rQNNOsUl5OLu');
	});

	it('validates design get response from Canva docs example', () => {
		const result = CanvaEndpointOutputSchemas.designsGet.parse({
			design: {
				id: 'DAFVztcvd9z',
				title: 'My summer holiday',
				owner: {
					user_id: 'auDAbliZ2rQNNOsUl5OLu',
					team_id: 'Oi2RJILTrKk0KRhRUZozX',
				},
				thumbnail: {
					width: 595,
					height: 335,
					url: 'https://document-export.canva.com/Vczz9/zF9vzVtdADc/2/thumbnail/0001.png?query',
				},
				urls: {
					edit_url: 'https://www.canva.com/api/design/example/edit',
					view_url: 'https://www.canva.com/api/design/example/view',
				},
				created_at: 1377396000,
				updated_at: 1692928800,
				page_count: 5,
			},
		});

		expect(result.design.id).toBe('DAFVztcvd9z');
		expect(result.design.urls.view_url).toContain('/view');
	});

	it('validates asset get response shape', () => {
		const result = CanvaEndpointOutputSchemas.assetsGet.parse({
			asset: {
				type: 'image',
				id: 'Msd59349ff',
				name: 'My Awesome Upload',
				tags: ['image', 'holiday', 'best day ever'],
				created_at: 1377396000,
				updated_at: 1692928800,
				thumbnail: {
					width: 595,
					height: 335,
					url: 'https://document-export.canva.com/example/thumbnail.png?query',
				},
			},
		});

		expect(result.asset.type).toBe('image');
		expect(result.asset.tags).toContain('holiday');
	});

	it('validates folder create response shape', () => {
		const result = CanvaEndpointOutputSchemas.foldersCreate.parse({
			folder: {
				id: 'FAF2lZtloor',
				name: 'My awesome holiday',
				created_at: 1377396000,
				updated_at: 1692928800,
			},
		});

		expect(result.folder.id).toBe('FAF2lZtloor');
		expect(result.folder.name).toBe('My awesome holiday');
	});

	it('validates users me response shape', () => {
		const result = CanvaEndpointOutputSchemas.usersGetMe.parse({
			team_user: {
				user_id: 'auDAbliZ2rQNNOsUl5OLu',
				team_id: 'Oi2RJILTrKk0KRhRUZozX',
			},
		});

		expect(result.team_user.user_id).toBe('auDAbliZ2rQNNOsUl5OLu');
		expect(result.team_user.team_id).toBe('Oi2RJILTrKk0KRhRUZozX');
	});

	it('validates exports create in-progress response shape', () => {
		const result = CanvaEndpointOutputSchemas.exportsCreate.parse({
			job: {
				id: 'e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8',
				status: 'in_progress',
			},
		});

		expect(result.job.status).toBe('in_progress');
		expect(result.job.id).toBe('e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8');
	});

	it('validates exports create success response shape', () => {
		const result = CanvaEndpointOutputSchemas.exportsGet.parse({
			job: {
				id: 'e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8',
				status: 'success',
				urls: ['https://export-download.canva.com/example.pdf'],
			},
		});

		expect(result.job.status).toBe('success');
		expect(result.job.urls).toHaveLength(1);
	});
});
