import { TestBed } from '@angular/core/testing';

import { PushListenerService } from './push-listener.service';

describe('PushListenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushListenerService = TestBed.get(PushListenerService);
    expect(service).toBeTruthy();
  });
});
