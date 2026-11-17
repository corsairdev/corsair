import * as Commands from './commands';
import * as Computers from './computers';
import * as Panels from './panels';

export const CommandsEndpoints = {
	list: Commands.list,
	run: Commands.run,
	history: Commands.history,
};

export const ComputersEndpoints = {
	list: Computers.list,
};

export const PanelsEndpoints = {
	list: Panels.listButtons,
	trigger: Panels.trigger,
};

export * from './types';
