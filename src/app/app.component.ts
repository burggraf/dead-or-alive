import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';

import { SupabaseService } from './services/supabase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public user: User = null;
  public score: any = null;

  public appPages = [
    // { title: 'Game', url: '/game', icon: 'mail' },
  ];

  constructor(private supabaseService: SupabaseService, 
              private router: Router, 
              private changeDetectorRef: ChangeDetectorRef,
              private alertController:AlertController) {
    // console.log('window.location.search', window.location.search);
    if (window.location.search) {
      // get provider token from window.location.search
      const query = new URLSearchParams(window.location.search);
      const provider = query.get('provider');
      if (provider) {
        console.log('provider', provider);
      }
    }
    
    this.supabaseService.user.subscribe((user: User) => {
      this.user = user;
      this.supabaseService.logDeviceInfo(user?.id || '');
    });

    this.supabaseService.score.subscribe((score: any) => {
      if (score) {
        this.score = score;
        this.changeDetectorRef.detectChanges();
      }
    });

    // handle password recovery links
    const hash = window.location.hash;
    if (hash && hash.substr(0,1) === '#') {
      const tokens = hash.substr(1).split('&');
      const entryPayload: any = {};
      tokens.map((token) => {
        const pair = (token + '=').split('=');
        entryPayload[pair[0]] = pair[1];
      });
      if (entryPayload?.type === 'recovery') { // password recovery link
        router.navigateByUrl(`/resetpassword/${entryPayload.access_token}`);
      }
    }

  }

  async signOut() {
    const { error } = await this.supabaseService.signOut();
    if (error) {
      console.log('signOut error', error);
    } else {
      this.score = null;
      this.router.navigateByUrl('/login');
    }
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      cssClass: 'deleteAccount',
      header: 'Delete Account',
      message: '<b>Are you sure you wish to delete your account and all your data?  There is no way to recover your data.</b>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          // cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'DELETE',
          handler: async () => {
            const { data, error } = await this.supabaseService.delete_my_account_and_data();
            if (error) {
              console.error('delete_my_account_and_data error', error);
            } else {
              const result: string = data.toString();
              if (result === 'success') {
                await this.signOut();
                this.score = null;
                this.router.navigateByUrl('/login');
              }
            }
          }
        }
      ]
    });

    await alert.present();

  }



}
