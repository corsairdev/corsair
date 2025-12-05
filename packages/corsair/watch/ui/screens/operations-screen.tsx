import { Box, Text, useInput } from "ink";
import type React from "react";
import { useMemo } from "react";
import { eventBus } from "../../core/event-bus.js";
import { CorsairEvent } from "../../types/events.js";
import type { StateContext } from "../../types/state.js";
import { OperationsList } from "../components/operations-list.js";
import { PaginationIndicator } from "../components/pagination-indicator.js";
import { SearchInput } from "../components/search-input.js";

interface OperationsScreenProps {
	context: StateContext;
}

export const OperationsScreen: React.FC<OperationsScreenProps> = ({
	context,
}) => {
	const operationsView = context.operationsView;

	if (!operationsView) {
		return null;
	}

	const { type, currentPage, searchQuery, isSearching } = operationsView;

	// Get operations based on type
	const allOperations = useMemo(() => {
		const opsMap = type === "queries" ? context.queries : context.mutations;
		return Array.from(opsMap?.values() || []);
	}, [type, context.queries, context.mutations]);

	// Filter operations based on search query
	const filteredOperations = useMemo(() => {
		if (!searchQuery.trim()) {
			return allOperations;
		}

		const query = searchQuery.toLowerCase();
		return allOperations.filter(
			(op) =>
				op.prompt.toLowerCase().includes(query) ||
				op.name.toLowerCase().includes(query),
		);
	}, [allOperations, searchQuery]);

	// Pagination
	const totalPages = Math.ceil(filteredOperations.length / 5);
	const startIndex = currentPage * 5;
	const paginatedOperations = filteredOperations.slice(
		startIndex,
		startIndex + 5,
	);

	const displayColor = type === "queries" ? "cyan" : "yellow";
	const displayTitle = type === "queries" ? "Queries" : "Mutations";

	// Handle keyboard input
	useInput((input, key) => {
		// ESC to exit
		if (key.escape) {
			eventBus.emit(CorsairEvent.USER_COMMAND, { command: "go_back" });
			return;
		}

		// If searching, handle text input
		if (isSearching) {
			if (key.return) {
				// If there are filtered results and Enter is pressed, select first one
				if (filteredOperations.length > 0 && paginatedOperations[0]) {
					eventBus.emit(CorsairEvent.USER_COMMAND, {
						command: "select_operation",
						args: { operationName: paginatedOperations[0].name },
					});
				} else {
					// Otherwise, toggle search off
					eventBus.emit(CorsairEvent.USER_COMMAND, {
						command: "toggle_search",
					});
				}
				return;
			}

			if (key.backspace || key.delete) {
				eventBus.emit(CorsairEvent.USER_COMMAND, {
					command: "update_search",
					args: { query: searchQuery.slice(0, -1) },
				});
				return;
			}

			// Regular character input
			if (input && !key.ctrl && !key.meta) {
				eventBus.emit(CorsairEvent.USER_COMMAND, {
					command: "update_search",
					args: { query: searchQuery + input },
				});
			}
			return;
		}

		// Not searching - handle navigation
		if (key.return) {
			eventBus.emit(CorsairEvent.USER_COMMAND, { command: "toggle_search" });
			return;
		}

		if (key.leftArrow && currentPage > 0) {
			eventBus.emit(CorsairEvent.USER_COMMAND, {
				command: "navigate_page",
				args: { direction: "prev" },
			});
			return;
		}

		if (key.rightArrow && currentPage < totalPages - 1) {
			eventBus.emit(CorsairEvent.USER_COMMAND, {
				command: "navigate_page",
				args: { direction: "next" },
			});
			return;
		}

		// Number keys 1-5 to select operation
		const num = parseInt(input);
		if (num >= 1 && num <= 5 && paginatedOperations?.[num - 1]) {
			eventBus.emit(CorsairEvent.USER_COMMAND, {
				command: "select_operation",
				args: { operationName: paginatedOperations[num - 1]!.name },
			});
		}
	});

	// Empty state
	if (allOperations.length === 0) {
		return (
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor={displayColor}
				padding={1}
			>
				<Box justifyContent="space-between">
					<Text color={displayColor} bold>
						{displayTitle} (0)
					</Text>
					<Text dimColor>[ESC] Exit</Text>
				</Box>
				<Text> </Text>
				<Box flexDirection="column" paddingY={2}>
					<Text color="yellow">No {type} found</Text>
					<Text> </Text>
					<Text dimColor>To create {type}, add them to:</Text>
					<Text color={displayColor}>corsair/{type}.ts</Text>
					<Text> </Text>
					<Text dimColor>Example:</Text>
					<Box flexDirection="column" paddingLeft={2}>
						<Text dimColor>
							export const {type} = {"{"}
						</Text>
						<Text dimColor> exampleQuery: query({"{"}</Text>
						<Text dimColor> prompt: "Get user by id",</Text>
						<Text dimColor>
							{" "}
							handler: async ({"{"} id {"}"}) ={">"} {"{"} ... {"}"},
						</Text>
						<Text dimColor> {"}"}),</Text>
						<Text dimColor>{"}"}</Text>
					</Box>
				</Box>
			</Box>
		);
	}

	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor={displayColor}
			padding={1}
		>
			{/* Header */}
			<Box justifyContent="space-between">
				<Text color={displayColor} bold>
					{displayTitle} ({allOperations.length})
				</Text>
				<Text dimColor>[ESC] Exit</Text>
			</Box>

			<Text> </Text>

			{/* Operations List */}
			<OperationsList
				operations={paginatedOperations}
				startIndex={startIndex}
				highlightFirst={isSearching && filteredOperations.length > 0}
				type={type}
			/>

			{/* Pagination */}
			{filteredOperations.length > 0 && (
				<PaginationIndicator
					currentPage={currentPage}
					totalPages={totalPages}
					totalItems={filteredOperations.length}
				/>
			)}

			{/* Search Input */}
			<Box marginTop={1}>
				<SearchInput
					value={searchQuery}
					isActive={isSearching}
					placeholder="Press Enter to search prompts..."
				/>
			</Box>

			{/* Help text */}
			<Box marginTop={1} gap={2}>
				<Text dimColor>[1-5] Select</Text>
				{totalPages > 1 && (
					<>
						<Text dimColor>[←→] Navigate</Text>
					</>
				)}
				<Text dimColor>[Enter] Search</Text>
			</Box>
		</Box>
	);
};
