/*! ConvexHullDemo 2019-05-08 */
define(["geom"],function(a){function b(b,c,d,e){var f,g,h,i,j=e?Plotly.newPlot:Plotly.plot,k=[],l=[],m=[];h={xaxis:{title:"x",range:[-1,101],scaleanchor:"y"},yaxis:{title:"y",range:[-1,101]},width:800,height:800,showlegend:!0,legend:{x:.3,y:1.1,orientation:"h"},margin:{l:60,r:30,b:60,t:90,pad:0}};for(var n=0;n<b.length;n++)f=b[n],f instanceof a.Vec?(k.push(f.x),l.push(f.y)):(k.push(f[0]),l.push(f[1])),m.push(""+n);g={x:k,y:l,mode:c},d.line&&d.line.name?g.name=d.line.name:d.marker&&d.marker.name?g.name=d.marker.name:g.showlegend=!1;for(var o in d)g[o]=d[o];i={displayModeBar:!1,staticPlot:!0},j("closestpointpair",[g],h,i)}return{plot:b}});