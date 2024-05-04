import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { SessionService } from '../_services/session.service';
import { StorageService } from '../_services/storage.service';
import { JWTTokenService } from '../_services/jwt.service';
import { Observable, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const INTERVAL = 5000;

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent implements OnInit, OnDestroy {
  closeTimer$ = new Subject<any>();
  id: string = '';

  session: any;

  endSessionBtnEnabled: boolean = false;

  endedSession:boolean = false;
  sessionFound:boolean = true;

  loading: boolean = true;

  @ViewChild('linkInput') linkInput: ElementRef | undefined;

  constructor(private route: ActivatedRoute,
              private sessionService: SessionService,
              private storageService: StorageService,
              private jwtService: JWTTokenService

  ) { }

  ngOnInit(): void {  
    this.route.params.pipe(switchMap((params) => this.sessionService.getSession(params['id']))).subscribe({
      next: session => {
        this.session = session;
        this.id = session.id;
        this.loading = false;

        if (session.selectedRestaurant) {
          this.endedSession = true;
        } else {
          this.checkAndJoin();
          this.setupCheckingSessionEnd(this.id)
        }
        
      },
      error: err => {
        this.loading = false;
        this.sessionFound = false;
      }
    });
  }

  setupCheckingSessionEnd(id: string) {
     //polling
     timer(0, INTERVAL).pipe(
      switchMap(() => this.sessionService.isSessionEnded(id)),
      takeUntil(this.closeTimer$)).subscribe({
        next: data => {
          if (data.data) {
            this.endedSession = true;
            this.closeTimer$.next('');
          }
        },
        error: err => {
        }
    });
  }

  checkAndJoin() {
    if (this.session) {
      if (this.session.createdBy === this.jwtService.getUser(this.storageService.getToken())) {
        this.endSessionBtnEnabled = true;
      } else {
        this.sessionService.joinSessin(this.session.id).subscribe({
          next: data => {

          },
          error: err => {

          }
        });
      }
    }
  }

  endSession() {
    this.sessionService.endSesion(this.session.id)
      .pipe(switchMap((session) => this.sessionService.getSession(session.id))).subscribe({
      next: data => {
        this.session = data;
        this.endedSession = true;
      },
      error: err => {

      }
    });
  }

  copyText() {
    const inputElement = this.linkInput?.nativeElement as HTMLInputElement;
    inputElement.select();
    document.execCommand('copy');
  }

  ngOnDestroy() {
    this.closeTimer$.next('');
  }
}
