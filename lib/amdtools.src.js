
// rules - these are converted into RegExps by removing comments and whitespace, escaping forward slashes,
// adding \h for horizontal whitespace ([ \t]) and adding the "g" modifier - see the Makefile
// for example rule{ hello \h* }x is converted to /hello[ \t]*/g
// if you're looking at amdtools.js, look at amdtools.src.js instead

var commentStripper = rule{
        (
            " (?: [^\"\\]+ | \\ [\s\S] )* " // double quoted string
        |   ' (?: [^\'\\]+ | \\ [\s\S] )* ' // single quoted string
        )
    |   / / [^\n]* (?: \n | $ )             // single line comment
    |   / \* (?: [^\*]+ | \* [^\*/] )* \* / // multi-line comment

}x;

var matcher = rule{
        \b require \s* \( \s* (
            " (?: [^\"\\]+ | \\ [\s\S] )* " // double quoted string
        |   ' (?: [^\'\\]+ | \\ [\s\S] )* ' // single quoted string
        ) \s* \)
    |   " (?: [^\"\\]+ | \\ [\s\S] )* "     // double quoted string
    |   ' (?: [^\'\\]+ | \\ [\s\S] )* '     // single quoted string
    |   / (?:   // regular expression literals
            [^*\\/\[\n]                         // ordinary char
        |   \\ [^\\n]                           // escape sequence
        |   \[ (?: [^\n\]\\]+ | \\ [^\\n] )* \] // character class
        )+ /
}x;

var methodCallMatcher = rule{
    \.
    (?:
        \s+                                     // whitespace
        |   / / [^\n]* (?: \n | $ )             // single line comment
        |   / \* (?: [^\*]+ | \* [^\*/] )* \* / // multi-line comment
    )*
    $
}x;

function stringLiteralToString (literal) {
    return eval(literal);
}

exports.commonJsToAmd = function (body, options) {

    var stripped = body.replace(commentStripper, function (match, stringLiteral) {
        return stringLiteral || '';
    });

    var definition = 'define(',
        result,
        dependencies = {},
        position;

    if (options && options.name) {
        definition += JSON.stringify(options.name) + ',';
    }

    definition += '["require","exports","module"';

    while (res = matcher.exec(stripped)) {
        if (! res[1]) {
            continue;
        }
        position = matcher.lastIndex;
        if (methodCallMatcher.test(stripped.substring(0, position - res[0].length))) {
            continue;
        }
        if (res[1]) {
            dependencies[stringLiteralToString(res[1])] = 1;
        }
    }

    var names = Object.keys(dependencies).sort();

    for (var i = 0, l = names.length; i < l; i++) {
        definition += ',' + JSON.stringify(names[i]);
    } 

    // include a newline in case there is a trailing single line comment
    definition += '],function(require,exports,module){' + body + '\n});';

    return definition;
};

