
// rules - these are converted into RegExps by removing comments and whitespace, escaping forward slashes,
// adding \h for horizontal whitespace ([ \t]) and adding the "g" modifier - see the Makefile
// for example rule{ hello \h* }x is converted to /hello[ \t]*/g
var ignoreRule = rule{
        " (?: [^\"\\]+ | \\ [\s\S] )* " // double quoted strings
    |   ' (?: [^\'\\]+ | \\ [\s\S] )* ' // single quoted strings
    |   /    // regular expression literals
        (?:
            [^*\\/\[\n]                         // ordinary char
        |   \\ [^\\n]                           // escape sequence
        |   \[ (?: [^\n\]\\]+ | \\ [^\\n] )* \] // character class
        ) /
    |   / / [^\n]* (?: \n | $ )                 // single line comments
    |   / \* (?: [^\*]+ | \ [^\*/] )* \* /      // multi-line comments
}x;

var requireStatementRule = rule{
    \b require \( \s* (
        " (?: [^\\\"]+ | \\ [\S\s] )* "
    |   ' (?: [^\\\']+ | \\ [\S\s] )* '
    ) \s* \)
}x;

exports.commonJsToAmd = function (body) {
    var def = 'define(["require","exports","module"',
        stripped = body.split(ignoreRule).join(''),
        res;
    while (res = requireStatementRule.exec(body)) {
        def += ',' + res[1];
    }
    // include a newline in case there is a trailing single line comment
    def += '],function(require,exports,module){' + body + '\n});';
    return def;
};
