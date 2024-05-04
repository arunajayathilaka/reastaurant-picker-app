import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { SessionService } from '../_services/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAuthService: any;
  let mockStorageService: any;
  let mockSessionService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['isLoggedIn', 'clean', 'getUser']);
    mockSessionService = jasmine.createSpyObj('SessionService', ['createSession']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockStorageService.clean).toHaveBeenCalled();
  });

  it('should create new session', fakeAsync(() => {
    const mockResponse = { id: 'mockSessionId' };
    mockSessionService.createSession.and.returnValue(of(mockResponse));

    component.newSession();
    tick();

    expect(component.sessionId).toBe(mockResponse.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/session', mockResponse.id]);
  }));

  it('should handle error while creating new session', fakeAsync(() => {
    const mockErrorResponse = { message: 'Session creation failed!' };
    mockSessionService.createSession.and.returnValue(throwError(mockErrorResponse));

    spyOn(console, 'log');

    component.newSession();
    tick();

    expect(console.log).toHaveBeenCalledWith(mockErrorResponse);
  }));
});
