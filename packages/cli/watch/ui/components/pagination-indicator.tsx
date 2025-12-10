import { Box, Text } from 'ink';
import type React from 'react';

interface PaginationIndicatorProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
}

export const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
	currentPage,
	totalPages,
	totalItems,
}) => {
	if (totalPages <= 1) {
		return null;
	}

	const startItem = currentPage * 5 + 1;
	const endItem = Math.min((currentPage + 1) * 5, totalItems);

	return (
		<Box justifyContent="space-between" paddingY={1}>
			<Text dimColor>
				{currentPage > 0 && '← '}
				Page {currentPage + 1} of {totalPages}
				{currentPage < totalPages - 1 && ' →'}
			</Text>
			<Text dimColor>
				Showing {startItem}-{endItem} of {totalItems}
			</Text>
		</Box>
	);
};
