// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';



class Replacement {

	constructor(private _regex: string, private _repl: string) {}

	get regex() {
		return this._regex;
	}

	get repl() {
		return this._repl;
	}
}

let replacements: Array<Replacement> = new Array();


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	replacements.push(new Replacement('--', '—'))

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdowntextreplacer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('replacer.replaceAll', () => {
		let editor = getEditor();
		let document: vscode.TextDocument = editor.document;
		if (!document) {
			throw new Error('Document is undefined!');
		}
		let text: string = document.getText();
		replacements.forEach((replacement)=> {
			text = text.replace(replacement.regex, replacement.repl);
		});
		editor.edit((editBuilder) => {
			let firstPosition = new vscode.Position(0, 0);
			let lastLine = document.lineAt(document.lineCount - 1);
			let lastPosition = new vscode.Position(document.lineCount - 1, lastLine.text.length );
			let range = new vscode.Range(firstPosition, lastPosition);
			editBuilder.replace(range, text);
		});
	});

	context.subscriptions.push(disposable);
}

function getEditor(): vscode.TextEditor {
	if (vscode.window.activeTextEditor) {
		return vscode.window.activeTextEditor;
	}
	throw new Error('Editor is undefined');
}

// this method is called when your extension is deactivated
export function deactivate() {}
