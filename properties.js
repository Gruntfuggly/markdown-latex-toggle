function compileLine(line, properties)
{
    compiledLine = line.replace( /@@(.*?)(\[(.*?)\])?(\!.*?\!)?(\{(.*?)\})?(\?\{(.*?)\})?@@/g, function (match, varName, arraySpec, arrayIndex, options, interSpec, inter, elsespec, elsetext) {
        if (varName in properties) {
            property = properties[varName];

            if (!options || !options.includes('no-escaping')) {
                property = property.map( function(p) {
                    p = p.replace(/&/g, "\\&");
                    p = p.replace(/%/g, "\\%");
                    p = p.replace(/\$/g, "\\$$"); // double $ for replace() rules
                    p = p.replace(/#/g, "\\#");
                    p = p.replace(/\{/g, "\\{");
                    p = p.replace(/\}/g, "\\}");
                    p = p.replace(/_/g, "\\_");
                    p = p.replace(/\\~/g, "\\textasciitilde");
                    p = p.replace(/\^/g, "\\textasciicircum");
                    p = p.replace(/\\\\/g, "\\textbackslash");
                    // make sure these are done last, so as not to escape replacement string!
                    p = p.replace( /\[\[(.+?)\]\]/g, "\\docref{$1}" );
                    p = p.replace( /\[([A-Za-z][A-Za-z0-9-]*?)\]\(\)/g, "[\\ref{$1}]" );
                    p = p.replace( /\[([\d\.]+\.?)\]\(\)/g, "section \\ref{$1}" );
                    return p;
                });
            }

            propIndex = (arraySpec && arrayIndex && arrayIndex.length > 0) ? (parseInt(arrayIndex) || 0) : 0;

            if (arraySpec && !arrayIndex) {
                inter = inter ? inter.replace(/\\n/g, "\n") : "";
                inter = inter ? inter.replace(/\\\\/g, "\\") : "";

                if (options) {
                    if (options.includes("as-table")) {
                        property = property.map( function(p) {
                            return p.replace(/(.|^)(\|)/g, function (match,g1,g2) {
                                return (g1 === "\\") ? g2 : g1 + " & ";
                            });
                        });
                    }
                }

                property = property.map( function(p) {
                    p = p.replace(/\|/g, "\\textbar ");
                    p = p.replace(/(.|^)(\~)/g, function (match,g1,g2) {
                        return (g1 === "\\") ? g2 : g1 + "\\newline ";
                    });
                    return p;
                });

                compiledProp = property.join(inter || "");
            }
            else {
                if (!options || !options.includes('no-escaping')) {
                    property = property.map( function(p) {
                        p = p.replace(/\|/g, "\\textbar ");
                        p = p.replace(/(.|^)(\~)/g, function (match,g1,g2) {
                            return (g1 === "\\") ? g2 : g1 + "\\newline ";
                        });
                        return p;
                    });
                }

                if (property[propIndex] === undefined) {
                    if (elsetext) {
                        compiledProp = elsetext;
                    }
                    else {
                        compiledProp = "@@ " + varName + "[" + propIndex + "] is undefined! @@";
                    }
                }
                else {
                    compiledProp = property[propIndex];
                }
            }
        }
        else {
            if (elsetext) {
                compiledProp = elsetext;
            }
            else {
                compiledProp = "@@ " + varName + " is undefined! @@";
            }
        }
        return compiledProp;
    } );

    return compiledLine.split('\n');
}

module.exports.compileLine = compileLine;
