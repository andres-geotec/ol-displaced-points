<script setup>
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { onMounted, ref } from 'vue';
import Point from 'ol/geom/Point';

import goniometric from "./goniometric";
import capaCluster from './capa-cluster';
import capaDesplazados from './capa-desplazados';

const centerPoint = new Point([-99, 19]);
// const urlCapa = 'https://sisdai-mapas.conahcyt.mx/assets/estados-centroides.geojson'

const map = new Map({
  // target: mapaDiv.value,
  layers: [ new TileLayer({ source: new OSM() }) ],
  view: new View({
    center: centerPoint.getCoordinates(),
    zoom: 6,
    projection: "EPSG:4326",
  }),
});

const mapaDiv = ref(null)
onMounted(() => map.setTarget(mapaDiv.value))

// map.addLayer(goniometric(map.getView().getResolution()));
// map.addLayer(capaCluster);
map.addLayer(capaDesplazados);
</script>

<template>
  <div id="map" ref="mapaDiv" />
</template>
