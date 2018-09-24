function compileLine(line, properties)
{
    compiledLine = line.replace( /@@(.*?)(\[(.*?)\])?(\{(.*?)\})?@@/g, function (match, varName, arraySpec, arrayIndex, interSpec, inter) {
        propIndex = (arraySpec && arrayIndex && arrayIndex.length > 0) ? (parseInt(arrayIndex) || 0) : 0;
        if (arraySpec && !arrayIndex) {
            inter = inter ? inter.replace(/\\n/g, "\n") : "";
            inter = inter ? inter.replace(/\\\\/g, "\\") : "";
            compiledProp = (varName in properties) ? properties[varName].join(inter || "") : ("@@ " + varName + " is undefined! @@");
        }
        else {
            compiledProp = (varName in properties) ? properties[varName][propIndex] : ("@@ " + varName + " is undefined! @@");
        }
        return compiledProp;
    } );

    return compiledLine.split('\n');
}

module.exports.compileLine = compileLine;
