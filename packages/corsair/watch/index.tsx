// #!/usr/bin/env node

// async function main() {}

// main().catch((error) => {
//   console.error("❌ Fatal error:", error);
//   process.exit(1);
// });

import React, { useState, useEffect } from "react";
import { render, Text } from "ink";
import { UncontrolledTextInput } from "ink-text-input";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Text color="green">{counter} tests passed</Text>
      <UncontrolledTextInput
        initialValue="Hello"
        onSubmit={(value) => console.log(value)}
      />
    </>
  );
};

render(<Counter />);
