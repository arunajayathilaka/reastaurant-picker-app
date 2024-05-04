import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockStorageService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['isLoggedIn', 'saveUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = { snapshot: { queryParams: {} } };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home if user is logged in', () => {
    mockStorageService.isLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  xit('should login successfully', fakeAsync(() => {
    const mockResponse = { token: 'mockToken' };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.form.username = 'testuser';
    component.form.password = 'testpassword';
    component.onSubmit();
    tick();

    expect(component.isLoginFailed).toBe(false);
    expect(component.isLoggedIn).toBe(true);
    expect(mockStorageService.saveUser).toHaveBeenCalledWith(mockResponse);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should handle login failure', fakeAsync(() => {
    const mockErrorResponse = { error: { message: 'Login failed!' } };
    mockAuthService.login.and.returnValue(throwError(mockErrorResponse));

    component.form.username = 'testuser';
    component.form.password = 'testpassword';
    component.onSubmit();
    tick();

    expect(component.isLoginFailed).toBe(true);
    expect(component.errorMessage).toBe(mockErrorResponse.error.message);
  }));
});
