import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SessionComponent } from './session.component';
import { SessionService } from '../_services/session.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

const INTERVAL = 3000;

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  let mockActivatedRoute: any;
  let mockSessionService: any;
  let mockActivatedRouteParam: any;

  beforeEach(async () => {
    mockActivatedRouteParam = of({
      id: 'mockSessionId'
    });

    mockSessionService = jasmine.createSpyObj('SessionService', ['getSession', 'isSessionEnded', 'joinSessin', 'endSesion']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['root']);

    mockActivatedRoute.params = mockActivatedRouteParam;

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle session found state', () => {
    const mockSession = { id: 'mockSessionId', createdBy: 'user', selectedRestaurant: null };
    mockSessionService.getSession.and.returnValue(of(mockSession));
    
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.session).toEqual(mockSession);
    expect(component.id).toBe(mockSession.id);
    expect(component.sessionFound).toBe(true);
    expect(component.endedSession).toBe(false);
    expect(component.endSessionBtnEnabled).toBe(false); // Assuming createdBy matches with user
  });

  it('should handle session not found state', () => {
    mockSessionService.getSession.and.returnValue(throwError(''));

    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.sessionFound).toBe(false);
  });

  it('should handle session ended state', fakeAsync(() => {
    const mockSession = { id: 'mockSessionId', createdBy: 'user', selectedRestaurant: 'restaurant' };
    mockSessionService.getSession.and.returnValue(of(mockSession));
    mockSessionService.isSessionEnded.and.returnValue(of({ data: true }));

    fixture.detectChanges();
    tick();

    expect(component.endedSession).toBe(true);
    expect(component.closeTimer$.observers.length).toBe(0);
  }));

  xit('should handle session not ended state', fakeAsync(() => {
    const mockSession = { id: 'mockSessionId', createdBy: 'user', selectedRestaurant: null };
    mockSessionService.getSession.and.returnValue(of(mockSession));
    mockSessionService.isSessionEnded.and.returnValue(of({ data: false }));

    fixture.detectChanges();
    tick(INTERVAL); // Advance time to trigger polling

    expect(component.endedSession).toBe(false);
  }));

  xit('should check and join session', () => {
    const mockSession = { id: 'mockSessionId', createdBy: 'user', selectedRestaurant: null };
    component.session = mockSession;

    component.checkAndJoin();

    expect(mockSessionService.joinSessin).toHaveBeenCalledWith(mockSession.id);
  });

  xit('should end session', () => {
    const mockSession = { id: 'mockSessionId', createdBy: 'user', selectedRestaurant: null };
    component.session = mockSession;
    const mockEndedSession = { id: 'mockSessionId', createdBy: 'user', selectedRestaurant: 'restaurant' };
    mockSessionService.endSesion.and.returnValue(of(mockEndedSession));
    mockSessionService.getSession.and.returnValue(of(mockEndedSession));

    component.endSession();
    fixture.detectChanges();

    expect(mockSessionService.endSesion).toHaveBeenCalledWith(mockSession.id);
    expect(component.session).toEqual(mockEndedSession);
    expect(component.endedSession).toBe(true);
  });
});
