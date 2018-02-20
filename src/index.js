import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebaseConfig from './firebaseConfig';
import * as firebase from "firebase";

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
