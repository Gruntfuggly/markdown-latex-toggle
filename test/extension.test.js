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

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }

    return true;
}


// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    test("Property Compiler - empty line returns empty line", function () {
        line = "";
        properties = {};

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            ""
        ];
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
    });

    test("Property Compiler - line with no properties returns same", function () {
        line = "Fish";
        properties = {};

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "Fish"
        ];
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
    });

    test("Property Compiler - line with property gets value", function () {
        line = "@@prop@@";
        properties = { "prop": ["value"] };

        actualCompiledLines = pcompiler.compileLine(line, properties);

        expectedCompiledLines = [
            "value"
        ];
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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
        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
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

        if(!arraysEqual(expectedCompiledLines, actualCompiledLines)) {
            console.log(expectedCompiledLines);
            console.log(actualCompiledLines);
        }

        assert(arraysEqual(expectedCompiledLines, actualCompiledLines));
    });
});
