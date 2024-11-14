import VectorLayer from "ol/layer/Vector";
import Cluster from "ol/source/Cluster";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';

export default new VectorLayer({
  source: new Cluster({
    source: new VectorSource({
      url: 'https://sisdai-mapas.conahcyt.mx/assets/estados-centroides.geojson',
      format: new GeoJSON(),
    }),
    distance: 20,
    minDistance: 0,
  }),
});
