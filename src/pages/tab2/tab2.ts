import { JsonLoadFinder } from './JsonLoadFinder';

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from "chart.js";
import { DomSanitizer } from "@angular/platform-browser";

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Comments, Months, Methods } from './tab2.module';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Generated class for the Tab2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html'
})
export class Tab2Page {

  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  private lineChart: Chart;
  private activeChart: Chart;
  private activeChart2: Chart;
  private chartcount: number;
  private measureChange: boolean;
  private periodofMonth: number;
  private sixMonth = false;
  private threeMonth = false;
  private tweleveMonth = false;
  private dataUrl: string = "assets/example_data/loadChart.json";

  test = 1;
  videoId = 'https://www.youtube.com/embed/TlQ8txalLYg';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dom: DomSanitizer,
    private dataFinder: JsonLoadFinder
 )
{
  this.measureChange = true;
    this.periodofMonth = 6;
    console.log('start!');
    this.dataFinder.getJSONData('../../assets/example_data/loadChart.json').then(data => {
      // console.log(data);
      console.log(data[0]);
      this.activeChart = new Chart(
        this.lineCanvas.nativeElement,
        data[0].fisrt
      );

      this.lineChart = this.activeChart;
    });

  }

  clickThreeMon() {
    console.log('click!');
    this.threeMonth = true;
    this.sixMonth = false;
    this.tweleveMonth = false;

    this.measureChange = true;

    console.log('start!');
    this.dataFinder.getJSONData('../../assets/data/loadChart.json').then(data => {
      // console.log(data);
      console.log(data[0]);
      this.activeChart = new Chart(
        this.lineCanvas.nativeElement,
        data[0].fisrt
      );

      this.lineChart = this.activeChart;
    });
  }


//   ionViewDidLoad() {
//     console.log('ionViewDidLoad Tab2Page');
//   }

}
