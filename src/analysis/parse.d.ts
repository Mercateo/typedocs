/**
 * Created by alexander on 09.08.16.
 */
import { CompilerOptions } from 'typescript';
import DocJson from '../interfaces/DocJson';
export declare type ParseOptions = {
    compilerOptions: CompilerOptions;
};
export declare function parse(fileNames: string[], options: ParseOptions): DocJson[];
