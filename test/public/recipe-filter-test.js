'use strict';

describe("recipe-filter-test", function() {

  var createFilter;

  beforeEach(module('recipeers.recipe'));

  beforeEach(inject(function($filter) {
    createFilter = function(name) {
      return $filter(name);
    };
  }));
  
  describe("hasKey test", function() {

    it('hasKeyにオブジェクト以外を渡すと、そのまま返ってくる。', function() {
      var hasKey, test;
      hasKey = createFilter('hasKey');

      test = 'test';
      expect(hasKey(test, 't')).toBe('test');

      test = 10;
      expect(hasKey(test, 0)).toBe(10);

      test = function() {};
      expect(hasKey(test, 'f').toString()).toBe(test.toString());
    });

    it('hasKeyにオブジェクトを渡すと、キーにqueryを含むものでフィルターをかける。', function() {
      var hasKey, test;
      hasKey = createFilter('hasKey');

      test = {
        test: 'test',
        func: function() {},
        array: ['test'],
        date: new Date(100)
      };
      expect(_.isEqual(hasKey(test, 's'), {
        test: 'test'
      })).toBe(true);
      expect(_.isEqual(hasKey(test, 0), {})).toBe(true);
      expect(_.isEqual(hasKey(test, 'e'), {
        test: 'test',
        date: test.date
      })).toBe(true);

      test = [
        'test',
        function() {},
        ['test'],
        new Date(100)
      ];
      expect(_.isEqual(hasKey(test, 's'), [])).toBe(true);
      expect(_.isEqual(hasKey(test, '0'), ['test'])).toBe(true);
      expect(_.isEqual(hasKey(test, 0), ['test'])).toBe(true);
    });

  });

});
