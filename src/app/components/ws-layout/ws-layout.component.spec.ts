import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsLayoutComponent } from './ws-layout.component';

describe('WsLayoutComponent', () => {
  let component: WsLayoutComponent;
  let fixture: ComponentFixture<WsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
