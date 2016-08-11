/**
 * Created by alexander on 09.08.16.
 */
import { Symbol, TypeChecker } from 'typescript';
import { FunctionDoc } from '../interfaces/DocEntries';
export declare function serializeFunctions(checker: TypeChecker, symbol: Symbol): FunctionDoc;
