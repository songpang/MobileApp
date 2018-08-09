import { Component } from '@angular/core';
import { NavController, SegmentButton, NavParams, AlertController, Form } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { RestService } from '../../app/services/restService.service';
import { ListVaccinesModel, ListVaccines, ListVaccineSchedule } from '../../pages/listVaccines/listVaccines.model';
import { ListVaccinesPage } from '../listVaccines/listVaccines';
import { HistoryModel, HistoryItemModel } from '../../pages/history/history.model';

@Component({
  selector: 'formVaccines-page',
  templateUrl: 'formVaccines.html'
})
export class FormVaccinesPage {
  section: string;
  recId: number;
  card_form: FormGroup;
  vaccine_array: FormArray;
  vaccine_schedule: FormGroup;
  curRec: any;
  saving: boolean = false;

  vaccineModelSave: ListVaccinesModel  = new ListVaccinesModel();
  vaccineSave: ListVaccines = new ListVaccines();
  vaccineSched: ListVaccineSchedule = new ListVaccineSchedule();
  category: HistoryItemModel = new HistoryItemModel();
  
  categories_checkbox_open: boolean;
  categories_checkbox_result;

  constructor(public nav: NavController, public alertCtrl: AlertController, public RestService:RestService, 
    public navParams: NavParams) {
    this.recId = navParams.get('recId');
   // this.section = "event";

    this.curRec = RestService.results[this.recId]; 
    //alert('CurRec: ' + this.curRec.recordid); 

    if (this.curRec.schedules.length > 0) {
      this.vaccine_array = new FormArray([]);
      for (var i = 0; i < this.curRec.schedules.length; i++) {
        var dtSched;      
        if (this.curRec.schedules[i].startdate == 'Invalid date') {
          dtSched = '';
        } else {
          dtSched = new Date(this.curRec.schedules[i].startdate).toISOString();
        }
          
        this.vaccine_schedule = new FormGroup({
          //interval: this.curRec.schedules[i].startdate,
          recordid: new FormControl(this.curRec.schedules[i].recordid),
          interval: new FormControl(this.curRec.schedules[i].interval),
          agerangelow: new FormControl(this.curRec.schedules[i].agerangelow),
          agerangehigh: new FormControl(this.curRec.schedules[i].agerangehigh),
          agerangeunit: new FormControl(this.curRec.schedules[i].agerangeunit),
          notes: new FormControl(this.curRec.schedules[i].notes),
          
          exp_date: new FormControl(dtSched, Validators.required),
          physician: new FormControl(this.curRec.schedules[i].physician, Validators.required)
        });
        this.vaccine_array.push(this.vaccine_schedule);
      } 
      this.card_form = new FormGroup({
        recordid: new FormControl(this.curRec.recordid),
        vaccine_name: new FormControl(this.curRec.name),
        confirmed: new FormControl(this.curRec.confirmed),
        schedules: this.vaccine_array
      });

    } else {
      //alert(this.curRec.startdate);
      //alert(this.curRec.startdate);
      var dt;      
      if (this.curRec.startdate == 'Invalid date') {
        dt = '';
      } else {
        dt = new Date(this.curRec.startdate).toISOString();
      }
      this.card_form = new FormGroup({
        //exp_date: new FormControl(this.curRec.startdate, Validators.required),
        recordid: new FormControl(this.curRec.recordid),
        vaccine_name: new FormControl(this.curRec.name),
        confirmed: new FormControl(this.curRec.confirmed),
        exp_date: new FormControl(dt, Validators.required),
        physician: new FormControl(this.curRec.physician, Validators.required)
      });  
      //alert("VaccineId: " + this.card_form.get('recordid').value);
    }
  }

  confirmRecord(){
    this.saving = true;
    this.vaccineSave.schedules = [];
    this.vaccineSave.recordid = this.card_form.get('recordid').value;
    this.vaccineSave.confirmed = 'Y';

    if (this.card_form.get('schedules') !== null) {
      var vaccineSaveArray = this.card_form.get('schedules') as FormArray;
      var isChanged = false;
      for (var i = 0; i < vaccineSaveArray.length ; i++) {
        console.log('VaccineSaveArray: ', vaccineSaveArray);
        this.vaccineSched = new ListVaccineSchedule;
        isChanged = false;
        if (vaccineSaveArray.controls[i].get('exp_date').dirty) {
          isChanged = true;
          this.vaccineSched.startdate = vaccineSaveArray.controls[i].get('exp_date').value;
          console.log('Start Date: ' + this.vaccineSched.startdate);
        }
        if (vaccineSaveArray.controls[i].get('physician').dirty) {
          isChanged = true;
          this.vaccineSched.physician = vaccineSaveArray.controls[i].get('physician').value;
        }
        if (isChanged) {
          this.vaccineSched.recordid = vaccineSaveArray.controls[i].get('recordid').value;
          //console.log('Record id: ' + this.vaccineSched.recordid);
          this.vaccineSave.schedules.push(this.vaccineSched);
        }
      }  
    } else {
      if (this.card_form.get('exp_date').dirty) {
        this.vaccineSave.startdate = this.card_form.get('exp_date').value;
      }
      if (this.card_form.get('physician').dirty) {
        this.vaccineSave.physician = this.card_form.get('physician').value;
      }  
    }

    var restURL="https://ap6oiuyew6.execute-api.us-east-1.amazonaws.com/dev/VaccinesByProfile";
    
    var config = {
      invokeUrl: restURL,
      accessKey: this.RestService.AuthData.accessKeyId,
      secretKey: this.RestService.AuthData.secretKey,
      sessionToken: this.RestService.AuthData.sessionToken,
      region:'us-east-1'
    };

    var apigClient = this.RestService.AWSRestFactory.newClient(config);
    var params = {        
      //pathParameters: this.vaccineSave
    };
    var pathTemplate = '';
    var method = 'POST';
    var additionalParams = {
        queryParams: {
            profileid: this.RestService.currentProfile
        }
    };
    var body = JSON.stringify(this.vaccineSave);
    var self = this;

    console.log('Calling Post', this.vaccineSave);    
    apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(function(result){
      self.RestService.results = result.data;
      console.log('Happy Path: ' + self.RestService.results);
      self.category.title = "Vaccines";
      //self.nav.push(ListVaccinesPage, { category: self.category });      
      self.nav.pop();      
    }).catch( function(result){
      console.log('Result: ',result);
      console.log(body);
    });
  }

  deleteRecord(){
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you certain you want to delete this record?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this.saving = true;
            //alert('Going to delete');
            this.vaccineSave.schedules = [];
            this.vaccineSave.recordid = this.card_form.get('recordid').value;
            this.vaccineSave.active = 'N';
            var restURL="https://ap6oiuyew6.execute-api.us-east-1.amazonaws.com/dev/VaccinesByProfile";
    
            var config = {
              invokeUrl: restURL,
              accessKey: this.RestService.AuthData.accessKeyId,
              secretKey: this.RestService.AuthData.secretKey,
              sessionToken: this.RestService.AuthData.sessionToken,
              region:'us-east-1'
            };
        
            var apigClient = this.RestService.AWSRestFactory.newClient(config);
            var params = {        
              //pathParameters: this.vaccineSave
            };
            var pathTemplate = '';
            var method = 'POST';
            var additionalParams = {
                queryParams: {
                    profileid: this.RestService.currentProfile
                }
            };
            var body = JSON.stringify(this.vaccineSave);
            var self = this;
        
            console.log('Calling Post', this.vaccineSave);    
            apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
            .then(function(result){
              self.RestService.results = result.data;
              console.log('Happy Path: ' + self.RestService.results);
              self.category.title = "Vaccines";
              //self.nav.push(ListVaccinesPage, { category: self.category });      
              self.nav.pop();      
            }).catch( function(result){
              console.log('Result: ',result);
              console.log(body);
            });        
          }
        }
      ]
    });
    alert.present();
  }

  saveRecord(){
    this.saving = true;
    //alert('Save Button Selected');
    this.vaccineSave.schedules = [];
    this.vaccineSave.recordid = this.card_form.get('recordid').value;
    if (!this.card_form.valid) {
      this.vaccineSave.confirmed = 'N';     
    }

    if (this.card_form.get('schedules') !== null) {
      var vaccineSaveArray = this.card_form.get('schedules') as FormArray;
      var isChanged = false;
      for (var i = 0; i < vaccineSaveArray.length ; i++) {
        console.log('VaccineSaveArray: ', vaccineSaveArray);
        this.vaccineSched = new ListVaccineSchedule;
        isChanged = false;
        if (vaccineSaveArray.controls[i].get('exp_date').dirty) {
          isChanged = true;
          this.vaccineSched.startdate = vaccineSaveArray.controls[i].get('exp_date').value;
          console.log('Start Date: ' + this.vaccineSched.startdate);
        }
        if (vaccineSaveArray.controls[i].get('physician').dirty) {
          isChanged = true;
          this.vaccineSched.physician = vaccineSaveArray.controls[i].get('physician').value;
        }
        if (isChanged) {
          this.vaccineSched.recordid = vaccineSaveArray.controls[i].get('recordid').value;
          //console.log('Record id: ' + this.vaccineSched.recordid);
          this.vaccineSave.schedules.push(this.vaccineSched);
        }
      }  
    } else {
      if (this.card_form.get('exp_date').dirty) {
        this.vaccineSave.startdate = this.card_form.get('exp_date').value;
      }
      if (this.card_form.get('physician').dirty) {
        this.vaccineSave.physician = this.card_form.get('physician').value;
      }  
    }

    var restURL="https://ap6oiuyew6.execute-api.us-east-1.amazonaws.com/dev/VaccinesByProfile";
    
    var config = {
      invokeUrl: restURL,
      accessKey: this.RestService.AuthData.accessKeyId,
      secretKey: this.RestService.AuthData.secretKey,
      sessionToken: this.RestService.AuthData.sessionToken,
      region:'us-east-1'
    };

    var apigClient = this.RestService.AWSRestFactory.newClient(config);
    var params = {        
      //pathParameters: this.vaccineSave
    };
    var pathTemplate = '';
    var method = 'POST';
    var additionalParams = {
        queryParams: {
            profileid: this.RestService.currentProfile
        }
    };
    var body = JSON.stringify(this.vaccineSave);
    var self = this;

    console.log('Calling Post', this.vaccineSave);    
    apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(function(result){
      self.RestService.results = result.data;
      console.log('Happy Path: ' + self.RestService.results);
      self.category.title = "Vaccines";
      //self.nav.push(ListVaccinesPage, { category: self.category });      
      self.nav.pop();      
    }).catch( function(result){
      console.log('Result: ',result);
      console.log(body);
    });
  }

  public today() {
    return new Date().toISOString().substring(0,10);
  }

  async ionViewCanLeave() {
    if (!this.saving && this.card_form.dirty) {
      const shouldLeave = await this.confirmLeave();
      return shouldLeave;
    }
  }
  
  confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    const alert = this.alertCtrl.create({
      title: 'Exit without Saving',
      message: 'Do you want to exit without saving?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => resolveLeaving(false)
        },
        {
          text: 'Yes',
          handler: () => resolveLeaving(true)
        }
      ]
    });
    alert.present();
    return canLeave
  }  

}
