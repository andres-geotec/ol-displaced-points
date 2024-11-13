<script setup>
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { onMounted, ref } from 'vue';
import { Point } from 'ol/geom';

const centerPoint = new Point([-99, 19]);
// const urlCapa = 'https://sisdai-mapas.conahcyt.mx/assets/estados-centroides.geojson'

const map = new Map({
  // target: mapaDiv.value,
  layers: [
    new TileLayer({ source: new OSM() }),
  ],
  view: new View({
    center: centerPoint.getCoordinates(),
    zoom: 5,
    projection: "EPSG:4326",
  }),
});

const mapaDiv = ref(null)
onMounted(() => map.setTarget(mapaDiv.value))
</script>

<template>
  <div id="map" ref="mapaDiv"></div>
</template>
