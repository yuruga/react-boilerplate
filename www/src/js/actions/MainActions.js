'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var MainConstants = require('../constants/MainConstants');

var MainActions = {

  /**
   * @param  {string} text
   */
  changeText: function(text) {
    AppDispatcher.dispatch({
      actionType: MainConstants.MAIN_CHANGE_TEXT,
      text: text
    });
  }

};

module.exports = MainActions;
