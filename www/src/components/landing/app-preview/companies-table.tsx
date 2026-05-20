'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import {
	CHAT_DEMO_ROW_ID,
	CONNECTION_STATUS_COLORS,
	CONNECTION_STATUS_LABELS,
	INTEGRATION_BY_ID,
	TABLE_WIDTH,
	TENANT_COLUMNS,
	TENANT_ROWS,
} from '../data/companies-data';
import { useChatDemoSync } from '../hooks/use-chat-demo-sync';
import type {
	CellValue,
	ConnectionStatus,
	IntegrationId,
	PersonCell,
	StatusCell,
	TableColumn,
} from '../data/companies-data';
import type { TableCellSelection } from './table-detail-sidebar';
import { TABLE } from './table-theme';
import { FaviconLogo, PersonAvatar } from './table-ui';

const DRAG_THRESHOLD_PX = 6;

function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
	const colors = CONNECTION_STATUS_COLORS[status];
	return (
		<span
			className="inline-flex min-w-0 items-center gap-1.5 underline decoration-[#1c1c1c33] underline-offset-4"
			style={{ fontFamily: TABLE.font }}
		>
			<span
				className="size-2 shrink-0 rounded-full"
				style={{ background: colors.dot }}
			/>
			<span
				className="truncate text-[11px] leading-none"
				style={{ color: colors.text }}
			>
				{CONNECTION_STATUS_LABELS[status]}
			</span>
		</span>
	);
}

function renderCell(cell: CellValue, column: TableColumn): React.ReactNode {
	switch (cell.type) {
		case 'person':
			if (column.isFirstColumn) {
				return (
					<div className="flex min-w-0 items-center gap-2">
						<PersonAvatar person={cell} size={16} />
						<span
							className="truncate text-[13px] font-semibold text-[#1c1c1c]"
							style={{ fontFamily: TABLE.font }}
						>
							{cell.name}
						</span>
					</div>
				);
			}
			return null;
		case 'status':
			return <ConnectionStatusBadge status={cell.status} />;
		default:
			return null;
	}
}

function TableCell({
	column,
	children,
	header,
	hovered,
	sticky,
	selected,
	pulsing,
	onClick,
}: {
	column: TableColumn;
	children: React.ReactNode;
	header?: boolean;
	hovered?: boolean;
	sticky?: boolean;
	selected?: boolean;
	pulsing?: boolean;
	onClick?: () => void;
}) {
	const interactive = Boolean(onClick) && !header;

	return (
		<div
			role={interactive ? 'button' : undefined}
			tabIndex={interactive ? 0 : undefined}
			onClick={interactive ? onClick : undefined}
			onKeyDown={
				interactive
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onClick?.();
							}
						}
					: undefined
			}
			className={`box-border flex shrink-0 items-center border-b border-r border-[#ebebeb] ${
				interactive ? 'cursor-pointer' : ''
			} ${pulsing ? 'landing-integration-cell-pulse' : ''}`}
			style={{
				width: column.width,
				minWidth: column.width,
				height: TABLE.rowHeight,
				padding: `0 ${TABLE.cellPadding}px`,
				justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start',
				background: pulsing
					? undefined
					: header
						? '#fafafa'
						: selected
							? '#f0f4ff'
							: hovered
								? TABLE.colors.bgSecondary
								: TABLE.colors.bg,
				position: sticky ? 'sticky' : 'relative',
				left: sticky ? 0 : undefined,
				zIndex: pulsing ? (sticky ? 5 : 2) : sticky ? (header ? 6 : 4) : 1,
				fontFamily: TABLE.font,
				boxShadow: pulsing
					? undefined
					: selected
						? 'inset 0 0 0 1px #4a38f533'
						: undefined,
			}}
		>
			{children}
		</div>
	);
}

export function CompaniesTable({
	selection,
	onSelect,
}: {
	selection: TableCellSelection | null;
	onSelect: (selection: TableCellSelection | null) => void;
}) {
	const { activeIntegrationIds } = useChatDemoSync();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);
	const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
	const dragRef = useRef({
		active: false,
		moved: false,
		startX: 0,
		scrollLeft: 0,
	});

	const columnWidth = TENANT_COLUMNS.reduce(
		(sum, column) => sum + column.width,
		0,
	);
	const fillerWidth = Math.max(TABLE_WIDTH - columnWidth, 0);

	useEffect(() => {
		const latestId = activeIntegrationIds.at(-1);
		if (!latestId || !scrollRef.current) return;

		const colIndex = TENANT_COLUMNS.findIndex((c) => c.id === latestId);
		if (colIndex < 0) return;

		const colLeft = TENANT_COLUMNS.slice(0, colIndex).reduce(
			(sum, c) => sum + c.width,
			0,
		);
		const colWidth = TENANT_COLUMNS[colIndex]?.width ?? 0;
		const el = scrollRef.current;
		const target =
			colLeft - (el.clientWidth - colWidth) / 2 + colWidth / 2;
		el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
	}, [activeIntegrationIds]);

	const onPointerDown = (e: PointerEvent) => {
		if ((e.target as HTMLElement).closest('[role="button"]')) return;
		const el = scrollRef.current;
		if (!el) return;
		dragRef.current = {
			active: true,
			moved: false,
			startX: e.clientX,
			scrollLeft: el.scrollLeft,
		};
		setDragging(true);
		el.setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: PointerEvent) => {
		if (!dragRef.current.active || !scrollRef.current) return;
		const delta = e.clientX - dragRef.current.startX;
		if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
			dragRef.current.moved = true;
		}
		scrollRef.current.scrollLeft = dragRef.current.scrollLeft - delta;
	};

	const onPointerUp = () => {
		const wasDragging = dragRef.current.moved;
		dragRef.current.active = false;
		setDragging(false);
		if (wasDragging) {
			window.setTimeout(() => {
				dragRef.current.moved = false;
			}, 0);
		}
	};

	const handlePersonClick = (rowId: string, person: PersonCell) => {
		if (dragRef.current.moved) return;
		const next: TableCellSelection = { kind: 'person', rowId, person };
		onSelect(
			selection?.kind === 'person' && selection.rowId === rowId ? null : next,
		);
	};

	const handleIntegrationClick = (
		rowId: string,
		personName: string,
		columnId: string,
		cell: StatusCell,
	) => {
		if (dragRef.current.moved) return;
		if (!(columnId in INTEGRATION_BY_ID)) return;
		const integrationId = columnId as IntegrationId;
		const isSame =
			selection?.kind === 'integration' &&
			selection.rowId === rowId &&
			selection.integrationId === integrationId;
		onSelect(
			isSame
				? null
				: {
						kind: 'integration',
						rowId,
						personName,
						integrationId,
						status: cell.status,
					},
		);
	};

	const isCellSelected = (rowId: string, columnId: string) => {
		if (!selection) return false;
		if (selection.rowId !== rowId) return false;
		if (selection.kind === 'person') return columnId === 'person';
		return selection.integrationId === columnId;
	};

	return (
		<div className="flex min-h-0 flex-1 overflow-hidden">
			<div
				ref={scrollRef}
				className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				style={{ cursor: dragging ? 'grabbing' : 'grab' }}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerLeave={onPointerUp}
				aria-label="Interactive preview of tenant integration configuration"
			>
				<div style={{ width: TABLE_WIDTH, minWidth: TABLE_WIDTH }}>
					<div className="flex">
						{TENANT_COLUMNS.map((column) => (
							<TableCell
								key={column.id}
								column={column}
								header
								sticky={column.isFirstColumn}
							>
								{column.label ? (
									<div className="flex min-w-0 items-center gap-1.5">
										{column.iconDomain ? (
											<FaviconLogo
												domain={column.iconDomain}
												label={column.label}
												size={14}
											/>
										) : null}
										<span className="truncate text-[11px] font-semibold text-[#666]">
											{column.label}
										</span>
									</div>
								) : null}
							</TableCell>
						))}
						<div
							className="shrink-0 border-b border-[#ebebeb] bg-[#fafafa]"
							style={{
								width: fillerWidth,
								minWidth: fillerWidth,
								height: TABLE.rowHeight,
							}}
						/>
					</div>

					{TENANT_ROWS.map((row) => {
						const hovered = hoveredRowId === row.id;
						const person = row.cells.person;
						const personName = person?.type === 'person' ? person.name : row.id;

						return (
							<div
								key={row.id}
								className="flex"
								onMouseEnter={() => setHoveredRowId(row.id)}
								onMouseLeave={() =>
									setHoveredRowId((current) =>
										current === row.id ? null : current,
									)
								}
							>
								{TENANT_COLUMNS.map((column) => {
									const cell = row.cells[column.id];
									const selected = isCellSelected(row.id, column.id);
									const isPerson =
										column.isFirstColumn && cell?.type === 'person';
									const isIntegration = cell?.type === 'status';
									const pulsing =
										row.id === CHAT_DEMO_ROW_ID &&
										activeIntegrationIds.includes(column.id as IntegrationId);

									return (
										<TableCell
											key={`${row.id}-${column.id}`}
											column={column}
											hovered={hovered && !pulsing}
											sticky={column.isFirstColumn}
											selected={selected && !pulsing}
											pulsing={pulsing}
											onClick={
												isPerson && cell.type === 'person'
													? () => handlePersonClick(row.id, cell)
													: isIntegration
														? () =>
																handleIntegrationClick(
																	row.id,
																	personName,
																	column.id,
																	cell,
																)
														: undefined
											}
										>
											{cell ? renderCell(cell, column) : null}
										</TableCell>
									);
								})}
								<div
									className="shrink-0 border-b border-[#ebebeb]"
									style={{
										width: fillerWidth,
										minWidth: fillerWidth,
										height: TABLE.rowHeight,
										background: hovered
											? TABLE.colors.bgSecondary
											: TABLE.colors.bg,
									}}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
