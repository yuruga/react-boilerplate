'use strict';

var React = require('react');

var MainApp = require('./components/MainApp.react');

React.render(
    /* jshint ignore:start */
    <MainApp />,
    /* jshint ignore:end */
    document.getElementById('mainapp')
);


module.exports = {
    count: 0,
    countUp: function(){
        this.count += 1;
    }
};
