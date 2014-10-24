'use strict';

var fake = (function () {
  var recipeData, fakeIdSerial, makeFakeId, mockSio, ingredientsKinds, returnChartData, getReturnChartData, getRecipeListData, recipeListData;

  fakeIdSerial = 6;

  makeFakeId = function () {
    return 'rid' + String(fakeIdSerial++);
  };

  recipeData = {
    rid: 'rid5',
    processes: [{
      content: "cont1",
      author: "auth1"
    }, {
      content: "cont2",
      author: "auth2"
    }, {
      content: "cont3",
      author: "auth3"
    }, {
      content: "cont4",
      author: "auth4"
    }, ],
    ingredients: [{
      content: "incont1",
      author: "inauth1",
      amount: 1
    }, {
      content: "incont2",
      author: "inauth2",
      amount: 2
    }, {
      content: "incont3",
      author: "inauth3",
      amount: 3
    }, {
      content: "incont3",
      author: "inauth3",
      amount: 3
    }, {
      content: "incont4",
      author: "inauth4",
      amount: 4
    }],
    chats: [{
      author: 'cau1',
      content: 'hello',
      date: new Date()
    }, {
      author: 'cau2',
      content: 'goodnight',
      date: new Date()
    }, {
      author: 'cau3',
      content: 'ggggggg',
      date: new Date()
    }],
    chart: [{
      content: 'b6',
      rate: 1.2,
      rateDetail: '60/50(g)'
    }, {
      content: 'iron',
      rate: 0.4,
      rateDetail: '20/50(g)'
    }, {
      content: 'b3',
      rate: 2.0,
      rateDetail: '100/50(g)'
    }, {
      content: 'Na',
      rate: 0.8,
      rateDetail: '40/50(g)'
    }]
  };

  ingredientsKinds = {
    tomato: 'g',
    tomato2: 'cup',
    potato: 'count',
    potato2: 'spoon',
    incont1: 'g1',
    incont2: 'g2',
    incont3: 'g3',
    incont4: 'g4',
  };

  recipeListData = {
    rid1: {
      content: 'recipe1',
      description: 'recdescriptioon1'
    },
    rid2: {
      content: 'recipe2',
      description: 'recdescriptioon2'
    },
    rid3: {
      content: 'recipe3',
      description: 'recdescriptioon3'
    },
    rid4: {
      content: 'recipe4',
      description: 'recdescriptioon4'
    },
    rid5: {
      content: 'recipe5',
      description: 'recdescriptioon5'
    },
  };

  mockSio = (function () {
    var
      on_sio, emit_sio, getRecipeData, getIngredientsKinds,
      callback_map = {};

    getRecipeData = function () {
      return recipeData;
    };

    getIngredientsKinds = function () {
      return ingredientsKinds;
    };

    getRecipeListData = function () {
      return recipeListData;
    };

    on_sio = function (msg_type, callback) {
      callback_map[msg_type] = callback;
    };

    emit_sio = function (msg_type, data) {
      var person_map, i;

      if (msg_type === 'sendProcess' && callback_map.receiveProcess) {
        setTimeout(function () {
          if (data.rid === 'rid5') {
            callback_map.receiveProcess(data);
          }
        }, 1000);
      }

      if (msg_type === 'sendIngredient' && callback_map.receiveProcess && callback_map.receiveChart) {
        setTimeout(function () {
          if (data.rid === 'rid5') {
            callback_map.receiveIngredient(data);
            callback_map.receiveChart({
              index: 'chart',
              value: [{
                content: 'b62',
                rate: 1.2,
                rateDetail: '630/50(g)'
              }, {
                content: 'iron222',
                rate: 0.4,
                rateDetail: '10/50(g)'
              }, {
                content: 'b3',
                rate: 7,
                rateDetail: '100/50(g)'
              }, {
                content: 'Na',
                rate: 0.8,
                rateDetail: '40/50(g)'
              }]
            });
          }
        }, 1000);
      }

      if (msg_type === 'sendChat' && callback_map.receiveProcess) {
        setTimeout(function () {
          if (data.rid === 'rid5') {
            callback_map.receiveChat(data);
          }
        }, 1000);
      }

      if (msg_type === 'sendRecipelist' && callback_map.recipelistRecieve) {
        setTimeout(function () {
          data.value.rid = makeFakeId();
          callback_map.recipelistRecieve(data);
        }, 1000);
      }
    };

    return {
      emit: emit_sio,
      on: on_sio,
      getRecipeData: getRecipeData,
      getIngredientsKinds: getIngredientsKinds,
      getRecipeListData: getRecipeListData
    };
  }());

  return {
    mockSio: mockSio
  };
}());
