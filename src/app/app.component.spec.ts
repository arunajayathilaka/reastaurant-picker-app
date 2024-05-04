import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockStorageService = jasmine.createSpyObj('StorageService', ['isLoggedIn', 'getUser', 'clean']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [RouterTestingModule],
      providers: [
        { provide: StorageService, useValue: mockStorageService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set username if user is logged in', () => {
    const mockUser = { username: 'testuser' };
    mockStorageService.isLoggedIn.and.returnValue(true);
    mockStorageService.getUser.and.returnValue(mockUser);

    fixture.detectChanges();

    expect(component.username).toEqual(mockUser.username);
  });

  xit('should call logout method on click of logout button', () => {
    spyOn(component, 'logout').and.callThrough();
    const logoutButton = fixture.nativeElement.querySelector('.nav-link');

    logoutButton.click();

    expect(component.logout).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockStorageService.clean).toHaveBeenCalled();
  });

  xit('should navigate to login page after logout', () => {
    //spyOn(component, 'logout').and.callThrough();

    const mockUser = { username: 'testuser' };
    mockStorageService.isLoggedIn.and.returnValue(true);
    mockStorageService.getUser.and.returnValue(mockUser);

    fixture.detectChanges();

    const logoutButton = fixture.debugElement.nativeElement.querySelector('.nav-link');
    logoutButton.click();
    //expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
