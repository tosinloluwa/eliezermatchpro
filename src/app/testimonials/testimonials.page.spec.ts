import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialsPage } from './testimonials.page';

describe('TestimonialsPage', () => {
  let component: TestimonialsPage;
  let fixture: ComponentFixture<TestimonialsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestimonialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
