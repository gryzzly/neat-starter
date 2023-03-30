DENO_VERSION=1.32.1
DENO_INSTALL := vendor
include deno.mk

.PHONY: build start

start: build
	make -j 2 server watch
	
server: 
	python3 -m http.server --directory ./build

watch: 
	chokidar "**/*.js" "**.html" -c "make build"
	
build: $(DENO_BIN)
	$(call deno, run -A src/build.js)
	cp -r admin	build/
	cp -r html build/
	mkdir -p build/content
	cp -r content/img build/content