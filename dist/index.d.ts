import { Question } from 'inquirer';
/**
 * Small utility class to define a set of expected arguments for a script
 * If an argument is not supplied the user will be prompted to enter them using an inquirer question
 * null required arguments will throw an error
 */
export declare class ArgvExtractor {
    private definitions;
    /**
     * Adds a single argument to the definition list
     */
    add(argument: Argument): this;
    /**
     * Adds a multiple arguments to the definition list
     * Additionally calls resolve()
     */
    addAndResolve(argumentList: Argument[], commandPrefix?: string): Promise<any>;
    /**
     * Resolves all arguments from the definition list
     * Adds defaults where applicable.
     * Executes inquirer questions where applicable
     */
    resolve(commandPrefix?: string): Promise<any>;
}
export interface Argument {
    name: string;
    type?: 'string' | 'boolean';
    required?: boolean;
    inquireQuestion?: Question | ((currentArgv: any) => Question);
    defaultValue?: boolean | string;
}
