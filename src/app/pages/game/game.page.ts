import { Component, OnInit } from '@angular/core';
import { People } from 'models/Database';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public person: People;
  constructor(private supabaseService: SupabaseService) { }

  ngOnInit() {
    this.getRandomPerson();
  }

  async getRandomPerson() {
    const { data, error } = await this.supabaseService.getRandomPerson();
    if (error) console.error('getRandomPerson ERROR', error);
    else {
      if (data.length) {
        this.person = data[0];
      } else {
        console.error('error getting person - array is empty');
      }
    }
  }

}
