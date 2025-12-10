import { Box, Text } from 'ink';
import type React from 'react';

interface SearchInputProps {
	value: string;
	isActive: boolean;
	placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
	value,
	isActive,
	placeholder = 'Search...',
}) => {
	return (
		<Box
			borderStyle="single"
			borderColor={isActive ? 'cyan' : 'gray'}
			paddingX={1}
		>
			<Text color={isActive ? 'cyan' : 'gray'}>
				{isActive ? '🔍 ' : ''}
				{value || <Text dimColor>{placeholder}</Text>}
				{isActive && <Text>|</Text>}
			</Text>
		</Box>
	);
};
