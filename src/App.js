import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomeEn from './components/HomeEn.js';
import ProductDetail from './components/ProductDetail.js';
import LoginEn from './components/LoginEn.js';
import RegisterEn from './components/RegisterEn.js';
import Verify from './components/Verify.js';
import server from './components/ServerURL.js';
import vector from './images/vector.png';
import MessengerCustomerChat from 'react-messenger-customer-chat/lib/MessengerCustomerChat';
import HomeKa from './components/componentsKA/HomeKa.js';
import LoginKa from './components/componentsKA/LoginKa.js';
import RegisterKa from './components/componentsKA/RegisterKa.js';
import ProductDetailKa from './components/componentsKA/ProductDetailKa.js';
import Favourites from './components/Favourites.js';
import Cart from './components/Cart.js';
import { UserContext } from './UserContext.js';

const App = () => {
  const [logged_in, set_logged_in] = useState(false);
  const [LoginLoading, setLoginLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    surname: "",
  });

  const checkUser = async () => {
    const link = server + 'user_info';
    const response = await fetch(link, {
      method: 'GET',
      headers: {
        "Content-Type":"application/json",
        'Authorization': 'Bearer ' + localStorage.getItem("access_token")
      }
    });
    const data = await response.json();
    if(response.status == 200) {
      set_logged_in(true);
      setUserData(data.user);
    }
    console.log(data);
  }

  useEffect(()=>{
    checkUser();
  }, []);
  

  const toggleLogged = () => {
    set_logged_in(!logged_in);
  }

  const login = async (em, pass, nav) => {
    const log = {
        email: em,
        password: pass
    }
    const loginError = document.getElementById("login_error");

    console.log(log);
    const link = server + 'login';

    setLoginLoading(true);
    loginError.style.display = 'none';
    const response = await fetch(link, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(log)
    });
    const data = await response.json();
    setLoginLoading(false);
    if(response.status === 200) {
      toggleLogged();
      setUserData(data.user);
      nav("/en");
      loginError.style.display = "none";
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    } else {
      loginError.style.display = "block";
    }
    console.log(data);
    console.log(logged_in);

  }

  // 401 if not logged in
  // 403 if not admin


  const logout2 = async () => {
    const link = server + 'logout2';
    const response = await fetch(link, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem("refresh_token")            
        },    
    });
    const data = await response.json();
    console.log(data);
  }

  const logout = async () => {
    const link = server + 'logout';
    const response = await fetch(link, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem("access_token")            
        },    
    });
    console.log(localStorage.getItem("refresh_token") + " : " + localStorage.getItem("access_token"));
    const data = await response.json();
    logout2();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    console.log(data);
  }

  return (
    <Router>
      <UserContext.Provider value={{logged_in, toggleLogged, userData, logout}}>
        <div className="app">
            <Routes>
                <Route path='/' element={
                  <Navigate to='/en' />
                } />
                <Route path='/en' element={
                  <HomeEn userData={userData}/>
                } />
                
                <Route path='/en/login' element={ 
                  <LoginEn loading={LoginLoading} login={login}/> 
                } />
                <Route path='/en/register' element={ 
                  <RegisterEn userData={userData}/> 
                } />
                <Route path='/en/cart/:id' element={<Cart />}/>
                <Route path='/en/verify' element={ 
                  <Verify /> 
                } />
                <Route path='/en/favourites/:id' element={<Favourites />}/>
                <Route path={'/en/product/:id'} element={ <ProductDetail /> } />      
                <Route path="/ka" element={
                  <HomeKa />
                } />
                <Route path="/ka/login" element={ <LoginKa loading={LoginLoading} login={login}/>} />
                <Route path="/ka/register" element={
                  <RegisterKa userData={userData}/>
                } />
                <Route path={'/ka/product/:id'} element={ 
                  <ProductDetailKa /> 
                } />
                <Route path={'en/kiushop/verify/:email/:token'} element={<Verify />}/>
                <Route path='en/addproduct'  element/>
                
            </Routes>  
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
