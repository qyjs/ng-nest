import { Injectable, ElementRef, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '@environments';
import { ConfigService } from '@services';
import { AppMenu } from '@interfaces';
import { menus } from '../../app/app.menus';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  headerRef = signal<ElementRef | null>(null);
  contentRef = signal<ElementRef | null>(null);
  contentScrolling = new Subject<CdkScrollable>();
  shrink = signal(false);
  small = signal(false);
  xsmall = signal(false);
  leftDrawerVisible = signal(false);
  rightDrawerVisible = signal(false);
  defaultActivatedId = signal<string | undefined>(undefined);
  menus = signal<AppMenu[]>([]);
  menusChange!: () => void;
  menusLang = signal<{ [lang: string]: AppMenu[] }>({});
  navs = signal<AppMenu[]>([]);
  navActive = signal<AppMenu | null>(null);
  navChildrenCatch = signal<{ [lang: string]: { [key: string]: AppMenu[] } }>({
    zh_CN: {},
    en_US: {}
  });

  getCurrentMenu(url: string): AppMenu | undefined {
    let route = menus.find((x) => x.type !== 'router' && url.endsWith(`${x.routerLink}`));
    if (route) {
      this.defaultActivatedId.set(route.id);
    }
    return route;
  }

  constructor(
    private router: Router,
    private config: ConfigService,
    private location: Location,
    private title: Title
  ) {
    this.setMenusLang();
    this.router.events.pipe(filter((x) => x instanceof NavigationEnd)).subscribe((x) => {
      const rt = x as NavigationEnd;
      const route = this.getCurrentMenu(rt.urlAfterRedirects);
      if (route) {
        this.title.setTitle(`${route.label}${route.label !== 'NG-NEST' ? ' | NG-NEST' : ''}`);
        this.setNav();
      }
    });
    this.getCurrentMenu(this.location.path());
    this.setNav();
  }

  setMenusLang() {
    for (const lang of this.config.langs()) {
      this.menusLang.update((x) => {
        x[lang] = menus.filter((x) => x.lang === lang);
        return x;
      });
    }
  }

  setLocale(lang: string) {
    const beforeLang = this.config.lang;
    this.config.setLocale(lang, () => {
      this.navs.set(this.menusLang()[lang].filter((x) => x.pid === null));
      this.setNavActive(this.navs().find((x) => x.id === this.navActive()?.id) as AppMenu);
      this.router.navigateByUrl(this.location.path().replace(`/${beforeLang}/`, `/${lang}/`));
    });
  }

  setNav() {
    this.navs.set(this.menusLang()[this.config.lang].filter((x) => x.pid === null));
    let navActive = this.navs().find(
      (x) => this.location.path().indexOf(`/${environment.layout}/${x.routerLink}`) === 0
    ) as AppMenu;
    this.setNavActive(navActive);
  }

  setNavActive(menu: AppMenu) {
    if (!menu) {
      return;
    }
    this.navActive.set(menu);
    let childrenMenus = this.navChildrenCatch()[this.config.lang][menu.id as string];
    if (childrenMenus) {
      this.menus.set(childrenMenus);
    } else {
      const langMenus = this.menusLang()[this.config.lang];
      childrenMenus = langMenus
        .filter((x) => x.pid === menu.id)
        .map((x) => {
          const nav = { ...x };
          nav.pid = null;
          return nav;
        });
      const getChildren = (data: AppMenu[]) => {
        data.forEach((item) => {
          const children = langMenus.filter((x) => x.pid === item.id);
          if (children.length > 0) {
            childrenMenus.push(...children);
            getChildren(children);
          }
        });
      };
      getChildren(childrenMenus);

      this.menus.set(childrenMenus);
      this.navChildrenCatch.update((x) => {
        x[this.config.lang][menu.id as string] = this.menus();
        return x;
      });
    }
  }
}
