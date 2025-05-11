import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowItWorksPage } from './how-it-works.page';

describe('HowItWorksPage', () => {
  let component: HowItWorksPage;
  let fixture: ComponentFixture<HowItWorksPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HowItWorksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
