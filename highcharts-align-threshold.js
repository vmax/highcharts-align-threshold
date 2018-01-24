jQuery(function onReady($) {
    /**
     * Experimental Highcharts plugin to implement chart.alignThreshold option. This primary axis
     * will be computed first, then all following axes will be aligned to the threshold.
     * Author: Torstein Hønsi
     * Last revision: 2016-11-02
     */
    (function (H) {
        var Axis = H.Axis,
            inArray = H.inArray,
            wrap = H.wrap;

        wrap(Axis.prototype, 'adjustTickAmount', function (proceed) {
            var chart = this.chart,
                primaryAxis = chart[this.coll][0],
                primaryThreshold,
                primaryIndex,
                index,
                newTickPos,
                threshold;

            // Find the index and return boolean result
            function isAligned(axis) {
                index = inArray(threshold, axis.tickPositions); // used in while-loop
                return axis.tickPositions.length === axis.tickAmount && index === primaryIndex;
            }

            if (chart.options.chart.alignThresholds && this !== primaryAxis) {
                primaryThreshold = (primaryAxis.series[0] && primaryAxis.series[0].options.threshold) || 0;
                threshold = (this.series[0] && this.series[0].options.threshold) || 0;

                primaryIndex = primaryAxis.tickPositions && inArray(primaryThreshold, primaryAxis.tickPositions);

                if (this.tickPositions && this.tickPositions.length &&
                        primaryIndex > 0 &&
                        primaryIndex < primaryAxis.tickPositions.length - 1 &&
                        this.tickAmount) {

                    // Add tick positions to the top or bottom in order to align the threshold
                    // to the primary axis threshold
                    while (!isAligned(this)) {

                        if (index < primaryIndex) {
                            newTickPos = this.tickPositions[0] - this.tickInterval;
                            this.tickPositions.unshift(newTickPos);
                            this.min = newTickPos;
                        } else {
                            newTickPos = this.tickPositions[this.tickPositions.length - 1] + this.tickInterval;
                            this.tickPositions.push(newTickPos);
                            this.max = newTickPos;
                        }
                        proceed.call(this);
                    }
                }

            } else {
                proceed.call(this);
            }
        });
    }(Highcharts));
});
