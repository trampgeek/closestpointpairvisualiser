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

// The module defines the line-sweep algorithm for the closest point pair problem.
/*jshint esnext:true */

define(["geom"], function (geom) {

    // Return a sequence of states to visualise the progress of the
    // line-sweep closest point pair algorithm.
    // Each state is an object with frontier, frontierPoint, closestPair, d and
    // candidate attributes. frontier is the set of points currently in the
    // frontier, frontierPoint is the point that is currently at the frontier,
    // closestPair is the current closest pair of points, d is their distance
    // and candidate is a point that, paired with frontierPoint, is a possible
    // candidate.

    // Remove from the given list the first occurrence of value
    function removeFrom(list, value) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === value) {
                list.splice(i, 1);
                break;
            }
        }
    }

    function sweepLine(rawpoints) {

        var points = [], states = [],
            pFrontier=null, closestPair=null, d=0, dNew=0,
            i, j, iFrontStart, frontier=null, dist=0, candidates;

        function pushState(candidate) {
            states.push({frontierPoint: pFrontier,
                         candidate: candidate,
                         d: d,
                         frontier: frontier ? frontier.slice() : null,
                         closestPair: closestPair ? closestPair.slice() : null
                         });
        }

        pushState(null);  // The initial point set
        for (i = 0; i < rawpoints.length; i++) {
            points.push(new geom.Vec(rawpoints[i][0], rawpoints[i][1]));
        }

        // Sort points by x first then y
        points.sort(function(a, b) {
            if (a.x < b.x) return -1;
            if (a.x == b.x) return a.y < b.y ? -1 : (a.y == b.y ? 0 : 1);
            return 1;
        });

        closestPair = [points[0], points[1]];
        frontier = [points[0], points[1]];
        d = points[0].minus(points[1]).dist();
        iFrontStart = 0;  // Index of left most point in frontier

        i = 2;
        while (d > 0 && i < points.length) {
            pFrontier = points[i];

            // Remove from frontier points more than d horizontally from p
            while (pFrontier.x - points[iFrontStart].x > d) {
                removeFrom(frontier, points[iFrontStart]);
                iFrontStart += 1;

            }
            pushState(null);  // Showing state after advancing frontier

            // Check all points in frontier against p.
            // Should only check those in range +/- d in y, but we don't have
            // the JavaScript tools and anyway this is only to get a suitable
            // state sequence with a smallish number of points
            // So we first make a list of the ones we should be testing
            // (to display in the visualiser) then we actual check them
            candidates = [];
            for (j = 0; j < frontier.length; j++) {
                if (Math.abs(frontier[j].y - pFrontier.y) <= d) {
                    candidates.push(frontier[j]);
                }
            }

            dNew = d; // So visualiser doesn't change d during loop
            for (j = 0; j < candidates.length; j++) {
                dist = pFrontier.minus(candidates[j]).dist();
                pushState(candidates[j]);
                if (dist < dNew) {
                    dNew = dist;
                    closestPair = [candidates[j], pFrontier];
                    pushState(null);  // New closest pair found
                }
            }
            d = dNew;

            frontier.push(pFrontier);
            i += 1;

        }
        console.log("Closest points: " + closestPair);
        return states;
    }

    return sweepLine;
});
