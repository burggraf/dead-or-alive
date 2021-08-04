import { Component, OnInit } from '@angular/core';
import { People } from 'models/Database';
import { SupabaseService } from 'src/app/services/supabase.service';
// import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public person: People;
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
        console.log(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(this.person.name)}&prop=pageimages&format=json&pithumbsize=300`);
        const subscription = this.httpClient.get(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(this.person.name)}&prop=pageimages&format=json&pithumbsize=300`)
          .subscribe((data) => {
            console.log('data', data);
          });
        // https://en.wikipedia.org/w/api.php?action=query&titles=Justin+Long&prop=pageimages&format=json&pithumbsize=300
      } else {
        console.error('error getting person - array is empty');
      }
    }
  }

}
