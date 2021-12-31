import '../styles/globals.css';
import "../styles/NotifStyle.css";
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {createStore, combineReducers, applyMiddleware} from "redux";
import Reducer from "../Store/Reducer";

const rootReducer=combineReducers({
  Reducer:Reducer
});

const store = createStore(rootReducer , applyMiddleware(thunk));

function MyApp({ Component, pageProps }) {
  return(
    <Provider store={store}>
      <ToastContainer rtl autoClose={6000} pauseOnFocusLoss={false}/>
      <Component {...pageProps} />
    </Provider>
  ) 
}

export default MyApp
