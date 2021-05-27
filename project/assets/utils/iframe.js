import $ from '$';

let resizeIframe = function(iframe) {
    let yPadding = 25,
        duration = 250,
        resizeCheck = 5000;

    iframe.onload = function() {
        let iframeDoc = iframe.contentWindow.document,
            resizer = function() {
                window.setTimeout(function() {
                    iframe.height = iframeDoc.body.clientHeight + yPadding;
                }, duration);
            };

        // set height of iframe container to inner content
        iframe.height = iframeDoc.body.clientHeight + yPadding;

        // whenever an input changes, trigger resize
        $(iframeDoc.body).on('change', resizer);

        // whenever a nav tab is clicked (bootstrap3), trigger resize
        $(iframeDoc.body).on('click', '.nav-tabs', resizer);

        // whenever a nav tab is clicked (niehs careers), trigger resize
        $(iframeDoc.body).on('click', '.treeview', resizer);

        // check every few seconds and resize as needed
        setInterval(resizer, resizeCheck);
    };
};

export { resizeIframe };
