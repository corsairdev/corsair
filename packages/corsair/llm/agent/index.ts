import { openai } from "@ai-sdk/openai";
import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { readFile, writeFile } from "./tools/index.js";

export const promptAgent = (pwd: string) =>
	new Agent({
		model: openai("gpt-4.1"),
		tools: {
			read_file: readFile(pwd),
			write_file: writeFile(pwd),
		},
		stopWhen: stepCountIs(20),
	});
