"use strict";$(document).ready(function(){var e=L.map("map").setView([39.13,-84.5167],12);L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',maxZoom:18,id:"jakeboyles.j0ajipap",accessToken:'pk.eyJ1IjoiamFrZWJveWxlcyIsImEiOiJNcGJpWXhJIn0.ONDjoScLnbU4_VVfXmeIAA'}).addTo(e);var a=new L.FeatureGroup,o={keepSpiderfied:!0},n=new OverlappingMarkerSpiderfier(e,o),c=(L.icon({iconUrl:"http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png",iconSize:[45,55],shadowSize:[50,64],iconAnchor:[22,54],shadowAnchor:[4,62],popupAnchor:[-3,-86]}),new L.Popup);n.addListener("click",function(a){c.setContent(a.desc),c.setLatLng(a.getLatLng()),e.openPopup(c)});var a=new L.FeatureGroup,r=function(o){o=o.breweries,o.forEach(function(e){var o=new L.LatLng(e.loc[1],e.loc[0]),c=L.icon({iconUrl:e.logo,iconSize:[45,55],shadowSize:[50,64],iconAnchor:[22,54],shadowAnchor:[4,62],popupAnchor:[-3,-86]}),r=new L.Marker(o,{icon:c});r.desc="\n            <b>"+e.name+"</b>\n            <p class='content'>\n            <i class=\"fa fa-home\"></i> "+e.address+'<br>\n            <i class="fa fa-phone"></i> '+e.phone+"<br>\n            </p>",a.addLayer(r),n.addMarker(r)}),e.addLayer(a)};$.ajax({url:"/api/breweries",success:function(e){r(e,!1)}})});