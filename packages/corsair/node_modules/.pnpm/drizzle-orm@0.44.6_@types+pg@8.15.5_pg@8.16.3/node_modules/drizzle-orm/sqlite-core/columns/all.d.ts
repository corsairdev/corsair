import { blob } from "./blob.js";
import { customType } from "./custom.js";
import { integer } from "./integer.js";
import { numeric } from "./numeric.js";
import { real } from "./real.js";
import { text } from "./text.js";
export declare function getSQLiteColumnBuilders(): {
    blob: typeof blob;
    customType: typeof customType;
    integer: typeof integer;
    numeric: typeof numeric;
    real: typeof real;
    text: typeof text;
};
export type SQLiteColumnBuilders = ReturnType<typeof getSQLiteColumnBuilders>;
