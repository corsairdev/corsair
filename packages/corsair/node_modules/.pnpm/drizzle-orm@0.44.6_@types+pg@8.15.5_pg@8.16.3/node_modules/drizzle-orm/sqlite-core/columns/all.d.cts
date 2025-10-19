import { blob } from "./blob.cjs";
import { customType } from "./custom.cjs";
import { integer } from "./integer.cjs";
import { numeric } from "./numeric.cjs";
import { real } from "./real.cjs";
import { text } from "./text.cjs";
export declare function getSQLiteColumnBuilders(): {
    blob: typeof blob;
    customType: typeof customType;
    integer: typeof integer;
    numeric: typeof numeric;
    real: typeof real;
    text: typeof text;
};
export type SQLiteColumnBuilders = ReturnType<typeof getSQLiteColumnBuilders>;
