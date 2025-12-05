import { Box, Text } from "ink";
import type React from "react";

interface Command {
	key: string;
	label: string;
}

interface CommandBarProps {
	commands: Command[];
}

export const CommandBar: React.FC<CommandBarProps> = ({ commands }) => {
	return (
		<Box marginTop={1} gap={2}>
			{commands.map((cmd, index) => (
				<Text key={index} dimColor>
					[
					<Text bold color="cyan">
						{cmd.key}
					</Text>
					] {cmd.label}
				</Text>
			))}
		</Box>
	);
};
