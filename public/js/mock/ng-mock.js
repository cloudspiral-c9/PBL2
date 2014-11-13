'use strict';

(function() {

  angular.module('recipeers').run(function($httpBackend) {

    $httpBackend.whenGET(/^view\//).passThrough();

    $httpBackend.when('GET', '/recipelist').respond([{
      rid: 1,
      title: 'recipe1',
      description: "desc1",
      sender: '',
      timestamp: new Date(10000)
    }, {
      rid: 2,
      title: 'recipe2',
      description: "desc2",
      sender: '',
      timestamp: new Date(20000)
    }, {
      rid: 2,
      title: 'recipe2',
      description: "desc2",
      sender: '',
      timestamp: new Date(30000)
    }]);

    $httpBackend.when('GET', '/chats').respond([{
      message: 'mess1',
      sender: 'se1',
      timestamp: new Date(10000)
    }, {
      message: 'mess2',
      sender: 'se2',
      timestamp: new Date(20000)
    }, {
      message: 'mess3',
      sender: 'se3',
      timestamp: new Date(30000)
    }]);

    $httpBackend.when('GET', '/chart').respond([{
      ingredient: 'in1',
      rate: 0.4,
      rateDetail: '40g/100g'
    }, {
      ingredient: 'in2',
      rate: 1.2,
      rateDetail: '120g/100g'
    }, {
      ingredient: 'in3',
      rate: 0.8,
      rateDetail: '80g/100g'
    }]);

    $httpBackend.when('GET', '/ingredients').respond([{
      ingredient: 'in1',
      amount: 100,
      sender: 'sen1',
      timestamp: new Date(10000)
    }, {
      ingredient: 'in2',
      amount: 200,
      sender: 'sen2',
      timestamp: new Date(20000)
    }, {
      ingredient: 'in3',
      amount: 300,
      sender: 'sen3',
      timestamp: new Date(30000)
    }]);

    $httpBackend.when('GET', '/kinds').respond({
      tomato:'g',
      banana: 'hon',
      sugar: 'ko'
    });

    $httpBackend.when('GET', '/processes').respond([{
      process: 'pro1',
      sender: 'se1',
      timestamp: new Date(10000)
    }, {
      process: 'pro2',
      sender: 'se2',
      timestamp: new Date(20000)
    }, {
      process: 'pro3',
      sender: 'se3',
      timestamp: new Date(30000)
    }]);

  });

})();
