import React from 'react';
import ReactDOM from 'react-dom';

const insertIntoDom = function(Component, el) {
    ReactDOM.render(React.createElement(Component), el);
};

export { insertIntoDom };
