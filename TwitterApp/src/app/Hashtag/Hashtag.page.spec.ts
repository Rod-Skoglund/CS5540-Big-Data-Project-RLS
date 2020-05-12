import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HashtagPage } from './Hashtag.page';

describe('Tab2Page', () => {
  let component: HashtagPage;
  let fixture: ComponentFixture<HashtagPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HashtagPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HashtagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
