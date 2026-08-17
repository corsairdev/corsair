import { logEventFromContext } from 'corsair/core';
import { runBatchUpdate } from '../client';
import type { GoogleDocsEndpoints } from '../index';

export const insertTable: GoogleDocsEndpoints['insertTable'] = async (
	ctx,
	input,
) => {
	const payload: Record<string, unknown> = {
		rows: input.rows,
		columns: input.columns,
	};
	if (input.appendToEnd) {
		payload.endOfSegmentLocation = {};
	} else {
		if (input.insertionIndex === undefined) {
			throw new Error(
				'[googledocs] insertTable requires insertionIndex or appendToEnd',
			);
		}
		payload.location = { index: input.insertionIndex };
	}

	const response = await runBatchUpdate(ctx, input.documentId, [
		{ insertTable: payload },
	]);

	await logEventFromContext(
		ctx,
		'googledocs.tables.insertTable',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const insertTableColumn: GoogleDocsEndpoints['insertTableColumn'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			{
				insertTableColumn: {
					tableCellLocation: input.tableCellLocation,
					insertRight: input.insertRight ?? false,
				},
			},
		]);

		await logEventFromContext(
			ctx,
			'googledocs.tables.insertTableColumn',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const deleteTableColumn: GoogleDocsEndpoints['deleteTableColumn'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			{ deleteTableColumn: { tableCellLocation: input.tableCellLocation } },
		]);

		await logEventFromContext(
			ctx,
			'googledocs.tables.deleteTableColumn',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const deleteTableRow: GoogleDocsEndpoints['deleteTableRow'] = async (
	ctx,
	input,
) => {
	const response = await runBatchUpdate(ctx, input.documentId, [
		{ deleteTableRow: { tableCellLocation: input.tableCellLocation } },
	]);

	await logEventFromContext(
		ctx,
		'googledocs.tables.deleteTableRow',
		{ documentId: input.documentId },
		'completed',
	);
	return response;
};

export const unmergeTableCells: GoogleDocsEndpoints['unmergeTableCells'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			{ unmergeTableCells: { tableRange: input.tableRange } },
		]);

		await logEventFromContext(
			ctx,
			'googledocs.tables.unmergeTableCells',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const updateTableRowStyle: GoogleDocsEndpoints['updateTableRowStyle'] =
	async (ctx, input) => {
		const response = await runBatchUpdate(ctx, input.documentId, [
			{
				updateTableRowStyle: {
					tableStartLocation: input.tableStartLocation,
					rowIndices: input.rowIndices,
					tableRowStyle: input.tableRowStyle ?? {},
					fields: input.fields ?? 'minRowHeight,tableHeader,preventOverflow',
				},
			},
		]);

		await logEventFromContext(
			ctx,
			'googledocs.tables.updateTableRowStyle',
			{ documentId: input.documentId },
			'completed',
		);
		return response;
	};

export const TablesEndpoints = {
	insertTable,
	insertTableColumn,
	deleteTableColumn,
	deleteTableRow,
	unmergeTableCells,
	updateTableRowStyle,
};
