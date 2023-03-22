.PHONY: build start

build:
	node build.js
	cp -r admin	build/

start: 
	python3 -m http.server build