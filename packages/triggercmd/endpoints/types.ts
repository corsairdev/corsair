import { z } from 'zod';

/**
 * TRIGGERcmd's list routes answer `{ records: [...] }`. That envelope comes from
 * the provider's own Go client, which reads `cmdResult["records"]` and iterates
 * it, and from the provider's command-list documentation.
 *
 * The record shape is typed from the same Go client: it reads `computer.name`,
 * `name`, `allowParams` and `icon` from each command, and `panel.name`, `name`
 * and `params` from each panel button.
 */

/** A command, as the command-list route returns it. */
const CommandSchema = z
	.object({
		name: z
			.string()
			.nullish()
			.describe('The command name, which is its trigger'),
		allowParams: z.boolean().nullish(),
		icon: z.string().nullish(),
		voice: z.string().nullish(),
		ground: z.string().nullish(),
		command: z
			.string()
			.nullish()
			.describe('The command line, when the agent reports it'),
		computer: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type CommandOutput = z.output<typeof CommandSchema>;

/** A computer, as the computer-list route returns it. */
const ComputerSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		connected: z.boolean().nullish(),
		platform: z.string().nullish(),
	})
	.loose();
export type ComputerOutput = z.output<typeof ComputerSchema>;

/** A panel button, which runs a run panel command when pressed. */
const PanelButtonSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		params: z.string().nullish(),
		panel: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type PanelButtonOutput = z.output<typeof PanelButtonSchema>;

/** A command run in the history. */
const CommandRunSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		status: z.string().nullish(),
		createdAt: z.string().nullish(),
		command: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type CommandRunOutput = z.output<typeof CommandRunSchema>;

/**
 * The `{ records }` envelope. The provider's CLI reads `records` and treats a
 * missing key as an empty list, so it is required here and an answer without it
 * fails loudly rather than looking like an empty account.
 */
const RecordsEnvelope = <T extends z.ZodType>(record: T) =>
	z.object({ records: z.array(record) }).loose();

const CommandsEnvelopeSchema = RecordsEnvelope(CommandSchema);
const ComputersEnvelopeSchema = RecordsEnvelope(ComputerSchema);
const PanelButtonsEnvelopeSchema = RecordsEnvelope(PanelButtonSchema);
const RunsEnvelopeSchema = RecordsEnvelope(CommandRunSchema);

/** A trigger answers an acknowledgement, whose wording is not documented. */
const TriggerResultSchema = z
	.object({
		result: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();
export type TriggerResultOutput = z.output<typeof TriggerResultSchema>;

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------

const ListCommandsInputSchema = z.object({
	computer_id: z
		.union([z.string(), z.number()])
		.optional()
		.describe('Only commands on this computer, from `computers.list`'),
});
export type ListCommandsInput = z.input<typeof ListCommandsInputSchema>;

const RunCommandInputSchema = z
	.object({
		computer: z
			.string()
			.min(1)
			.describe("The computer's name, as `computers.list` reports it"),
		trigger: z
			.string()
			.min(1)
			.describe('The command name, which is its trigger'),
		params: z
			.string()
			.optional()
			.describe('Only takes effect when the command has Allow Params on'),
	})
	.superRefine((value, ctx) => {
		// An empty string is not the same as omitting the parameter: the provider
		// would pass an empty argument to the command.
		if (value.params === '') {
			ctx.addIssue({
				code: 'custom',
				message: 'Omit `params` rather than passing an empty string',
				path: ['params'],
			});
		}
	});
export type RunCommandInput = z.input<typeof RunCommandInputSchema>;

const RunHistoryInputSchema = z.object({
	command_id: z
		.union([z.string(), z.number()])
		.describe('The command whose runs to read, from `commands.list`'),
});
export type RunHistoryInput = z.input<typeof RunHistoryInputSchema>;

// ---------------------------------------------------------------------------
// computers
// ---------------------------------------------------------------------------

const ListComputersInputSchema = z.object({});
export type ListComputersInput = z.input<typeof ListComputersInputSchema>;

// ---------------------------------------------------------------------------
// panels
// ---------------------------------------------------------------------------

const ListPanelButtonsInputSchema = z.object({});
export type ListPanelButtonsInput = z.input<typeof ListPanelButtonsInputSchema>;

const TriggerPanelButtonInputSchema = z.object({
	panel: z.string().min(1).describe('The panel name'),
	button: z.string().min(1).describe('The button name within that panel'),
	params: z.string().optional().describe('Only for a button that takes them'),
});
export type TriggerPanelButtonInput = z.input<
	typeof TriggerPanelButtonInputSchema
>;

export type TriggerCmdEndpointInputs = {
	listCommands: ListCommandsInput;
	runCommand: RunCommandInput;
	runHistory: RunHistoryInput;
	listComputers: ListComputersInput;
	listPanelButtons: ListPanelButtonsInput;
	triggerPanelButton: TriggerPanelButtonInput;
};

export type TriggerCmdEndpointOutputs = {
	listCommands: z.output<typeof CommandsEnvelopeSchema>;
	runCommand: TriggerResultOutput;
	runHistory: z.output<typeof RunsEnvelopeSchema>;
	listComputers: z.output<typeof ComputersEnvelopeSchema>;
	listPanelButtons: z.output<typeof PanelButtonsEnvelopeSchema>;
	triggerPanelButton: TriggerResultOutput;
};

export const TriggerCmdEndpointInputSchemas = {
	listCommands: ListCommandsInputSchema,
	runCommand: RunCommandInputSchema,
	runHistory: RunHistoryInputSchema,
	listComputers: ListComputersInputSchema,
	listPanelButtons: ListPanelButtonsInputSchema,
	triggerPanelButton: TriggerPanelButtonInputSchema,
} as const;

export const TriggerCmdEndpointOutputSchemas = {
	listCommands: CommandsEnvelopeSchema,
	runCommand: TriggerResultSchema,
	runHistory: RunsEnvelopeSchema,
	listComputers: ComputersEnvelopeSchema,
	listPanelButtons: PanelButtonsEnvelopeSchema,
	triggerPanelButton: TriggerResultSchema,
} as const;
