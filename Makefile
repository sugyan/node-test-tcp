TESTS = $(shell find test/*.js)

test:
	./node_modules/.bin/mocha $(TESTS)

.PHONY: test
