import { Component, OnInit } from '@angular/core';
import { People } from 'models/Database';
import { SupabaseService } from 'src/app/services/supabase.service';
// import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public person: People;
  public photoURL: string = '';
  public result: string = '';
  public toggles: any = {
    category: false,
    famous_as: false,
    birthdate: false,
    birthplace: false,
    notes: false
  };
  public showCredits = false;
  constructor(private supabaseService: SupabaseService, public httpClient: HttpClient) { }

  ngOnInit() {
    this.getRandomPerson();
  }

  async getRandomPerson() {
    const { data, error } = await this.supabaseService.getRandomPerson();
    if (error) console.error('getRandomPerson ERROR', error);
    else {
      if (data.length) {
        this.person = data[0];
        console.log(this.person?.photo_info);
        if (this.person?.photo_info?.source) {
          this.photoURL = this.person.photo_info.source;
        }
      } else {
        console.error('error getting person - array is empty');
      }
    }
  }

  answer(choice: boolean) {
    console.log('choice', choice);
    const isDead = this.person.died?.length > 0;
    if (choice === isDead) {
      this.result = 'Correct';
    } else {
      this.result = 'Incorrect';
    } 
    this.toggles = {
      category: true,
      famous_as: true,
      birthdate: true,
      birthplace: true,
      notes: true
    };
  }
  nextPerson() {
    this.result = '';
    this.photoURL = '';
    this.toggles = {
      category: false,
      famous_as: false,
      birthdate: false,
      birthplace: false,
      notes: false
    };
    this.getRandomPerson();
  }

}
