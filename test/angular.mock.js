var angular = {
    module: moduleFactory
};

function moduleFactory(name, requires) {
    return new AngularModule(name, requires);
}

module.exports = angular;

function AngularModule(name, requires) {
    this.name = name;
    this.requires = requires;
    this.$configure = [];
    this.$run = [];
    this.$$providers = {};
    this.$const = {};
}

AngularModule.prototype = {
    constructor: AngularModule,
    injector: makeInjector,
    directive: directive,
    value: value,
    provider: provider,
    factory: factory,
    filter: filter,
    service: service,
    animation: animation,
    controller: controller,
    start: start,

    config: configFn,
    run: runFn,
    constant: constant,

    provide: provide
};

function start() {
    var self = this;

    this.$configure.forEach(function(f) {
        f.call(self);
    });

    this.$run.forEach(function(f) {
        f.call(self);
    });
}

function makeInjector() {
    return {
        get: getFromInjector.bind(this)
    };
}

function provide(type, name, value) {
    var $provide = this.$$providers,
        provider;

    switch (type) {
        case 'provider':
            provider = value;
            break;

        case 'service':
        case 'controller':
            provider = function() {
                this.$get = function() {
                    return new value();
                };
            };
            break;

        case 'factory':
        case 'value':
        case 'filter':
        case 'directive':
        case 'animation':
            provider = function() {
                this.$get = value;
            };
            break;
    }

    $provide[name] = provider;
}

/**
 * .value(name, value);
 */
function value(name, _value) {
    this.provide('value', name, valueFn(_value));
    return this;
}

function factory(name, value) {
    this.provide('factory', name, value);
    return this;
}

function service(name, value) {
    this.provide('service', name, value);
    return this;
}

function provider(name, value) {
    this.provide('provider', name, value);
    return this;
}

function filter(name, value) {
    this.provide('filter', name + 'Filter', value);
    return this;
}

function directive(name, value) {
    this.provide('directive', name + 'Directive', value);
    return this;
}

function animation(name, value) {
    this.provide('animation', name, value);
    return this;
}

function controller(name, value) {
    this.provide('controller', name, value);
    return this;
}

function configFn(fn) {
    this.$configure.push(fn);
    return this;
}

function runFn(fn) {
    this.$run.push(fn);
    return this;
}

function constant(name, value) {
    this.$const[name] = value;
    return this;
}

/**
 * @return {Function} fn
 */
function valueFn(value) {
    return function() {
        return value;
    };
}

function getFromInjector(name) {
    if (this.$const[name]) return this.$const[name];

    var $provide = this.$$providers;
    var Provider = name in $provide ? $provide[name] : null;

    if (!Provider) return null;
    var value = new Provider();

    if (!value.$get) {
        throw new Error('Invalid provider.$get on ' + name);
    }

    var Getter = value.$get;
    var instance = Getter.call(null);

    if (!instance) {
        instance = new Getter();
    }

    return instance;
}
