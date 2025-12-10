import { Box, Text } from 'ink';
import type React from 'react';
import type { StateContext } from '../../types/state.js';
import { CommandBar } from '../components/command-bar.js';

interface AwaitingFeedbackScreenProps {
	context: StateContext;
}

export const AwaitingFeedbackScreen: React.FC<AwaitingFeedbackScreenProps> = ({
	context,
}) => {
	const query = context.currentQuery;
	const files = context.generatedFiles || [];
	const llmResponse = context.llmResponse;
	const newOperation = context.newOperation;

	// If we have an LLM response, show LLM feedback instead of generation feedback
	if (llmResponse && newOperation) {
		return (
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor="green"
				padding={1}
			>
				<Text color="green" bold>
					✓ Operation Generated Successfully
				</Text>
				<Text> </Text>

				<Text>
					Operation: <Text color="cyan">"{newOperation.operationName}"</Text>
				</Text>
				<Text>
					Type: <Text color="yellow">{newOperation.operationType}</Text>
				</Text>

				<Text> </Text>
				<Text color="cyan" bold>
					📋 Agent Report:
				</Text>
				{llmResponse.suggestions.map((suggestion, i) => (
					<Text key={i} dimColor>
						{suggestion}
					</Text>
				))}

				{llmResponse.usage && (
					<>
						<Text> </Text>
						<Text color="yellow" bold>
							🔢 Token Usage:
						</Text>
						<Text dimColor>
							Input: {llmResponse.usage.inputTokens.toLocaleString()}
						</Text>
						<Text dimColor>
							Output: {llmResponse.usage.outputTokens.toLocaleString()}
						</Text>
						<Text dimColor>
							Total: {llmResponse.usage.totalTokens.toLocaleString()}
						</Text>
					</>
				)}

				<CommandBar
					commands={[
						{ key: 'U', label: 'Update' },
						{ key: 'ESC/Q', label: 'Back to Idle' },
					]}
				/>
			</Box>
		);
	}

	// Default generation feedback UI
	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor="green"
			padding={1}
		>
			<Text color="green" bold>
				✓ Generated Successfully
			</Text>
			<Text> </Text>

			{query && (
				<>
					<Text>
						Query: <Text color="cyan">"{query.nlQuery}"</Text>
					</Text>
					<Text>
						Function: <Text color="green">{query.id}</Text>
					</Text>
				</>
			)}

			<Text> </Text>
			<Text>Generated files:</Text>
			{files.map((file, i) => (
				<Text key={i} dimColor>
					{' '}
					• {file}
				</Text>
			))}

			<CommandBar
				commands={[
					{ key: 'R', label: 'Regenerate' },
					{ key: 'T', label: 'Tweak' },
					{ key: 'U', label: 'Undo' },
					{ key: 'A', label: 'Accept' },
				]}
			/>
		</Box>
	);
};
