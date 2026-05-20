'use client';

import { useState } from 'react';
import { CompaniesTable } from './companies-table';
import { RecordNavbar } from './record-navbar';
import { PreviewSidebar } from './sidebar';
import { TableDetailSidebar } from './table-detail-sidebar';
import type { TableCellSelection } from './table-detail-sidebar';

export function CrmShell() {
	const [selection, setSelection] = useState<TableCellSelection | null>(null);

	return (
		<div className="relative flex h-full min-h-0 w-full bg-white">
			<PreviewSidebar />
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<RecordNavbar />
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-3">
					<div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-[#ebebeb] bg-white">
						<CompaniesTable selection={selection} onSelect={setSelection} />
					</div>
				</div>
			</div>
			<TableDetailSidebar
				selection={selection}
				onClose={() => setSelection(null)}
			/>
		</div>
	);
}
