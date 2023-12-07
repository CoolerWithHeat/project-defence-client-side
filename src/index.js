import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { MainBoard } from "./coreComponents";
import store from './redux/store';
import { Provider } from 'react-redux';
import AdminPanel from "admin";
import AuthenticationForm from './auth_form'
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import InsideCollection from "collectionView";
import ItemView from "itemView";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/main" element={<MainBoard/>} />
          <Route path="/register" element={<AuthenticationForm id={1}/>} /> 
          <Route path="/login" element={<AuthenticationForm id={0}/>} /> 
          <Route path="/collection/:collectionID/" element={<InsideCollection/>} /> 
          <Route path="/collection/:collectionID/:itemID/" element={<ItemView/>} /> 
          <Route path="/ItemView/:itemID/" element={<ItemView/>} /> 
          <Route path="*" element={<Navigate to="/register" replace />}/>
        </Routes>
      </BrowserRouter>
  </Provider>
)