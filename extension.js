var vscode = require( 'vscode' );

function activate( context )
{
    var inItemize = false;

    var markdownToLatexMappings =
    {
        "^#\\s+(.*)$": { replacement: "\\chapter{\$1}", group: 1 },
        "^#{2}\\s+(.*)$": { replacement: "\\section{\$1}", group: 1 },
        "^#{3}\\s+(.*)$": { replacement: "\\subsection{\$1}", group: 1 },
        "^#{4}\\s+(.*)$": { replacement: "\\subsubsection{\$1}", group: 1 },
        "^#{5}\\s+(.*)$": { replacement: "\\paragraph{\$1}\\hfill\\break", group: 1 },
        "^(\\s*)\-\\s+(.*)$": { replacement: "\\item{\$2}", group: 2, state: "itemize" },
        "^(\\s*)\\d+\\.\\s+(.*)$": { replacement: "\\item{\$2}", group: 2, state: "enumerate" }
    };

    var latexToMarkdownMappings =
    {
        "\\\\chapter\\{(.*)\\}": { replacement: "# \$1", group: 1 },
        "\\\\section\\{(.*)\\}": { replacement: "## \$1", group: 1 },
        "\\\\subsection\\{(.*)\\}": { replacement: "### \$1", group: 1 },
        "\\\\subsubsection\\{(.*)\\}": { replacement: "#### \$1", group: 1 },
        "\\\\paragraph\\{(.*)\\}\\\\hfill\\\\break": { replacement: "##### \$1", group: 1 },
        "\\\\item\\{(.*)\\}": { replacements: { itemize: "- \$1", enumerate: "1. \$1" }, group: 1 },
        "\\\\begin\\{itemize\\}": { state: "itemize" },
        "\\\\end\\{itemize\\}": { state: "" },
        "\\\\begin\\{enumerate\\}": { state: "enumerate" },
        "\\\\end\\{enumerate\\}": { state: "" }
    };

    function convert( doConversion )
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

        var newLines = doConversion( lines.split( '\n' ) );

        var edits = [];
        edits.push( new vscode.TextEdit( range, newLines.join( "\n" ) ) );
        var edit = new vscode.WorkspaceEdit();
        edit.set( editor.document.uri, edits );
        vscode.workspace.applyEdit( edit );
    }

    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.markdown-to-latex', function()
    {
        convert( function( lines )
        {
            function indentation( adjustment )
            {
                if( states.length > 0 )
                {
                    var currentLevel = states[ states.length - 1 ].level;
                    if( currentLevel )
                    {
                        return " ".repeat( ( currentLevel + adjustment ) * 4 );
                    }
                }

                return "";
            }

            var newLines = [];
            var states = [];
            lines.map( function( line )
            {
                var currentMatch;
                Object.keys( markdownToLatexMappings ).map( function( regex )
                {
                    line = line.replace( new RegExp( regex ), function( match, g1, g2 )
                    {
                        var m = markdownToLatexMappings[ regex ];
                        currentMatch = m;
                        if( g2 )
                        {
                            currentMatch.level = 1 + g1.length / 4;
                        }
                        return m.replacement.replace( "\$" + m.group, m.group === 1 ? g1 : g2 );
                    } );
                } );

                if( states.length > 0 )
                {
                    var currentState = states[ states.length - 1 ];
                    while( states.length > 0 &&
                        ( currentMatch === undefined ||
                            ( currentMatch && currentMatch.state === undefined ) ||
                            ( currentMatch.level < currentState.level ) ) )
                    {
                        newLines.push( indentation( -1 ) + "\\end{" + currentState.state + "}" );
                        states.pop();
                        if( states.length > 0 )
                        {
                            currentState = states[ states.length - 1 ];
                        }
                    }
                }

                if( currentMatch && currentMatch.state )
                {
                    var lastState = states.length > 0 ? states[ states.length - 1 ] : undefined;
                    if( !lastState || lastState.state !== currentMatch.state || currentMatch.level > lastState.level )
                    {
                        newLines.push( indentation( 0 ) + "\\begin{" + currentMatch.state + "}" );
                        states.push( { state: currentMatch.state, level: currentMatch.level } );
                    }
                }

                newLines.push( indentation( 0 ) + line );
            } );

            return newLines;
        } );
    } ) );


    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.latex-to-markdown', function()
    {
        convert( function( lines )
        {
            var newLines = [];
            var states;
            lines.map( function( line )
            {
                var currentMatch;
                var oldLine = line;
                Object.keys( latexToMarkdownMappings ).map( function( regex )
                {
                    line = line.replace( new RegExp( regex ), function( match, g1, g2 )
                    {
                        var m = latexToMarkdownMappings[ regex ];
                        currentMatch = m;
                        var replacement = m.replacements ? m.replacements[ states ] : m.replacement;
                        return replacement ? replacement.replace( "\$" + m.group, m.group === 1 ? g1 : g2 ) : match;
                    } );
                } );
                if( currentMatch && currentMatch.state )
                {
                    if( currentMatch.state.length > 0 )
                    {
                        states = currentMatch.state;
                    }
                    else
                    {
                        states = undefined;
                    }
                }
                if( currentMatch === undefined || currentMatch.replacement || currentMatch.replacements )
                {
                    newLines.push( line );
                }
            } );

            return newLines;
        } );
    } ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
