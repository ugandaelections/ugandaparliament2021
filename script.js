var map = L.map('map').setView([1.3733, 32.2903], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function getColor(party) {
    switch (party) {
        case 'DP': return 'green';
        case 'FDC': return 'blue';
        case 'INDEPENDENT': return 'grey';
        case 'JEEEMA': return 'purple';
        case 'NRM': return '#FADA5E'; // Updated yellow
        case 'NUP': return '#E85A5A'; // Updated red
        case 'PPP': return 'brown';
        case 'UPC': return 'black';
        default: return '#FFEDA0';
    }
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties["Political Party"]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson = L.geoJson(ugandaElectionsData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Members of the 11th Parliament of Uganda</h4>' +  (props ?
        '<b>Member of Parliament: ' + props.Name + '</b><br />Constituency: ' + props.Constituency + '<br />Party: ' + props["Political Party"]
        : 'Hover over a constituency');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        parties = ['DP', 'FDC', 'INDEPENDENT', 'JEEEMA', 'NRM', 'NUP', 'PPP', 'UPC'];

    for (var i = 0; i < parties.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(parties[i]) + '"></i> ' +
            parties[i] + '<br>';
    }

    return div;
};

legend.addTo(map);
