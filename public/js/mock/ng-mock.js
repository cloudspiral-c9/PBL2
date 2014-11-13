'use strict';

(function() {

  angular.module('recipeers').run(['$httpBackend', '$cookieStore', function($httpBackend, $cookieStore) {

    $cookieStore.put('user', {
      userID: 'userID',
      userName: 'userName'
    });

    $httpBackend.whenGET(/^view\//).passThrough();

    $httpBackend.when('POST', '/getroomlist').respond([{
      rid: '1',
      title: 'recipe1',
      description: "desc1",
      userID: 'ui1',
      userName: 'un1',
      timestamp: '2014/11/07 07:05:44',
      limit: 3,
      members: [{
        userID: 'ui1',
        userName: 'un1'
      }, {
        userID: 'ui1',
        userName: 'un1'
      }, {
        userID: 'ui1',
        userName: 'un1'
      }]
    }, {
      rid: '2',
      title: 'recipe2',
      description: "desc2",
      userID: 'ui1',
      userName: 'un1',
      timestamp: '2014/11/17 07:05:44',
      limit: 5,
      members: [{
        userID: 'ui1',
        userName: 'un1'
      }, {
        userID: 'ui1',
        userName: 'un1'
      }, {
        userID: 'ui1',
        userName: 'un1'
      }]
    }, {
      rid: '3',
      title: 'recipe3',
      description: "desc2",
      userID: 'ui1',
      userName: 'un1',
      timestamp: '2014/11/07 07:05:44',
      limit: 3,
      members: [{
        userID: 'ui1',
        userName: 'un1'
      }, {
        userID: 'ui1',
        userName: 'un1'
      }, {
        userID: 'ui1',
        userName: 'un1'
      }]
    }]);

    $httpBackend.when('POST', '/getchatlog').respond([{
      message: 'mess1',
      sender: 'se1',
      timestamp: '2014/11/04 07:05:44'
    }, {
      message: 'mess2',
      sender: 'se2',
      timestamp: '2014/11/08 07:05:44'
    }, {
      message: 'mess3',
      sender: 'se3',
      timestamp: '2014/11/07 07:05:44'
    }]);

    $httpBackend.when('POST', '/getnutrition').respond([{
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

    $httpBackend.when('POST', '/getingredient').respond([{
      ingredient: 'in1',
      amount: 100,
      sender: 'sen1',
      timestamp: '2014/11/02 07:05:44'
    }, {
      ingredient: 'in2',
      amount: 200,
      sender: 'sen2',
      timestamp: '2014/11/01 07:05:44'
    }, {
      ingredient: 'in3',
      amount: 300,
      sender: 'sen3',
      timestamp: '2014/11/03 07:05:44'
    }]);

    $httpBackend.when('GET', '/getingredientlist').respond(['tomato', 'banana', 'sugar']);

    $httpBackend.when('POST', '/getprocess').respond([{
      process: 'pro1',
      sender: 'se1',
      timestamp: '2014/11/03 07:05:44'
    }, {
      process: 'pro2',
      sender: 'se2',
      timestamp: '2014/11/03 07:05:44'
    }, {
      process: 'pro3',
      sender: 'se3',
      timestamp: '2014/11/03 07:05:44'
    }]);

    $httpBackend.when('POST', '/addmember').respond({});

    $httpBackend.when('POST', '/reducemember').respond({});
  }]);

})();
