import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { PruliaMemberProvider } from "../../providers/prulia-member/prulia-member";
import { PruliaEventProvider } from "../../providers/prulia-event/prulia-event";
import { Events } from 'ionic-angular/util/events';


/**
 * Generated class for the EventPrefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-pref',
  templateUrl: 'event-pref.html',
})
export class EventPrefPage {
	member: any = {
    shirt_size: "",
    meal_option: "",
    name:"",
    accomodation: ""
  };
  acknowledgement: boolean = false;
  mode: any = "New"
  	constructor(public navCtrl: NavController, public navParams: NavParams, public memberProvider: PruliaMemberProvider, public eventProvider: PruliaEventProvider,
  		public alertCtrl: AlertController, public toastCtrl: ToastController, private events:Events, public viewCtrl: ViewController) {
		  this.member = Object.assign({}, navParams.get('value'));
      this.mode = navParams.get('mode');

      if(this.member.accomodation == undefined){
        this.member.accomodation = "";
      }

      if(this.member.shirt_size == undefined){
        this.member.shirt_size = "";
      }
  }
  saveEventPref(){
  	console.log(this.member);
  	let that = this;
  	this.events.publish('loading:start', 'Saving...');
    switch(this.mode){
        case "Profile":
          this.memberProvider.post_member_profile(this.member, function(data){
            let toast = that._createToast('Perferences was update successfully');
            that.memberProvider.get_member_profile(true)
              .then(data => {
                that.events.publish('loading:end');
                that.dismiss();
                toast.present();
              },(error => {
                that._displayError(error);
              })
            )
          }, function(error){
            that._displayError(error);
          })
          break;
        case "Update":
          this.eventProvider.update_event_registration(this.member, function(data){
            
            let toast = that._createToast('Registration was update successfully');
            that.events.publish('event:update', function(){
              that.events.publish('loading:end');
              that.dismiss();
              toast.present();
            });
            
          }, function(error){
            that._displayError(error);
          })
          break;
        case "New": 
          if(this.acknowledgement){ 
            this.eventProvider.create_event_registration({
              "member": that.memberProvider.member.name,
              "member_name": that.memberProvider.member.full_name,
              "event": this.member.name,
              "meal": this.member.meal_option,
              "shirt": this.member.shirt_size,
              "accomodation" : this.member.accomodation
            }, function(data){
              
              let toast = that._createToast('Registration was update successfully');
              that.events.publish('event:update', function(){
                that.events.publish('loading:end');
                that.dismiss();
                toast.present();
              });
            }, function(error){
              that._displayError(error);
            })
          } else {
            that._displayAckError();
          }
          break;
    }
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPrefPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  _displayAckError(){
    console.log("No acknowledgement");
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Please kindly acknowledge the declaration by clicking the checkbox in the form',
      buttons: ['Dismiss']
    });
    this.events.publish('loading:end');
    alert.present();
  }

  _displayError(error){
    console.log(error);
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Error in update',
      buttons: ['Dismiss']
    });
    this.events.publish('loading:end');
    alert.present();
  }

  _createToast(message){
    return this.toastCtrl.create({
              message: message,
              duration: 10000,
              showCloseButton: true,
              closeButtonText: 'OK',
              position: 'bottom'
            });
  }

}
