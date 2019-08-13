import { Component } from '@angular/core';
import {
  NavParams,
  ViewController 
} from "ionic-angular";

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  disabledBtn6: boolean = false;
  disabledBtn9: boolean = false;
  disabledBtn12: boolean = false;
  disabledBtn24: boolean = false;
  selectedData: number;

  constructor(
    private params: NavParams,
    private viewCtrl:ViewController
  ) {
    this.selectedData = params.get('selectData')
    // console.log("SelectData is " + this.selectedData)
    switch (this.selectedData) {
      case 6:
        this.disabledBtn6 = true;
        break;
      case 9:
        this.disabledBtn9 = true;
        break;
      case 12:
        this.disabledBtn12 = true;
        break;
      case 24:
        this.disabledBtn24 = true;
        break;
    }
  }

  selectDay(selectedperiod){
    this.viewCtrl.dismiss(selectedperiod);
   }
}
