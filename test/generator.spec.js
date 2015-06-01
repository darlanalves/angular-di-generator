var expect = require('expect.js');
var angular = require('./angular.mock');
var Generator = require('../angular-di/Generator');

describe('Generator', function() {
    describe('.module(name, [requires])', function() {
        it('should generate the syntax to create a module with its dependencies', function() {
            var product = Generator.module('app');

            expect(product).to.be("angular.module('app')");
        });

        it('should generate the syntax to get a module', function() {
            var requires = ['foo', 'bar'];
            var product = Generator.module('app', requires);

            expect(product).to.be("angular.module('app', ['foo', 'bar'])");
        });
    });

    describe('.injectableType(name, value)', function() {
        it('should declare a filter', function() {
            var product = Generator.filter('lowcase', 'lowcase');
            expect(product).to.be(".filter('lowcase', lowcase);");
        });

        it('should declare a factory', function() {
            var product = Generator.factory('Foo', 'FooFactory');
            expect(product).to.be(".factory('Foo', FooFactory);");
        });

        it('should declare a service', function() {
            var product = Generator.service('Foo', 'FooService');
            expect(product).to.be(".service('Foo', FooService);");
        });

        it('should declare a provider', function() {
            var product = Generator.provider('Foo', 'FooServiceProvider');
            expect(product).to.be(".provider('Foo', FooServiceProvider);");
        });

        it('should declare an animation', function() {
            var product = Generator.animation('slide', 'SlideAnim');
            expect(product).to.be(".animation('slide', SlideAnim);");
        });

        it('should declare a controller', function() {
            var product = Generator.controller('MyController', 'MyController');
            expect(product).to.be(".controller('MyController', MyController);");
        });

        it('should declare a directive', function() {
            var product = Generator.directive('component', 'cmpDirective');
            expect(product).to.be(".directive('component', cmpDirective);");
        });

        it('should declare a value', function() {
            var product = Generator.value('component', 'cmpDirective');
            expect(product).to.be(".value('component', cmpDirective);");
        });
    });

    describe('.runnableBlock(value)', function() {
        it('should declare a config block', function() {
            var product = Generator.config('configApp');
            expect(product).to.be(".config(configApp);");
        });

        it('should declare a run block', function() {
            var product = Generator.run('onRun');
            expect(product).to.be(".run(onRun);");
        });
    });

    describe('$inject value', function() {
        it('should generate the injection annotation', function() {
            var product = Generator.inject(['Foo', 'Bar']);
            expect(product).to.be(".$inject = ['Foo', 'Bar'];");
        });
    });
});
