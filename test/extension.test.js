/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');
pcompiler = require('../properties.js');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');


// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    test("Property Compiler - empty line returns empty line", function () {
        line = "";
        properties = {};

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            ""
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - line with no properties returns same", function () {
        line = "Fish";
        properties = {};

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "Fish"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - line with property gets value", function () {
        line = "@@prop@@";
        properties = { "prop": ["value"] };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - line with property gets value with escaped special characters", function () {
        line = "@@prop@@";
        properties = { "prop": ["& % $ # _ { } \\~ ^ \\\\"] };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "\\& \\% \\$ \\# \\_ \\{ \\} \\textasciitilde \\textasciicircum \\textbackslash"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - line with property gets value with escaped per", function () {
        line = "@@prop@@";
        properties = { "prop": ["value & energy"] };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value \\& energy"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - unknown property", function () {
        line = "@@prop@@";
        properties = { "property": ["value"] };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "@@ property prop is undefined! @@"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - line with property and option spec gets value", function () {
        line = "@@prop!option!@@";
        properties = { "prop": ["value"] };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - line with two properties gets compiled", function () {
        line = "@@prop1@@ @@prop2@@";
        properties = {
            "prop1": ["value1"],
            "prop2": ["value2"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1 value2"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - second value of property gets compiled", function () {
        line = "@@prop1[0]@@ @@prop1[1]@@";
        properties = {
            "prop1": ["value1", "value2"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1 value2"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - second value of property with option spec gets compiled", function () {
        line = "@@prop1[0]@@ @@prop1[1]!option!@@";
        properties = {
            "prop1": ["value1", "value2"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1 value2"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - all values of property get compiled with no separator", function () {
        line = "@@prop1[]@@";
        properties = {
            "prop1": ["value1", "value2"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1value2"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - all values of property get compiled with no separator (empty separator)", function () {
        line = "@@prop1[]{}@@";
        properties = {
            "prop1": ["value1", "value2"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1value2"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - all values of property get compiled with separator", function () {
        line = "@@prop1[]{-}@@";
        properties = {
            "prop1": ["value1", "value2", "value3"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1-value2-value3"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - all values of property get compiled with suffix including newline", function () {
        line = "@@prop1[]{\\n}@@";
        properties = {
            "prop1": ["value1", "value2", "value3"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1",
            "value2",
            "value3"
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - all values of property get compiled with separator including multiple newline", function () {
        line = "@@prop1[]{\\n\\n}@@";
        properties = {
            "prop1": ["value1", "value2", "value3"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1",
            "",
            "value2",
            "",
            "value3",
        ];
        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - all values of property get compiled with separator having escaped backslashes", function () {
        line = "@@prop1[]{ \\\\hline \\n}@@";
        properties = {
            "prop1": ["value1", "value2", "value3"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value1 \\hline ",
            "value2 \\hline ",
            "value3",
        ];

        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - convert as table - vertical bar to Latex ampersand", function () {
        line = "@@prop1[]!as-table!{ \\\\hline \\n}@@";
        properties = {
            "prop1": ["one|two", "three|four", "five | six"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "one & two \\hline ",
            "three & four \\hline ",
            "five  &  six",
        ];

        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - convert as table - escaped vertical bar not converted to Latex ampersand", function () {
        line = "@@prop1[]!as-table!{\\n}@@";
        properties = {
            "prop1": ["one\\|two|three", "four|five\\|six"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "one\\textbar two & three",
            "four & five\\textbar six"
        ];

        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - convert as table - tilde to newline command", function () {
        line = "@@prop1[]!as-table!{\\n}@@";
        properties = {
            "prop1": ["one|two|thr~ee"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "one & two & thr\\newline ee"
        ];

        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - no-escaping option doesn't escape special chars", function () {
        line = "@@prop!no-escaping!@@";
        properties = {
            "prop": ["& % $ # { } _ ~ ^ \\ |"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "& % $ # { } _ ~ ^ \\ |"
        ];

        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - reference definitions converted to LaTeX command", function () {
        line = "@@prop@@";
        properties = {
            "prop": ["xxx [[ABC]] zzz"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "xxx \\docref{ABC} zzz"
        ];

        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });

    test("Property Compiler - reference definitions not converted with !no-escaping!", function () {
        line = "@@prop!no-escaping!@@";
        properties = {
            "prop": ["xxx [[ABC]] zzz"]
        };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "xxx [[ABC]] zzz"
        ];

        assert.deepEqual(actualCompiledLines, expectedCompiledLines);
    });


});
