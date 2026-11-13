import { logEventFromContext } from 'corsair/core';
import { makeGigasheetRequest } from './client';
import { Datasets, Exports, Rows, Upload, User, Views } from './endpoints';
import type { GigasheetContext } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeGigasheetRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const mockRequest = jest.mocked(makeGigasheetRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

// `unknown` because mock plugin context only needs minimum fields used by endpoints.
const mockCtx = {
	key: 'test-api-key',
	authType: 'api_key',
} as unknown as GigasheetContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockReset();
});

describe('Gigasheet Endpoints', () => {
	// --------------------------------------------------------------------------
	// User Endpoints
	// --------------------------------------------------------------------------
	describe('user.whoami', () => {
		it('calls GET /user/whoami and parses output', async () => {
			mockRequest.mockResolvedValue({
				username: 'testuser',
				authenticated: true,
			});

			const res = await User.whoami(mockCtx, {});

			expect(mockRequest).toHaveBeenCalledWith('/user/whoami', 'test-api-key', {
				method: 'GET',
			});
			expect(res).toEqual({ username: 'testuser', authenticated: true });
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.user.whoami',
				{ authenticated: true },
				'completed',
			);
		});

		it('allows keyless call when ctx.key is empty', async () => {
			// `unknown` because keyless context has empty key string.
			const unauthCtx = { key: '' } as unknown as GigasheetContext;
			mockRequest.mockResolvedValue({ username: '', authenticated: false });

			const res = await User.whoami(unauthCtx, {});

			expect(mockRequest).toHaveBeenCalledWith('/user/whoami', undefined, {
				method: 'GET',
			});
			expect(res.authenticated).toBe(false);
		});
	});

	describe('user.getDetails', () => {
		it('calls GET /user/details and parses output', async () => {
			mockRequest.mockResolvedValue({
				id: 'usr_123',
				username: 'testuser',
				email: 'test@example.com',
			});

			const res = await User.getDetails(mockCtx, {});

			expect(mockRequest).toHaveBeenCalledWith(
				'/user/details',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res.id).toBe('usr_123');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.user.getDetails',
				{ hasUser: true },
				'completed',
			);
		});
	});

	describe('user.getSpaceUsed', () => {
		it('calls GET /user/space-used and parses integer response', async () => {
			mockRequest.mockResolvedValue(1048576);

			const res = await User.getSpaceUsed(mockCtx, {});

			expect(mockRequest).toHaveBeenCalledWith(
				'/user/space-used',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res).toEqual({ bytesUsed: 1048576 });
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.user.getSpaceUsed',
				{ bytesUsed: 1048576 },
				'completed',
			);
		});

		it('parses object response with bytesUsed property', async () => {
			mockRequest.mockResolvedValue({ bytesUsed: 2048 });

			const res = await User.getSpaceUsed(mockCtx, {});
			expect(res).toEqual({ bytesUsed: 2048 });
		});

		it('throws GigasheetAPIError when provider returns unrecognized response shape', async () => {
			mockRequest.mockResolvedValue('invalid string data');

			await expect(User.getSpaceUsed(mockCtx, {})).rejects.toThrow(
				'Invalid response format from /user/space-used',
			);
		});
	});

	describe('user.getEnrichmentCredits', () => {
		it('calls GET /user/enrichment-credits and parses output', async () => {
			mockRequest.mockResolvedValue({ Limit: 1000, Used: 250 });

			const res = await User.getEnrichmentCredits(mockCtx, {});

			expect(mockRequest).toHaveBeenCalledWith(
				'/user/enrichment-credits',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res).toEqual({ Limit: 1000, Used: 250 });
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.user.getEnrichmentCredits',
				{ used: 250, limit: 1000 },
				'completed',
			);
		});
	});

	// --------------------------------------------------------------------------
	// Upload Endpoints
	// --------------------------------------------------------------------------
	describe('upload.fromUrl', () => {
		it('calls POST /upload/url and parses output', async () => {
			mockRequest.mockResolvedValue({
				Handle: 'handle_url_123',
				Message: 'File entry created',
				Success: true,
			});

			const res = await Upload.fromUrl(mockCtx, {
				url: 'https://example.com/dataset.csv',
				name: 'Test_Dataset',
			});

			expect(mockRequest).toHaveBeenCalledWith('/upload/url', 'test-api-key', {
				method: 'POST',
				body: {
					url: 'https://example.com/dataset.csv',
					name: 'Test_Dataset',
				},
			});
			expect(res.Handle).toBe('handle_url_123');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.upload.fromUrl',
				{ handle: 'handle_url_123' },
				'completed',
			);
		});

		it('rejects invalid URL before network call', async () => {
			// `unknown` because caught rejection has untyped error signature.
			const err = await Upload.fromUrl(mockCtx, {
				// `unknown` because deliberately passing invalid type to verify runtime Zod gate.
				url: 'not-a-valid-url',
				name: 'Test_Dataset',
			} as unknown as { url: string; name: string }).catch(
				(caught: unknown) => caught,
			);

			expect(err).toBeDefined();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('upload.direct', () => {
		it('calls POST /upload/direct and parses output', async () => {
			mockRequest.mockResolvedValue({
				Handle: 'handle_direct_123',
				Message: 'Upload processed',
				Success: true,
			});

			const res = await Upload.direct(mockCtx, {
				name: 'file.csv',
				contents: 'Y29sMSxjb2wyCjEsMgo=',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/upload/direct',
				'test-api-key',
				{
					method: 'POST',
					body: {
						name: 'file.csv',
						contents: 'Y29sMSxjb2wyCjEsMgo=',
					},
				},
			);
			expect(res.Handle).toBe('handle_direct_123');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.upload.direct',
				{ handle: 'handle_direct_123' },
				'completed',
			);
		});
	});

	// --------------------------------------------------------------------------
	// Datasets Endpoints
	// --------------------------------------------------------------------------
	describe('datasets.get', () => {
		it('calls GET /dataset/{handle} with encoded handle', async () => {
			mockRequest.mockResolvedValue({
				FileUuid: 'sheet/123?raw=true',
				FileName: 'sample.csv',
				Status: 'processed',
				FileRows: 50,
			});

			const res = await Datasets.get(mockCtx, {
				handle: 'sheet/123?raw=true',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				`/dataset/${encodeURIComponent('sheet/123?raw=true')}`,
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res.Status).toBe('processed');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.datasets.get',
				{ handle: 'sheet/123?raw=true', status: 'processed' },
				'completed',
			);
		});

		it('rejects empty handle before network call', async () => {
			// `unknown` because rejection type is untrusted.
			const err = await Datasets.get(mockCtx, {
				handle: '',
			}).catch((caught: unknown) => caught);

			expect(err).toBeDefined();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('datasets.delete', () => {
		it('calls DELETE /delete/{handle} with encoded handle and query', async () => {
			mockRequest.mockResolvedValue({
				Success: true,
				Message: 'Sheet deleted',
			});

			const res = await Datasets.delete(mockCtx, {
				handle: 'sheet_to_delete',
				recursive: true,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/delete/sheet_to_delete',
				'test-api-key',
				{
					method: 'DELETE',
					query: { recursive: true },
				},
			);
			expect(res.Success).toBe(true);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.datasets.delete',
				{ handle: 'sheet_to_delete', success: true },
				'completed',
			);
		});
	});

	describe('datasets.getColumns', () => {
		it('calls GET /dataset/{handle}/columns with query parameters', async () => {
			mockRequest.mockResolvedValue([
				{ Id: 'A', Name: 'First Name', FieldType: 'string' },
				{ Id: 'B', Name: 'Age', FieldType: 'number' },
			]);

			const res = await Datasets.getColumns(mockCtx, {
				handle: 'sheet_col_123',
				showHidden: true,
				type: 'string',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/sheet_col_123/columns',
				'test-api-key',
				{
					method: 'GET',
					query: { showHidden: true, type: 'string' },
				},
			);
			expect(res.length).toBe(2);
			expect(res[0]?.Name).toBe('First Name');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.datasets.getColumns',
				{ handle: 'sheet_col_123', columnCount: 2 },
				'completed',
			);
		});
	});

	describe('datasets.list', () => {
		it('calls GET /library/ for root listing', async () => {
			mockRequest.mockResolvedValue([
				{
					metadata: {
						FileUuid: 'file_1',
						FileName: 'file1.csv',
					},
					permissions: [0, 1],
					within_quota: true,
				},
			]);

			const res = await Datasets.list(mockCtx, {});

			expect(mockRequest).toHaveBeenCalledWith('/library/', 'test-api-key', {
				method: 'GET',
			});
			expect(res.length).toBe(1);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.datasets.list',
				{ count: 1 },
				'completed',
			);
		});

		it('calls GET /library/{handle} when handle is specified', async () => {
			mockRequest.mockResolvedValue([]);

			await Datasets.list(mockCtx, { handle: 'folder/subfolder' });

			expect(mockRequest).toHaveBeenCalledWith(
				`/library/${encodeURIComponent('folder/subfolder')}`,
				'test-api-key',
				{ method: 'GET' },
			);
		});
	});

	describe('datasets.getOperationStatus', () => {
		it('calls GET /dataset/{handle}/operation-status and parses output', async () => {
			mockRequest.mockResolvedValue({
				Status: 'Working',
				Message: 'Calculating column stats',
				Owner: 'user@example.com',
				UpdatedAt: '2026-11-13T12:00:00Z',
			});

			const res = await Datasets.getOperationStatus(mockCtx, {
				handle: 'sheet_op_123',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/sheet_op_123/operation-status',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res.Status).toBe('Working');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.datasets.getOperationStatus',
				{ handle: 'sheet_op_123', status: 'Working' },
				'completed',
			);
		});
	});

	// --------------------------------------------------------------------------
	// Rows Endpoints
	// --------------------------------------------------------------------------
	describe('rows.appendByName', () => {
		it('calls POST /dataset/{handle}/append/by-name and sends records in body', async () => {
			mockRequest.mockResolvedValue({
				Success: true,
				Message: 'Rows appended successfully',
			});

			const res = await Rows.appendByName(mockCtx, {
				handle: 'sheet_append_123',
				records: [
					{ colA: 'val1', colB: 123 },
					{ colA: 'val2', colB: 456 },
				],
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/sheet_append_123/append/by-name',
				'test-api-key',
				{
					method: 'POST',
					body: {
						records: [
							{ colA: 'val1', colB: 123 },
							{ colA: 'val2', colB: 456 },
						],
					},
				},
			);
			expect(res.Success).toBe(true);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.rows.appendByName',
				{ handle: 'sheet_append_123', recordCount: 2 },
				'completed',
			);
		});
	});

	describe('rows.insertBlankRow', () => {
		it('calls POST /datasets/{handle}/insert-blank-row with index and num_rows', async () => {
			mockRequest.mockResolvedValue({
				Success: true,
				Message: 'Blank row inserted',
			});

			const res = await Rows.insertBlankRow(mockCtx, {
				handle: 'sheet_blank_123',
				index: 5,
				num_rows: 3,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/datasets/sheet_blank_123/insert-blank-row',
				'test-api-key',
				{
					method: 'POST',
					body: {
						index: 5,
						num_rows: 3,
					},
				},
			);
			expect(res.Success).toBe(true);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.rows.insertBlankRow',
				{ handle: 'sheet_blank_123', index: 5, numRows: 3 },
				'completed',
			);
		});
	});

	describe('rows.deleteRows', () => {
		it('calls DELETE /dataset/{handle}/delete-rows with Rows in body', async () => {
			mockRequest.mockResolvedValue({
				Success: true,
				Message: 'Rows deleted',
			});

			const res = await Rows.deleteRows(mockCtx, {
				handle: 'sheet_del_rows',
				rows: [1, 2, 3],
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/sheet_del_rows/delete-rows',
				'test-api-key',
				{
					method: 'DELETE',
					body: {
						Rows: [1, 2, 3],
					},
				},
			);
			expect(res.Success).toBe(true);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.rows.deleteRows',
				{ handle: 'sheet_del_rows', rowCount: 3 },
				'completed',
			);
		});
	});

	// --------------------------------------------------------------------------
	// Views Endpoints
	// --------------------------------------------------------------------------
	describe('views.list', () => {
		it('calls GET /dataset/{handle}/views and parses output', async () => {
			mockRequest.mockResolvedValue([
				{
					id: 'view_1',
					name: 'Filtered High Value',
					client_state: 'state_123',
					file: 'sheet_views_123',
				},
			]);

			const res = await Views.list(mockCtx, {
				handle: 'sheet_views_123',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/sheet_views_123/views',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res.length).toBe(1);
			expect(res[0]?.name).toBe('Filtered High Value');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.views.list',
				{ handle: 'sheet_views_123', viewCount: 1 },
				'completed',
			);
		});
	});

	describe('views.get', () => {
		it('calls GET /dataset/{handle}/views/{view} with encoded handles', async () => {
			mockRequest.mockResolvedValue({
				id: 'view_1',
				name: 'Default View',
				client_state: 'state_abc',
				file: 'sheet_views_123',
			});

			const res = await Views.get(mockCtx, {
				handle: 'sheet_views_123',
				view: 'view_1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/sheet_views_123/views/view_1',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res.id).toBe('view_1');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.views.get',
				{ handle: 'sheet_views_123', viewId: 'view_1' },
				'completed',
			);
		});
	});

	// --------------------------------------------------------------------------
	// Exports Endpoints
	// --------------------------------------------------------------------------
	describe('exports.create', () => {
		it('calls POST /dataset/{handle}/export and parses output', async () => {
			mockRequest.mockResolvedValue({
				handle: 'export_job_123',
			});

			const res = await Exports.create(mockCtx, {
				handle: 'sheet_export_123',
				filename: 'data.zip',
				compressionType: 'zip',
				gridState: { filterModel: {} },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/sheet_export_123/export',
				'test-api-key',
				{
					method: 'POST',
					body: {
						filename: 'data.zip',
						compressionType: 'zip',
						gridState: { filterModel: {} },
					},
				},
			);
			expect(res.handle).toBe('export_job_123');
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.exports.create',
				{ handle: 'sheet_export_123', exportHandle: 'export_job_123' },
				'completed',
			);
		});
	});

	describe('exports.download', () => {
		it('calls GET /dataset/{handle}/download-export and parses presigned URL', async () => {
			mockRequest.mockResolvedValue({
				presignedUrl:
					'https://s3.amazonaws.com/gigasheet-exports/data.zip?token=123',
				error: '',
			});

			const res = await Exports.download(mockCtx, {
				handle: 'export_job_123',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'/dataset/export_job_123/download-export',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(res.presignedUrl).toBe(
				'https://s3.amazonaws.com/gigasheet-exports/data.zip?token=123',
			);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gigasheet.exports.download',
				{ handle: 'export_job_123', hasUrl: true },
				'completed',
			);
		});
	});
});
