import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../_services/session.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, timer, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

interface Item {
  name: string;
}

const INTERVAL = 5000;

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})
export class ListViewComponent implements OnInit, OnDestroy {
  closeTimer$ = new Subject<any>();
  newItemName: string = '';
  restaurantAdded: boolean = false;
  items: Item[] = [];
  loading: boolean = true;

  sessionId: string = '';

  constructor(private sessionService: SessionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];

        //polling
        timer(0, INTERVAL).pipe(
          switchMap(() => this.sessionService.getRestaurants(params['id'])),
          takeUntil(this.closeTimer$)).subscribe({
            next: data => {
              this.items = [];
              data.forEach((e: { name: string; }) => {
                this.items.push({ name: e.name });
              });
              this.loading = false;

            },
            error: err => {
            }
        });
      
    });
  }

  addItem() {
    if (this.newItemName) {
      this.sessionService.addRestaurant(this.sessionId, this.newItemName).subscribe({
        next: data => { },
        error: err => { }
      });

      this.newItemName = '';
      this.restaurantAdded = true;
    }
  }

  ngOnDestroy() {
    this.closeTimer$.next('');
  }
}
