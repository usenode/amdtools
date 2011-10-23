
lib/amdtools.js: lib/amdtools.src.js
	touch lib/amdtools.js && chmod +w lib/amdtools.js && (perl -e 'undef $$/; $$_ = <STDIN>; s{rule{(.*?)}x}{$$a=$$1;$$a =~ s{//.*?$$}{}gm; $$a =~ s/\s+//gs; $$a =~ s/\\h/[ \\t]/g; $$a =~ s{/}{\\/}g; "/$$a/g"}sge; print' < lib/amdtools.src.js > lib/amdtools.js) && chmod -w lib/amdtools.js

./node_modules/.bin/litmus:
	npm install litmus

test: lib/amdtools.js ./node_modules/.bin/litmus
	./node_modules/.bin/litmus tests/suite.js

publish: lib/amdtools.js
	@echo current version is `perl -ne 'print /"version"\s*:\s*"(\d+\.\d+\.\d+)"/' package.json` && \
	perl -e 'print "new version? "' && \
	read new_version && \
	perl -i -pe 's/("version"\s*:\s*\")(?:|\d+\.\d+\.\d+)(")/$$1."'$$new_version'".$$2/e' package.json && \
	git commit -m 'Version for release' package.json && \
	git tag v$$new_version && \
	git push --tags && \
	npm publish https://github.com/usenode/amdtools/tarball/v$$new_version
