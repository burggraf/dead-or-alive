import { Component } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public user: User = null;
  public score: any = null;

  public appPages = [
    { title: 'Game', url: '/game', icon: 'mail' },
  ];

  constructor(private supabaseService: SupabaseService, private router: Router) {
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
      this.score = score;
    });

    // handle password recovery links
    const hash = window.location.hash;
    console.log('#hash', hash);
    if (hash && hash.substr(0,1) === '#') {
      console.log('processing hash');
      const tokens = hash.substr(1).split('&');
      console.log('tokens', tokens);
      const entryPayload: any = {};
      tokens.map((token) => {
        const pair = (token + '=').split('=');
        entryPayload[pair[0]] = pair[1];
      });
      console.log('entryPayload', entryPayload);
      console.log('entryPayload.type', entryPayload?.type);
      if (entryPayload?.type === 'recovery') { // password recovery link
        router.navigateByUrl(`/resetpassword/${entryPayload.access_token}`);
      }
    }

  }

  async signOut() {
    const { error } = await this.supabaseService.signOut();
    console.log('signOut', error);
  }



}
