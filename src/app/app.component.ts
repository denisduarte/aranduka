import { Component, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { NavigateService } from "./services/navigate.service";
import { Router, ActivatedRoute } from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
//import { AppService } from './_services/app.service';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedFeature = 'book-create';

  idleState = 'Not started.';
  lastPing?: Date = null;
  title = 'angular-idle-timeout';

  public modalRef: BsModalRef;

  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(private navigation: NavigateService,
              private router: Router,
              private route: ActivatedRoute,
              private idle: Idle,
              private keepalive: Keepalive,
              private modalService: BsModalService,
              private userService: UserService) {

      this.navigation.navigateToPage.subscribe( (feature) => this.onNavigate(feature) );

    //idle.setIdle(2);
    //idle.setTimeout(5);

    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.logout();
    });

    idle.onIdleStart.subscribe(() => {
      this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'Teu acesso irá expirar em ' + countdown + " segundos. Se não quiseres deixar o acervo físico da biblioteca social, pressione 'continuar'."
    });

    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  reset() {
    this.idle.watch();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  logout() {
   this.childModal.hide();

   this.userService.logout();
   this.router.navigate(['/']);
 }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
