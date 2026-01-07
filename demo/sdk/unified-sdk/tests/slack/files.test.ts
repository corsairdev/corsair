import { Slack } from '../slack-api';
import { FilesService } from '../../services/slack';
import { handleRateLimit, requireToken } from './setup';

describe('Slack.Files - Files API', () => {
	describe('Service class methods', () => {
		it('should have all file methods defined', () => {
			expect(typeof FilesService.filesInfo).toBe('function');
			expect(typeof FilesService.filesList).toBe('function');
			expect(typeof FilesService.filesUpload).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all file methods through facade', () => {
			expect(typeof Slack.Files.get).toBe('function');
			expect(typeof Slack.Files.list).toBe('function');
			expect(typeof Slack.Files.upload).toBe('function');
		});
	});

	describe('list', () => {
		it('should list files (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Files.list({
					count: 10,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(Array.isArray(response.files)).toBe(true);

				console.log('Files count:', response.files?.length);
				response.files?.slice(0, 5).forEach((file) => {
					console.log(`  ${file.name} (${file.id}) - ${file.filetype}`);
					console.log(`    Size: ${file.size} bytes`);
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should list files with filters (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Files.list({
					types: 'images',
					count: 5,
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);

				console.log('Image files count:', response.files?.length);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get file info (integration test)', async () => {
			if (requireToken()) return;

			try {
				const listResponse = await Slack.Files.list({ count: 1 });
				const fileId = listResponse.files?.[0]?.id;

				if (!fileId) {
					console.warn('No files available for testing');
					return;
				}

				const response = await Slack.Files.get({ file: fileId });

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.file).toBeDefined();
				expect(response.file?.id).toBe(fileId);

				console.log('File name:', response.file?.name);
				console.log('File type:', response.file?.filetype);
				console.log('File size:', response.file?.size);
				console.log('Created:', response.file?.created);
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should handle non-existent file', async () => {
			if (requireToken()) return;

			try {
				await Slack.Files.get({ file: 'FNONEXISTENT' });
				fail('Expected request to fail for non-existent file');
			} catch (error: any) {
				expect(error.body?.error || error.message).toContain('file_not_found');
				console.log('Correctly received error for non-existent file');
			}
		});
	});

	describe('upload', () => {
		it('should upload a text file (integration test)', async () => {
			if (requireToken()) return;

			try {
				const response = await Slack.Files.upload({
					content: 'Hello, this is a test file from automated tests.',
					filename: 'test-file.txt',
					title: 'Test File',
					filetype: 'text',
					initial_comment: 'Automated test upload',
				});

				expect(response).toBeDefined();
				expect(response.ok).toBe(true);
				expect(response.file).toBeDefined();

				console.log('Uploaded file:', response.file?.name);
				console.log('File ID:', response.file?.id);
			} catch (error: any) {
				if (error?.body?.error === 'no_file_data') {
					console.log('File upload requires channel - skipping');
					return;
				}
				await handleRateLimit(error);
			}
		});
	});
});
