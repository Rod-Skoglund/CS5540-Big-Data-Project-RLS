import {Component, Injectable, OnInit} from '@angular/core';
import {DataService} from '../service/data.service';
import * as d3 from 'd3';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-Hashtag',
  templateUrl: 'Hashtag.page.html',
  styleUrls: ['Hashtag.page.scss']
})
export class HashtagPage implements OnInit {
  loadingBubble: boolean;
  errorBubble: string;
  bubbleHeight = 1000;
  bubbleWidth = 1000;

  loadingTopHash: boolean;
  errorTopHash: string;
  TopHashHeight = 500;
  TopHashWidth = 1200;

  loadingTopHashTime: boolean;
  errorTopHashTime: string;
  TopHashTimeHeight = 500;
  TopHashTimeWidth = 1000;

  constructor(private dataService: DataService) {}

  ngOnInit() {
      if (!environment.testing) {
          this.loadingBubble = true;
          this.loadingTopHash = true;
          this.loadingTopHashTime = true;

          this.dataService.getBubbleChart().subscribe(hashtags => {
                  this.createBubbles(hashtags);
                  this.loadingBubble = false;
              },
              error => {
                  this.errorBubble = 'Unable to load Bubble Chart';
                  this.loadingBubble = false;
              });

          this.dataService.getTop10Hash().subscribe(top10Hash => {
                  this.createTop10Hash(top10Hash);
                  this.loadingTopHash = false;
              },
              error => {
                  this.errorTopHash = 'Unable to load Top 10 Hashtags';
                  this.loadingTopHash = false;
              });

          this.dataService.getTopHashTime().subscribe((topHashTime: any) => {
                  this.createTopHashTime(topHashTime.TimePoints);
                  this.loadingTopHashTime = false;
              },
              error => {
                  this.errorTopHashTime = 'Unable to load Hashtag Chart';
                  this.loadingTopHashTime = false;
              });
      }
  }

  createTop10Hash(dataset) {
      const margin = 200;
      const width = this.TopHashWidth - margin;
      const height = this.TopHashHeight - margin;

      const svg = d3.select('#Top10Hash')
          .append('svg')
          .attr('viewBox', `0,0,${this.TopHashWidth},${this.TopHashHeight}`)
          .attr('width', this.TopHashWidth)
          .attr('height', this.TopHashHeight);

      const xScale = d3.scaleBand().range ([0, width]).padding(0.4);
      const yScale = d3.scaleLinear().range ([height, 0]);

      const g = svg.append('g').attr('transform', 'translate(' + 100 + ',' + 100 + ')');

      xScale.domain(dataset.Hashtags.map(d => d.text));
      yScale.domain([0, d3.max(dataset.Hashtags, d => d.count)]);

      g.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(xScale))
          .append('text')
          .attr('y', height - 250)
          .attr('x', width - 100)
          .attr('text-anchor', 'end')
          .attr('stroke', 'black')
          .text('Hashtag');

      g.append('g')
          .call(d3.axisLeft(yScale).tickFormat(d => {
              return d;
          }).ticks(10))
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '-5.1em')
          .attr('text-anchor', 'end')
          .attr('stroke', 'black')
          .text('Tweets with Hashtag');

      g.selectAll('.bar')
          .data(dataset.Hashtags)
          .enter().append('rect')
          .style('fill', 'steelblue')
          .attr('x', d => xScale(d.text))
          .attr('y', d => yScale(d.count))
          .attr('width', xScale.bandwidth())
          .attr('height', d => height - yScale(d.count));
  }

  createTopHashTime(dataset) {
      const margin = {top: 10, right: 200, bottom: 30, left: 50};
      const width = this.TopHashTimeWidth - margin.left - margin.right;
      const height = this.TopHashTimeHeight - margin.top - margin.bottom;
      const dateParse = d3.timeParse('%m-%d-%H');
      const color = d3.scaleOrdinal(['#009900', '#ff9900', '#ff0000', '#cc99ff',
          '#660066', '#0033cc', '#00ffff', '#ff00ff', '#ff0066', '#000066',
          '#00cc99', '#666699', '#ffff00', '#00ff00', '#cc3300', '#6600cc',
          '#330033', '#ffc6b3', '#003300', '#990000']);

      const xScale = d3.scaleTime().range([0, width])
          .domain(d3.extent(dataset, d => dateParse(d.Time)));

      const yScale = d3.scaleLinear().range([height, 0])
          .domain([0, d3.max(dataset, d => d.Count)]);

      const countline = d3.line()
          .x(d => xScale(dateParse(d.Time)))
          .y(d => yScale(d.Count));

      const dataNest = d3.nest()
          .key(d => d.Hashtag)
          .entries(dataset);

      const svg = d3.select('#TopHashTime')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      dataNest.forEach((d, i) => {
          svg.append('path')
              .attr('stroke', color(d.key))
              .attr('fill', 'none')
              .attr('d', countline(d.values));
      });

      svg.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(xScale));

      svg.append('g')
          .call(d3.axisLeft(yScale));

      const legend = svg.selectAll('.legend')
          .data(color.domain().slice())
          .enter().append('g');

      legend.append('rect')
          .attr('x', width + 10)
          .attr('y', (d, i) => i * 20)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', d => color(d));

      legend.append('text')
          .attr('x', width + 22)
          .attr('y', (d, i) => (i * 20) + 6)
          .attr('width', 40)
          .attr('dy', '.35em')
          .attr('text-anchor', 'start')
          .text(d => d);
  }

  createBubbles(dataset) {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const bubble = d3.pack()
        .size([this.bubbleWidth, this.bubbleHeight])
        .padding(1.5);

    const svg = d3.select('#BubbleChart')
        .append('svg')
        .attr('viewBox', `0,0,${this.bubbleWidth},${this.bubbleHeight}`)
        .attr('width', this.bubbleWidth)
        .attr('height', this.bubbleHeight)
        .attr('class', 'bubble');

    const nodes = d3.hierarchy(dataset)
        .sum((d: any) => d.count);

    const node = svg.selectAll('.node')
        .data(bubble(nodes).descendants())
        .enter()
        .filter(d => {
          return !d.children;
        })
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        .style('fill', (d, i: any) => color(i));

    node.append('title')
        .text((d: any) =>  d.data.text + ': ' + d.data.count);

    node.append('circle')
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .attr('r', (d) => d.r)
        .style('fill', (d, i: any) => color(i));

    node.append('text')
        .attr('dy', '.2em')
        .style('text-anchor', 'middle')
        .text((d: any) => d.data.text)
        .attr('font-family', 'sans-serif')
        .attr('font-size', (d) => d.r / 5)
        .attr('fill', 'white');

    node.append('text')
        .attr('dy', '1.3em')
        .style('text-anchor', 'middle')
        .text((d: any) => d.data.count)
        .attr('font-family', 'Gill Sans')
        .attr('font-size', (d) =>  d.r / 5)
        .attr('fill', 'white');
  }
}
