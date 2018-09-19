var vscode = require( 'vscode' );
var convert = require( './convert.js' );

function activate( context )
{
    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.markdown-to-latex', function()
    {
        var editor = vscode.window.activeTextEditor;
        var document = editor.document;

        convert.markdownToLatex( document.uri.fsPath );
    } ) );


    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.latex-to-markdown', function()
    {
        var editor = vscode.window.activeTextEditor;
        var document = editor.document;

        convert.latexToMarkdown( document.uri.fsPath );
    } ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
