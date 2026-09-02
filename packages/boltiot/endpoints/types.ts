import { z } from 'zod';

// Check device online status
export const CheckDeviceStatusInputSchema = z.object({
	deviceName: z
		.string()
		.describe('The ID/Name of the Bolt IoT device (e.g. BOLT1234567)'),
});
export type CheckDeviceStatusInput = z.infer<
	typeof CheckDeviceStatusInputSchema
>;

export const CheckDeviceStatusOutputSchema = z.object({
	success: z.boolean(),
	value: z
		.string()
		.describe('Device status from isOnline: "online" or "offline"'),
	time: z
		.string()
		.optional()
		.describe('Official isOnline timestamp when that status last changed'),
	deviceName: z.string(),
});
export type CheckDeviceStatusOutput = z.infer<
	typeof CheckDeviceStatusOutputSchema
>;

// Analog Read
export const AnalogReadInputSchema = z.object({
	deviceName: z.string().describe('The ID/Name of the Bolt IoT device'),
	pin: z.string().default('A0').describe('Analog pin to read from (e.g. A0)'),
});
export type AnalogReadInput = z.infer<typeof AnalogReadInputSchema>;

export const AnalogReadOutputSchema = z.object({
	success: z.boolean(),
	value: z.number().describe('Analog value reading (0-1023)'),
	rawValue: z.string(),
	pin: z.string(),
	deviceName: z.string(),
});
export type AnalogReadOutput = z.infer<typeof AnalogReadOutputSchema>;

// Digital Write
export const DigitalWriteInputSchema = z.object({
	deviceName: z.string().describe('The ID/Name of the Bolt IoT device'),
	pin: z
		.string()
		.describe('Digital pin to write to (e.g. "0", "1", "2", "3", "4")'),
	state: z.enum(['HIGH', 'LOW', '1', '0']).describe('State to set pin to'),
});
export type DigitalWriteInput = z.infer<typeof DigitalWriteInputSchema>;

export const DigitalWriteOutputSchema = z.object({
	success: z.boolean(),
	value: z.string().describe('Response value from device'),
	pin: z.string(),
	state: z.string(),
	deviceName: z.string(),
});
export type DigitalWriteOutput = z.infer<typeof DigitalWriteOutputSchema>;

// Digital Read
export const DigitalReadInputSchema = z.object({
	deviceName: z.string().describe('The ID/Name of the Bolt IoT device'),
	pin: z
		.string()
		.describe('Digital pin to read from (e.g. "0", "1", "2", "3", "4")'),
});
export type DigitalReadInput = z.infer<typeof DigitalReadInputSchema>;

export const DigitalReadOutputSchema = z.object({
	success: z.boolean(),
	value: z.string().describe('Digital pin state ("1" for HIGH, "0" for LOW)'),
	pin: z.string(),
	deviceName: z.string(),
});
export type DigitalReadOutput = z.infer<typeof DigitalReadOutputSchema>;

// Serial Read
export const SerialReadInputSchema = z.object({
	deviceName: z.string().describe('The ID/Name of the Bolt IoT device'),
	till: z
		.string()
		.optional()
		.describe('ASCII character code to read until (e.g. "10" for newline)'),
});
export type SerialReadInput = z.infer<typeof SerialReadInputSchema>;

export const SerialReadOutputSchema = z.object({
	success: z.boolean(),
	value: z.string().describe('Serial data read from device'),
	deviceName: z.string(),
});
export type SerialReadOutput = z.infer<typeof SerialReadOutputSchema>;

// Serial Write
export const SerialWriteInputSchema = z.object({
	deviceName: z.string().describe('The ID/Name of the Bolt IoT device'),
	data: z.string().describe('ASCII data string to send over UART'),
});
export type SerialWriteInput = z.infer<typeof SerialWriteInputSchema>;

export const SerialWriteOutputSchema = z.object({
	success: z.boolean(),
	value: z.string().describe('Response status from serial write'),
	deviceName: z.string(),
});
export type SerialWriteOutput = z.infer<typeof SerialWriteOutputSchema>;

// Serial Write & Read
export const SerialWriteReadInputSchema = z.object({
	deviceName: z.string().describe('The ID/Name of the Bolt IoT device'),
	data: z.string().describe('ASCII data string to send over UART'),
	till: z
		.string()
		.optional()
		.describe('ASCII character code to read reply until'),
});
export type SerialWriteReadInput = z.infer<typeof SerialWriteReadInputSchema>;

export const SerialWriteReadOutputSchema = z.object({
	success: z.boolean(),
	value: z.string().describe('Reply received from serial write & read command'),
	deviceName: z.string(),
});
export type SerialWriteReadOutput = z.infer<typeof SerialWriteReadOutputSchema>;

export type BoltIotEndpointInputs = {
	checkDeviceStatus: CheckDeviceStatusInput;
	analogRead: AnalogReadInput;
	digitalWrite: DigitalWriteInput;
	digitalRead: DigitalReadInput;
	serialRead: SerialReadInput;
	serialWrite: SerialWriteInput;
	serialWriteRead: SerialWriteReadInput;
};

export type BoltIotEndpointOutputs = {
	checkDeviceStatus: CheckDeviceStatusOutput;
	analogRead: AnalogReadOutput;
	digitalWrite: DigitalWriteOutput;
	digitalRead: DigitalReadOutput;
	serialRead: SerialReadOutput;
	serialWrite: SerialWriteOutput;
	serialWriteRead: SerialWriteReadOutput;
};

export const BoltIotEndpointInputSchemas = {
	checkDeviceStatus: CheckDeviceStatusInputSchema,
	analogRead: AnalogReadInputSchema,
	digitalWrite: DigitalWriteInputSchema,
	digitalRead: DigitalReadInputSchema,
	serialRead: SerialReadInputSchema,
	serialWrite: SerialWriteInputSchema,
	serialWriteRead: SerialWriteReadInputSchema,
} as const;

export const BoltIotEndpointOutputSchemas = {
	checkDeviceStatus: CheckDeviceStatusOutputSchema,
	analogRead: AnalogReadOutputSchema,
	digitalWrite: DigitalWriteOutputSchema,
	digitalRead: DigitalReadOutputSchema,
	serialRead: SerialReadOutputSchema,
	serialWrite: SerialWriteOutputSchema,
	serialWriteRead: SerialWriteReadOutputSchema,
} as const;
