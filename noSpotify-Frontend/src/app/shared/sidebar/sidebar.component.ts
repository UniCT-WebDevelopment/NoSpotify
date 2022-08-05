import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {

  isActive!: boolean;
  collapsed!: boolean;
  showMenu!: string;
  pushRightClass!: string;

  servicesOpen = false;
  ipOpen = false;
  configurationsOpen = false;
  topologyOpen = false;
  linkOpen = false;
  historyOpen = false;

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(public router: Router) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.isActive = true;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';

      this.linkOpen = false;
    
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    const dom: HTMLBodyElement | null = document.querySelector('body');
    return dom!.classList.contains(this.pushRightClass);
  }


  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: HTMLBodyElement | null = document.querySelector('body');
    dom!.classList.toggle('rtl');
  }

  onLoggedout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  checkRoute(route: string) {
    if (this.router.url.includes(route)) return true;
    return false;
  }
}
