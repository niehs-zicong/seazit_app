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
        // Remove existing event listener to prevent duplicates
        this.modal.removeEventListener('shown.bs.modal', this._renderContent);

        // Add the new event listener
        this._renderContent = () => {
            ReactDOM.render(
                React.createElement(this.headerComponent, this.args, null),
                this.header
            );
            ReactDOM.render(React.createElement(this.bodyComponent, this.args, null), this.body);
        };
        this.modal.addEventListener('shown.bs.modal', this._renderContent);

        // Unmount the React components when the modal is hidden
        this.modal.addEventListener('hide.bs.modal', () => {
            ReactDOM.unmountComponentAtNode(this.header);
            ReactDOM.unmountComponentAtNode(this.body);
        });

        // Show the modal using Bootstrap's JavaScript API
        this.bootstrapModalInstance.show();
    }

    _getModalContainer() {
        const modalId = `modal-${Date.now()}`; // Unique ID for each modal
        const modalHTML = `
        <div id="${modalId}" class="modal fade" tabindex="-1" role="dialog">
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
    `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        return document.getElementById(modalId);
    }
}

export default BootstrapModal;
