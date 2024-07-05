import * as vscode from 'vscode';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Provide instructions for the AI language model
const CODE_LABEL = 'Here is the code:';
const README_LABEL = 'Here is a good README:';
const PROMPT = `
Generate a well-formatted GitHub README document in Markdown based based on the following text. 
The document should include appropriate headers, lists, code blocks, and any other relevant Markdown formatting.

Example 1:
${CODE_LABEL}
# Introduction

This project is a Python script that prints colored output to the console using terminal codes.

## Features
- Print colored output
- Easy to use

## Example Usage

\`\`\`python
print(f" \\033[33m {msg}\\033[00m", file=sys.stderr)
\`\`\`

${README_LABEL}
Generate a README introducing the project, listing features, and providing an example usage.

Example 2:
${CODE_LABEL}
# Data Cleaning Script

This script modifies a given data dictionary to remove any entries not specified in the keep list.

## Features
- Remove unwanted data
- Easy to customize

## Example Usage

\`\`\`python
to_delete = set(data.keys()) - frozenset(keep)
for key in to_delete:
  del data[key]
\`\`\`

${README_LABEL}
Generate a README introducing the data cleaning script, listing features, and providing an example usage.

Example 3:
${CODE_LABEL}
# Line Replacement Script

This script replaces text from a list of lines with new content, noting that array indices are offset by 1 from line numbers.

## Features
- Replace specific lines
- Handle text replacements efficiently

## Example Usage

\`\`\`python
lines[text_range.start_line - 1:text_range.end_line - 1] = [repl.new_content]
\`\`\`

${README_LABEL}
Generate a README introducing the line replacement script, listing features, and providing an example usage.

Example 4:
${CODE_LABEL}
# API Key Loader

This script attempts to load the API key from the environment.

## Features
- Securely load API keys
- Easy to integrate

## Example Usage

\`\`\`python
api_key = os.getenv("GOOGLE_API_KEY")
\`\`\`

${README_LABEL}
Generate a README introducing the API key loader script, listing features, and providing an example usage.

`;

export async function generateMarkdown() {
    vscode.window.showInformationMessage('Generating Markdown...');

    const modelName = vscode.workspace.getConfiguration().get<string>('google.gemini.textModel', 'models/gemini-1.0-pro-latest');

    // Get API Key from local user configuration
    const apiKey = vscode.workspace.getConfiguration().get<string>('google.gemini.apiKey');
    if (!apiKey) {
        vscode.window.showErrorMessage('API key not configured. Check your settings.');
        return;
    }

    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({model: modelName});

    // Text selection
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        console.debug('Abandon: no open text editor.');
        return;
    }

    const selection = editor.selection;
    const selectedCode = editor.document.getText(selection);

    // Build the full prompt using the template.
    const fullPrompt = `${PROMPT}
    ${CODE_LABEL}
    ${selectedCode}
    ${README_LABEL}
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const comment = response.text();  

    // Insert before selection.
    editor.edit((editBuilder) => {
        // TODO(you!): Support other comment styles.
        const commentPrefix = '# ';

        // Copy the indent from the first line of the selection.
        const trimmed = selectedCode.trimStart();
        const padding = selectedCode.substring(0, selectedCode.length - trimmed.length);

        let pyComment = comment.split('\n').map((l: string) => `${padding}${commentPrefix}${l}`).join('\n');
        if (pyComment.search(/\n$/) === -1) {
            // Add a final newline if necessary.
            pyComment += "\n";
        }
        let commentIntro = padding + commentPrefix + "Markdown : (generated)\n";
        editBuilder.insert(selection.start, commentIntro);
        editBuilder.insert(selection.start, pyComment);
    });
}
