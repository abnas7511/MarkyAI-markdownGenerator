/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ 

import * as vscode from 'vscode';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Provide instructions for the AI language model
const PROMPT = `
Generate a well-formatted Markdown document based on the following text. 
The document should include appropriate headers, lists, code blocks, and any other relevant Markdown formatting.
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
    "
    ${selectedCode}
    "
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
