import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearnMorePage } from './learn-more.page';

describe('LearnMorePage', () => {
  let component: LearnMorePage;
  let fixture: ComponentFixture<LearnMorePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LearnMorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
