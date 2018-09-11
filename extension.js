var vscode = require( 'vscode' );
var mappings = require( './mappings.js' );

function activate( context )
{
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
                Object.keys( mappings.markdownToLatexMappings ).map( function( regex )
                {
                    line = line.replace( new RegExp( regex ), function( match, g1, g2 )
                    {
                        var m = mappings.markdownToLatexMappings[ regex ];
                        if( !currentMatch )
                        {
                            currentMatch = m;
                            if( g2 && g1.replace( /\s/g, '' ) === "" )
                            {
                                currentMatch.level = 1 + g1.length / 4;
                            }
                            var updated = m.replacement ? m.replacement : match;
                            var groups = arguments;
                            if( m.groups )
                            {
                                m.groups.map( function( group )
                                {
                                    updated = updated.replace( "\$" + group, groups[ group ] );
                                } );
                            }
                            if( m.state === "tabularx" )
                            {
                                currentMatch.elements = match.split( '|' ).filter( function( e ) { return e.length > 0; } );
                                updated = currentMatch.elements.join( " & " ) + "\\\\ \\hline";
                            }

                            return updated;
                        }
                        return match;
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
                        if( currentMatch.state === "tabularx" )
                        {
                            newLines.push( "\\begin{tabularx}{\\textwidth}{" + ( "|X".repeat( currentMatch.elements.length ) ) + "|}\\hline" );
                        }
                        else
                        {
                            newLines.push( indentation( 0 ) + "\\begin{" + currentMatch.state + "}" );
                        }
                        states.push( { state: currentMatch.state, level: currentMatch.level } );
                    }
                }

                if( !currentMatch || !currentMatch.ignore )
                {
                    newLines.push( indentation( 0 ) + line );
                }
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
                Object.keys( mappings.latexToMarkdownMappings ).map( function( regex )
                {
                    line = line.replace( new RegExp( regex ), function( match, g1, g2 )
                    {
                        var m = mappings.latexToMarkdownMappings[ regex ];
                        currentMatch = m;

                        var updated = m.replacement ? m.replacement : match;
                        if( m.groups )
                        {
                            var groups = arguments;
                            m.groups.map( function( group )
                            {
                                updated = updated.replace( "\$" + group, groups[ group ] );
                            } );
                        }
                        if( m.state === "table" )
                        {
                            var cells = updated.substr( 0, updated.indexOf( "\\\\ \\hline" ) );
                            currentMatch.elements = cells.split( '&' ).filter( function( e ) { return e.length > 0; } );
                            updated = "| " + currentMatch.elements.join( " | " ) + " |";
                        }

                        return updated;
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

                if( !currentMatch || !currentMatch.ignore )
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
