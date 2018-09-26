function compileLine(line, properties)
{
    compiledLine = line.replace( /@@(.*?)(\[(.*?)\])?(\!.*?\!)?(\{(.*?)\})?@@/g, function (match, varName, arraySpec, arrayIndex, options, interSpec, inter) {
        if (varName in properties) {
            property = properties[varName];

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
                return p;
            });

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
                property = property.map( function(p) {
                    p = p.replace(/\|/g, "\\textbar ");
                    p = p.replace(/(.|^)(\~)/g, function (match,g1,g2) {
                        return (g1 === "\\") ? g2 : g1 + "\\newline ";
                    });
                    return p;
                });

                compiledProp = property[propIndex];
            }
        }
        else {
            compiledProp = "@@ property " + varName + " is undefined! @@";
        }
        return compiledProp;
    } );

    return compiledLine.split('\n');
}

module.exports.compileLine = compileLine;
