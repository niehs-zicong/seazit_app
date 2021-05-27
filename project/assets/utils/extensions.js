import { selection } from 'd3';

selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

Number.prototype.toCustomString = function() {
    if (this > 1e6) {
        return this.toExponential(2).toUpperCase();
    } else if (this > 0.001) {
        return this.toLocaleString();
    } else {
        return this.toExponential(2).toUpperCase();
    }
};
