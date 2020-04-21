import 'zone.js/dist/zone'

import { Observable } from 'rxjs'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule, Component } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { select, createAction, createReducer, on } from '@ngrx/store'
import { LoguxNgrxModule, LoguxNgRxStore } from 'logux-ngrx'

const reset = createAction('[Counter] Reset')
const increment = createAction('[Counter] Increment')
const decrement = createAction('[Counter] Decrement')

const counterReducer = createReducer<number>(0,
  on(reset, () => 0),
  on(increment, (state: number) => state + 1),
  on(decrement, (state: number) => state - 1)
)

@Component({
  selector: 'app-root',
  template: `
    <div>Current Count: {{ count$ | async }}</div>
    <button (click)="decrement()">Decrement</button>
    <button (click)="reset()">Reset</button>
    <button (click)="increment()">Increment</button>
  `
})
export class AppComponent {
  count$: Observable<number>;

  constructor (private store: LoguxNgRxStore<{ count: number }>) {
    this.count$ = store.pipe(select('count'))
  }

  reset () {
    this.store.dispatch(reset())
  }

  increment () {
    this.store.dispatch(increment())
  }

  decrement () {
    this.store.dispatch(decrement())
  }
}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LoguxNgrxModule.forRoot(
      {
        subprotocol: '1.0.0',
        server: 'ws://example.com:1337',
        userId: '1',
        token: '<% token %>'
      },
      { count: counterReducer }
    )
  ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
