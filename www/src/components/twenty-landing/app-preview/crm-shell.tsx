'use client';

import { CompaniesTable } from './companies-table';
import { RecordNavbar } from './record-navbar';
import { PreviewSidebar } from './sidebar';

export function CrmShell() {
	return (
		<div className="flex h-full min-h-0 w-full bg-white">
			<PreviewSidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<RecordNavbar />
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-3">
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#ebebeb] bg-white">
						<CompaniesTable />
					</div>
				</div>
			</div>
		</div>
	);
}
