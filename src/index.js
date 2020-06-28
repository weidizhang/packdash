import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={ store }>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// Allow for debugging from dev console using store.getState()
if (process.env.NODE_ENV !== "production")
    window.store = store;
