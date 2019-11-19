import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsOnlineComponent } from './ws-online.component';

describe('WsOnlineComponent', () => {
  let component: WsOnlineComponent;
  let fixture: ComponentFixture<WsOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
