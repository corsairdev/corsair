import { Box, Text } from "ink";
import type React from "react";
import type { OperationDefinition } from "../../types/state.js";

interface OperationsListProps {
	operations: OperationDefinition[];
	startIndex: number;
	highlightFirst?: boolean;
	type: "queries" | "mutations";
}

export const OperationsList: React.FC<OperationsListProps> = ({
	operations,
	startIndex,
	highlightFirst = false,
	type,
}) => {
	const displayColor = type === "queries" ? "cyan" : "yellow";

	if (operations.length === 0) {
		return (
			<Box flexDirection="column" paddingY={1}>
				<Text color="gray" dimColor>
					No operations found
				</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingY={1}>
			{operations.slice(0, 5).map((operation, index) => {
				const displayNumber = index + 1;
				const isHighlighted = highlightFirst && index === 0;

				return (
					<Box key={operation.name} marginBottom={index < 4 ? 1 : 0}>
						<Text color={displayColor} bold>
							[{displayNumber}]
						</Text>
						<Text> </Text>
						<Box flexDirection="column">
							<Text
								color={isHighlighted ? displayColor : "white"}
								bold={isHighlighted}
							>
								{operation.name}
							</Text>
							<Text dimColor>{operation.prompt}</Text>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};
