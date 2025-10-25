import React from 'react';
import { Box, Text } from 'ink';

interface ProgressBarProps {
  percentage: number;
  width?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, width = 40 }) => {
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <Box>
      <Text color="cyan">{bar}</Text>
      <Text> {percentage.toFixed(0)}%</Text>
    </Box>
  );
};
