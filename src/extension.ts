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
	let replacement = vscode.commands.registerCommand('replacer.replaceAll', () => {
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

	let addReplacement = vscode.commands.registerCommand('replacer.addReplacement', async function() {
		let regex: string = await getRegex();
		let repl: string = await getReplacement();
		replacements.push(new Replacement(regex, repl));
	});

	context.subscriptions.push(replacement);
	context.subscriptions.push(addReplacement);
}

 async function getRegex(){
	let inputWindow = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		password: false,
		placeHolder: "[0-9]",
		prompt: "Enter regex to be replaced"
	}).then(input => {
		if(!input || input === "") {
			throw new Error('Regex Input is empty!');
		} else {
			return input;
		}
	}, err => {
		vscode.window.showErrorMessage('Empty regex window');
	});

	return inputWindow;
}

async function getReplacement(){
	let inputWindow = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		password: false,
		placeHolder: "Replacement",
		prompt: "Enter replacement to be replaced"
	}).then(input => {
		if(!input || input === "") {
			throw new Error('Regex Input is empty!');
		} else {
			return input;
		}
	}, err => {
		vscode.window.showErrorMessage('Empty replacement window');
	});

	return inputWindow;
}

function getEditor(): vscode.TextEditor {
	if (vscode.window.activeTextEditor) {
		return vscode.window.activeTextEditor;
	}
	throw new Error('Editor is undefined');
}

// this method is called when your extension is deactivated
export function deactivate() {}
