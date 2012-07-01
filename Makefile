# Makefile for github.js
# Author: Hsiaoming Yang <lepture@me.com>
# Website: http://lepture.com

.PHONY: doc upload publish


doc:
	doki.py -l js -t default --title=github.js --github=github.js README.md > index.html

publish:
	git push origin gh-pages

minify:
	uglifyjs -nc github.js > dist/github.min.js
