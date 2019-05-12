/*
    Copyright (C) 2019  Richard Lobb

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version. See <https://www.gnu.org/licenses/>

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */

// The main javascript module for the Closest Point Pair visualiser.
// Uses the Vue framework.
/* jshint esnext:true */

require(["geom", "plotter", "linesweeper"], function (geom, plotter, linesweeper) {

    const FRONTIER_LINE_STYLE   = {color: 'green', width: 2, name: 'Frontier'};
    const BACKIER_LINE_STYLE = {color: 'green', width: 1,  dash: 'dot', name: 'Backier'};
    const POINT_SET_STYLE   = {color: 'blue', size: 11};
    const CLOSEST_POINTS_STYLE = {color: 'red', size: 15};
    const CLOSEST_POINTS_LINE_STYLE = {color: 'red', width: 2, name: 'Closest points'};
    const CANDIDATE_PAIR_LINE_STYLE = {color: 'red', width: 2, dash: 'dot', name: 'Candidate pair'};
    const FRONTIER_POINT_STYLE = {color: 'orange', size: 15, name: 'Current point'};
    const ZONE_LINE_STYLE = {color: 'yellow', 'width': 2, name: 'Zone of interest'};
    const FRONTIER_SET_STYLE = {color: 'green', size: 15, line: {color: 'orange', width: 2}, name: 'Frontier set'};

    // Data here is read from Mukundan's slide with y vertically down. Need to scale and flip.
    var flippedPoints = [[30, 153], [65, 233], [145, 312], [213, 281], [204, 163], [236, 82], [247, 164], [389, 273]];
    var points = [];

    for (var i=0; i < flippedPoints.length; i++) {
        points.push([flippedPoints[i][0] / 4.0, 101 - flippedPoints[i][1] / 4.0]);
    }

    var app = new Vue({
        el: '#app',

        data: {
            points: points,
            countString: "5",
            states: [],
            currentStateIndex: 0,
            stateIndexString: '0',
            togglefileuploadhelp: false,
        },

        mounted: function() {
            this.start();
        },

        watch: {
            stateIndexString: function() {
                this.currentStateIndex = parseInt(this.stateIndexString);
                this.plot();
            }
        },

        computed: {
            startDisabled: function() { return Boolean(this.points.length === 0); },
            nextDisabled: function() { return Boolean(this.currentStateIndex >= this.states.length - 1); },
            previousDisabled: function() { return Boolean(this.currentStateIndex === 0); },
            statesMax: function() { return this.states.length - 1; }
        },

        methods: {
            // Upload the selected text file of (x, y) data. x, y values should
            // all be integers in the range [0, 100]. Data is extracted with
            // the pattern /[0-9]+/ so any separators can be used but white space
            // or commas are recommended.
            upload: function(event) {
                var rdr = new FileReader(),
                    file = event.target.files[0],
                    that = this;
                rdr.onload = function(evt) {
                    that.clear();
                    var data = evt.target.result,
                        pointStrings = data.match(/[0-9]+/g);
                    for (var i = 0; i < pointStrings.length; i += 2) {
                        that.points.push([parseInt(pointStrings[i]), parseInt(pointStrings[i + 1])]);
                    }
                    that.start();
                };
                rdr.readAsText(file);
            },

            clear: function() {
                this.points = [];
                this.states = [];
                this.currentStateIndex = 0;
                this.plot();
            },

            start: function() {
                this.states = linesweeper(this.points);
                this.currentStateIndex = 0;
                this.plot();
            },

            next: function() {
                this.currentStateIndex += 1;
                this.plot();
            },

            previous: function() {
                this.currentStateIndex -= 1;
                this.plot();
            },

            addPoints: function() {
                // Add however many points is set by the slider
                var x, y, that=this, n = 0;
                function isInPoints(x, y) {
                    // True if (x, y) is in the array points
                    return that.points.find(function (q) {
                        return q[0] == x && q[1] == y;
                    });

                }

                while (n < parseInt(this.countString)) {
                    x = Math.floor(100 * Math.random());
                    y = Math.floor(100 * Math.random());
                    if (!isInPoints(x, y)) {
                        this.points.push([x, y]);
                        n += 1;
                    }
                }
                this.start();
            },

            plot: function () {
                var state, lines, p, d;
                this.stateIndexString = '' + this.currentStateIndex;
                plotter.plot(this.points, 'markers', {marker: POINT_SET_STYLE}, true);

                if (this.states.length > 0) {
                    state = this.states[this.currentStateIndex];
                    if (state.frontierPoint) {
                        plotter.plot(state.frontier, 'markers', {marker: FRONTIER_SET_STYLE});
                        p = state.frontierPoint;
                        d = state.d;
                        plotter.plot(state.closestPair, 'lines+markers', {marker: CLOSEST_POINTS_STYLE, line: CLOSEST_POINTS_LINE_STYLE});
                        plotter.plot([[p.x - d, p.y - d],
                                      [p.x, p.y - d],
                                      [p.x, p.y + d],
                                      [p.x - d, p.y + d],
                                      [p.x - d, p.y - d]], 'lines', {line: ZONE_LINE_STYLE}); // Zone of interest
                        plotter.plot([p], 'markers', {marker: FRONTIER_POINT_STYLE});
                        plotter.plot([[p.x, 0], [p.x, 100]], 'lines', {line: FRONTIER_LINE_STYLE});
                        plotter.plot([[p.x - d, 0], [p.x - d, 100]], 'lines', {line: BACKIER_LINE_STYLE});
                        if (state.candidate) {
                            plotter.plot([p, state.candidate], 'lines', {line: CANDIDATE_PAIR_LINE_STYLE});
                        }
                    }
                }
            }
        },
    });
});
