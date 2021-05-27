import $ from '$';
import React from 'react';
import ReactDOM from 'react-dom';

class BootstrapModal {
    /*
    Renders a bootstrap modal with the header and body components. If
    the modal is closed, the components are unregistered.
    */

    constructor(headerComponent, bodyComponent, args) {
        /*
            - headerComponent is a ReactComponent
            - bodyComponent is a ReactComponent
            - args is an object passed into both components
        */
        this.headerComponent = headerComponent;
        this.bodyComponent = bodyComponent;
        this.args = args || {};
        this.modal = this._getModalContainer();
        this.header = this.modal.find('.modal-title').get(0);
        this.body = this.modal.find('.modal-body').get(0);
        this.render();
    }

    render() {
        this.modal
            .one('shown.bs.modal', () => {
                ReactDOM.render(
                    React.createElement(this.headerComponent, this.args, null),
                    this.header
                );
                ReactDOM.render(
                    React.createElement(this.bodyComponent, this.args, null),
                    this.body
                );
            })
            .modal('show')
            .one('hide.bs.modal', () => {
                ReactDOM.unmountComponentAtNode(this.header);
                ReactDOM.unmountComponentAtNode(this.body);
            });
    }

    _getModalContainer() {
        // add modal container to body of page if it doesn't exist
        let modal = $('.modal');
        if (modal.length === 0) {
            $(document.body).append(`
                <div class="modal fade" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <div class="modal-title">
                                </div>
                            </div>
                            <div class="modal-body">
                            </div>
                        </div>
                    </div>
                </div>
            `);
            modal = $('.modal');
        }
        return modal;
    }
}

export default BootstrapModal;
