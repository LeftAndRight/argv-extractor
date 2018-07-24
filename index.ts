import * as inquirer from 'inquirer';
import {Question} from 'inquirer';
import * as minimist from 'minimist';


/**
 * Small utility class to define a set of expected arguments for a script
 * If an argument is not supplied the user will be prompted to enter them using an inquirer question
 * null required arguments will throw an error
 */
export class ArgvExtractor {

    private definitions:Argument[] = [];

    /**
     * Adds a single argument to the definition list
     */
    public add(argument:Argument){
        argument.type       = argument.type == null ? 'string' : argument.type;
        argument.required   = argument.required == null ? true : argument.required;

        if (argument.required && (argument.inquireQuestion == null && argument.defaultValue == null)){
            throw new Error('If an argument is required you require an inquireQuestion or defaultValue to resolve from the user');
        }
        this.definitions.push(argument);
        return this;
    }

    /**
     * Adds a multiple arguments to the definition list
     * Additionally calls resolve()
     */
    public addAndResolve(argumentList:Argument[], commandPrefix?:string){
        argumentList.forEach(arg => this.add(arg));
        return this.resolve(commandPrefix);
    }

    /**
     * Resolves all arguments from the definition list
     * Adds defaults where applicable.
     * Executes inquirer questions where applicable
     */
    public async resolve(commandPrefix?:string) {
        const options   = {boolean: this.definitions.filter(e => e.type === 'boolean').map(e => e.name)};
        const argv      = minimist(process.argv.slice(2), options);
        let asked       = false;

        for (let i = 0; i < this.definitions.length; i++) {
            const argument  = this.definitions[i];
            let value       = argv[argument.name];

            if (argument.required && value == null){
                if (argument.inquireQuestion){
                    asked           = true;
                    const question  = typeof argument.inquireQuestion === 'function' ? argument.inquireQuestion(argv) : argument.inquireQuestion;

                    // Just needs to be populated, not that relevant in this case
                    if (question.name == null) question.name = 'question';

                    const answers   = await inquirer.prompt(question);
                    value           = answers[question.name];
                }

                if (value == null && argument.defaultValue == null) {
                    throw new Error('You must supply a value for ' + argument.name);
                }
            }
            if (value == null && argument.defaultValue){
                value = argument.defaultValue;
            }

            argv[argument.name] = value;
        }

        if (commandPrefix && asked){
            this.definitions.forEach(entry => {
                if (argv[entry.name] != null){
                    commandPrefix += ` --${entry.name}=${argv[entry.name]}`;
                }
            });
            console.log(commandPrefix);
        }

        return argv;
    }
}

export interface Argument {
    name:string;
    type?:'string' | 'boolean';
    required?:boolean;
    inquireQuestion?:Question | ((currentArgv:any) => Question);
    defaultValue?:boolean|string;
}