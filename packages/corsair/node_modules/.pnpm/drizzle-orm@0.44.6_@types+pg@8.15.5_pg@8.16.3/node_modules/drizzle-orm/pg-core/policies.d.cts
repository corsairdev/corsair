import { entityKind } from "../entity.cjs";
import type { SQL } from "../sql/sql.cjs";
import type { PgRole } from "./roles.cjs";
import type { PgTable } from "./table.cjs";
export type PgPolicyToOption = 'public' | 'current_role' | 'current_user' | 'session_user' | (string & {}) | PgPolicyToOption[] | PgRole;
export interface PgPolicyConfig {
    as?: 'permissive' | 'restrictive';
    for?: 'all' | 'select' | 'insert' | 'update' | 'delete';
    to?: PgPolicyToOption;
    using?: SQL;
    withCheck?: SQL;
}
export declare class PgPolicy implements PgPolicyConfig {
    readonly name: string;
    static readonly [entityKind]: string;
    readonly as: PgPolicyConfig['as'];
    readonly for: PgPolicyConfig['for'];
    readonly to: PgPolicyConfig['to'];
    readonly using: PgPolicyConfig['using'];
    readonly withCheck: PgPolicyConfig['withCheck'];
    constructor(name: string, config?: PgPolicyConfig);
    link(table: PgTable): this;
}
export declare function pgPolicy(name: string, config?: PgPolicyConfig): PgPolicy;
