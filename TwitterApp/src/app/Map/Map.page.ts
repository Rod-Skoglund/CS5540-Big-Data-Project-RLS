import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as legend from 'd3-svg-legend';
import {isUndefined} from 'util';
import {DataService} from '../service/data.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-Map',
  templateUrl: 'Map.page.html',
  styleUrls: ['Map.page.scss']
})
export class MapPage implements OnInit {
  loadingWorld: boolean;
  errorWorld: string;
  worldWidth = 1000;
  worldHeight = 610;
  loadingPoint: boolean;
  errorPoint: string;
  pointWidth = 975;
  pointHeight = 610;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
      if (!environment.testing) {
          this.loadingWorld = true;
          this.loadingPoint = true;

          this.dataService.getCountryData().subscribe((countries: any) => {
                  this.createWorldMap(countries.CountryCounts);
                  this.loadingWorld = false;
              },
              error => {
                  this.errorWorld = 'Unable to load World Map';
                  this.loadingWorld = false;
          });

          this.dataService.getGeoData().subscribe((coords: any) => {
                  this.createPointMap(coords.Coords);
                  this.loadingPoint = false;
              }, error => {
                  this.errorPoint = 'Unable to load US Map';
                  this.loadingPoint = false;
          });
      }
  }

  createWorldMap(dataset) {
      const colorScale = d3.scaleThreshold()
          .domain([1, 10, 100, 500, 1000, 5000, 10000, 100000, 1000000])
          .range(d3.schemeBlues[9]);

      const svg = d3.select('#CountryMap')
          .append('svg')
          .attr('width', this.worldWidth)
          .attr('height', this.worldHeight);

      const projection = d3.geoMercator().scale(100).center([0, 20])
          .translate([this.worldWidth / 2, this.worldHeight / 2]);
      const path = d3.geoPath().projection(projection);
      const countByName = d3.map();

      d3.json('../assets/world.json').then(world => {
        dataset.forEach(data => countByName.set(data.country_code, data.count));
        const countries = topojson.feature(world, world.objects.countries);

        svg.append('g')
            .attr('class', 'legendLinear')
            .attr('transform', 'translate(810, 400)');

        const legendLinear = legend.legendColor()
            .labelFormat(d3.format('1'))
            .shape('rect')
            .orient('vertical')
            .shapeWidth(40)
            .scale(colorScale);

        svg.selectAll('path').data(countries.features)
            .enter().append('path')
            .attr('d', path)
            .attr('stroke', 'black')
            .attr('stroke-opacity', 0.2)
            .attr('fill', d => {
              const countryCount = countByName.get(d.properties.ISO_A2);
              if (isUndefined(countryCount)) {
                 return colorScale(0);
               } else {
                 return colorScale(countryCount);
               }
            });

        svg.select('.legendLinear')
          .call(legendLinear);
    });
  }

  createPointMap(dataset) {
      const svg = d3.select('#GPSMap')
          .append('svg')
          .attr('width', this.pointWidth)
          .attr('height', this.pointHeight);

      const projection = d3.geoMercator().scale(100).center([0, 20])
          .translate([this.worldWidth / 2, this.worldHeight / 2]);
      const path = d3.geoPath().projection(projection);

      d3.json('../assets/world.json').then(world => {
          const countries = topojson.feature(world, world.objects.countries);

          svg.selectAll('path').data(countries.features)
              .enter().append('path')
              .attr('d', path)
              .attr('stroke', 'black')
              .attr('stroke-opacity', 0.2)
              .attr('fill', 'lightgreen');

          svg.selectAll('.pin')
              .data(dataset)
              .enter().append('circle', '.pin')
              .attr('r', 1.25)
              .attr('fill', 'red')
              .attr('transform', d => 'translate(' +
                  projection([d.longitude, d.latitude]) + ')');
      });
  }
}
