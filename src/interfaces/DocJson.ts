/**
 * Created by alexander on 09.08.16.
 */
import { FileDoc } from "./DocEntries";

export interface DocJson extends JSON {
  sourceFile?: FileDoc
}
