import { async, TestBed } from '@angular/core/testing';
import { AngularFeatureSetsModule } from './angular-feature-sets.module';

describe('AngularFeatureSetsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularFeatureSetsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AngularFeatureSetsModule).toBeDefined();
  });
});
