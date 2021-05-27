import { format } from 'd3';

let getLog10AxisFunction = function(axisFunction, scale) {
    /*
    The default d3.log scale axis can contain minor scale ticks which is
    distracting; this helper function returns a scale w/ only base10
    text presented.

    https://github.com/d3/d3-axis/blob/master/README.md#axis_ticks

    */
    let orderOfMagnitude =
        Math.ceil(Math.log10(scale.domain()[1])) - Math.floor(Math.log10(scale.domain()[0]));

    if (orderOfMagnitude % 10 === 0) {
        orderOfMagnitude = orderOfMagnitude / 2;
    }

    return axisFunction(scale).ticks(orderOfMagnitude * 1.1, function(d) {
        if (parseInt(Math.log10(d)) === Math.log10(d)) {
            let formatter = d > 1 ? format(',.0f') : format(',.0g');
            return formatter(d);
        } else {
            return null;
        }
    });
};

export { getLog10AxisFunction };
