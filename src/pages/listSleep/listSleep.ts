import { Component, Self } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FeedModel } from '../feed/feed.model';

import 'rxjs/Rx';

import { ListSleepModel } from './listSleep.model';
import { ListSleepService } from './listSleep.service';
import { RestService } from '../../app/services/restService.service';
import { FormSleepPage } from '../../pages/formSleep/formSleep';

var moment = require('moment-timezone');

@Component({
  selector: 'listExercisePage',
  templateUrl: 'listSleep.html'
})
export class ListSleepPage {
  list2: ListSleepModel = new ListSleepModel();
  feed: FeedModel = new FeedModel();
  loading: any;
  resultData: any;
  userTimezone: any;

  constructor(
    public nav: NavController,
    public list2Service: ListSleepService,
    public navParams: NavParams,
    public RestService:RestService,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
    this.feed.category = navParams.get('category');

    var self = this;
    this.RestService.curProfileObj(function (error, results) {
      if (!error) {
        self.userTimezone = results.timezone;
      }
    });

  }

  ionViewWillEnter() {
    this.loading.present();
    this.loadData();

  }

  ionViewDidLoad() {
    this.loading.present();
    this.loadData();
    /*
    this.list2Service
      .getData()
      .then(data => {
        this.list2.items = this.RestService.results;
        alert('Allergy Response: ' + this.RestService.results);   
        alert('Transfer to List Items: ' +  this.list2.items);   
       
        this.loading.dismiss();
      });
      */
  }

  loadData() {
    //alert('Feed Category: ' + this.feed.category.title);
    //alert('Current Profile ID: ' + this.RestService.currentProfile);
    var restURL: string;

    restURL="https://ap6oiuyew6.execute-api.us-east-1.amazonaws.com/dev/SleepByProfile";
    
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
      self.RestService.results = result.data;
      self.list2Service
      .getData()
      .then(data => {
        self.list2.items = self.RestService.results;
        //alert('Allergy Response: ' + this.RestService.results);   
        //alert('Transfer to List Items: ' +  this.list2.items);   
       console.log("Results Data for Get Goals: ", self.list2.items);
        self.loading.dismiss();
      });
      
      //alert('Async Check from Invoke: ' + self.RestService.results);   
      
    }).catch( function(result){
        console.log(body);
        self.loading.dismiss();
    });

  }

  openRecord(recordId) {
    console.log("Goto Form index: " + recordId);
    //console.log("Recordid from index: " + this.list2[recordId].recordid);
    this.nav.push(FormSleepPage, { recId: recordId });
    //alert('Open Record:' + recordId);
  }  

  addNew() {
    this.nav.push(FormSleepPage);
  }  
  
  formatDateTime(dateString) {
    //alert('FormatDateTime called');
    if (this.userTimezone !== undefined && this.userTimezone !=="") {
      return moment(dateString).tz(this.userTimezone).format('dddd, MMMM DD');
    } else {
      return moment(dateString).format('dddd, MMMM DD');
    }
  }

  formatTime(timeString) {
    //alert('FormatDateTime called');
    var timeSplit = timeString.split(":");
    var hour = timeSplit[0];
    var minute = timeSplit[1];

    if (Number(hour) > 11) {
      if (Number(hour) == 12 ) {
        return hour + ":" + minute + " PM";
      } else {
        return (Number(hour) - 12) + ":" + minute + " PM";
      }
    } else {
      if (Number(hour) == 0) {
        return "12:" + minute + " AM";
      } else {
        return hour + ":" + minute + " AM";
      }
    }
  }
}