/*! ConvexHullDemo 2019-05-13 */
require(["geom","plotter","linesweeper"],function(a,b,c){const d={color:"green",width:2,name:"Frontier"},e={color:"green",width:1,dash:"dot",name:"Backier"},f={color:"blue",size:11},g={color:"red",size:15},h={color:"red",width:2,name:"Closest points"},i={color:"red",width:2,dash:"dot",name:"Candidate pair"},j={color:"orange",size:15,name:"Current point"},k={color:"yellow",width:2,name:"Zone of interest"},l={color:"green",size:15,line:{color:"orange",width:2},name:"Frontier set"};for(var m=[[30,153],[65,233],[145,312],[213,281],[204,163],[236,82],[247,164],[389,273]],n=[],o=0;o<m.length;o++)n.push([m[o][0]/4,101-m[o][1]/4]);new Vue({el:"#app",data:{points:n,countString:"5",states:[],currentStateIndex:0,stateIndexString:"0",togglefileuploadhelp:!1},mounted:function(){this.start()},watch:{stateIndexString:function(){this.currentStateIndex=parseInt(this.stateIndexString),this.plot()}},computed:{startDisabled:function(){return Boolean(0===this.points.length)},nextDisabled:function(){return Boolean(this.currentStateIndex>=this.states.length-1)},previousDisabled:function(){return Boolean(0===this.currentStateIndex)},statesMax:function(){return this.states.length-1}},methods:{upload:function(a){var b=new FileReader,c=a.target.files[0],d=this;b.onload=function(a){d.clear();for(var b=a.target.result,c=b.match(/[0-9]+/g),e=0;e<c.length;e+=2)d.points.push([parseInt(c[e]),parseInt(c[e+1])]);d.start()},b.readAsText(c)},clear:function(){this.points=[],this.states=[],this.currentStateIndex=0,this.plot()},start:function(){this.states=c(this.points),this.currentStateIndex=0,this.plot()},next:function(){this.currentStateIndex+=1,this.plot()},previous:function(){this.currentStateIndex-=1,this.plot()},addPoints:function(){function a(a,b){return d.points.find(function(c){return c[0]==a&&c[1]==b})}for(var b,c,d=this,e=0;e<parseInt(this.countString);)b=Math.floor(100*Math.random()),c=Math.floor(100*Math.random()),a(b,c)||(this.points.push([b,c]),e+=1);this.start()},plot:function(){var a,c,m;this.stateIndexString=""+this.currentStateIndex,b.plot(this.points,"markers",{marker:f},!0),this.states.length>0&&(a=this.states[this.currentStateIndex],a.frontierPoint&&(b.plot(a.frontier,"markers",{marker:l}),c=a.frontierPoint,m=a.d,b.plot(a.closestPair,"lines+markers",{marker:g,line:h}),b.plot([[c.x-m,c.y-m],[c.x,c.y-m],[c.x,c.y+m],[c.x-m,c.y+m],[c.x-m,c.y-m]],"lines",{line:k}),b.plot([c],"markers",{marker:j}),b.plot([[c.x,0],[c.x,100]],"lines",{line:d}),b.plot([[c.x-m,0],[c.x-m,100]],"lines",{line:e}),a.candidate&&b.plot([c,a.candidate],"lines",{line:i})))}}})});