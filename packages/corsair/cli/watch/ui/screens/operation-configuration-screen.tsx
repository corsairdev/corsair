import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { StateContext } from "../../types/state.js";
import { eventBus } from "../../core/event-bus.js";
import { CorsairEvent } from "../../types/events.js";

interface OperationConfigurationScreenProps {
  context: StateContext;
}

export const OperationConfigurationScreen: React.FC<
  OperationConfigurationScreenProps
> = ({ context }) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputActive, setIsInputActive] = useState(true);

  const newOperation = context.newOperation;

  if (!newOperation) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="red"
        padding={1}
      >
        <Text color="red" bold>
          Error: No operation configuration data found
        </Text>
      </Box>
    );
  }

  useInput((input, key) => {
    if (!isInputActive) return;

    if (key.return) {
      // Submit the configuration rules
      eventBus.emit(CorsairEvent.USER_COMMAND, {
        command: "submit_operation_config",
        args: { configurationRules: inputValue },
      });
      setIsInputActive(false);
      return;
    }

    if (key.escape) {
      // Cancel and go back to idle
      eventBus.emit(CorsairEvent.USER_COMMAND, {
        command: "cancel_operation_config",
      });
      return;
    }

    if (key.backspace || key.delete) {
      setInputValue((prev) => prev.slice(0, -1));
      return;
    }

    if (input && !key.ctrl && !key.meta) {
      setInputValue((prev) => prev + input);
    }
  });

  const operationTypeDisplay =
    newOperation.operationType === "query" ? "Query" : "Mutation";
  const fileName = newOperation.file.split("/").pop() || newOperation.file;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      padding={1}
    >
      {/* Header Banner */}
      <Box
        borderStyle="single"
        borderColor="yellow"
        padding={1}
        marginBottom={1}
      >
        <Text color="yellow" bold>
          🔧 Configure {operationTypeDisplay}:{" "}
          <Text color="cyan">{newOperation.operationName}</Text>{" "}
          <Text dimColor>
            ({fileName}:{newOperation.lineNumber})
          </Text>{" "}
          -{" "}
          <Text color="green">
            "{newOperation.prompt.replace(/['"]/g, "")}"
          </Text>
        </Text>
      </Box>

      {/* Input Section */}
      <Box flexDirection="column">
        <Text bold>Configuration Rules:</Text>
        <Text> </Text>

        {/* Input box */}
        <Box
          borderStyle="single"
          borderColor={isInputActive ? "cyan" : "gray"}
          padding={1}
          minHeight={8}
        >
          <Text>
            {inputValue || (isInputActive && <Text dimColor>input / output types, authorization, etc...</Text>)}
            {isInputActive && inputValue && <Text color="cyan">█</Text>}
            {isInputActive && !inputValue && <Text color="cyan">█</Text>}
          </Text>
        </Box>

        <Text> </Text>

        {/* Instructions */}
        <Box
          borderStyle="single"
          borderColor="gray"
          padding={1}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Text dimColor>
            <Text color="green" bold>
              [Enter]
            </Text>{" "}
            Submit configuration
          </Text>
          <Text dimColor>
            <Text color="red" bold>
              [Esc]
            </Text>{" "}
            Cancel
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
