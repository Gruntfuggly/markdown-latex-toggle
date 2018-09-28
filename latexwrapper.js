const os = require('os');
const fs = require( 'fs' );
const path = require( 'path' );
const pcompiler = require( './properties.js' );

function defaultTemplatePath()
{
    var homedir = os.homedir();
    return path.join( homedir, 'document-templates' );
}

function templatePath()
{
    return process.env.DOCUMENT_TEMPLATES_DIR || defaultTemplatePath();
}

function parseProperties( lines )
{
    properties = {};

    inProperties = false; // until we find "properties-begin", then it's true

    lines.map( function( line )
    {
        line = line.replace(/(\r\n|\n|\r)/gm, "");

        if (!inProperties && line.match(/!properties-begin!/)) {
            inProperties = true;
        }
        else if (inProperties && line.match(/!properties-end!/)) {
            inProperties = false;
        }

        if (inProperties) {

            re = new RegExp("[\\s]*([^=]+)=[\\s]*(.*)$");

            groups = line.match(re);
            //console.log(groups);

            if (groups && groups.length >= 3) {
                key = groups[1].trim();
                value = groups[2].trim();

                if (key in properties) {
                    properties[key].push(value);
                }
                else {
                    properties[key] = [value];
                }
            }

        }
    } );

    return properties;
};

function wrapperTemplate(templateName)
{
    lines = [];

    if (templateName) {
        templateFullname = path.join(templatePath(), templateName + '.tex');
        lines = fs.readFileSync( templateFullname ).toString().split(/\r?\n/);
    }

    return lines;
}

function compileLatexWrapper(properties)
{
    var templateFilename = (properties["template"] || [undefined])[0];

    template = wrapperTemplate(templateFilename);
    compiled = [];
    template.forEach( function(templateLine) {
        compiledLines = pcompiler.compileLine(templateLine, properties);
        compiled.push.apply(compiled, compiledLines);
    } );

    return compiled;
};

function writeLatexWrapper(filename, lines)
{
    fs.writeFileSync(filename, lines.join('\n')+'\n');
}

function createLatexWrapper( sourceFilename )
{
    var lines = fs.readFileSync( sourceFilename ).toString().split( /\r?\n/ );
    var properties = parseProperties( lines );

    var sourceFilenameKey = "__md-source-filename";
    properties[sourceFilenameKey] = properties[sourceFilenameKey] || [ path.basename(sourceFilename).replace(/ /g, '_') ];

    wrapperLines = compileLatexWrapper(properties);

    var wrapperFilename = sourceFilename + '.wrapper.tex';

    writeLatexWrapper(wrapperFilename, wrapperLines);
};


module.exports.createLatexWrapper = createLatexWrapper;
