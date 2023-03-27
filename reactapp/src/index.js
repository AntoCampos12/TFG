import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserForm from './pages/UserForm';
import LoginForm from './pages/LoginForm';
import AddLiga from './pages/AddLiga';
import Ligas from './pages/Ligas';
import JoinLiga from './pages/JoinLiga';
import Comunio from './pages/Comunio';
import Fichajes from './pages/Fichajes';
import Rank from './pages/Rank';
import Update from './tools/Update';

export default function App()
{
  return(
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Ligas/>}/>
        <Route path="/authentication" element={<UserForm/>}/>
        <Route path='/authentication/login' element={<LoginForm/>}/>
        <Route path='/add' element={<AddLiga/>}/>
        <Route path='/join' element={<JoinLiga/>}/>
        <Route path='/partidas/:pk' element={<Comunio/>}/>
        <Route path='/partidas/:pk/fichajes' element={<Fichajes/>}/>
        <Route path='/partidas/:pk/ranking' element={<Rank/>}/>
        <Route path='/:pk/update' element={<Update/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"))
reportWebVitals();
