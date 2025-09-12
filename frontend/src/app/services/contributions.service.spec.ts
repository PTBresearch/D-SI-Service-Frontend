import { TestBed } from '@angular/core/testing';

import { ContributionsService } from './contributions.service';

describe('ContributionsService', () => {
  let service: ContributionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContributionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
