TAILWIND_EXE := $(CURDIR)/tailwindcss.exe
INPUT_CSS := $(CURDIR)/input.css
OUTPUT_CSS := $(CURDIR)/../src/static/styles/tailwind.css


all:
	@echo "Usage: make [watch|minify]"


watch:
	$(TAILWIND_EXE) -i $(INPUT_CSS) -o $(OUTPUT_CSS) --watch


minify:
	$(TAILWIND_EXE) -i $(INPUT_CSS) -o $(OUTPUT_CSS) --minify


.PHONY: all watch minify
