This project is currently a prototype. It contains functions to convert between AMD and CommonJS modules:

    var amdtools = require('amdtools');
    
    var amdCode = amdtools.commonJsToAmd('...commonjs module code...');
    var commonJsCode = amdtools.amdToCommonJs('...amd module code...');

Note that it adds some boilerplate in each direction, so don't expect to be able to perform both conversions
end up with what you started with. The default boilerplate for amdToCommonJs is fairly minimal, but the
converted module depends on amdtools (see the "standalone" option below).

Both functions take an optional object second parameter containing options. These options are:

commonJsToAmd Options
---------------------

* name - if specified adds a module id to the generated AMD module.


amdToCommonJsOptions
--------------------

* standalone - if specified a much larger piece of boilerplate is added to the module, but the result
               does not depend on amdtools.

Copyright & Licensing
=====================

Copyright (C) 2011 by Tom Yandell.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


