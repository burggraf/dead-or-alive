import { Injectable } from '@angular/core';
import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { keys } from 'src/environments/supabase';
import { Device } from '@capacitor/device';
import { People } from 'models/Database';

const supabase: SupabaseClient = createClient(keys.SUPABASE_URL, keys.SUPABASE_KEY);

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public user = new BehaviorSubject<User>(null);
  private _user: User = null;

  constructor() {
    // Try to recover our user session
    this.loadUser();
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        this._user = session.user;
        this.user.next(session.user);
      } else {
        this._user = null;
        this.user.next(null);
      }
    });
  }

  // ************** auth ****************

  private async loadUser() {
    const user = supabase.auth.user();
    if (user) {
      this._user = user;
      this.user.next(user);
    } else {

    }

  };

  public signUpWithEmail = async (email: string, password: string) => {
    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    return { user, session, error };
  }

  public signInWithEmail = async (email: string, password: string) => {
    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    return { user, session, error };
  }

  public signInWithProvider = async (provider: Provider) => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: provider
    }, {
      redirectTo: window.location.origin
    });
    return { user, session, error };
  }

  public resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email,
      {
        redirectTo: window.location.origin
      });
    return { data, error };
  }

  public sendMagicLink = async (email: string) => {
    const { user, session, error } = await supabase.auth.signIn({
      email: email
    }, {
      redirectTo: window.location.origin
    });
    return { user, session, error };
  }

  public updatePassword = async (access_token: string, new_password: string) => {
    const { error, data } = await supabase.auth.api
      .updateUser(access_token, { password: new_password });
    return { error, data };
  }

  public signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      this.user.next(null);
    }
    return { error };
  }

  // ************** data ****************

  public getProfile = async (id: string = this._user?.id) => {
    const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('id', id);
    return { Profile: data, error };
  }



  // ************** logDeviceInfo ****************

  public logDeviceInfo = async (userid: string) => {
    const { uuid } = await Device.getId();
    const info = await Device.getInfo();
    const { data: rpcdata, error: rpcerror } = await supabase.rpc('log_device',
      {
        userid: userid || null,
        deviceid: uuid,
        isvirtual: info.isVirtual,
        manufacturer: info.manufacturer,
        model: info.model,
        operatingsystem: info.operatingSystem,
        osversion: info.osVersion,
        platform: info.platform,
        webviewversion: info.webViewVersion,
        useragent: navigator?.userAgent || ''
      }
    );
    if (rpcerror) {
      console.error('logDeviceInfo errror', rpcerror);
    }
  };


}
