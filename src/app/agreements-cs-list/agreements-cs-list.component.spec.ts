import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementsCsListComponent } from './agreements-cs-list.component';

describe('AgreementsCsListComponent', () => {
  let component: AgreementsCsListComponent;
  let fixture: ComponentFixture<AgreementsCsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementsCsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementsCsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
