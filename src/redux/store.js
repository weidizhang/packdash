import { createStore } from "redux";
import packdashApp from "./reducers";

const store = createStore(packdashApp);
export default store;
