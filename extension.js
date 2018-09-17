var vscode = require( 'vscode' );
var mappings = require( './mappings.js' );
var fs = require( 'fs' );

var inPlace = false;

function activate( context )
{
    function simpleClone( object )
    {
        var newObject = ( object instanceof Array ) ? [] : {};
        for( var i in object )
        {
            if( i == 'clone' ) continue;
            if( object[ i ] && typeof object[ i ] == "object" )
            {
                newObject[ i ] = simpleClone( object[ i ] );
            } else newObject[ i ] = object[ i ]
        } return newObject;
    };

    function convert( extension, doConversion )
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

        var newLines = doConversion( lines.split( '\n' ) ).join( '\n' );

        if( inPlace )
        {
            var edits = [];
            edits.push( new vscode.TextEdit( range, newLines.join( '\n' ) ) );
            var edit = new vscode.WorkspaceEdit();
            edit.set( editor.document.uri, edits );
            vscode.workspace.applyEdit( edit );
        }
        else
        {
            var filePath = document.uri.fsPath + extension;
            fs.writeFileSync( filePath, newLines, 'utf8' );
        }
    }

    context.subscriptions.push( vscode.commands.registerCommand( 'markdown-latex-toggle.markdown-to-latex', function()
    {
        convert( ".tex", function( lines )
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
            var codeBlock = false;
            var verbatim = false;
            var currentTable;

            lines.map( function( line )
            {
                var currentMatch;
                Object.keys( mappings.markdownToLatexMappings ).map( function( regex )
                {
                    line = line.replace( new RegExp( regex, 'g' ), function( match, g1, g2 )
                    {
                        var m = simpleClone( mappings.markdownToLatexMappings[ regex ] );
                        if( !m.state || !currentMatch || m.simple || m.break )
                        {
                            if( !m.simple )
                            {
                                var previousState = states.length > 0 ? states[ states.length - 1 ].state : undefined;
                                currentMatch = m;
                                if( m.break )
                                {
                                    currentMatch.state = previousState;
                                }
                            }

                            if( m.codeBlock === false )
                            {
                                codeBlock = false;
                            }
                            else if( m.latex === false )
                            {
                                verbatim = false;
                            }

                            if( codeBlock === false && verbatim === false )
                            {
                                if( typeof ( g1 ) === "string" && g2 && g1.replace( /\s/g, '' ) === "" )
                                {
                                    currentMatch.level = g1.length / 4;
                                }
                                var updated = m.replacement ? m.replacement : match;
                                var groups = arguments;
                                if( m.groups )
                                {
                                    m.groups.map( function( group )
                                    {
                                        updated = updated.replace( new RegExp( '\\$' + group, 'g' ), groups[ group ] );
                                    } );
                                }
                                if( m.state === 'tabularx' )
                                {
                                    currentMatch.elements = match.split( '|' ).filter( function( e ) { return e.length > 0; } );
                                    updated = currentMatch.elements.join( " & " ) + "\\\\ \\hline";
                                }

                                if( match === "<!-- break -->" )
                                {
                                    currentMatch.break = true;
                                }

                            }
                            else
                            {
                                updated = match;
                            }

                            if( m.codeBlock === true )
                            {
                                codeBlock = true;
                            }
                            else if( m.latex === true )
                            {
                                verbatim = true;
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
                        if( currentMatch.state === 'tabularx' )
                        {
                            var cells = currentMatch.elements;
                            var widest = 0;
                            var widestWidth = 0;
                            cells = cells.map( function( cell, index )
                            {
                                if( cell.length > widestWidth )
                                {
                                    widestWidth = cell.length;
                                    widest = index;
                                }
                                return "\\textbf{" + cell.trim() + "}";
                            } );
                            var format = "|";
                            cells.map( function( cell, index )
                            {
                                format += ( index === widest ? "X" : "l" ) + "|";
                            } );

                            currentTable = {
                                header: "\\begin{tabularx}{\\textwidth}{" + format + "}\\hline\\rowcolor[gray]{0.9}\n" + cells.join( " & " ) + "\\\\ \\hline"
                            }
                            newLines.push( currentTable.header );
                            currentMatch.ignore = true;
                        }
                        else
                        {
                            newLines.push( indentation( 0 ) + "\\begin{" + currentMatch.state + "}" );
                        }
                        states.push( { state: currentMatch.state, level: currentMatch.level } );
                    }

                }
                if( currentMatch && currentMatch.break )
                {
                    if( currentTable )
                    {
                        newLines.push( "\\end{tabularx}" );
                        newLines.push( "" );
                        newLines.push( currentTable.header );
                    }
                    else
                    {
                        newLines.push( "\\pagebreak" );
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
        convert( ".md", function( lines )
        {
            var newLines = [];
            var currentState;
            var codeBlock = false;

            lines.map( function( line )
            {
                var currentMatch;
                Object.keys( mappings.latexToMarkdownMappings ).map( function( regex )
                {
                    line = line.replace( new RegExp( regex, 'g' ), function( match, g1, g2 )
                    {
                        var m = mappings.latexToMarkdownMappings[ regex ];
                        currentMatch = m;

                        if( m.codeBlock === false )
                        {
                            codeBlock = false;
                        }

                        if( codeBlock === false )
                        {
                            var updated = m.replacements ? m.replacements[ currentState ]
                                : ( m.replacement ? m.replacement : match );

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
                                var cells = updated.substr( 0, updated.indexOf( "\\\\ \\hline" ) ).split( '&' );
                                cells = cells.map( function( cell )
                                {
                                    var cell = cell.trim();
                                    return ( cell.indexOf( "\\textbf{" ) === 0 && cell.substr( -1 ) === "}" ) ? cell.substr( 8, cell.length - 9 ) : cell;
                                } );
                                currentMatch.elements = cells.filter( function( e ) { return e.length > 0; } );
                                updated = "| " + currentMatch.elements.join( " | " ) + " |";
                                if( currentState !== "table" )
                                {
                                    updated += "\n|" + ( ( "-|" ).repeat( cells.length ) );
                                }
                            }
                        } else
                        {
                            updated = match;
                        }

                        if( m.codeBlock === true )
                        {
                            codeBlock = true;
                        }

                        return updated;
                    } );
                } );
                if( currentMatch && currentMatch.state )
                {
                    if( currentMatch.state.length > 0 )
                    {
                        currentState = currentMatch.state;
                    }
                    else
                    {
                        currentState = undefined;
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
