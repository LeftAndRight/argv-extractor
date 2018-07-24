"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = require("inquirer");
var minimist = require("minimist");
/**
 * Small utility class to define a set of expected arguments for a script
 * If an argument is not supplied the user will be prompted to enter them using an inquirer question
 * null required arguments will throw an error
 */
var ArgvExtractor = /** @class */ (function () {
    function ArgvExtractor() {
        this.definitions = [];
    }
    /**
     * Adds a single argument to the definition list
     */
    ArgvExtractor.prototype.add = function (argument) {
        argument.type = argument.type == null ? 'string' : argument.type;
        argument.required = argument.required == null ? true : argument.required;
        if (argument.required && (argument.inquireQuestion == null && argument.defaultValue == null)) {
            throw new Error('If an argument is required you require an inquireQuestion or defaultValue to resolve from the user');
        }
        this.definitions.push(argument);
        return this;
    };
    /**
     * Adds a multiple arguments to the definition list
     * Additionally calls resolve()
     */
    ArgvExtractor.prototype.addAndResolve = function (argumentList, commandPrefix) {
        var _this = this;
        argumentList.forEach(function (arg) { return _this.add(arg); });
        return this.resolve(commandPrefix);
    };
    /**
     * Resolves all arguments from the definition list
     * Adds defaults where applicable.
     * Executes inquirer questions where applicable
     */
    ArgvExtractor.prototype.resolve = function (commandPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            var options, argv, asked, i, argument, value, question, answers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = { boolean: this.definitions.filter(function (e) { return e.type === 'boolean'; }).map(function (e) { return e.name; }) };
                        argv = minimist(process.argv.slice(2), options);
                        asked = false;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.definitions.length)) return [3 /*break*/, 6];
                        argument = this.definitions[i];
                        value = argv[argument.name];
                        if (!(argument.required && value == null)) return [3 /*break*/, 4];
                        if (!argument.inquireQuestion) return [3 /*break*/, 3];
                        asked = true;
                        question = typeof argument.inquireQuestion === 'function' ? argument.inquireQuestion(argv) : argument.inquireQuestion;
                        // Just needs to be populated, not that relevant in this case
                        if (question.name == null)
                            question.name = 'question';
                        return [4 /*yield*/, inquirer.prompt(question)];
                    case 2:
                        answers = _a.sent();
                        value = answers[question.name];
                        _a.label = 3;
                    case 3:
                        if (value == null && argument.defaultValue == null) {
                            throw new Error('You must supply a value for ' + argument.name);
                        }
                        _a.label = 4;
                    case 4:
                        if (value == null && argument.defaultValue) {
                            value = argument.defaultValue;
                        }
                        argv[argument.name] = value;
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        if (commandPrefix && asked) {
                            this.definitions.forEach(function (entry) {
                                if (argv[entry.name] != null) {
                                    commandPrefix += " --" + entry.name + "=" + argv[entry.name];
                                }
                            });
                            console.log(commandPrefix);
                        }
                        return [2 /*return*/, argv];
                }
            });
        });
    };
    return ArgvExtractor;
}());
exports.ArgvExtractor = ArgvExtractor;