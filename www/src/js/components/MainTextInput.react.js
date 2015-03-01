'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;
var MainActions = require('../actions/MainActions');

var MainTextInput = React.createClass({

    propTypes: {
        className: ReactPropTypes.string,
        id: ReactPropTypes.string,
        placeholder: ReactPropTypes.string,
        value: ReactPropTypes.string
    },

    getInitialState: function() {
        return {
            value: this.props.value || ''
        };
    },

    /**
    * @return {object}
    */
    render: function() /*object*/ {
        return (
            /* jshint ignore:start */
            <div className="inputs">
            <input
                className={this.props.className}
                id={this.props.id}
                placeholder={this.props.placeholder}
                onChange={this._onChange}
                onBlur={this._onChange}
                value={this.state.value}
                autoFocus={true}
                />
            </div>
            /* jshint ignore:end */
        );
    },

    /**
   * @param {object} event
   */
    _onChange: function (/*object*/ event) {
        MainActions.changeText(event.target.value);
        this.setState({
            value: event.target.value
        });
    }
});

module.exports = MainTextInput;
