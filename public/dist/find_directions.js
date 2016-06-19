"use strict";function formatDepot(e){return{geometry:{x:e.point.x,y:e.point.y},attributes:{Name:e.name}}}function getDepots(e){return{features:e.map(formatDepot)}}function formatOrder(e){return{geometry:{x:e.point.x,y:e.point.y},attributes:{Name:e.name}}}function getOrders(e){return{features:e.map(formatOrder)}}function getRoute(e,t){return{attributes:{Name:"Route "+(t+1),StartDepotName:e.name,EndDepotName:e.name,EarliestStartTime:14556096e5,LatestStartTime:14556096e5}}}function getRoutes(e){return{features:e.map(getRoute)}}function showRoutes(e){console.log("showRoutes",e)}function showStops(e){console.log("showStops",e)}function showDirections(e){console.log("showDirections",e)}function getGeomappingDataFromArcGis(e,t,o){o=o.map(function(e){return e.point=new t(e.loc[0],e.loc[1]),e});var s="https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblem/GPServer/SolveVehicleRoutingProblem",n=process.env.ARCGIS_KEY,r=o.slice(0,1),i=o.slice(1),u=new e(s+"?token="+n),a={default_date:14556096e5,time_units:"Minutes",distance_units:"Miles",depots:JSON.stringify(getDepots(r)),orders:JSON.stringify(getOrders(i)),routes:JSON.stringify(getRoutes(r)),populate_directions:!0};u.submitJob(a).then(function(e){u.getResultData(e.jobId,"out_routes").then(showRoutes),u.getResultData(e.jobId,"out_stops").then(showStops),u.getResultData(e.jobId,"out_directions").then(showDirections)})}function setupGeomapping(e,t){getGeomappingDataFromArcGis(e,t,data)}var dependencies=["esri/tasks/Geoprocessor","esri/geometry/Point"];require(dependencies,setupGeomapping);