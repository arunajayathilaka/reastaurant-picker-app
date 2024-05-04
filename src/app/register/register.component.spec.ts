import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let mockStorageService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should register successfully', fakeAsync(() => {
    const mockResponse = { message: 'Registration successful!' };
    mockAuthService.register.and.returnValue(of(mockResponse));

    component.form.username = 'testuser';
    component.form.password = 'testpassword';
    component.onSubmit();
    tick();

    expect(component.isSuccessful).toBe(true);
    expect(component.isSignUpFailed).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle registration failure', fakeAsync(() => {
    const mockErrorResponse = { error: { message: 'Registration failed!' } };
    mockAuthService.register.and.returnValue(throwError(mockErrorResponse));

    component.form.username = 'testuser';
    component.form.password = 'testpassword';
    component.onSubmit();
    tick();

    expect(component.isSignUpFailed).toBe(true);
    expect(component.errorMessage).toBe(mockErrorResponse.error.message);
  }));
});
