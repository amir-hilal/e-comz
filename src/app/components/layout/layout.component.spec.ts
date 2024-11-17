import { InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LayoutComponent } from './layout.component';

class MockAngularFireAuth {
  authState = of(null);
}

class MockAngularFirestore {
  collection = jasmine.createSpy('collection').and.returnValue({
    doc: jasmine.createSpy('doc').and.returnValue({
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    }),
  });
}

const mockFirebaseConfig = {};

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: AngularFireAuth, useClass: MockAngularFireAuth },
        { provide: AngularFirestore, useClass: MockAngularFirestore },
        {
          provide: new InjectionToken('angularfire2.app.options'),
          useValue: mockFirebaseConfig,
        },
        provideRouter([]), 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
