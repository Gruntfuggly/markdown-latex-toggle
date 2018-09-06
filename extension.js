var vscode = require( 'vscode' );

function activate( context )
{
    var inItemize = false;

    var markdownToLatexMappings =
    {
        "^#\\s+(.*)$": "\\chapter{\$1}",
        "^#{2}\\s+(.*)$": "\\section{\$1}",
        "^#{3}\\s+(.*)$": "\\subsection{\$1}",
        "^#{4}\\s+(.*)$": "\\subsubsection{\$1}",
        "^#{5}\\s+(.*)$": "\\paragraph{\$1}\\hfill\\break",
        "^\\s*\-\\s+(.*)$": "\\item{\$1}"
    };

    var latexToMarkdownMappings =
    {
        "\\\\chapter\\{(.*)\\}": "# \$1",
        "\\\\section\\{(.*)\\}": "## \$1",
        "\\\\subsection\\{(.*)\\}": "### \$1",
        "\\\\subsubsection\\{(.*)\\}": "#### \$1",
        "\\\\paragraph\\{(.*)\\}\\\\hfill\\\\break": "##### \$1",
        "\\\\item\\{(.*)\\}": "- \$1",
        "\\\\begin\\{itemize\\}": "<REMOVE>",
        "\\\\end\\{itemize\\}": "<REMOVE>",
    };

    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.markdown-to-latex', function()
    {
        var editor = vscode.window.activeTextEditor;
        var document = editor.document;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        var hasSelection = s.line !== e.line || s.character !== e.character;

        var lines = document.getText();

        var range = new vscode.Range( 0,
            document.lineAt( 0 ).range.start.character,
            document.lineCount - 1,
            document.lineAt( document.lineCount - 1 ).range.end.character );

        if( hasSelection )
        {
            range = new vscode.Range( s.line, 0, e.line, document.lineAt( e.line ).range.end.character );
            lines = lines.substring( document.offsetAt( range.start ), document.offsetAt( range.end ) );
        }

        var newLines = [];
        lines.split( "\n" ).map( function( line )
        {
            Object.keys( markdownToLatexMappings ).map( function( regex )
            {
                line = line.replace( new RegExp( regex ), markdownToLatexMappings[ regex ] );
            } );
            if( line.indexOf( '\\item{' ) === 0 )
            {
                if( inItemize === false )
                {
                    newLines.push( "\\begin{itemize}" );
                }
                inItemize = true;
            }
            else if( inItemize )
            {
                inItemize = false;
                newLines.push( "\\end{itemize}" );
            }
            newLines.push( line );
        } );

        var edits = [];
        edits.push( new vscode.TextEdit( range, newLines.join( "\n" ) ) );
        var edit = new vscode.WorkspaceEdit();
        edit.set( editor.document.uri, edits );
        vscode.workspace.applyEdit( edit );
    } ) );


    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.latex-to-markdown', function()
    {
        var editor = vscode.window.activeTextEditor;
        var document = editor.document;
        var selection = editor.selection;

        var s = selection.start;
        var e = selection.end;

        var hasSelection = s.line !== e.line || s.character !== e.character;

        var lines = document.getText();

        var range = new vscode.Range( 0,
            document.lineAt( 0 ).range.start.character,
            document.lineCount - 1,
            document.lineAt( document.lineCount - 1 ).range.end.character );

        if( hasSelection )
        {
            range = new vscode.Range( s.line, 0, e.line, document.lineAt( e.line ).range.end.character );
            lines = lines.substring( document.offsetAt( range.start ), document.offsetAt( range.end ) );
        }

        var newLines = [];
        lines.split( "\n" ).map( function( line )
        {
            Object.keys( latexToMarkdownMappings ).map( function( regex )
            {
                line = line.replace( new RegExp( regex ), latexToMarkdownMappings[ regex ] );
            } );
            if( line !== "<REMOVE>" )
            {
                newLines.push( line );
            }
        } );

        var edits = [];
        edits.push( new vscode.TextEdit( range, newLines.join( "\n" ) ) );
        var edit = new vscode.WorkspaceEdit();
        edit.set( editor.document.uri, edits );
        vscode.workspace.applyEdit( edit );
    } ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
