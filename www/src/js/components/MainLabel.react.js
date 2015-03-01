'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;

var MainLabel = React.createClass({
    propTypes: {
        text: ReactPropTypes.string
    },

    getInitialState: function() {
        return {
            text: this.props.text || ''
        };
    },

    /**
    * @return {object}
    */
    render: function() /*object*/ {
        var text = this.props.text;
        if(text === ''){
            text = 'Empty';
        }
        return (
            /* jshint ignore:start */
            <div id='header'>
                <h1>{text}</h1>
            </div>
            /* jshint ignore:end */
        );
    }
});

module.exports = MainLabel;
