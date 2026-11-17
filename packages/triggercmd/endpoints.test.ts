import { z } from 'zod';
import { TriggerCmdEndpointOutputSchemas } from './endpoints/types';
import {
	buttonPressed,
	command,
	commandRun,
	commandsEnvelope,
	computersEnvelope,
	emptyEnvelope,
	panelButtonsEnvelope,
	runsEnvelope,
	triggerAccepted,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a command list with the nested computer', () => {
		const parsed =
			TriggerCmdEndpointOutputSchemas.listCommands.parse(commandsEnvelope);
		expect(parsed.records).toHaveLength(2);
		expect(parsed.records[0]?.name).toBe('notepad');
		expect(parsed.records[0]?.computer?.name).toBe('laptop');
	});

	it('keeps camelCase: the field is allowParams, not allow_params', () => {
		const parsed =
			TriggerCmdEndpointOutputSchemas.listCommands.parse(commandsEnvelope);
		expect(parsed.records[0]?.allowParams).toBe(true);
		expect(parsed.records[0]).not.toHaveProperty('allow_params');
	});

	it('parses a command whose optional fields are absent', () => {
		const parsed = TriggerCmdEndpointOutputSchemas.listCommands.parse({
			records: [{ name: 'notepad' }],
		});
		expect(parsed.records[0]?.allowParams).toBeUndefined();
		expect(parsed.records[0]?.computer).toBeUndefined();
	});

	it('parses a computer list', () => {
		const parsed =
			TriggerCmdEndpointOutputSchemas.listComputers.parse(computersEnvelope);
		expect(parsed.records[0]?.name).toBe('laptop');
		expect(parsed.records[1]?.platform).toBe('linux');
	});

	it('parses an empty account', () => {
		expect(
			TriggerCmdEndpointOutputSchemas.listComputers.parse(emptyEnvelope)
				.records,
		).toEqual([]);
	});

	it('parses a panel button with its nested panel', () => {
		const parsed =
			TriggerCmdEndpointOutputSchemas.listPanelButtons.parse(
				panelButtonsEnvelope,
			);
		expect(parsed.records[0]?.name).toBe('Lights off');
		expect(parsed.records[0]?.panel?.name).toBe('Living room');
		expect(parsed.records[0]?.params).toBe('off');
	});

	it('parses a run history', () => {
		const parsed =
			TriggerCmdEndpointOutputSchemas.listCommands.parse(commandsEnvelope);
		expect(parsed.records[0]?.id).toBe(101);
		expect(
			TriggerCmdEndpointOutputSchemas.listPanelButtons.parse(
				panelButtonsEnvelope,
			).records,
		).toHaveLength(1);
		const runs = TriggerCmdEndpointOutputSchemas.runHistory.parse(runsEnvelope);
		expect(runs.records[0]?.status).toBe('success');
	});

	it('parses a trigger acknowledgement', () => {
		const parsed =
			TriggerCmdEndpointOutputSchemas.runCommand.parse(triggerAccepted);
		expect(parsed.message).toBe('Trigger sent.');
	});

	it('parses a panel button press', () => {
		const parsed =
			TriggerCmdEndpointOutputSchemas.triggerPanelButton.parse(buttonPressed);
		expect(parsed.message).toContain('pressed');
	});

	it('accepts an acknowledgement with no fields at all', () => {
		expect(() =>
			TriggerCmdEndpointOutputSchemas.runCommand.parse({}),
		).not.toThrow();
	});

	it('parses a command id sent as a string', () => {
		const parsed = TriggerCmdEndpointOutputSchemas.listCommands.parse({
			records: [{ ...command, id: '101' }],
		});
		expect(parsed.records[0]?.id).toBe('101');
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a list with no records key', () => {
		expect(() =>
			TriggerCmdEndpointOutputSchemas.listCommands.parse({}),
		).toThrow(z.ZodError);
	});

	it('rejects a records value that is a string', () => {
		expect(() =>
			TriggerCmdEndpointOutputSchemas.listComputers.parse({
				records: 'laptop',
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a command whose allowParams arrived as a string', () => {
		expect(() =>
			TriggerCmdEndpointOutputSchemas.listCommands.parse({
				records: [{ ...command, allowParams: 'true' }],
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a run whose status is an object', () => {
		expect(() =>
			TriggerCmdEndpointOutputSchemas.runHistory.parse({
				records: [{ ...commandRun, status: {} }],
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a panel button whose panel is a string', () => {
		expect(() =>
			TriggerCmdEndpointOutputSchemas.listPanelButtons.parse({
				records: [{ name: 'Lights off', panel: 'Living room' }],
			}),
		).toThrow(z.ZodError);
	});
});
