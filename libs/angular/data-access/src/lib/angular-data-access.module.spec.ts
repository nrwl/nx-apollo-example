import { async, TestBed } from '@angular/core/testing';
import { AngularDataAccessModule } from './angular-data-access.module';

describe('AngularDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AngularDataAccessModule).toBeDefined();
  });
});
