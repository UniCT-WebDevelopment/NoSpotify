import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistListComponent } from './shared/playlist-list/playlist-list.component';
import { Socket } from 'ngx-socket-io';
import { ShareplayComponent } from './shared/shareplay/shareplay.component';
import { PlayerService } from './shared/player/player.service';
import { SnotifyService } from 'ng-snotify';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
  user: User;
  collapedSideBar!: boolean;
  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;
  @ViewChild('sideBar', { static: false }) sideBar!: SidebarComponent;

  constructor(private router1: Router, private spinner: NgxSpinnerService, private snotifyService: SnotifyService, private playerService: PlayerService, private socket: Socket, private modalService: NgbModal, private route: ActivatedRoute, private accountService: AccountService, private router: Router) {
    this.accountService.user.subscribe(x => this.user = x);

  }
  status: boolean = false;

  ngOnInit() {


    setTimeout(() => {

      if (document.getElementById("myVideo"))
        (document.getElementById("myVideo") as HTMLVideoElement).play();


    }, 600);


    this.socket.connect();


    this.socket.fromEvent<any>('roomInfo').subscribe(data => {
      try {
        if (!this.playerService.room && data) {
          try {
            this.snotifyService.success("SharePlay avviato", "", {
              timeout: 2000,
              showProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true
            });
          } catch (e) {
          }
        } else if (this.playerService.room && data) {

          let json = JSON.parse(data);

          if (this.playerService.room.users.length < json.users.length) {
            try {
              this.snotifyService.info("Un utente si è unito a SharePlay", "", {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              });
            } catch (e) {
            }

          }


          if (this.playerService.room.users.length > json.users.length) {
            try {
              this.snotifyService.info("Un utente ha lasciato SharePlay", "", {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              });
            } catch (e) {
            }

          }



        }
        this.playerService.setRoom(JSON.parse(data));
      } catch (e) {
        this.playerService.setRoom(null);
      }
    });


    this.socket.fromEvent<any>('error').subscribe(data => {

      if (data.includes("host si è disconnesso")) {
        this.snotifyService.info(data, {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });

      } else
        this.snotifyService.error(data, "Errore", {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });

    });



  }



  isLogged() {
    if (this.accountService.userValue) return true
    else return false
  }


  getUser() {
    return this.accountService.userValue.id;
  }

  clickEvent() {
    this.status = !this.status;
  }
  logout() {
    if(this.screenWidth<800)
    this.clickEvent();
    this.accountService.logout();

    this.snotifyService.success("Logout effettuato", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });

  }


  hide() {
    this.spinner.show();

    setTimeout(() => {
      (document.getElementById("myVideo") as HTMLVideoElement).pause()
      document.getElementById("startVideo").style.display = "none"
    }, 800);



    setTimeout(() => {

      this.spinner.hide();

      if (!localStorage.getItem("cookiesConsent"))
        this.snotifyService.confirm('Il sito necessita di cookies per garantire il corretto funzionamento.', 'Cookies', {
          // timeout: 5000,
          showProgressBar: true,

          closeOnClick: false,
          pauseOnHover: true,
          buttons: [
            { text: 'Capito!', action: (toast) => { localStorage.setItem("cookiesConsent", "true"); this.snotifyService.remove(toast.id); }, bold: true },
          ]
        });

    }, 2000);
  }

  search() {
    if(this.screenWidth<800)
    this.clickEvent();
        setTimeout(() => {
      let searchTitle = (document.getElementById("searchBox") as HTMLInputElement).value
      this.router.navigate(['search', searchTitle]);
    }, 100);

  }

  onKeyDownEvent(event: any) {
    if(this.screenWidth<800)
    this.clickEvent();
    let searchTitle = (document.getElementById("searchBox") as HTMLInputElement).value

    this.router.navigate(['search', searchTitle]);

  }

  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }

  toggleSidenav(event) {
    this.sideBar.toggleCollapsed();
    this.collapedSideBar = this.sideBar.collapsed;
  }


  openPlaylistList() {
    if(this.screenWidth<800)
    this.clickEvent();

    const modalRef = this.modalService.open(PlaylistListComponent, { size: 'xl' });
    // modalRef.componentInstance.name = 'World';
  }



  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }




}