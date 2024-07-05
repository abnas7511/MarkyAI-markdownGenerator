# Pipet Code Agent Extension

The Pipet Code Agent is a Visual Studio Code extension developed by Google that leverages the power of the Google Gemini API to assist developers by generating comments and reviews for selected code. 
I have extended pipet to include a new command for generating well-formatted GitHub README documents in Markdown based on selected code snippets.

## Features

- **Code Review Comments**: Automatically generate code review comments that identify bugs and suggest improvements.
- **Code Comments**: Add explanatory comments to your code.
- **Markdown README Generator**: Generate comprehensive GitHub README documents in Markdown format based on selected code.

## New Command: Markdown README Generator

The new command added to this extension allows you to generate a well-structured GitHub README document in Markdown based on the code selected in the editor. The README includes appropriate headers, descriptions, code examples, and other relevant Markdown formatting.

### Example Usage

1. **Install the Pipet Code Agent Extension**

   Since the extension is not yet published on the VS Code Marketplace, you can test it locally by following these steps:

   - Clone or download the Pipet Code Agent repository from GitHub.
   - Navigate to the project directory in your terminal.

2. **Install Dependencies**

   Install the required Node.js dependencies using npm.

   ```bash
   npm install
   ```

3. **Run the Extension in Debug Mode**

   Open the project in Visual Studio Code and start debugging to run the extension in an Extension Development Host window.

   ```bash
   npm run vscode:prepublish
   ```

4. **Configure API Key**

   Set up your Google Gemini API key in the VS Code settings.

   ```json
   // settings.json
   {
       "google.gemini.apiKey": "your-api-key-here"
   }
   ```

5. **Use the Markdown README Generator Command**

   - Select the code snippet in your editor that you want to document.
   - Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
   - Type `Pipet: Create README from Selected Text` and select the command.

6. **Generated README Example**

   Here is an example of a generated README based on a selected code snippet:

   ```markdown
   # API Key Loader

   This script attempts to load the API key from the environment.

   ## Features
   - Securely load API keys
   - Easy to integrate

   ## Example Usage

   ```python
   api_key = os.getenv("GOOGLE_API_KEY")
   ```
   ```

### Contributing

Contributions to this extension are welcome! If you have suggestions for improvements or new features, feel free to open an issue or create a pull request on the [Pipet Markdown Agent GitHub repository]([https://github.com/google/generative-ai-docs](https://github.com/abnas7511/pipet]).

### License

This project is licensed under the Apache 2.0 License.

---
