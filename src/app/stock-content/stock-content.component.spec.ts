import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockContentComponent } from './stock-content.component';

describe('StockContentComponent', () => {
  let component: StockContentComponent;
  let fixture: ComponentFixture<StockContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
