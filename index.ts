import { Inject, Injectable, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import {
  Action,
  ActionReducerMap,
  Store,
  StoreModule,
  StoreRootModule,
  RootStoreConfig,
  StateObservable,
  ActionsSubject,
  ReducerManager
} from "@ngrx/store";
import { ClientOptions, CrossTabClient } from '@logux/client'

const PROVIDER_CLEAN_EVERY = "cleanEvery";
const PROVIDER_REASONLESS_HISTORY = "reasonlessHistory";
const PROVIDER_SAVE_STATE_EVERY = "saveStateEvery";
const PROVIDER_ON_MISSED_HISTORY = "onMissedHistory";
const PROVIDER_LOGUX_CLIENT = "loguxClient";

@Injectable()
export class LoguxNgRxStore<T = object> extends Store<T> {
  constructor(
    @Inject(PROVIDER_CLEAN_EVERY) private cleanEvery: number,
    state$: StateObservable, actionsObserver: ActionsSubject, reducerManager: ReducerManager
  ) {
    super(state$, actionsObserver, reducerManager);
  }

  dispatch<V extends Action = Action>(action) {
    super.dispatch(action)
  }
}

type LoguxNgRxConfig = ClientOptions & {
  /**
   * How many actions without `meta.reasons` will be kept for time travel.
   * Default is `1000`.
   */
  reasonlessHistory?: number

  /**
   * How often save state to history. Default is `50`.
   */
  saveStateEvery?: number

  /**
   * Callback when there is no history to replay actions accurate.
   */
  onMissedHistory?: (action: Action) => void

  /**
   * How often we need to clean log from old actions. Default is every `25`
   * actions.
   */
  cleanEvery?: number
}

@NgModule({})
export class LoguxNgrxModule {
  static forRoot<T, V extends Action = Action>(
    clientConfig: LoguxNgRxConfig,
    reducers:
      | ActionReducerMap<T, V>
      | InjectionToken<ActionReducerMap<T, V>>,
    config?: RootStoreConfig<T, V>
  ): ModuleWithProviders<StoreRootModule> {
    let cleanEvery = clientConfig.cleanEvery || 25
    delete clientConfig.cleanEvery
    let reasonlessHistory = clientConfig.reasonlessHistory || 1000
    delete clientConfig.reasonlessHistory
    let saveStateEvery = clientConfig.saveStateEvery || 50
    delete clientConfig.saveStateEvery
    let onMissedHistory = clientConfig.onMissedHistory
    delete clientConfig.onMissedHistory

    let module = StoreModule.forRoot<T>(reducers, config);
    let client = new CrossTabClient(clientConfig);

    if (!module.providers) {
      module.providers = [];
    }

    module.providers.push(
      { provide: PROVIDER_CLEAN_EVERY, useValue: cleanEvery },
      { provide: PROVIDER_REASONLESS_HISTORY, useValue: reasonlessHistory },
      { provide: PROVIDER_SAVE_STATE_EVERY, useValue: saveStateEvery },
      { provide: PROVIDER_ON_MISSED_HISTORY, useValue: onMissedHistory },
      {
        provide: PROVIDER_LOGUX_CLIENT,
        useValue: client
      },
      [LoguxNgRxStore]
    );

    return module;
  }
}
