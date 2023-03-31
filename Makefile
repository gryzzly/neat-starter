DENO_VERSION=1.32.1
DENO_INSTALL := vendor
include deno.mk

.PHONY: build start

start: build
	$(MAKE) -j 2 server watch
	
server: 
	python3 -m http.server --directory ./build

watch: 
	# $(call deno) run -A --watch='./**/*.js,./**.html' src/build.js
	chokidar --silent "**/*.js" "**.html" -i "build/**" -c "$(MAKE) build"
	
build: $(DENO_BIN)
	@$(call deno, run -A src/build.js)
	@cp -r admin	build/
	@cp -r html build/
	@mkdir -p build/content
	@cp -r content/img build/content