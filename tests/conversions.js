
var litmus = require('litmus'),
    amdtools = require('../lib/amdtools');

exports.test = new litmus.Test('amd conversions test', function () {
    var test = this;

    test.plan(8);

    function testCommonJsToAmd (body, options, namePart, dependenciesPart, name) {
        test.is(
            amdtools.commonJsToAmd(body, options),
            'define(' + namePart + '["require","exports","module"' + dependenciesPart + '],function(require,exports,module){' + body + '\n});',
            name
        );
    }

    testCommonJsToAmd(
        '// body javascript',
        {},
        '',
        '',
        'basic amd conversion'
    );

    testCommonJsToAmd(
        'require(\'foo\')',
        {},
        '',
        ',"foo"',
        'amd conversion with require call'
    );

    testCommonJsToAmd(
        'require(\'foo\');require("bar");require("\\x66\\x6f\\x6f");require(\'bar\');',
        {},
        '',
        ',"bar","foo"',
        'duplicate require calls removed and list determinate'
    );

    testCommonJsToAmd(
        'require("foo"); /* require("bar"); */',
        {},
        '',
        ',"foo"',
        'require in multiline comments ignored'
    );

    testCommonJsToAmd(
        'require("foo"); // require("bar");\n// require("baz");\n require("baz")',
        {},
        '',
        ',"baz","foo"',
        'require in single line comments ignored'
    );

    testCommonJsToAmd(
        'require("foo"); if (/require("bar")/i.test(""));',
        {},
        '',
        ',"foo"',
        'require in RegExp ignored'
    );

    testCommonJsToAmd(
        'require("foo"); \'require("bar");\'; "require(\'baz\');";',
        {},
        '',
        ',"foo"',
        'require in string literals ignored'
    );

    testCommonJsToAmd(
        'require("foo")',
        { name: 'bar' },
        '"bar",',
        ',"foo"',
        'can provide optional name'
    );
});


