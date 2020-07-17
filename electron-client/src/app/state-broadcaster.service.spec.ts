import { TestBed } from '@angular/core/testing';

import { StateBroadcasterService } from './state-broadcaster.service';

describe('StateBroadcasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateBroadcasterService = TestBed.get(StateBroadcasterService);
    expect(service).toBeTruthy();
  });
});
