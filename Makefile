DENO_VERSION=1.32.1
DENO_INSTALL := vendor
include deno.mk

.PHONY: build start

start: build
	+make -j2 server watch
	
server: 
	python3 -m http.server --directory ./build

watch: $(DENO_BIN)
	# https://stackoverflow.com/q/75903719/236135 (still doesn’t work)
	# $(call deno) run --watch=$(deno eval -p 'Deno.args.join(",")' ./**/*.{html,js})  -A src/build.js
	chokidar --silent "**/*.js" "**.html" -i "build/**" -c "$(MAKE) build"
	
build: $(DENO_BIN)
	$(call deno) run -A src/build.js
	@cp -r admin	build/
	@cp -r src/html build/
	@mkdir -p build/content
	@cp -r content/img build/content