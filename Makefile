DENO_VERSION=1.32.1
DENO_INSTALL := vendor
include deno.mk

.PHONY: build start static

start: static
	+make -j2 watch server
	
server: 
	python3 -m http.server --directory ./build

watch: $(DENO_BIN)
	# https://stackoverflow.com/q/75903719/236135
	# glob expands to space separated list of filenames, where 
	# watch expects comma separated list, that is why we need to use printf
	$(call deno) run --watch="$(printf "%s," ./src/**/*.{html,js})"  -A src/build.js

static:
	mkdir -p build
	cp -r ./src/{html,admin} build/
	mkdir -p build/content && cp -r content/img build/content
	
build: static $(DENO_BIN)
	$(call deno) run -A src/build.js
