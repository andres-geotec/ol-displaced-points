import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';
import Cluster from "../../../src/Cluster";
import DisplacedPoints from "../../../src/DisplacedPoints";

export default new VectorLayer({
  source: new DisplacedPoints({
    source: new VectorSource({
      url: 'https://sisdai-mapas.conahcyt.mx/assets/estados-centroides.geojson',
      format: new GeoJSON(),
    }),
    distance: 80,
    minDistance: 40,
  }),
});
