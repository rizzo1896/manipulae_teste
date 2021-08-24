import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import Reducers from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  //   whitelist: ["FavoriteListReducer"],
};

const pReducer = persistReducer(persistConfig, Reducers);

const store = createStore(
  pReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const persistor = persistStore(store);

export { store, persistor };
