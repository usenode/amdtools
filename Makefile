
lib/amdtools.js: lib/amdtools.src.js
	chmod +w lib/amdtools.js && (perl -e 'undef $$/; $$_ = <STDIN>; s{rule{(.*?)}x}{$$a=$$1;$$a =~ s{//.*?$$}{}gm; $$a =~ s/\s+//gs; $$a =~ s/\\h/[ \\t]/g; $$a =~ s{/}{\\/}g; "/$$a/g"}sge; print' < lib/amdtools.src.js > lib/amdtools.js) && chmod -w lib/amdtools.js

./node_modules/.bin/litmus:
	npm install litmus

test: lib/amdtools.js ./node_modules/.bin/litmus
	./node_modules/.bin/litmus tests/suite.js

