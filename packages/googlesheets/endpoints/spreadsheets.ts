import { logEventFromContext } from 'corsair/core';
import type { GoogleSheetsEndpoints } from '..';
import {
	makeAuthenticatedDriveRequest,
	makeAuthenticatedSheetsRequest,
} from '../client';
import type {
	GoogleSheetsEndpointOutputs,
	ListSpreadsheetsResponse,
} from './types';

export const create: GoogleSheetsEndpoints['spreadsheetsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedSheetsRequest<
		GoogleSheetsEndpointOutputs['spreadsheetsCreate']
	>('/spreadsheets', ctx, {
		method: 'POST',
		body: {
			properties: input.properties,
		},
	});

	if (result.spreadsheetId && ctx.db.spreadsheets) {
		try {
			await ctx.db.spreadsheets.upsertByEntityId(result.spreadsheetId, {
				spreadsheetId: result.spreadsheetId,
				title: result.properties?.title,
				spreadsheetUrl: result.spreadsheetUrl,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save spreadsheet to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlesheets.spreadsheets.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSpreadsheet: GoogleSheetsEndpoints['spreadsheetsDelete'] =
	async (ctx, input) => {
		const response = await makeAuthenticatedDriveRequest(
			`/files/${input.spreadsheetId}`,
			ctx,
			{ method: 'DELETE' },
		);

		if (!response.ok && response.status !== 404) {
			const errorText = await response.text();
			throw new Error(
				`Failed to delete spreadsheet: ${response.status} ${errorText}`,
			);
		}

		if (ctx.db.spreadsheets) {
			try {
				await ctx.db.spreadsheets.deleteByEntityId(input.spreadsheetId);
			} catch (error) {
				console.warn('Failed to delete spreadsheet from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlesheets.spreadsheets.delete',
			{ ...input },
			'completed',
		);
	};

export const listSpreadsheets: GoogleSheetsEndpoints['spreadsheetsList'] =
	async (ctx, input) => {
		const mimeFilter = "mimeType='application/vnd.google-apps.spreadsheet'";
		const params = new URLSearchParams({
			q: input.query ? `${mimeFilter} AND ${input.query}` : mimeFilter,
			fields:
				'files(id,name,createdTime,modifiedTime,webViewLink),nextPageToken',
		});
		if (input.pageSize) params.set('pageSize', String(input.pageSize));
		if (input.pageToken) params.set('pageToken', input.pageToken);

		const response = await makeAuthenticatedDriveRequest(
			`/files?${params.toString()}`,
			ctx,
		);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Failed to list spreadsheets: ${response.status} ${errorText}`,
			);
		}

		// Drive request is invoked in sheets plugin, so type assertion is required
		const result = (await response.json()) as ListSpreadsheetsResponse;

		await logEventFromContext(
			ctx,
			'googlesheets.spreadsheets.list',
			{ ...input },
			'completed',
		);
		return result;
	};
