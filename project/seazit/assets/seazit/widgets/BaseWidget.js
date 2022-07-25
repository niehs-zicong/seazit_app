import $ from '$';
import React from 'react';
import PropTypes from 'prop-types';

/*

BaseWidget writes state into props.stateHolder react component; a naive
solution for a data-store.

*/

class BaseWidget extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSelectMultiChange = this.handleSelectMultiChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleIntegerInputChange = this.handleIntegerInputChange.bind(this);
        this.handleFloatInputChange = this.handleFloatInputChange.bind(this);
        this.handleCheckboxInputChange = this.handleCheckboxInputChange.bind(this);
    }

    handleRadioChange(e) {
        let d = {};
        d[e.target.name] = parseInt(e.target.value);
        this.props.stateHolder.setState(d);
    }

    handleSelectChange(e) {
        let d = {};
        d[e.target.name] = $(e.target).val();
        this.props.stateHolder.setState(d);
    }

    handleSelectMultiChange(e) {
        let d = {};
        d[e.target.name] = $(e.target).val();
        this.props.stateHolder.setState(d);
    }

    handleIntegerInputChange(e) {
        let d = {};
        d[e.target.name] = parseInt(e.target.value);
        this.props.stateHolder.setState(d);
    }

    handleFloatInputChange(e) {
        let d = {};
        d[e.target.name] = parseFloat(e.target.value);
        this.props.stateHolder.setState(d);
    }

   handleCheckboxInputChange(e) {
        const { name, checked } = e.target;
        let list = this.props.stateHolder.state.selectivityList
        list.map((i) => {
              if (i.name === name)
              {
                    i.isChecked=checked
              }
          }
          );
       this.props.stateHolder.setState(list);
      }


      ;
}

BaseWidget.propTypes = {
    stateHolder: PropTypes.instanceOf(React.Component).isRequired,
};

export default BaseWidget;
