var Generator = {};
var Util = require('util');

['controller', 'filter', 'directive', 'service', 'factory', 'provider', 'animation', 'value'].forEach(function(type) {
    Generator[type] = function(moduleObj, name, value) {
        return makeInjectable(type, moduleObj, name, value);
    };
});

['config', 'run'].forEach(function(type) {
    Generator[type] = function(moduleObj, value) {
        return makeRunnable(type, moduleObj, value);
    };
});

function makeModule(name, requires) {
    if (requires) {
        requires = wrapInQuotes(requires);
        requires = "[" + requires.join(', ') + "]";

        return Util.format("angular.module('%s', %s)", name, requires);
    }

    return Util.format("angular.module('%s')", name);
}

function makeInjectable(type, name, value) {
    return Util.format(".%s('%s', %s);", type, name, value);
}

function makeInjection(injectables) {
    injectables = wrapInQuotes(injectables);
    return Util.format('.$inject = [%s];', injectables.join(', '));
}

function makeRunnable(type, value) {
    return Util.format(".%s(%s);", type, value);
}

function Module(name, requires) {
    this.name = name;
    this.requires = requires;
}

// Module

Generator.module = makeModule;
Generator.inject = makeInjection;
Generator.Module = Module;

module.exports = Generator;

function wrapInQuotes(list) {
    return (list || []).map(function(item) {
        return "'" + item + "'";
    });
}
