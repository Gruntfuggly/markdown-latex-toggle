var vscode = require( 'vscode' );
var convert = require( './convert.js' );

function activate( context )
{
    var outputChannel = vscode.window.createOutputChannel( 'Markdown To Latex' );

    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.markdown-to-latex', function()
    {
        var editor = vscode.window.activeTextEditor;
        var document = editor.document;

        convert.markdownToLatex( document.uri.fsPath, outputChannel.appendLine );
    } ) );


    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.latex-to-markdown', function()
    {
        var editor = vscode.window.activeTextEditor;
        var document = editor.document;

        convert.latexToMarkdown( document.uri.fsPath, outputChannel.appendLine );
    } ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
