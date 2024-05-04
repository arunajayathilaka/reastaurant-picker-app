import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ListViewComponent } from './list-view.component';
import { SessionService } from '../_services/session.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let mockSessionService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockSessionService = jasmine.createSpyObj('SessionService', ['getRestaurants', 'addRestaurant']);
    mockActivatedRoute = { params: of({ id: 'mockSessionId' }) };

    await TestBed.configureTestingModule({
      declarations: [ListViewComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.closeTimer$.next('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should load list of restaurants', fakeAsync(() => {
    const mockResponse = [{ name: 'Restaurant 1' }, { name: 'Restaurant 2' }];
    mockSessionService.getRestaurants.and.returnValue(of(mockResponse));

    fixture.detectChanges();
    tick();

    expect(component.items).toEqual(mockResponse);
    expect(component.loading).toBe(false);
  }));

  xit('should handle error while loading restaurants', fakeAsync(() => {
    const mockErrorResponse = { message: 'Failed to load restaurants!' };
    mockSessionService.getRestaurants.and.returnValue(throwError(mockErrorResponse));

    fixture.detectChanges();
    tick();

    expect(console.log).toHaveBeenCalledWith(mockErrorResponse);
  }));

  xit('should add restaurant', () => {
    const itemName = 'New Restaurant';
    component.newItemName = itemName;

    component.addItem();

    expect(mockSessionService.addRestaurant).toHaveBeenCalledWith('mockSessionId', itemName);
    expect(component.newItemName).toBe('');
    expect(component.restaurantAdded).toBe(true);
  });
});
