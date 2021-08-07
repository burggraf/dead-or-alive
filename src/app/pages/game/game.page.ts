import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { User } from 'rxjs/Observable';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '@supabase/supabase-js';
import { GameData, People } from 'models/Database';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public user: User = null;
  public person: People;
  public photoURL: string = '';
  public result: string = '';
  public majorStreak: number = 0;
  public minorStreak: number = 0;
  public toggles: any = {
    category: false,
    famous_as: false,
    birthdate: false,
    birthplace: false,
    notes: false,
    photo: false
  };
  public value = 15;
  public showCredits = false;
  constructor(private supabaseService: SupabaseService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.supabaseService.user.subscribe(async (user: User) => {
      this.user = user;
      if (user) {
        this.getScore();
        this.getRandomPerson();
      }
    });
  }
  detect() {
    this.changeDetectorRef.detectChanges();
    this.calculateValue();
  }
  async getScore() {
    const { data, error } = await this.supabaseService.getScore();
    if (error) console.error('getScore ERROR', error);
  }

  async getRandomPerson() {
    const { data, error } = await this.supabaseService.getRandomPerson();
    if (error) console.error('getRandomPerson ERROR', error);
    else {
      if (data) {
        this.person = data as People;
        if (this.person?.photo_info?.source) {
          this.photoURL = this.person.photo_info.source;
        } else {
          this.photoURL = '/assets/no-image.svg';
        }
        this.value = 15;
        this.changeDetectorRef.detectChanges();
      } else {
        console.error('error getting person - result is empty');
      }
    }
  }

  calculateValue() {
    this.value = 15
    - (this.toggles.category ? 1 : 0)
    - (this.toggles.birthplace ? 1 : 0)
    - (this.toggles.famous_as ? 2 : 0)
    - (this.toggles.birthdate ? 3 : 0)
    - (this.toggles.notes ? 4 : 0)
    - (this.toggles.photo ? 2 : 0); 
    return this.value;
  }
  async answer(choice: boolean) {
    const isDead = this.person.died?.length > 0;
    if (choice === isDead) {
      this.result = 'Correct';
    } else {
      this.result = 'Incorrect';
    } 
    const gameData: GameData = {
      person_id: this.person.id,
      user_id: this.user?.id,
      help_category: this.toggles.category ? -1 : 0,
      help_birthplace: this.toggles.birthplace ? -1 : 0,
      help_famous_as: this.toggles.famous_as ? -2 : 0,
      help_birthdate: this.toggles.birthdate ? -3 : 0,
      help_notes: this.toggles.notes ? -4 : 0,
      help_photo: this.toggles.photo ? -2 : 0,
      score: 0
    }
    if (this.result === 'Correct') {
      gameData.score = this.calculateValue(); /*15
        - (this.toggles.category ? 1 : 0)
        - (this.toggles.birthplace ? 1 : 0)
        - (this.toggles.famous_as ? 2 : 0)
        - (this.toggles.birthdate ? 3 : 0)
        - (this.toggles.notes ? 4 : 0)
        - (this.toggles.photo ? 2 : 0);*/
    }
    this.value = gameData.score;
    this.supabaseService.updateLocalScore(gameData);
    this.toggles = {
      category: true,
      famous_as: true,
      birthdate: true,
      birthplace: true,
      notes: true,
      photo: true
    };
    this.changeDetectorRef.detectChanges();
    if (this.user) {
      const { data, error } = await this.supabaseService.saveGameData(gameData);
      if (error) console.error('saveGameData ERROR', error);
    } else {
      console.log('user is null, cannot save score');
    }
  }
  nextPerson() {
    this.result = '';
    this.photoURL = '';
    this.toggles = {
      category: false,
      famous_as: false,
      birthdate: false,
      birthplace: false,
      notes: false,
      photo: false
    };
    this.getRandomPerson();
  }

}
