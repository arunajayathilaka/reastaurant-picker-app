import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let sessionService: SessionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService]
    });

    sessionService = TestBed.inject(SessionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(sessionService).toBeTruthy();
  });

  it('should retrieve session by ID', () => {
    const mockSessionId = 'mockSessionId';
    const mockResponse = { id: mockSessionId, name: 'Mock Session' };

    sessionService.getSession(mockSessionId).subscribe(session => {
      expect(session).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`api/sessions/${mockSessionId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should check if session is ended', () => {
    const mockSessionId = 'mockSessionId';
    const mockResponse = { ended: true };

    sessionService.isSessionEnded(mockSessionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`api/sessions/${mockSessionId}/isEnded`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should retrieve restaurants for session', () => {
    const mockSessionId = 'mockSessionId';
    const mockResponse = [{ id: '1', name: 'Restaurant 1' }, { id: '2', name: 'Restaurant 2' }];

    sessionService.getRestaurants(mockSessionId).subscribe(restaurants => {
      expect(restaurants).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`api/sessions/${mockSessionId}/restaurants`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should create session', () => {
    const mockResponse = { id: 'newSessionId', name: 'New Session' };

    sessionService.createSession().subscribe(session => {
      expect(session).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('api/sessions');
    expect(req.request.method).toBe('POST');

    req.flush(mockResponse);
  });

  it('should join session', () => {
    const mockSessionId = 'mockSessionId';
    const mockResponse = { success: true };

    sessionService.joinSessin(mockSessionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`api/sessions/${mockSessionId}/join`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should add restaurant to session', () => {
    const mockSessionId = 'mockSessionId';
    const mockRestaurantName = 'New Restaurant';
    const mockResponse = { success: true };

    sessionService.addRestaurant(mockSessionId, mockRestaurantName).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`api/sessions/${mockSessionId}/addRestaurant`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: mockRestaurantName });

    req.flush(mockResponse);
  });

  it('should end session', () => {
    const mockSessionId = 'mockSessionId';
    const mockResponse = { success: true };

    sessionService.endSesion(mockSessionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`api/sessions/${mockSessionId}/end`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
