import {Component, OnInit, OnChanges, Input, SimpleChange} from '@angular/core';

import OlMap from 'ol/Map';
import OlVectorSource from 'ol/source/Vector';
import OlVectorLayer from 'ol/layer/Vector';
import OlView from 'ol/View';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlXyzSource from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlStyle from 'ol/style/Style';
import OlIcon from 'ol/style/Icon';

import {fromLonLat} from 'ol/proj';
import {LocationService} from '../../_services/location.service';
import {Sale} from '../../_models/Sale.model';

@Component({
  selector: 'app-sale-modificate-map',
  templateUrl: './sale-modificate-map.component.html',
  styleUrls: ['./sale-modificate-map.component.css']
})
export class SaleModificateMapComponent implements OnInit, OnChanges {

  @Input() sale: Sale;
  @Input() movieMapMarker = false;

  map: OlMap;
  vectorSource: OlVectorSource;
  vectorLayer: OlVectorLayer;
  xyzSource: OlXyzSource;
  tileLayer: OlTileLayer;
  view: OlView;
  marker: OlFeature;
  styles: OlStyle;
  rotate_coordinates = [];
  center = [];

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    if (this.sale.id !== 0) {
      this.rotate_coordinates = this.locationService.rotateCoordinates(this.sale.location.coordinates);
      /* Подгрузка карты*/
      this.loadMap();
      this.addMarker(this.rotate_coordinates[1], this.rotate_coordinates[0]); // метка координат
    } else {
      this.loadMap();
      this.addView(27.547099, 53.904098);
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {

    if (this.movieMapMarker === true) {

      this.removeFeatures();
      this.rotate_coordinates = this.locationService.rotateCoordinates(this.sale.location.coordinates);
      this.addMarker(this.rotate_coordinates[1], this.rotate_coordinates[0]); // метка координат // сделать перемещение центра карты*/

      this.movieMapMarker = false;

    }
  }

  loadMap() {
    // Style
    this.styles = new OlStyle({
      image: new OlIcon({
        anchor: [0.4, 1],
        opacity: 1,
        src: 'assets/images/icon.png'
      })
    });
    /* Vector */
    this.vectorSource = new OlVectorSource({});
    // Vector layer
    this.vectorLayer = new OlVectorLayer({
      source: this.vectorSource,
      style: this.styles
    });
    /* XYZ */
    this.xyzSource = new OlXyzSource({
      url: 'https://tile.osm.org/{z}/{x}/{y}.png'
    });
    // Tile layer
    this.tileLayer = new OlTileLayer({
      source: this.xyzSource
    });
    /* View and map */
    this.view = new OlView({
      zoom: 15
    });

    this.map = new OlMap({
      target: 'map',
      layers: [this.tileLayer, this.vectorLayer],
      view: this.view
    });
  }

  addView (lon = 0, lat = 0) {
    this.view.setCenter(fromLonLat([+lon, +lat]));
  }

  addMarker(lon = 0, lat = 0) {

    this.marker = new OlFeature({
      geometry: new OlPoint(fromLonLat([+lon, +lat])),
    });

    this.vectorSource.addFeature(this.marker);
    this.addView(lon, lat);
  }

  removeFeatures() {
    const features = this.vectorSource.getFeatures();
    features.forEach((feature) => {
      this.vectorSource.removeFeature(feature);
    });
  }

}
