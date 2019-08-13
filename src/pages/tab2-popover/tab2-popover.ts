import { Component } from "@angular/core";
import {
  IonicPage,
  NavParams,
  ViewController 
} from "ionic-angular";

/**
 * Generated class for the Tab2PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-tab2-popover",
  templateUrl: "tab2-popover.html"
})
export class Tab2PopoverPage {
  disabledBtn6: boolean = false;
  disabledBtn9: boolean = false;
  disabledBtn12: boolean = false;
  disabledBtn24: boolean = false;
  selectedData: number;

  constructor(
    private params: NavParams,
    private viewCtrl:ViewController
  ) {


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
