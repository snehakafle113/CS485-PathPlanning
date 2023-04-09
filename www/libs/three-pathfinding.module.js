import{Vector3 as t,Plane as e,Geometry as r,Triangle as n,Color as o,Object3D as i,LineBasicMaterial as s,MeshBasicMaterial as a,SphereBufferGeometry as h,BoxGeometry as u,Mesh as c,SphereGeometry as p,Line as l}from"./three.module.js";var f=function(){};f.roundNumber=function(t,e){var r=Math.pow(10,e);return Math.round(t*r)/r},f.sample=function(t){return t[Math.floor(Math.random()*t.length)]},f.distanceToSquared=function(t,e){var r=t.x-e.x,n=t.y-e.y,o=t.z-e.z;return r*r+n*n+o*o},f.isPointInPoly=function(t,e){for(var r=!1,n=-1,o=t.length,i=o-1;++n<o;i=n)(t[n].z<=e.z&&e.z<t[i].z||t[i].z<=e.z&&e.z<t[n].z)&&e.x<(t[i].x-t[n].x)*(e.z-t[n].z)/(t[i].z-t[n].z)+t[n].x&&(r=!r);return r},f.isVectorInPolygon=function(t,e,r){var n=1e5,o=-1e5,i=[];return e.vertexIds.forEach(function(t){n=Math.min(r[t].y,n),o=Math.max(r[t].y,o),i.push(r[t])}),!!(t.y<o+.5&&t.y>n-.5&&this.isPointInPoly(i,t))},f.triarea2=function(t,e,r){return(r.x-t.x)*(e.z-t.z)-(e.x-t.x)*(r.z-t.z)},f.vequal=function(t,e){return this.distanceToSquared(t,e)<1e-5};var d=function(t){this.content=[],this.scoreFunction=t};d.prototype.push=function(t){this.content.push(t),this.sinkDown(this.content.length-1)},d.prototype.pop=function(){var t=this.content[0],e=this.content.pop();return this.content.length>0&&(this.content[0]=e,this.bubbleUp(0)),t},d.prototype.remove=function(t){var e=this.content.indexOf(t),r=this.content.pop();e!==this.content.length-1&&(this.content[e]=r,this.scoreFunction(r)<this.scoreFunction(t)?this.sinkDown(e):this.bubbleUp(e))},d.prototype.size=function(){return this.content.length},d.prototype.rescoreElement=function(t){this.sinkDown(this.content.indexOf(t))},d.prototype.sinkDown=function(t){for(var e=this.content[t];t>0;){var r=(t+1>>1)-1,n=this.content[r];if(!(this.scoreFunction(e)<this.scoreFunction(n)))break;this.content[r]=e,this.content[t]=n,t=r}},d.prototype.bubbleUp=function(t){for(var e=this.content.length,r=this.content[t],n=this.scoreFunction(r);;){var o=t+1<<1,i=o-1,s=null,a=void 0;if(i<e&&(a=this.scoreFunction(this.content[i]))<n&&(s=i),o<e&&this.scoreFunction(this.content[o])<(null===s?n:a)&&(s=o),null===s)break;this.content[t]=this.content[s],this.content[s]=r,t=s}};var v=function(){};v.init=function(t){for(var e=0;e<t.length;e++){var r=t[e];r.f=0,r.g=0,r.h=0,r.cost=1,r.visited=!1,r.closed=!1,r.parent=null}},v.cleanUp=function(t){for(var e=0;e<t.length;e++){var r=t[e];delete r.f,delete r.g,delete r.h,delete r.cost,delete r.visited,delete r.closed,delete r.parent}},v.heap=function(){return new d(function(t){return t.f})},v.search=function(t,e,r){this.init(t);var n=this.heap();for(n.push(e);n.size()>0;){var o=n.pop();if(o===r){for(var i=o,s=[];i.parent;)s.push(i),i=i.parent;return this.cleanUp(s),s.reverse()}o.closed=!0;for(var a=this.neighbours(t,o),h=0,u=a.length;h<u;h++){var c=a[h];if(!c.closed){var p=o.g+c.cost,l=c.visited;if(!l||p<c.g){if(c.visited=!0,c.parent=o,!c.centroid||!r.centroid)throw new Error("Unexpected state");c.h=c.h||this.heuristic(c.centroid,r.centroid),c.g=p,c.f=c.g+c.h,l?n.rescoreElement(c):n.push(c)}}}}return[]},v.heuristic=function(t,e){return f.distanceToSquared(t,e)},v.neighbours=function(t,e){for(var r=[],n=0;n<e.neighbours.length;n++)r.push(t[e.neighbours[n]]);return r};var g=function(){};g.buildZone=function(e){var r=this,n=this._buildNavigationMesh(e),o={};n.vertices.forEach(function(t){t.x=f.roundNumber(t.x,2),t.y=f.roundNumber(t.y,2),t.z=f.roundNumber(t.z,2)}),o.vertices=n.vertices;var i=this._buildPolygonGroups(n);return o.groups=new Array(i.length),i.forEach(function(e,n){var i=new Map;e.forEach(function(t,e){i.set(t,e)});var s=new Array(e.length);e.forEach(function(e,n){var a=[];e.neighbours.forEach(function(t){return a.push(i.get(t))});var h=[];e.neighbours.forEach(function(t){return h.push(r._getSharedVerticesInOrder(e,t))});var u=new t(0,0,0);u.add(o.vertices[e.vertexIds[0]]),u.add(o.vertices[e.vertexIds[1]]),u.add(o.vertices[e.vertexIds[2]]),u.divideScalar(3),u.x=f.roundNumber(u.x,2),u.y=f.roundNumber(u.y,2),u.z=f.roundNumber(u.z,2),s[n]={id:n,neighbours:a,vertexIds:e.vertexIds,centroid:u,portals:h}}),o.groups[n]=s}),o},g._buildNavigationMesh=function(t){return t.mergeVertices(),this._buildPolygonsFromGeometry(t)},g._buildPolygonGroups=function(t){var e=[],r=function(t){t.neighbours.forEach(function(e){void 0===e.group&&(e.group=t.group,r(e))})};return t.polygons.forEach(function(t){void 0!==t.group?e[t.group].push(t):(t.group=e.length,r(t),e.push([t]))}),e},g._buildPolygonNeighbours=function(t,e){var r=new Set,n=e[t.vertexIds[1]],o=e[t.vertexIds[2]];return e[t.vertexIds[0]].forEach(function(e){e!==t&&(n.includes(e)||o.includes(e))&&r.add(e)}),n.forEach(function(e){e!==t&&o.includes(e)&&r.add(e)}),r},g._buildPolygonsFromGeometry=function(t){for(var e=this,r=[],n=t.vertices,o=new Array(n.length),i=0;i<n.length;i++)o[i]=[];return t.faces.forEach(function(t){var e={vertexIds:[t.a,t.b,t.c],neighbours:null};r.push(e),o[t.a].push(e),o[t.b].push(e),o[t.c].push(e)}),r.forEach(function(t){t.neighbours=e._buildPolygonNeighbours(t,o)}),{polygons:r,vertices:n}},g._getSharedVerticesInOrder=function(t,e){var r=t.vertexIds,n=r[0],o=r[1],i=r[2],s=e.vertexIds,a=s.includes(n),h=s.includes(o),u=s.includes(i);return a&&h&&u?Array.from(r):a&&h?[n,o]:h&&u?[o,i]:a&&u?[i,n]:(console.warn("Error processing navigation mesh neighbors; neighbors with <2 shared vertices found."),[])};var y=function(){this.portals=[]};y.prototype.push=function(t,e){void 0===e&&(e=t),this.portals.push({left:t,right:e})},y.prototype.stringPull=function(){var t,e,r,n=this.portals,o=[],i=0,s=0,a=0;e=n[0].left,r=n[0].right,o.push(t=n[0].left);for(var h=1;h<n.length;h++){var u=n[h].left,c=n[h].right;if(f.triarea2(t,r,c)<=0){if(!(f.vequal(t,r)||f.triarea2(t,e,c)>0)){o.push(e),e=t=e,r=t,s=i=s,a=i,h=i;continue}r=c,a=h}if(f.triarea2(t,e,u)>=0){if(!(f.vequal(t,e)||f.triarea2(t,r,u)<0)){o.push(r),e=t=r,r=t,s=i=a,a=i,h=i;continue}e=u,s=h}}return 0!==o.length&&f.vequal(o[o.length-1],n[n.length-1].left)||o.push(n[n.length-1].left),this.path=o,o};var b,_=function(){this.zones={}};_.createZone=function(t){return t.isGeometry?console.warn("[three-pathfinding]: Use BufferGeometry, not Geometry, to create zone."):t=(new r).fromBufferGeometry(t),g.buildZone(t)},_.prototype.setZoneData=function(t,e){this.zones[t]=e},_.prototype.getRandomNode=function(e,r,n,o){if(!this.zones[e])return new t;n=n||null,o=o||0;var i=[];return this.zones[e].groups[r].forEach(function(t){n&&o?f.distanceToSquared(n,t.centroid)<o*o&&i.push(t.centroid):i.push(t.centroid)}),f.sample(i)||new t},_.prototype.getClosestNode=function(t,e,r,n){void 0===n&&(n=!1);var o=this.zones[e].vertices,i=null,s=Infinity;return this.zones[e].groups[r].forEach(function(e){var r=f.distanceToSquared(e.centroid,t);r<s&&(!n||f.isVectorInPolygon(t,e,o))&&(i=e,s=r)}),i},_.prototype.findPath=function(e,r,n,o){var i=this.zones[n].groups[o],s=this.zones[n].vertices,a=this.getClosestNode(e,n,o,!0),h=this.getClosestNode(r,n,o,!0);if(!a||!h)return null;var u=v.search(i,a,h),c=function(t,e){for(var r=0;r<t.neighbours.length;r++)if(t.neighbours[r]===e.id)return t.portals[r]},p=new y;p.push(e);for(var l=0;l<u.length;l++){var f=u[l+1];if(f){var d=c(u[l],f);p.push(s[d[0]],s[d[1]])}}p.push(r),p.stringPull();var g=p.path.map(function(e){return new t(e.x,e.y,e.z)});return g.shift(),g},_.prototype.getGroup=(b=new e,function(t,e,r){if(void 0===r&&(r=!1),!this.zones[t])return null;for(var n=null,o=Math.pow(50,2),i=this.zones[t],s=0;s<i.groups.length;s++)for(var a=0,h=i.groups[s];a<h.length;a+=1){var u=h[a];if(r&&(b.setFromCoplanarPoints(i.vertices[u.vertexIds[0]],i.vertices[u.vertexIds[1]],i.vertices[u.vertexIds[2]]),Math.abs(b.distanceToPoint(e))<.01&&f.isPointInPoly([i.vertices[u.vertexIds[0]],i.vertices[u.vertexIds[1]],i.vertices[u.vertexIds[2]]],e)))return s;var c=f.distanceToSquared(u.centroid,e);c<o&&(n=s,o=c)}return n}),_.prototype.clampStep=function(){var r,o,i=new t,s=new e,a=new n,h=new t,u=new t;return function(t,e,n,c,p,l){var f=this.zones[c].vertices,d=this.zones[c].groups[p],v=[n],g={};g[n.id]=0,r=void 0,u.set(0,0,0),o=Infinity,s.setFromCoplanarPoints(f[n.vertexIds[0]],f[n.vertexIds[1]],f[n.vertexIds[2]]),s.projectPoint(e,i),h.copy(i);for(var y=v.pop();y;y=v.pop()){a.set(f[y.vertexIds[0]],f[y.vertexIds[1]],f[y.vertexIds[2]]),a.closestPointToPoint(h,i),i.distanceToSquared(h)<o&&(r=y,u.copy(i),o=i.distanceToSquared(h));var b=g[y.id];if(!(b>2))for(var _=0;_<y.neighbours.length;_++){var w=d[y.neighbours[_]];w.id in g||(v.push(w),g[w.id]=b+1)}}return l.copy(u),r}}();var w={PLAYER:new o(15631215).convertGammaToLinear(2.2).getHex(),TARGET:new o(14469912).convertGammaToLinear(2.2).getHex(),PATH:new o(41903).convertGammaToLinear(2.2).getHex(),WAYPOINT:new o(41903).convertGammaToLinear(2.2).getHex(),CLAMPED_STEP:new o(14472114).convertGammaToLinear(2.2).getHex(),CLOSEST_NODE:new o(4417387).convertGammaToLinear(2.2).getHex()},m=function(e){function n(){var t=this;e.call(this),this._playerMarker=new c(new p(.25,32,32),new a({color:w.PLAYER})),this._targetMarker=new c(new u(.3,.3,.3),new a({color:w.TARGET})),this._nodeMarker=new c(new u(.1,.8,.1),new a({color:w.CLOSEST_NODE})),this._stepMarker=new c(new u(.1,1,.1),new a({color:w.CLAMPED_STEP})),this._pathMarker=new e,this._pathLineMaterial=new s({color:w.PATH,linewidth:2}),this._pathPointMaterial=new a({color:w.WAYPOINT}),this._pathPointGeometry=new h(.08),this._markers=[this._playerMarker,this._targetMarker,this._nodeMarker,this._stepMarker,this._pathMarker],this._markers.forEach(function(e){e.visible=!1,t.add(e)})}return e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n,n.prototype.setPath=function(e){for(;this._pathMarker.children.length;)this._pathMarker.children[0].visible=!1,this._pathMarker.remove(this._pathMarker.children[0]);e=[this._playerMarker.position].concat(e);for(var n=new r,o=0;o<e.length;o++)n.vertices.push(e[o].clone().add(new t(0,.2,0)));this._pathMarker.add(new l(n,this._pathLineMaterial));for(var i=0;i<e.length-1;i++){var s=new c(this._pathPointGeometry,this._pathPointMaterial);s.position.copy(e[i]),s.position.y+=.2,this._pathMarker.add(s)}return this._pathMarker.visible=!0,this},n.prototype.setPlayerPosition=function(t){return this._playerMarker.position.copy(t),this._playerMarker.visible=!0,this},n.prototype.setTargetPosition=function(t){return this._targetMarker.position.copy(t),this._targetMarker.visible=!0,this},n.prototype.setNodePosition=function(t){return this._nodeMarker.position.copy(t),this._nodeMarker.visible=!0,this},n.prototype.setStepPosition=function(t){return this._stepMarker.position.copy(t),this._stepMarker.visible=!0,this},n.prototype.reset=function(){for(;this._pathMarker.children.length;)this._pathMarker.children[0].visible=!1,this._pathMarker.remove(this._pathMarker.children[0]);return this._markers.forEach(function(t){t.visible=!1}),this},n}(i);export{_ as Pathfinding,m as PathfindingHelper};
//# sourceMappingURL=three-pathfinding.module.js.map
