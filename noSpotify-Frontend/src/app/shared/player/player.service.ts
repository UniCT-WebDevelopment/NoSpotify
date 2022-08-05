import { EventEmitter, Injectable, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from '@app/_services';
import _ from 'lodash';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {


  currPlayList = [];
  isConnectedWebsocket = false;
  hideLabel = false;

  room = null;

  @Output() model$ = new EventEmitter<{
    playlist: any;
    type: string;
    index?: number;
  }>();

  constructor(public router: Router,private accountService:AccountService,private socket:Socket) {


    // setInterval(()=>{

    //   if(this.isInRoom() && this.isHost()){
    //   let objPlayer = JSON.parse(localStorage.getItem("playerState"));
    //   objPlayer["playlist"] = this.currPlayList;

    //   let objToSend = {
    //     userData:this.accountService.userValue,
    //     playerState:objPlayer

    //   }

    //   this.socket.emit('sendPlayerState',JSON.stringify(objToSend))
    // }
    // },1000)
  }


  getRoom(){
    return this.room;
  }

  setRoom(room) {
    this.room = _.cloneDeep(room);
  }

  isInRoom() {
    if(this.room) return true;
    else return false;
  }

  isHost() {
    if(this.room && this.room.owner && this.room.owner == this.socket.ioSocket.id) return true;
   else return false;
  }

  updatePlayList(playList, fromPlayer = false) {
    if (fromPlayer) {
      this.currPlayList = _.cloneDeep(playList);
      this.model$.emit({ playlist: _.cloneDeep(this.currPlayList), type: "partialreInit" });
    } else {
      this.currPlayList = _.cloneDeep(playList);
      this.model$.emit({ playlist: _.cloneDeep(this.currPlayList), type: "reInit" });
    }
  }


  addToPlayList(music) {
    this.currPlayList.push(music);
    this.model$.emit({ playlist: music, type: "add" });
  }


  removeFromPlayList(index) {
    try {
      this.model$.emit({ playlist: this.currPlayList, type: "remove", index });
      this.currPlayList.splice(index, 1);
    } catch (e) { }
  }

  deletePlaylist() {

    this.currPlayList = _.cloneDeep([]);
    this.model$.emit({ playlist: this.currPlayList, type: "delete" });

  }
}
