import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TweetPage } from './Tweet.page';

describe('TweetPage', () => {
  let component: TweetPage;
  let fixture: ComponentFixture<TweetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TweetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
