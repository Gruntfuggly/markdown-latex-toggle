function compileLine(line, properties)
{
    compiledLine = line.replace( /@@(.*?)(\[(.*?)\])?(\!.*?\!)?(\{(.*?)\})?@@/g, function (match, varName, arraySpec, arrayIndex, options, interSpec, inter) {
        if (varName in properties) {
            propIndex = (arraySpec && arrayIndex && arrayIndex.length > 0) ? (parseInt(arrayIndex) || 0) : 0;
            if (arraySpec && !arrayIndex) {
                inter = inter ? inter.replace(/\\n/g, "\n") : "";
                inter = inter ? inter.replace(/\\\\/g, "\\") : "";

                property = properties[varName];

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
                    return p.replace(/\|/g, "\\textbar ");
                });

                compiledProp = property.join(inter || "");
            }
            else {
                compiledProp = properties[varName][propIndex];
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
