
var litmus = require('litmus'),
    amdtools = require('../lib/amdtools');

exports.test = new litmus.Test('amd conversions test', function () {
    var test = this;

    test.plan(2);

    test.is(
        amdtools.commonJsToAmd('// body javascript'),
        'define(["require","exports","module"],function(require,exports,module){// body javascript\n});',
        'basic amd conversion'
    );

    test.is(
        amdtools.commonJsToAmd('require("blah");'),
        'define(["require","exports","module","blah"],function(require,exports,module){require("blah");\n});',
        'amd conversion with embedded require call'
    );

});


