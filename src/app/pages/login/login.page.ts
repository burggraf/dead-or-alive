import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { User } from '@supabase/supabase-js';
import { Provider } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email = '';
  public password = '';
  public emailExists = false;
  public user: User = null;
  public locale: string = null;
  constructor(
              private supabaseService: SupabaseService,
              private loadingController: LoadingController,
              private router: Router,
              private toastController: ToastController
              ) {   
  }

  async ngOnInit() {
    this.supabaseService.user.subscribe((user: User) => {
      this.user = user;
    });  
  }

  async signUpWithEmail() {
    const { user, session, error } = await this.supabaseService.signUpWithEmail(this.email, this.password);
    if (error) {
      this.presentToast(error.message, 3000, 'danger');
    }
  }

  async signInWithEmail() {
    const { user, session, error } = await this.supabaseService.signInWithEmail(this.email, this.password);
    if (error) {
      this.presentToast(error.message, 3000, 'danger');
    }
  }

  async signInWithMagicLink() {
    const { user, session, error } = await this.supabaseService.sendMagicLink(this.email);
    if (!error) {
      this.presentToast('Check your email for a magic link to log in.', 3000);
    } else {
      this.presentToast(error.message, 3000, 'danger');
    }
  }

  async signInWithProvider(provider: Provider) {
    const { user, session, error } = await this.supabaseService.signInWithProvider(provider);
    if (error) {
      this.presentToast(error.message, 3000, 'danger');
    }
  }


  async resetPassword() {
    const { data, error } = await this.supabaseService.resetPassword(this.email);
    if (!error) {
      this.presentToast('Check your email for a password reset link.', 3000);
    } else {
      this.presentToast(error.message, 3000, 'danger');
    }
  }

  async signOut() {
    const { error } = await this.supabaseService.signOut();
    if (error) {
      this.presentToast(error.message, 3000, 'danger');
    }
  }

  // *** utility funcitons
  public validateEmail() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.email).toLowerCase());
  }   

  public async presentToast(message, duration = 2000, color = 'primary') {
    const toast = await this.toastController.create({
      message: '<b>' + message + '</b>',
      duration: duration,
      color: color
    });
    toast.present();
  }


}
