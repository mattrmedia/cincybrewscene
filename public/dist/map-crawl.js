$( document ).ready(function() {

  var map = L.map('map').setView([39.1300, -84.5167], 12);


  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'jakeboyles.j0ajipap',
      accessToken: "pk.eyJ1IjoiamFrZWJveWxlcyIsImEiOiJNcGJpWXhJIn0.ONDjoScLnbU4_VVfXmeIAA",
  }).addTo(map);


  var markers = new L.FeatureGroup();
  var options = {
      'keepSpiderfied':true
  };

  var oms = new OverlappingMarkerSpiderfier(map, options);


  var popup = new L.Popup();

  oms.addListener('click', function(marker) {
    popup.setContent(marker.desc);
    popup.setLatLng(marker.getLatLng());
    map.openPopup(popup);
  });

  var markers = new L.FeatureGroup();

  var addToMap = function(result)
  {
    result = result.breweries;
    result.forEach(function(brew){
    var loc = new L.LatLng(brew.loc[1],brew.loc[0]);

    var Icon = L.icon({
        iconUrl: brew.logo,
        iconSize:     [45, 55], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 54], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -86] // point from which the popup should open relative to the iconAnchor
    });

    var marker = new L.Marker(loc, {icon: Icon});

    marker.desc = `
    <b>${brew.name}</b>
    <p class='content'>
    <i class="fa fa-home"></i> ${brew.address}<br>
    <i class="fa fa-phone"></i> ${brew.phone}<br>
    </p>`;

    markers.addLayer(marker);

    oms.addMarker(marker);

  });

  map.addLayer(markers);

  }

  function formatDepot(depot) {
    return {
      geometry: {
        x: depot.loc[0],
        y: depot.loc[1],
      },
      attributes: {
        Name: depot.name,
      },
    };
  }

  function getDepots(depots) {
    return {
      features: depots.map(formatDepot),
    };
  }

  function formatOrder(order) {
    return {
      geometry: {
        x: order.loc[0],
        y: order.loc[1],
      },
      attributes: {
        Name: order.name,
      },
    };
  }

  function getOrders(orders) {
    return {
      features: orders.map(formatOrder),
    };
  }

  function getRoute(depot, i) {
    return {
      attributes: {
        Name: `Route ${i + 1}`,
        StartDepotName: depot.name,
        EarliestStartTime: 1455609600000,
        LatestStartTime: 1455609600000,
      },
    };
  }

  function getRoutes(depots) {
    return {
      features: depots.map(getRoute),
    };
  }

  function showRoutes(results) {
    const features = results.value.features

    features.forEach(feature => {
      const points = features[0].geometry.paths[0].map(p => {
        return L.latLng(p[1], p[0]);
      });
      const polyline = L.polyline(points);

      map.addLayer(polyline);
    });

    $(".loader").hide();
  }

  function showStops(results) {
    console.log('showStops', results);
  }

  function showDirections(results) {
    console.log('showDirections', results);
  }

  function getGeomappingDataFromArcGis(Geoprocessor, Point, data) {
    const geoserviceUrl = 'https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblem/GPServer/SolveVehicleRoutingProblem';
    const arcgis = "zlut5gMuE4iwuIom6enafnzQZkYBFpmteWcUOojhQFV5sa-zNfynF7EOQ1TDnEsQDxqQ1LLB8KT6qeKdVSeBS5CNxjDuB9WU7MLvJUhvNfem-e9TBdPgrDBe9HKCpx27mFsky-LKoPtlTvnVZ82Qig..";
    const depots = data.slice(0, 1);
    const orders = data.slice(1);
    const geoprocessor = new Geoprocessor(`${geoserviceUrl}?token=${arcgis}`);
    const params = {
      default_date: 1455609600000,
      time_units: "Minutes",
      distance_units: "Miles",
      depots: JSON.stringify(getDepots(depots)),
      orders: JSON.stringify(getOrders(orders)),
      routes: JSON.stringify(getRoutes(depots)),
      populate_directions: true,
    };

    geoprocessor.submitJob(params).then(results => {
      geoprocessor.getResultData(results.jobId, "out_routes").then(showRoutes);
      geoprocessor.getResultData(results.jobId, "out_stops").then(showStops);
      geoprocessor.getResultData(results.jobId, "out_directions").then(showDirections);
    });
  }

  function setupGeomapping(Geoprocessor, Point) {
    var id = $('input').val();
    $.ajax({
      url: "/api/crawls/breweries/" + id,
      success: function(result) {
        addToMap(result, false);
        addToBrewBox(result.breweries);
        getGeomappingDataFromArcGis(Geoprocessor, Point, result.breweries);
    }});

  }

  function addToBrewBox(brews){
    brews.forEach(brew =>{
      $(".allBreweries .brews").append(`
        <div class='brew'>
          <img src="${brew.logo}" />
          <h3>${brew.name}</h3>
        </div>
        `);
    })
  }


  $(".flyout").on("click",function(){
    var parent =  $(this).parent();
    parent.toggleClass('active');

    if(parent.hasClass('active'))
    {
      parent.css("right","0px");
    }
    else
    {
      parent.css("right","-260px");
    }
  })

  const dependencies = [
    "esri/tasks/Geoprocessor",
    "esri/geometry/Point",
  ];

  require(dependencies, setupGeomapping);
});