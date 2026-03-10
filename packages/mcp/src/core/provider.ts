import { buildCorsairToolDefs, type CorsairToolDef } from './tools.js';
import type { BaseMcpOptions } from './adapters.js';

export abstract class BaseProvider<TOutput> {
	abstract readonly name: string;
	abstract wrapTool(def: CorsairToolDef): TOutput;

	build(options: BaseMcpOptions): TOutput[] {
		return buildCorsairToolDefs(options).map(def => this.wrapTool(def));
	}
}
