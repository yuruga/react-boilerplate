'use strict';

var MainLabel = require('./MainLabel.react.js');
var MainTextInput = require('./MainTextInput.react');
var React = require('react');
var MainStore = require('../stores/MainStore');

function getMainState() {
    return {
        text: MainStore.getText()
    };
}

var MainApp = React.createClass({

    getInitialState: function() {
        return getMainState();
    },

    componentDidMount: function() {
        MainStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        MainStore.removeChangeListener(this._onChange);
    },

    /**
    * @return {object}
    */
    render: function() {
        return (
            /* jshint ignore:start */
            <div id='contents'>
                <MainLabel text={this.state.text} />
                <MainTextInput value={this.state.text} className='form-control' placeholder='Empty' />
            </div>
            /* jshint ignore:end */
    	);
    },

    /**
    * Event handler for 'change' events coming from the TodoStore
    */
    _onChange: function() {
        this.setState(getMainState());
    }
});

module.exports = MainApp;
