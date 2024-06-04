import { XIconComponent } from '@ng-nest/ui/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { XRowComponent, XColComponent } from '@ng-nest/ui/layout';
import { XBadgeComponent } from '@ng-nest/ui/badge';
import { FormsModule } from '@angular/forms';
import { XBadgePrefix } from './badge.property';
import { XButtonComponent } from '@ng-nest/ui/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XThemeComponent } from '@ng-nest/ui/theme';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe(XBadgePrefix, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [TestXBadgeComponent],
    imports: [BrowserAnimationsModule,
        XThemeComponent,
        FormsModule,
        XBadgeComponent,
        XButtonComponent,
        XRowComponent,
        XColComponent,
        XIconComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });
  describe(`default.`, () => {
    let fixture: ComponentFixture<TestXBadgeComponent>;
    let badge: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TestXBadgeComponent);
      fixture.detectChanges();
      badge = fixture.debugElement.query(By.directive(XBadgeComponent));
    });
    it('should create.', () => {
      expect(badge).toBeDefined();
    });
  });
});

@Component({
  template: `
    <x-theme showDark></x-theme>
    <div class="row">
      <x-badge value="12">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="3">
        <x-button>回复</x-button>
      </x-badge>
    </div>
    <div class="row">
      <x-badge value="12" type="primary">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="12" type="success">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="12" type="info">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="12" type="warning">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="12" type="danger">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="12" type="text">
        <x-button>评论</x-button>
      </x-badge>
    </div>
    <div class="row">
      <x-badge value="200" max="99">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="300" max="200">
        <x-button>回复</x-button>
      </x-badge>
    </div>
    <div class="row">
      <x-badge value="new">
        <x-button>评论</x-button>
      </x-badge>
      <x-badge value="hot">
        <x-button>回复</x-button>
      </x-badge>
    </div>
    <div class="row">
      <x-badge dot>
        <x-button type="primary">评论</x-button>
      </x-badge>
      <x-badge dot>
        <x-icon type="fto-user"></x-icon>
      </x-badge>
    </div>
  `,
  styles: [
    `
      :host {
        background-color: var(--x-background);
        padding: 1rem;
        border: 0.0625rem solid var(--x-border);
      }
      .row {
        display: flex;
        align-items: center;
      }
      .row:not(:first-child) {
        margin-top: 1rem;
      }
      .row x-badge:not(:first-child) {
        margin-left: 2rem;
      }
    `
  ]
})
class TestXBadgeComponent {}
