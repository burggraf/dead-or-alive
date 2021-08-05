import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';

import { SupabaseService } from './services/supabase.service';

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

  constructor(private supabaseService: SupabaseService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
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
      this.router.navigateByUrl('/login');
    }
  }



}
