import $ from '$';
import React from 'react';
import ReactDOM from 'react-dom';

class BootstrapModal {
    constructor(headerComponent, bodyComponent, args) {
        this.headerComponent = headerComponent;
        this.bodyComponent = bodyComponent;
        this.args = args || {};
        this.modal = this._getModalContainer();
        this.header = this.modal.querySelector('.modal-title');
        this.body = this.modal.querySelector('.modal-body');

        // Use the global bootstrap object for Modal
        this.bootstrapModalInstance = new bootstrap.Modal(this.modal); // Bootstrap Modal instance from the global `bootstrap`
        this.render();
    }

    render() {
        // Show the modal
        this.modal.addEventListener('shown.bs.modal', () => {
            ReactDOM.render(
                React.createElement(this.headerComponent, this.args, null),
                this.header
            );
            ReactDOM.render(React.createElement(this.bodyComponent, this.args, null), this.body);
        });

        // Unmount the React components when the modal is hidden
        this.modal.addEventListener('hide.bs.modal', () => {
            ReactDOM.unmountComponentAtNode(this.header);
            ReactDOM.unmountComponentAtNode(this.body);
        });

        // Show the modal using Bootstrap's JavaScript API
        this.bootstrapModalInstance.show();
    }

    _getModalContainer() {
        let modal = document.querySelector('.modal');
        if (!modal) {
            document.body.insertAdjacentHTML(
                'beforeend',
                `
            <div class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Modal Title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        </div>
                    </div>
                </div>
            </div>
        `
            );
            modal = document.querySelector('.modal');
        }
        return modal;
    }
}

export default BootstrapModal;
