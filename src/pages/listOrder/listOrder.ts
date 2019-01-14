import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { FeedModel } from '../feed/feed.model';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/Rx';
import { ListOrderModel, ListFilterModel } from './listOrder.model';
import { ListOrderService } from './listOrder.service';
import { RestService } from '../../app/services/restService.service';
import { FormOrderPage } from '../../pages/formOrder/formOrder';

var moment = require('moment-timezone');

@Component({
  selector: 'listOrderPage',
  templateUrl: 'listOrder.html'
})
export class ListOrderPage {
  list2: ListOrderModel = new ListOrderModel();
  listFilter: ListFilterModel = new ListFilterModel();
  feed: FeedModel = new FeedModel();
  loading: any;
  items: any;
  resultData: any;
  show: boolean = false;
  searchTerm: string = '';
  searchControl: FormControl;

  constructor(
    public nav: NavController,
    public list2Service: ListOrderService,
    public navParams: NavParams,
    public RestService:RestService,
    public loadingCtrl: LoadingController
  ) {
    this.feed.category = navParams.get('category');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    var dtNow = moment(new Date());
    var dtExpiration = moment(this.RestService.AuthData.expiration);
    var self = this;

    if (dtNow < dtExpiration) {
      this.presentLoadingDefault();
      this.loadData();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.setFilteredItems();
      });
    } else {
      this.presentLoadingDefault();
      this.RestService.refreshCredentials(function(err, results) {
        if (err) {
          console.log('Need to login again!!! - Credentials expired from listOrder');
          self.loading.dismiss();
          self.RestService.appRestart();
        } else {
          console.log('From listOrder - Credentials refreshed!');
          self.loadData();
          self.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            self.setFilteredItems();
          });
        }
      });
    }
  }

  ionViewWillEnter() {
  }

  loadData() {
    var restURL: string;
    restURL="https://ap6oiuyew6.execute-api.us-east-1.amazonaws.com/dev/OrderAMeal";
    var config = {
      invokeUrl: restURL,
      accessKey: this.RestService.AuthData.accessKeyId,
      secretKey: this.RestService.AuthData.secretKey,
      sessionToken: this.RestService.AuthData.sessionToken,
      region:'us-east-1'
    };
    var apigClient = this.RestService.AWSRestFactory.newClient(config);
    var params = {
      //email: accountInfo.getEmail()
    };
    var pathTemplate = '';
    var method = 'GET';
    var additionalParams = {
        queryParams: {
            profileid: this.RestService.currentProfile
        }
    };
    var body = '';
    var self = this;
    apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(function(result){
      console.log('Meal Results: ', result.data);
      self.RestService.results = result.data;
      self.list2Service
      .getData()
      .then(data => {
        self.list2.items = self.RestService.results;
        self.loading.dismiss();
      });
    }).catch( function(result){
        console.log(body);
        self.loading.dismiss();
    });

    var restURLFilter: string;
    restURLFilter="https://ap6oiuyew6.execute-api.us-east-1.amazonaws.com/dev/GetMealFilterList";
    var config2 = {
      invokeUrl: restURLFilter,
      accessKey: this.RestService.AuthData.accessKeyId,
      secretKey: this.RestService.AuthData.secretKey,
      sessionToken: this.RestService.AuthData.sessionToken,
      region:'us-east-1'
    };
    var apigClient2 = this.RestService.AWSRestFactory.newClient(config2);
    var params2 = {
      //email: accountInfo.getEmail()
    };
    var pathTemplate2 = '';
    var method2 = 'GET';
    var additionalParams2 = {
        queryParams: {
            profileid: this.RestService.currentProfile
        }
    };
    var body2 = '';
    apigClient2.invokeApi(params2, pathTemplate2, method2, additionalParams2, body2)
    .then(function(result){
      self.list2Service
      .getFilter()
      .then(data => {
        self.listFilter.items = result.data;
        self.setFilteredItems();
        self.loading.dismiss();
      });
    }).catch( function(result){
        console.log(body);
        self.loading.dismiss();
    });
  }

  setFilteredItems() {
      this.items = this.filterItems(this.searchTerm);
      //alert('Search Term:' + this.searchTerm);
  }

  filterItems(searchTerm){
    if (this.listFilter.items !== undefined) {
      if (this.listFilter.items.filter((item) => {return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) ===0;}).length ==1 &&
      this.listFilter.items.filter((item) => {return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) ===0;})[0].name.toLowerCase() == searchTerm.toLowerCase() ){
        return [];
      } else {
        return this.listFilter.items.filter((item) => {
          return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
      }
    } else {
      return [];
    }
  }

  openRecord(recordId) {
    this.nav.push(FormOrderPage, { recId: recordId });
  }

  searchListTerm(idx) {
    this.searchTerm = this.items[idx].name;
    this.getSearchData(idx);
  }

  runSearch() {
    this.getSearchData(-1);
  }

  getSearchData(idx) {
    var dtNow = moment(new Date());
    var dtExpiration = moment(this.RestService.AuthData.expiration);
    var self = this;

    if (dtNow < dtExpiration) {
      this.presentLoadingDefault();
      this.getSearchDataDo(idx);
    } else {
      this.presentLoadingDefault();
      this.RestService.refreshCredentials(function(err, results) {
        if (err) {
          console.log('Need to login again!!! - Credentials expired from listOrder.getSearchData');
          self.loading.dismiss();
          self.RestService.appRestart();
        } else {
          console.log('From listOrder.getSearchData - Credentials refreshed!');
          this.getSearchDataDo(idx);
        }
      });
    }
  }

  getSearchDataDo(idx) {
    var term;
    var recordid = -1;
    var iscategory;
    var restURL: string;

    idx = idx || -1;
    if (idx !== -1) {
      term = this.items[idx].name.toLowerCase();
      recordid = this.items[idx].recordid;
      iscategory = this.items[idx].iscategory;
    } else if ((this.listFilter.items.filter((item) => {return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) ===0;}).length ==1 &&
      this.listFilter.items.filter((item) => {return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) ===0;})[0].name.toLowerCase() == this.searchTerm.toLowerCase() )) {
        term =  this.listFilter.items.filter((item) => {return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) ===0;})[0].name.toLowerCase();
        recordid = this.listFilter.items.filter((item) => {return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) ===0;})[0].recordid;
        iscategory = this.listFilter.items.filter((item) => {return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) ===0;})[0].iscategory;
    } else {
      term = this.searchTerm.toLowerCase();
    }
    restURL="https://ap6oiuyew6.execute-api.us-east-1.amazonaws.com/dev/OrderAMeal";
    var config = {
      invokeUrl: restURL,
      accessKey: this.RestService.AuthData.accessKeyId,
      secretKey: this.RestService.AuthData.secretKey,
      sessionToken: this.RestService.AuthData.sessionToken,
      region:'us-east-1'
    };
    var apigClient = this.RestService.AWSRestFactory.newClient(config);
    var params = {
      //email: accountInfo.getEmail()
    };
    var pathTemplate = '';
    var method = 'GET';
    var additionalParams;
    if (recordid !== -1) {
      additionalParams = {
        queryParams: {
            profileid: this.RestService.currentProfile,
            term: term,
            recordid: recordid,
            iscategory: iscategory
        }
      };
    } else {
      additionalParams = {
        queryParams: {
            profileid: this.RestService.currentProfile,
            term: term
        }
      };
    }
    var body = '';
    var self = this;

    apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(function(result){
      if (result.data == 'No data found') {
        alert('Your search yielded no results.');
        self.searchTerm = '';
        self.loading.dismiss();
      } else {
        self.RestService.results = result.data;
        console.log('Data', result.data);
        self.list2Service
        .getData()
        .then(data => {
          self.list2.items = self.RestService.results;
          self.getFilterPane();
          self.loading.dismiss();
        });
      }
    }).catch( function(result){
        console.log(body);
        self.loading.dismiss();
      });
  }

  getFilterPane() {
    if(this.show){
      this.show = false;
      this.searchTerm = '';
    } else {
      this.show = true;
    }
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: `
      <div class="custom-spinner-container">
        <div class="custom-spinner-box">
           <img src="assets/images/stickManCursor3.gif" width="50" height="50" />
           Loading...
        </div>
      </div>`,
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
      //console.log('Timeout for spinner called ' + this.formName);
    }, 15000);
  }

}
