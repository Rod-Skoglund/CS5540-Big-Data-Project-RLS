import { Component, OnInit } from '@angular/core';
import {DataService} from '../service/data.service';
import * as d3 from 'd3';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-Tweet',
  templateUrl: './Tweet.page.html',
  styleUrls: ['./Tweet.page.scss'],
})
export class TweetPage implements OnInit {
  freqLoading = false;
  freqError: string;
  freqWidth = 500;
  freqHeight = 500;

  retweetLoading = false;
  retweetError: string;
  retweetWidth = 1000;
  retweetHeight = 500;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (!environment.testing) {
      this.freqLoading = true;
      this.retweetLoading = true;

      this.dataService.getTweetFreq().subscribe((freqData: any) => {
            this.freqLoading = false;
            this.createPie([
              {name: 'Retweets', percent: freqData.Retweets},
              {name: 'Replies', percent: freqData.Replies},
              {name: 'Tweets', percent: freqData.Tweets}
            ]);
          },
          error => {
            this.freqLoading = false;
            this.freqError = 'Unable to load Tweet Frequency Data';
          }
      );
      this.dataService.getMostRetweeted().subscribe((retweeted: any) => {
            this.retweetLoading = false;
            this.createStacked(retweeted.TimePoints);
          },
              error => {
            this.retweetLoading = false;
            this.freqError = 'Unable to load Tweet Frequency Data';
        }
      );
    }
  }

  createStacked(dataset) {
    const margin = {top: 25, right: 20, bottom: 20, left: 60};
    const width =  this.retweetWidth - margin.left - margin.right;
    const height = this.retweetHeight - margin.top - margin.bottom;
    const keys = ['Retweet_Count', 'Followers_Count', 'Listed_Count'];
    const strokeWidth = 1.5;
    const dateParse = d3.timeParse('%m-%d-%H');
    const stack = d3.stack().keys(keys);
    const stackedValues = stack(dataset);

    const stackedData = [];
    stackedValues.forEach((layer, index) => {
      const currentStack = [];
      layer.forEach((d, i) => {
        currentStack.push({
          values: d,
          time: dateParse(dataset[i].Time)
        });
      });
      stackedData.push(currentStack);
    });

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(stackedValues[stackedValues.length - 1], dp => dp[1])]);

    const xScale = d3.scaleLinear().range([0, width])
        .domain([stackedData[0][0].time, stackedData[0][stackedData.length - 1].time]);

    const area = d3.area()
        .x(dataPoint => xScale(dataPoint.time))
        .y0(dataPoint => yScale(dataPoint.values[0]))
        .y1(dataPoint => yScale(dataPoint.values[1]));

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(['pink', 'lightgreen', 'lightblue']);

    const svg = d3.select('#Retweeted')
        .append('svg')
        .attr('width', this.retweetWidth)
        .attr('height', this.retweetHeight);

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const grp = chart.append('g')
        .attr('transform', `translate(-${margin.left - strokeWidth},0)`);

    grp.selectAll('g')
        .data(stackedData)
        .enter().append('g')
        .append('path')
        .attr('transform', `translate(${margin.left},0)`)
        .attr('d', dataValue => area(dataValue))
        .style('fill', (d, i) => color(i));

    chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m/%d %I:%M%p')));

    chart.append('g')
        .attr('transform', `translate(0, 0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .attr('text-anchor', 'end')
        .text('Count');

    const legend = svg.selectAll('.legend')
        .data(['Retweets', 'Followers', 'Groups'])
        .enter().append('g')
        .attr('transform', (d, i) => 'translate(' + i * -85 + ', 10)');

    legend.append('rect')
        .attr('x', width + -53)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color);

    legend.append('text')
        .attr('x', width - 40)
        .attr('y', 5)
        .attr('width', 40)
        .attr('dy', '.35em')
        .attr('text-anchor', 'start')
        .text(d => d);
  }

  createPie(dataset) {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const radius = this.freqWidth * 0.49;

    const svg = d3.select('#Frequencies')
        .append('svg')
        .attr('width', this.freqWidth)
        .attr('height', this.freqHeight)
        .append('g')
        .attr('transform', `translate(${this.freqWidth / 2},${this.freqHeight / 2})`);

    const pie = d3.pie()
        .value(d => d.percent)
        .sort(null);

    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    const label = d3.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.5);

    svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i));

    svg.selectAll('text')
        .data(pie(dataset))
        .enter()
        .append('text')
        .attr('transform', d => 'translate(' + label.centroid(d) + ')')
        .attr('dy', '.4em')
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .attr('fill', '#fff')
        .attr('font-size', '20px');
  }
}
