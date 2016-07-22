import thunk from 'redux-thunk';
import reducers from './reducers';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

export default function configureStore(initialState) {
  const reducer = combineReducers(Object.assign({},
    reducers));

  // DevTool store or not (Todo: switch false prod)
  const finalCreateStore = true ? compose(
    applyMiddleware(thunk, logger)(createStore)) :
    createStore;

  const store = finalCreateStore(reducer);

  // if (module.hot) {
  //   module.hot.accept('./reducers', () => {
  //     const nextRootReducer = require('./reducers/index').default;
  //     const nextCombinedReducers = combineReducers(Object.assign({},
  //       reducers));
  //     store.replaceReducer(nextCombinedReducers);
  //   });
  // }

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      const nextCombinedReducers = combineReducers(Object.assign({},
        reducers));
      store.replaceReducer(nextCombinedReducers);
    });
  }

  return store;
}
