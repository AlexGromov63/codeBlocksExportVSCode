import * as vscode from 'vscode';
import * as fs from 'fs';

const blocks: TextBlock[] = [];

const logChannel = vscode.window.createOutputChannel("CBE logs");

interface TextBlock {
	filename: string;
	text_begin: number;
	text_end: number;
	selected_text: string;
	filepath: string;
};

function showInputBox() {
	const result = vscode.window.showInputBox({
		value: 'CodeBlocks.md',
		valueSelection: [2, 4],
		placeHolder: 'Enter filename'
	});
	
	return result;
}

function CreateFile(blocks: TextBlock[], output: vscode.Uri) {
	const output_path = output;
	var output_content = '';
	for (var t of blocks) {
		output_content += `
# **File:** ${t.filepath} \n
## **Lines** ${t.text_begin} - ${t.text_end} \n
\`\`\`
${t.selected_text}
\`\`\`
\n`
	}
	vscode.workspace.fs.writeFile(output_path, Buffer.from(output_content));
	
	logChannel.appendLine(`File ${output} successfully written!`);
}

async function SaveFileBlock() {
	var filename = 'CodeBlocks.md';
	if (!vscode.workspace.workspaceFolders) {
		vscode.window.showErrorMessage('Error finding root of workspace');
		return;
	}
	const filepath = vscode.workspace.workspaceFolders[0].uri;
	const items: vscode.QuickPickItem[] = [
            { label: 'Save to workspace root', description: 'Save file to root directory of your workspace.',},
            { label: 'Save to...', description: 'Pick directory where your file will be saved.' },
        ];
	const result = await vscode.window.showQuickPick(items, {
		canPickMany: false,
		placeHolder: 'Pick where to save file:'
	});

	if (!result) {
		vscode.window.showErrorMessage('Pick something!');
		return;
	}
	
	logChannel.appendLine(`Picked ${result.label}`);
	if (result.label == 'Save to...') {
		const options: vscode.SaveDialogOptions = {
			saveLabel: 'Сохранить',
			title: 'Выберите место для сохранения',
			defaultUri: vscode.Uri.file('CodeBlocks.md')
		}
		const file_open = await vscode.window.showSaveDialog(options);
		if (!file_open) {
			vscode.window.showErrorMessage('Can\'t save file. Try again.');
			return;
		}
		CreateFile(blocks, file_open);
	} else {
		const filename_input = await showInputBox();
		if (!filename_input) {
			vscode.window.showErrorMessage('Can\'t save file. Try again.');
			return;
		}
		const file_open = vscode.Uri.joinPath(
			filepath,
			filename_input
		)
		CreateFile(blocks, file_open);
	}
	blocks.length = 0;
}


export function activate(context: vscode.ExtensionContext) {

	const addSelectionFunc = vscode.commands.registerCommand('codeblocksexport.addSelection', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('There is no editor found!');
			return;
		}

		const selected_area = editor.selection;
		if (selected_area.isEmpty) {
			vscode.window.showErrorMessage('There is no selected area!');
			return
		}
		const selected_text = editor.document.getText(selected_area);
		const filename = editor.document.fileName;
		const filepath = vscode.workspace.asRelativePath(editor.document.uri);
		const text_begin = selected_area.start.line + 1;
		const text_end = selected_area.end.line + 1;

		if (text_end-text_begin > 2000) {
			vscode.window.showErrorMessage('Selected more than 2000 lines');
			return;
		} 

		logChannel.appendLine(`Selected ${filepath}: lines ${text_begin}-${text_end}`);
		
		const NewText: TextBlock = {
			filename: filename,
			filepath: filepath,
			text_begin: text_begin,
			text_end: text_end,
			selected_text: selected_text,
		}

		if (blocks.length > 20) {
			logChannel.appendLine(`Too much code blocks. First one was deleted`);
			blocks.pop()
		}
		logChannel.appendLine(`Added ${blocks.length + 1} code block`);
		blocks.push(NewText);
	})

	const exportCodeBlocks = vscode.commands.registerCommand('codeblocksexport.saveFile', () => {
		if (blocks.length == 0) {
			vscode.window.showErrorMessage('There are no saved blocks to export!');
			return;
		}
		SaveFileBlock();
	})

}

export function deactivate() {}
