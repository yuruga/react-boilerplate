'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MainConstants = require('../constants/MainConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _data = {
    text: 'Hello World!!'
};

function changeText(text) {
    _data.text = text;
}

var MainStore = assign({}, EventEmitter.prototype, {

    getText: function () {
        return _data.text;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
    * @param {function} callback
    */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
    * @param {function} callback
    */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


// Register callback to handle all updates
AppDispatcher.register(function (action) {
    switch(action.actionType) {
        case MainConstants.MAIN_CHANGE_TEXT:
            var text = action.text;
            if (typeof text === 'string') {
                changeText(text);
            }
            MainStore.emitChange();
            break;
        default:
              // no op
    }
});

module.exports = MainStore;
