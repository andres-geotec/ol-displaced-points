import VectorLayer from "ol/layer/Vector";
// import DelimitedCluster from "ol/source/Cluster";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';
// import DelimitedCluster from "../../../src/DelimitedCluster";
import DelimitedCluster from "../../../build/ol-displaced-points/DelimitedCluster";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

const styleCache = {};
export default new VectorLayer({
  source: new DelimitedCluster({
    source: new VectorSource({
      url: 'https://sisdai-mapas.conahcyt.mx/assets/estados-centroides.geojson',
      format: new GeoJSON(),
    }),
    distance: 20,
    minDistance: 0,
    delimiterField: 'grado_marg',
  }),
  style: function (feature) {
    const size = feature.get('features').length;
    let style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          // radius: 10,
          radius: 5 * size,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: '#3399CC',
          }),
        }),
        // text: new Text({
        //   // text: size.toString(),
        //   fill: new Fill({
        //     color: '#fff',
        //   }),
        // }),
      });

      styleCache[size] = style;
    }

    return style;
  },
});
