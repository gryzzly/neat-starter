.PHONY: build start

build:
	node build.js
	cp -r admin	build/
	mkdir -p build/content
	cp -r content/img build/content

start: build 
	python3 -m http.server --directory ./build