import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '@app/shared/player/player.service';
import { PlaylistListComponent } from '@app/shared/playlist-list/playlist-list.component';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.less']
})
export class ArtistComponent implements OnInit,OnDestroy {

  constructor(private snotifyService:SnotifyService ,private spinner: NgxSpinnerService,private accountService: AccountService,private modalService:NgbModal, private playerService: PlayerService,private route:ActivatedRoute) { }

    albumList = [];
    singoliList = [];
    artistName  = null;
    artistId = null;
    artist = null;

    ngOnDestroy(): void {

      // document.getElementById('headerBar').style.background = "#1b1c1e";
  
    }


    addToQueue(music) {

      this.accountService.getMusicFromAlbum(music.albumId)
      .subscribe(music1 => {

        if (music1) {
          if(!music1 || !music1[0]) return;
          this.playerService.addToPlayList(music1[0]);
          this.snotifyService.info("Canzone aggiunta alla coda", "", {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
        }});


    }
  
    addToPlaylist(music) {

      this.accountService.getMusicFromAlbum(music.albumId)
      .subscribe(music1 => {

        if (music1) {
          if(!music1 || !music1[0]) return;
          const modalRef = this.modalService.open(PlaylistListComponent,{size:'xl'});
      
          modalRef.componentInstance.modalAction = 'addMusic';
          modalRef.componentInstance.musicToAdd = music1[0];
        }});



    }
  

    

  ngOnInit(): void {

    this.spinner.show();

    this.artistName = this.route.snapshot.paramMap.get('name');
    this.artistId = this.route.snapshot.paramMap.get('id');


 
    this.accountService.getArtist(this.artistId).subscribe((res: any) => {

      if (res) {
        this.albumList = res.albums;
        this.singoliList = res.singles;
        this.artist = res;

        this.spinner.hide();

      }else{
        this.spinner.hide();

      }
    });



  }


  loadAlbum(idAlbum) {
    this.accountService.getMusicFromAlbum(idAlbum)
      .subscribe(res => {

        if (res) {
          this.playerService.updatePlayList(res)

          this.snotifyService.info("Album in riproduzione", "", {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });

        } else {
        }


      });
  }


  playMusic(music) {
    this.playerService.updatePlayList([music])
  }


}
