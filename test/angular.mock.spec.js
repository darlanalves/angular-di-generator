var expect = require('expect.js');
var angular = require('./angular.mock');

describe('angular.mock', function() {
    it('should mock the angular modules', function() {
        var app = angular.module('app', ['dep', 'end']);

        function FooProvider() {
            this.$get = function() {
                return 'foo-provider';
            };
        }

        function FooFactory() {
            return {
                foo: true
            };
        }

        function BarService() {
            this.bar = 'bar';
        }

        function bazFilter() {
            return function baz() {
                return 'baz';
            };
        }

        function SlideAnimation() {
            return {
                enter: 'slide'
            };
        }

        function configBlock() {
            app.configured = true;
            expect(!!app.ran).to.be(false);
        }

        function runBlock() {
            app.ran = true;
        }

        function cmpDirective() {
            return {
                scope: true
            };
        }

        function MyController() {
            this.value = 2;
        }

        expect(app.name).to.be('app');
        expect(app.requires).to.eql(['dep', 'end']);

        app.value('foo', 123)
            .constant('FOO', 1)
            .filter('baz', bazFilter)
            .directive('cmp', cmpDirective)
            .service('BarService', BarService)
            .factory('FooFactory', FooFactory)
            .provider('Foo', FooProvider)
            .animation('Slide', SlideAnimation)
            .controller('MyController', MyController)
            .config(configBlock)
            .run(runBlock);

        var injector = app.injector();
        app.start();

        expect(injector.get('Foo')).to.be('foo-provider');
        expect(injector.get('FooFactory').foo).to.be(true);
        expect(injector.get('BarService').bar).to.be('bar');
        expect(injector.get('bazFilter')()).to.be('baz');
        expect(injector.get('cmpDirective').scope).to.be(true);
        expect(injector.get('MyController').value).to.be(2);

        expect(app.configured).to.be(true);
        expect(app.ran).to.be(true);
    });
});
