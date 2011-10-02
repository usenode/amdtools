
var litmus = require('litmus'),
    amdtools = require('..');

exports.test = new litmus.Test('amd conversions test', function () {
    var test = this;

    test.plan(30);

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

    testCommonJsToAmd(
        'require \n // ... \n /* \n ... \n */ \n ("foo")',
        {},
        '',
        ',"foo"',
        'can have comments before parameters (edge case found by micmath++)'
    );

    testCommonJsToAmd(
        'require("foo"); bar \n . /* \n ... \n */ \n // ... \n require("baz")',
        {},
        '',
        ',"foo"',
        'avoid method call false positive'
    );

    testCommonJsToAmd(
        'require("foo"); /** require("bar") */',
        {},
        '',
        ',"foo"',
        'allow multiple *s in multiline comments (spotted by micmath++)'
    );

    // this cheats a little by re-evaluating the passed in function in a new context, to allow access
    // to a local "define", "mainRequire", "mainExports" and "mainModule" variables to test with
    function testAmdToCommonJs (runner, checker) {
        var required    = {},
            require     = function (what) {
                required[what] = 1;
                return { name: what };
            },
            mainRequire = require,
            exports     = {},
            mainExports = exports,
            module      = { id: 'name' }
            mainModule  = module;
        eval(amdtools.amdToCommonJs('(' + runner.toString() + ')();'));
        checker(required, exports);
    }

    testAmdToCommonJs(
        function () {
            define(function (require, exports, module) {
                test.is(require, mainRequire, 'default first parameter is require');
                test.is(exports, mainExports, 'default second parameter is exports');
                test.is(module, mainModule, 'default third parameter is module');
            });
        },
        function (required, exported) {
            test.is(Object.keys(required).length, 0, 'nothing required by default');
            test.is(Object.keys(exported).length, 0, 'nothing exported by default');
        }
    );

    testAmdToCommonJs(
        function () {
            define('name', function (require, exports, module) {
                test.is(require, mainRequire, 'default first parameter is require for named define');
                test.is(exports, mainExports, 'default second parameter is exports for named define');
                test.is(module, mainModule, 'default third parameter is module for named define');
            });
        },
        function (required, exported) {
            test.is(Object.keys(required).length, 0, 'nothing required by default for named define');
            test.is(Object.keys(exported).length, 0, 'nothing exported by default for named define');
        }
    );

    testAmdToCommonJs(
        function () {
            define(['b', 'c', 'a'], function (first, second, third) {
                test.is(first.name, 'b', 'first dependency loaded');
                test.is(second.name, 'c', 'second dependency loaded');
                test.is(third.name, 'a', 'third dependency loaded');
            });
        },
        function (required, exported) {
            test.is(required, { a: 1, b: 1, c: 1 }, 'require called for each unique dependency');
            test.is(Object.keys(exported).length, 0, 'nothing exported by default when dependencies loaded');
        }
    );

    testAmdToCommonJs(
        function () {
            require(['foo', 'bar'], function (a, b) {
                test.is(a.name, 'foo', 'async style require outside of define');
                test.is(b.name, 'bar', 'async style require outside of define 2');
                define(['require', 'baz'], function (require) {
                    test.is(require('baz').name, 'baz', 'synchronously require within callback');
                });
            });
        },
        function (required, exported) {
            test.is(required, { foo: 1, bar: 1, baz: 1 }, 'async and sync-style require called');
        }
    );
});


