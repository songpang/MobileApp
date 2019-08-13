import { JsonLoadFinder } from "./JsonLoadFinder";

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from "chart.js";

import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from "ionic-angular";
import { Tab2PopoverPage } from "../tab2-popover/tab2-popover";
import { PopoverComponent } from "../../components/popover/popover";

@IonicPage()
@Component({
  selector: "page-tab2",
  templateUrl: "tab2.html"
})
export class Tab2Page {
  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  private lineChart: Chart;
  private activeChart: Chart;
  private measureChange: boolean;
  private periodofMonth: number;
  private dataChanged: boolean = true;

  selectedData: any = 6;
  globalPeriod: number = 6;
  jasontodata1: any;
  jasontodata2: any;
  pastData = [
    100,
    94,
    95,
    96,
    93,
    91,
    92,
    91,
    90,
    87,
    88,
    86,
    85,
    84,
    82,
    80,
    78,
    75
  ];
  userData = [
    79,
    83,
    79,
    83,
    83,
    83,
    84,
    86,
    82,
    83,
    87,
    84,
    79,
    79,
    80,
    84,
    82,
    83
  ];

  private dataUrl: string = "assets/example_data/loadChart.json";

  videoId = "https://www.youtube.com/embed/TlQ8txalLYg";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataFinder: JsonLoadFinder,
    private popoverController: PopoverController
  ) {
    this.measureChange = true;
    console.log("start!");

    this.dataFinder
      .getJSONData("../../assets/example_data/loadChart.json")
      .then(data => {
        this.jasontodata1 = data[0].first;
        this.jasontodata2 = data[1].second;

        console.log(data[0]);
        this.activeChart = new Chart(
          this.lineCanvas.nativeElement,
          this.jasontodata1
        );

        this.lineChart = this.activeChart;
        // measure of yAxes ( init KG )
        this.lineChart.options.scales.yAxes = [
          {
            ticks: {
              callback: value => {
                return value + " kg";
              }
            }
          }
        ];
        this.lineChart.update();
      });
    console.log("Load constructor");
  }
  
  viewpastData(period) {
    const dataOfMonth = [
      "Dec/18",
      "Nov",
      "Oct",
      "Sep",
      "Aug",
      "Jul",
      "Jun",
      "May",
      "Apr",
      "Mar",
      "Feb",
      "Jan",
      "Dec/17",
      "Nov",
      "Oct",
      "Sep",
      "Aug",
      "Jul"
    ];

    let changePeriod = this.globalPeriod - period;
    let __lineChartData = this.lineChart;

    switch (period) {
      case 6:
        __lineChartData.data.labels.splice(0, changePeriod);
        __lineChartData.data.datasets[0].data.splice(0, changePeriod);
        __lineChartData.data.datasets[1].data.splice(0, changePeriod);

        this.globalPeriod = period;
        break;
      case 9:
        if (changePeriod > 0) {
          __lineChartData.data.labels.splice(0, changePeriod);
          __lineChartData.data.datasets[0].data.splice(0, changePeriod);
          __lineChartData.data.datasets[1].data.splice(0, changePeriod);
          console.log("i'm 9");
        } else {
          this.unshiftData(
            3,
            __lineChartData.data,
            dataOfMonth,
            this.pastData,
            this.userData
          );
        }
        this.globalPeriod = period;
        break;
      case 12:
        if (changePeriod > 0) {
          __lineChartData.data.labels.splice(0, changePeriod);
          __lineChartData.data.datasets[0].data.splice(0, changePeriod);
          __lineChartData.data.datasets[1].data.splice(0, changePeriod);
          console.log("i'm 12");
        } else {
          this.unshiftData(
            period - this.globalPeriod,
            __lineChartData.data,
            dataOfMonth,
            this.pastData,
            this.userData
          );
        }
        this.globalPeriod = period;
        break;
      case 24:
        if (changePeriod > 0) {
          __lineChartData.data.labels.splice(0, changePeriod);
          __lineChartData.data.datasets[0].data.splice(0, changePeriod);
          __lineChartData.data.datasets[1].data.splice(0, changePeriod);
          console.log("i'm 24");
        } else {
          this.unshiftData(
            period - this.globalPeriod,
            __lineChartData.data,
            dataOfMonth,
            this.pastData,
            this.userData
          );
        }
        this.globalPeriod = period;
        break;
    }
    __lineChartData.update();
  }

  unshiftData(count: number, chartData, dataList, targetData, userDat) {
    let tar = [];
    let usr = [];

    for (let i = 0; i < count; i++) {
      chartData.labels.unshift(dataList[i]);
    }

    for (let j = 0; j < count; j++) {
      tar.push(targetData[j]);
      usr.push(userDat[j]);
    }
    //kyle's Data
    chartData.datasets[0].data = tar.concat(chartData.datasets[0].data);
    //user's Data
    chartData.datasets[1].data = usr.concat(chartData.datasets[1].data);

    console.log(chartData.datasets[0].data);
  }

  // conversion measure of data
  // dataConverse() {
  //   let userData_weight = this.lineChart.data.datasets[0].data;
  //   let userData_weight2 = this.lineChart.data.datasets[1].data;

  //   if (this.measureChange) {
  //     userData_weight.forEach((item, index, array) => {
  //       array[index] = item * 2.2;
  //       array[index] = array[index].toFixed(2);
  //       // function of javascript calculating error fix (toFixed fn)
  //     });
  //     userData_weight2.forEach((item, index, array) => {
  //       array[index] = item * 2.2;
  //       array[index] = array[index].toFixed(2);
  //       // function of javascript calculating error fix (toFixed fn)
  //     });

  //     this.lineChart.options.scales.yAxes = [
  //       {
  //         ticks: {
  //           callback: value => {
  //             return value + " lb";
  //           }
  //         }
  //       }
  //     ];

  //     this.lineChart.update();
  //     this.measureChange = false;
  //   } else {
  //     userData_weight.forEach((item, index, array) => {
  //       array[index] = item / 2.2;
  //       array[index] = array[index].toFixed(2);
  //       // function of javascript calculating error fix
  //     });
  //     userData_weight2.forEach((item, index, array) => {
  //       array[index] = item / 2.2;
  //       array[index] = array[index].toFixed(2);
  //       // function of javascript calculating error fix
  //     });

  //     this.lineChart.options.scales.yAxes = [
  //       {
  //         ticks: {
  //           callback: value => {
  //             return value + " kg";
  //           }
  //         }
  //       }
  //     ];

  //     this.lineChart.update();
  //     this.measureChange = true;
  //   }
  //   console.log(userData_weight);
  // }

  changeData() {
    if (this.dataChanged) {
      this.activeChart = new Chart(
        this.lineCanvas.nativeElement,
        this.jasontodata2
      );
      this.lineChart = this.activeChart;
      this.dataChanged = false;
    } else {
      this.activeChart = new Chart(
        this.lineCanvas.nativeElement,
        this.jasontodata1
      );
      this.lineChart = this.activeChart;
      this.dataChanged = true;
    }
  }

  //to change month [: Btn] can show popover
  //list of data (6, 9, 12, 24 month)
  async openpopver(ev: Event) {
    const popover = await this.popoverController.create({
      component: Tab2PopoverPage,
      event: ev,
      showBackdrop: false,
      componentProps: {
        selectedData: this.selectedData
      }
    });

    popover.present();
  }

  testfunc () {
    console.log("Hello i'm test");
    this.viewpastData(24);
  }
  
  presentPopover(myEvent) {
    let selectData = this.selectedData
    let popover = this.popoverController.create(PopoverComponent,
      { selectData });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {  
      if (data) {
        this.selectedData = data;
        this.viewpastData(this.selectedData);
        console.log("Here " + data + "this " + this.selectedData);
      }
    });
  }
}
