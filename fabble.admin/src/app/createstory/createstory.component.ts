import { Story } from "./../model/story";
import { Component, OnInit, NgModule } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { first } from "rxjs/operators";
import { AuthenticationServiceService } from "../authentication-service.service";
import { debugOutputAstAsTypeScript } from "@angular/compiler";

@Component({
  selector: "app-createstory",
  templateUrl: "./createstory.component.html",
  styleUrls: ["./createstory.component.css"]
})
export class CreatestoryComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  submitted = false;
  model: any = {};
  public story: Story = new Story();
  name: string;
  image: string;
  sponsor: string;
  transcriptText: string;
  description: string;
  themeColor:string;
  overview: string;
  ratings: string;
  tag: string;
  public tags: Array<any> = [];
  public videoObject: any = { url: "", videoDuration: "", trascript: File, index: 0 };
  videoUrls: Array<any> = new Array<any>();
  audio: any;
  videoURL: string;
  genresList: any = [];
  public imageFile: File;
  selectedgenres: Object = {};
  selectedGenresId: string = "";
  selectedLength: string = "";
  selectedRating: string | Blob = "";
  //imageFiles: Array<File> = [];
  imageFiles = [];
  audioFiles: File;
  videoFiles: Array<File> = [];
  storyId: any;
  // story: any;
  subtitleFile: any;
  aplhaNumericPattern = "[a-zA-Z0-9 ]*";
  aplhaPattern = "[a-zA-Z ]*";
  numericPattern = "[0-9 ]*";
  timePattren = "(([0][0-9]|[1][0-2])|[0-9]):([0-5][0-9])( *)((AM|PM)|(am|pm))$";
  websitePattern = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";
  //"((http|https|ftp):\/\/(www\.)?|www\.)[a-zA-Z0-9\_\-]+\.([a-zA-Z]{2,4}|[a-zA-Z]{2}\.[a-zA-Z]{2})(\/[a-zA-Z0-9\-\._\?\&=,'\+%\$#~]*)*$";
  latitudePattern = "[0-9.-]*";
  decimalPattern = "[0-9.-]*";
  //"-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)";
  longitudePattern = "[0-9.-]*";
  images: any = [];
  apiUrl = "http://fable.mobilytedev.com:8098";
  genresNameList: any = [];
  genresIds: any = [];
  imgurl: string | ArrayBuffer;
  imageFileName: any = "";
  audioFileName: any = "";
  transcriptFileName: any = "";
  credit = { name: "", role: "" };
  //{ Name: "", Role: "", OriginalStory: "", Narator: "", Actor: "", Music: "" };
  posterFileName: any = "";
  posterImageFile: File;
  embedFileName: any = "";
  embedImageFile: File;
  sponserFileName: any = "";
  sponserImageFile: File;
  pstrImgUrl: string | ArrayBuffer;
  embedImgurl: string | ArrayBuffer;
  spnsImgUrl: string | ArrayBuffer;
  

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationServiceService, public sanitizer: DomSanitizer,) {}
  ngOnInit() {
    this.getGenersList();
    this.getUrlParams();
  }

  getUrlParams() {
    this.route.params.subscribe(params => {
      this.storyId = params["id"];
      if (this.storyId) {
        this.getStoryDetail();
      }
      console.log("===============", this.storyId);
      // this.getStoryDetail();
    });
  }
  //const trackByIdentity = (index: number, item: any) => item;
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  removeVideoUrl(id, index) {
    //  this.videoUrls.splice(index, 1);
    this.deleteStoryVideo(id, index);
  }
  removeAudio() {
    this.audio = "";
    this.audioFiles = null;
  }
  AddVideoUrl() {
    if (!(this.videoObject && this.videoObject.url)) {
      alert("Please enter url");
      return;
    }

    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!regex.test(this.videoObject.url)) {
      alert("Please enter valid url");
      return;
    }
    if (!(this.videoObject && this.videoObject.videoDuration)) {
      alert("Please Select Video Length");
      return;
    }
    if (this.videoUrls.length > 4) {
      alert("you can not enter more than 5 url");
      return;
    }

    //var formData=new FormData();
    //formData.append("trascript", this.videoObject.trascript);
    //this.videoObject.trascript.index=111;
    // if(this.videoObject.trascript && this.videoObject.trascript.name )
    // {
    this.videoUrls.push({
      url: this.videoObject.url,
      videoDuration: this.videoObject.videoDuration,
      transcriptName: this.videoObject.trascript ? this.videoObject.trascript.name : "",
      trascript: this.videoObject.trascript
    }); //due to object overridding
    // }
    // else
    // {
    //   this.videoUrls.push({ url: this.videoObject.url, videoDuration: this.videoObject.videoDuration,trascript:this.videoObject.trascript }); //due to object overridding
    // }
    this.videoObject = { url: "", videoDuration: "", trascript: "", index: 0 };
    this.transcriptFileName = "";
    // /    this.videoObject.fileUpload.value = null
    //    this.subtitleFile=[];
  }
  removeTag(index) {
    this.tags.splice(index, 1);
  }
  addTags() {
    if (!this.tag) {
      alert("Please enter tag");
      return;
    }
    this.tags.push(this.tag);
  }
  removeImage(url, index) {
    // this.images.splice(index, 1);
    if (this.images && url.indexOf("data:image") == 0) {
      this.images.splice(index, 1);
      let imgFiles = [];
      Array.prototype.push.apply(imgFiles, this.imageFiles);
      imgFiles.splice(index, 1);
      this.imageFiles = imgFiles;
      if (this.images.length == 0) {
        this.imageFileName = "";
      }
      return;
    }
    if (this.storyId && url) {
      this.authenticationService.deleteImageByStoryId(url, this.storyId).subscribe(
        data => {
          console.log(data);
          if (data.status != 0) {
            alert(data.message);
            this.images.splice(index, 1);
            let imgFiles = [];
            Array.prototype.push.apply(imgFiles, this.imageFiles);
            imgFiles.splice(index, 1);
            this.imageFiles = imgFiles;
            if (this.images.length == 0) {
              this.imageFileName = "";
            }
          }
        },
        error => {
          let msg = error;
        }
      );
    }
  }
  addGenres() {
    if (this.genresList.length > 0 && this.selectedGenresId) {
      this.genresIds.push(this.selectedGenresId);
      let genreName = this.genresList.find(x => x._id == this.selectedGenresId).name;
      if (genreName) this.genresNameList.push(genreName);
    }
  }
  removeGenres(index) {
    this.genresIds.splice(index, 1);
    this.genresNameList.splice(index, 1);
    if (this.genresIds.length == 0) {
      this.selectedGenresId = "";
    }
  }
  public imagePath;
  imgURL: any;
  public message: string;
  // preview(files) {
  //   if (files.length === 0) return;

  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }

  //   var reader = new FileReader();
  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]);
  //   reader.onload = _event => {
  //     this.imgURL = reader.result;
  //   };
  // }

  // readUrl(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  //     this.imageFileName = event.target.files[0].name;
  //     reader.onload = (event: ProgressEvent) => {
  //       this.imgurl = (<FileReader>event.target).result;
  //       this.images.push(this.imgurl);
  //     };
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  // }

  convertToImgUrl(file: File, imgName) {
    if (file) {
      var reader = new FileReader();
      // this.imageFileName = file.name;
      reader.onload = (event: ProgressEvent) => {
        switch (imgName) {
          case "poster": {
            this.pstrImgUrl = (<FileReader>event.target).result;
            break;
          }
          case "embed": {
            this.embedImgurl = (<FileReader>event.target).result;
            break;
          }
          case "sponser": {
            this.spnsImgUrl = (<FileReader>event.target).result;
            break;
          }
          //  default: {
          //     console.log("Invalid choice");
          //     break;
          //  }
        }

        //this.images.push(this.imgurl);
      };

      reader.readAsDataURL(file);
    }
  }

  readUrl(file: File) {
    if (file) {
      var reader = new FileReader();
      this.imageFileName = file.name;
      reader.onload = (event: ProgressEvent) => {
        this.imgurl = (<FileReader>event.target).result;
        this.images.push(this.imgurl);
      };

      reader.readAsDataURL(file);
    }
  }
  getStoryDetail() {
    this.authenticationService.getStoryDetailById(this.storyId).subscribe(
      data => {
        //console.log(data);
        if (data) {
          this.story = data;
          this.selectedGenresId = this.story.genres;
          this.selectedRating = this.story.ratings;
          this.tags = data.tags;
          this.videoUrls = data.videos;
          this.images = data.image;
          this.roles = data.credits;
          this.pstrImgUrl = data.posterImage;
          this.embedImgurl = data.playerImage;
          this.spnsImgUrl = data.sponsorImage;
          this.sponserImageFile = data.sponsorImage;
          this.embedImageFile = data.playerImage;
          this.posterImageFile = data.posterImage;
          // this.credit = data.credits ? data.credits : { Name: "", Role: "", OriginalStory: "", Narator: "", Actor: "", Music: "" };
          this.audio = { Name: data.audioName, Length: data.audioLength, Url: data.audio };
          this.audioFiles=data.audio;
          data.genresId.forEach(val => {
            this.genresNameList.push(val.name);
            this.genresIds.push(val._id);
          });
          this.selectedGenresId = "";
          //this.name=this.story.Name;
          console.log("StoryObject", this.story);
        }
      },
      error => {
        let msg = error;
      }
    );
  }
  //myItems: MyItems[] = new Array();
  createStory(form: NgForm) {
    if (!form.valid) return;
    let newData = new FormData();
    newData.append("name", this.story.name);
    newData.append("audio", this.audioFiles?this.audioFiles:"");
    newData.append("sponsor", this.story.sponsor);
    newData.append("transcriptText", this.story.transcriptText);
    newData.append("themeColor", this.story.themeColor);
    newData.append("description", this.story.description);
    newData.append("ratings", this.selectedRating);
    newData.append("overview", this.story.overview);
    //    newData.append("genres", this.selectedGenresId);
    newData.append("genres", JSON.stringify(this.genresIds));

    //newData.append("videoArr[]", JSON.stringify(this.videoUrls));

    //["History","Royal"]

    // newData.append(
    //     'tags',
    //      new Blob( [ JSON.stringify( this.tags ) ], { type : 'application/json' } ) );
    newData.append("tags", JSON.stringify(this.tags));
    // console.log(JSON.parse(JSON.stringify(this.tags)));
    // console.log(JSON.stringify(this.tags));

    // newData.append("video", this.videoFiles);
    // console.log(this.name);
    // console.log(this.audioFiles);
    // console.log(this.sponsor);
    // console.log(this.description);
    // console.log(this.tags);
    //console.log(JSON.stringify( this.videoFiles));

    // for (let i = 0; i < this.videoFiles.length; i++) {
    //   newData.append("video[]", this.videoFiles[i], this.videoFiles[i]["name"]);
    // }

    for (let i = 0; i < this.imageFiles.length; i++) {
      newData.append("image[]", this.imageFiles[i], this.imageFiles[i]["name"]);
    }
    for (let i = 0; i < this.videoUrls.length; i++) {
      newData.append("videoArr[]", this.videoUrls[i], this.videoUrls[i]["name"]);
    }

    console.log(this.selectedGenresId);
    this.submitted = true;

    this.loading = true;

    this.authenticationService
      .createStory(newData)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data) this.router.navigate(["dashboard"]);
          else {
            alert(data);
          }
        },
        error => {
          console.log("error", error);
          this.loading = false;
        }
      );
  }

  addEditStory(form: NgForm) {
    
    if (!form.valid) return;
    if (this.genresIds.length == 0) {
      alert("Please select atleast one genres");
      return;
    }
    if (!this.story.name.trim()) {
      alert("Please enter story name");
      return;
    }
    // if(!this.creditsValidation())
    // {
    //   return;
    // }
    let newData = new FormData();
    if(this.audioFiles)
    {
      let keysare = Object.keys(this.audioFiles);
      if(keysare.length>0){
        console.log("inside",this.story.audioName);
        console.log("inside",this.story.audioLength);
        console.log("inside",this.story.audio);
        let data = {
          Name:this.story.audioName,
          Length:this.story.audioLength,
          Url:this.story.audio
        }
        console.log("data",data);
        newData.append("audio", JSON.stringify(data));
      }
      else{
        newData.append("audio", this.audioFiles);
      }
    }
    newData.append("storyId", this.storyId);
    newData.append("name", this.story.name);
    // this.audio = { Name: data.audioName, Length: data.audioLength, Url: data.audio };
    // this.audioFiles=data.audio;
    // newData.append("audio", this.audioFiles);
    // newData.append("audio", this.audioFiles?this.audioFiles:"");
    newData.append("posterImage", this.posterImageFile ? this.posterImageFile : "");
    newData.append("sponsorImage", this.sponserImageFile ? this.sponserImageFile : "");
    newData.append("playerImage", this.embedImageFile ? this.embedImageFile : "");
    newData.append("sponsor", this.story.sponsor);
    newData.append("transcriptText", this.story.transcriptText);
    newData.append("themeColor",this.story.themeColor);
    newData.append("description", this.story.description);
    newData.append("ratings", this.selectedRating);
    newData.append("overview", this.story.overview);
    newData.append("credits", JSON.stringify(this.roles));
    // /newData.append("genres", this.selectedGenresId);
    newData.append("genres", JSON.stringify(this.genresIds));

    newData.append("tags", JSON.stringify(this.tags));
    for (let i = 0; i < this.imageFiles.length; i++) {
      newData.append("image[]", this.imageFiles[i], this.imageFiles[i]["name"]);
    }

    // for (let i = 0; i < this.videoUrls.length; i++) {
    //   newData.append("videoArr[]",JSON.stringify( this.videoUrls[i]));
    // }
    let videodetails = [];
    for (let i = 0; i < this.videoUrls.length; i++) {
      videodetails.push({ url: this.videoUrls[i].url, transcript: this.videoUrls[i].transcript, videoDuration: this.videoUrls[i].videoDuration, key: i });

      if (this.videoUrls[i].trascript) {
        newData.append("transcript[]", this.videoUrls[i].trascript, this.videoUrls[i].trascript.name + ",," + i);
      }
      // else
      // {
      // newData.append("transcript[]", new Blob( [ JSON.stringify(i ) ], { type : 'application/json' } ));
      // }
    }

    newData.append("videoArr[]", JSON.stringify(videodetails));

    if (this.storyId) this.editStory(newData);
    else this.addStory(newData);
  }
  addStory(storyModel) {
    this.loading = true;
    this.authenticationService
      .createStory(storyModel)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data) this.router.navigate(["dashboard"]);
          else {
            alert(data);
          }
        },
        error => {
          console.log("error", error);
          this.loading = false;
        }
      );
  }
  editStory(request) {
    this.loading = true;
    //request.append("oldImages", JSON.stringify(this.images));
    //  request.append("oldVideoArr", JSON.stringify(this.videoUrls));
    this.authenticationService
      .editStory(request)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data) this.router.navigate(["dashboard"]);
          else {
            alert(data);
          }
        },
        error => {
          console.log("error", error);
          this.loading = false;
        }
      );
  }

  roles = [this.credit];

  creditsValidation()
  {
    let isValid=true;
    this.roles.forEach((val,ind) => {
      if (!val.role )
      {
        alert("Please fill the Credit Role")
        isValid=false;
        return;
      }else if (!val.name)
      {
        alert("Please fill the Credit Name")
        isValid=false;
        return;
      }
    });
    return isValid;
  }
  addCredit(key, val) {
    //    var obj={};
    //    obj[key]=val;
    // let isValid=true;
    // this.roles.forEach(val => {
    //   if (!val.role )
    //   {
    //     alert("Please fill the Credit Role")
    //     isValid=false;
    //     return;
    //   }else if (!val.name)
    //   {
    //     alert("Please fill the Credit Name")
    //     isValid=false;
    //     return;
    //   }
    // });
    if(this.creditsValidation())
    {
    let obj = { name: "", role: "" };
    this.roles.push(obj);
    }
  }
  removeCredit(index) {
    this.roles.splice(index, 1);
  }
  updateStory(form: NgForm) {
    if (!form.valid && this.storyId) return;
    let newData = new FormData();
    newData.append("storyId", this.storyId);
    newData.append("name", this.name);
    newData.append("audio", this.audioFiles);
    newData.append("sponsor", this.sponsor);
    newData.append("transcriptText", this.transcriptText);
    newData.append("themeColor", this.themeColor);
    newData.append("description", this.description);
    newData.append("ratings", this.selectedRating);
    newData.append("overview", this.overview);
    newData.append("tags", JSON.stringify(this.tags));
    newData.append("genres", this.selectedGenresId);

    //["History","Royal"]

    // newData.append(
    //     'tags',
    //      new Blob( [ JSON.stringify( this.tags ) ], { type : 'application/json' } ) );

    // newData.append("video", this.videoFiles);
    //  console.log(this.name);
    //  console.log(this.audioFiles);
    //  console.log(this.sponsor);
    //  console.log(this.description);
    //  console.log(this.tags);
    //console.log(JSON.stringify( this.videoFiles));

    for (let i = 0; i < this.videoFiles.length; i++) {
      newData.append("video[]", this.videoFiles[i], this.videoFiles[i]["name"]);
    }

    for (let i = 0; i < this.imageFiles.length; i++) {
      newData.append("image[]", this.imageFiles[i], this.imageFiles[i]["name"]);
    }
    //newData.append("image", this.imageFiles);

    console.log(this.selectedGenresId);
    this.submitted = true;

    this.loading = true;
    this.authenticationService
      .createStory(newData)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data) this.router.navigate(["dashboard"]);
          else {
            alert(data);
          }
        },
        error => {
          console.log("error", error);
          this.loading = false;
        }
      );
  }

  deleteStoryVideo(id, index) {
    let newData = new FormData();
    newData.append("videoId", id);
    if (id) {
      this.authenticationService.deleteStoryVideo(newData).subscribe(data => {
        if (data.status != 0) {
          this.videoUrls.splice(index, 1);
          console.log(data.message);
          alert(data.message);
        }
        // this.router.navigate(["dashboard"]);
      });
    } else {
      if (this.videoUrls && this.videoUrls.length > 0) this.videoUrls.splice(index, 1);
    }
  }

  // onSelect(selectedgenres) {
  //     this.selectedgenres = null;
  //     for (var i = 0; i < this.genresList.length; i++) {
  //         if (this.getGenersList[i].name == name) {
  //             this.selectedgenres = this.allGenres[i];
  //         }
  //     }
  // }

  public imageEvent($event) {
    let existImageLength=this.images.length + $event.target.files.length;
    if (existImageLength>3 || (this.images.length > 2 || $event.target.files.length >= 4)) {
      alert("Please select maximum three images");
      return;
    }
    this.imageFiles = <Array<File>>$event.target.files;
    for (let index = 0; index < this.imageFiles.length; index++) {
      const element = this.imageFiles[index];
      this.readUrl(element);
    }    
  }
  public audioEvent($event) {
    if ($event.target.files) {
      this.audioFileName = $event.target.files[0].name;
      this.audioFiles = $event.target.files[0];
    }
  }
  public videoEvent($event) {
    this.videoFiles = <Array<File>>$event.target.files;
  }
  public addSubtitle($event) {
    //this.subtitleFile = $event.target.files[0];
    if ($event.target.files) {
      this.transcriptFileName = $event.target.files[0].name;
      this.videoObject.trascript = $event.target.files[0];
    }
    //this.videoObject.trascript.size=0;
  }

  public posterImage($event) {
    if ($event.target.files) {
      this.posterFileName = $event.target.files[0].name;
      this.posterImageFile = $event.target.files[0];
      this.convertToImgUrl(this.posterImageFile, "poster");
    }
  }
  public embedImage($event) {
    if ($event.target.files) {
      this.embedFileName = $event.target.files[0].name;
      this.embedImageFile = $event.target.files[0];
      this.convertToImgUrl($event.target.files[0], "embed");
    }
  }
  public sponserImage($event) {
    if ($event.target.files) {
      this.sponserFileName = $event.target.files[0].name;
      this.sponserImageFile = $event.target.files[0];
      this.convertToImgUrl($event.target.files[0], "sponser");
    }
  }
  removeImg(imgName) {
    switch (imgName) {
      case "poster": {
        this.posterFileName = "";
        this.posterImageFile = null;
        this.pstrImgUrl = "";
        break;
      }
      case "embed": {
        this.embedFileName = "";
        this.embedImageFile = null;
        this.embedImgurl = "";
        break;
      }
      case "sponser": {
        this.sponserFileName = "";
        this.sponserImageFile = null;
        this.spnsImgUrl = "";
        break;
      }
      //  default: {
      //     console.log("Invalid choice");
      //     break;
      //  }
    }
  }

  getGenersList() {
    this.authenticationService
      .allGenres()
      .pipe(first())
      .subscribe(
        data => {
          if (data.status) this.genresList = data.category;
          else {
            alert(data);
          }
        },
        error => {
          console.log("error", error);
          // this.loading = true;
        }
      );
  }

  public uploadFile(fileToUpload: File) {
    const _formData = new FormData();
    _formData.append("file", fileToUpload, fileToUpload.name);
  }

  logout(){
    window.localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
