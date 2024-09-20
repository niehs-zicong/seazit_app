import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class SelectInput extends Component {
    /**
     * Builds a single <select> input.
     *
     * `Choices` should be an array of objects,
     * with id:int and value:str properties, eg:
     *  [{id: 0, value: 'Option 1'}, {id:1, value: 'Option 1'}];
     */

    constructor(props) {
        super(props);
    }

    renderLabel() {
        if (!this.props.label) {
            return null;
        }
        return (
            <label htmlFor={`id_${this.props.name}`} className="form-label">
                {this.props.label}
                {this.props.required ? <span className="asteriskField">*</span> : null}
            </label>
        );
    }

    render() {
        let { id, choices, helpText, name, handleSelect } = this.props,
            className = this.props.className || 'react-select',
            value = this.props.value || this.props.defVal || _.first(choices);
        return (
            <div className="control-group">
                {this.renderLabel()}
                <div className="controls">
                    <select
                        id={id}
                        className={className}
                        value={value}
                        onChange={handleSelect}
                        name={name}
                    >
                        {_.map(choices, (choice) => {
                            return (
                                <option key={choice.id} value={choice.id}>
                                    {choice.value}
                                </option>
                            );
                        })}
                    </select>
                    {helpText ? <p className=" form-text">{this.props.helpText}</p> : null}
                </div>
            </div>
        );
    }
}

SelectInput.propTypes = {
    handleSelect: PropTypes.func.isRequired,
    className: PropTypes.string,
    choices: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.any.isRequired,
            value: PropTypes.any.isRequired,
        })
    ).isRequired,
    id: PropTypes.string,
    defVal: PropTypes.any,
    value: PropTypes.any,
    name: PropTypes.string,
    helpText: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
};

export default SelectInput;
