import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from './slice'

let middleware = []
// if (import.meta.env.DEV) {
//     middleware = [...middleware]
// }

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
     }).concat(middleware),
})
const persistor = persistStore(store)

export const AppProvider = ({ children }) => (
    <Provider store={store}>
        <PersistGate persistor={persistor} >
            {children}
        </PersistGate>
    </Provider>
)