import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public getStoryList = environment.apiURL+"api/search/getStoryList";
  public searchStory  = environment.apiURL+"api/search/searchStory"; 
  public allGenres    = environment.apiURL+"api/story/allGenres";
  public storyDetail  = environment.apiURL+"api/story/detailStory?storyId=";
  public subscribapi  = environment.apiURL+"api/users/userSubscribe";
  public topstory     = environment.apiURL+"api/story/getTopFiveStories";
  public relativeStory= environment.apiURL+"api/story/getRelatedStories?storyId=";

  constructor() { }
}
