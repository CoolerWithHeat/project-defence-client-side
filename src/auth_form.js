import React from "react"
import { TailSpin } from "react-loader-spinner"
import { faker } from '@faker-js/faker';
import arrow from './assets/img/arrow.png'
import SocialAuth from "socialAuthentication"
import './assets/css/authentication.scss'
import getHost from 'host';

const host = getHost()

export const FirstLayerValdation = ()=>{
    const token = localStorage.getItem('users-token')
    console.log(token.length)
}

    async function SendBack_register(oauth2_data, full_name=null, email=null, password1=null, password2=null, stateCallback){
        const data = oauth2_data ? {[oauth2_data.providerId.split('.')[0]]: oauth2_data} : {'Custom-Authentication': {full_name:full_name, email:email, password1: password1, password2:password2}}
        
        const request = await fetch(host+'/SignUp/', {
            method:'POST',
            body: JSON.stringify(data)
            }
        )

        const result = await request.json()

        if (request.status == 200){
            console.log(result.token)
            localStorage.setItem('users-token', result.token)
            window.location.pathname = '../main'
        }
        
        else{

            if (stateCallback)
                stateCallback('Invalid!')
        }
            
    }
    

    const Login_Form = ()=>{
        const [error, update_error] = React.useState()
        const emailField = React.useRef(null)
        const passwordField = React.useRef(null)
        const login = ()=>{
            const email = emailField.current
            const password = passwordField.current
            if (email && password)  
                LoginSend({email:email.value, password:password.value}) 
        }   

        async function LoginSend(data){
        
            const request = await fetch(host+'/Login/', {
                method:'POST',
                body: JSON.stringify(data)
            }
        )
            const result = await request.json()
            if (request.status == 200){
                localStorage.setItem('users-token', result.token)
                if (result['is_admin'])
                    window.location.pathname = '../admin'
                else 
                    window.location.pathname = '../main'
            }
            else
                update_error(<div class="alert alert-warning" role="alert">{result.error}</div>)
            
        }
    return (
        <>
            {error ? [error] : <h2 className="title">Sign In</h2>}
            <div className="input-group">
                <input ref={emailField} id='EmailField' className="input--style-3" type="email" placeholder="Email *" name="email"/>
                <i className="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
            </div>
            <div className="input-group">
                <input ref={passwordField} id='Password1' className="input--style-3" type="text" placeholder="Password *" name="phone"/>
            </div>

            <div className="p-t-10">
                <button onClick={login} style={{color:'#00308F'}} className="btn btn--pill btn--green" type="submit">log in</button>
            </div>
        </>
    )
}

const SignUp_Form = ()=>{
    const [autoSelected, Update_autoSelected] = React.useState()
    const [fakerStatus, Update_fakerStatus] = React.useState(<TailSpin height="65" width="65" color="#FFD700"/>)
    const [error, update_error] = React.useState()

    const changeErrorState = (message)=>{
        update_error(<div id="AuthMessage" class="alert alert-warning" role="alert">{message}</div>)
    }

    const getIndexes = ()=> {
        return {
            1: document.getElementById('FullName'),
            2: document.getElementById('EmailField'),
            3: document.getElementById('Password1'),
        }
    };


    const submit = ()=>{
        const fields = getIndexes()
        const full_name = fields[1].value
        const email = fields[2].value
        const password1 = fields[3].value
        const password2 = document.getElementById('Password2').value
        SendBack_register(false, full_name, email, password1, password2, changeErrorState)
    }

    const AutoFill = ()=>{
        Update_autoSelected(Main=>true)
    
        const Creds = [
            faker.person.fullName(),
            faker.internet.email(),
            faker.internet.password(),
        ];
        
        
        const indexes = getIndexes()
            function setField(index) {
                if (index > 3) {
                    setTimeout(() => {
                        Update_fakerStatus(
                            <svg xmlns="http://www.w3.org/2000/svg" style={{marginBottom:'20px', marginRight:'15px'}} width="60" height="60" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                        )
                    }, 333);
                    document.getElementById('Password2').value = Creds[2]
                return true;
                }
            
            setTimeout(() => {
              indexes[index].value = Creds[index - 1];
              setField(index + 1);
            }, 777);
          }
          setField(1)
    }
    return (
        <>
         <h2 className="title">{error ? error : 'Registration'}</h2>
                            <div className="input-group">
                                <input id='FullName' className="input--style-3" type="text" placeholder="Full Name *" name="name"/>
                            </div>
                            <div className="input-group">
                                <input id='EmailField' className="input--style-3" type="email" placeholder="Email *" name="email"/>
                                <i className="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
                            </div>
                            <div className="input-group">

                                <div  className="rs-select2 js-select-simple select--no-search">
                                    <select id='GenderField' style={{minWidth:'115px', cursor:'pointer', backgroundColor:'#6d6d6d', color:'white', textAlign:'center'}} className="form-select form-select-sm" aria-label=".form-select-lg example">
                                        <option value="1">Male</option>
                                        <option value="2">Female</option>
                                        <option value="3">Other</option>
                                    </select>
                                    
                                </div>
                                
                            </div>
                            
                            <div className="input-group">
                                <input id='Password1' className="input--style-3" type="text" placeholder="Password" name="phone"/>
                            </div>

                            <div className="input-group">
                                <input id='Password2' className="input--style-3" type="text" placeholder="Confirm password" name="phone"/>
                            </div>
                            
                            <div className="p-t-10">
                                <button onClick={submit} style={{color:'#00308F'}} className="btn btn--pill btn--green" type="submit">Sign Up</button>
                            </div>
                            
                            <div className='fakerDiv'>
                                <div id='imageHub'>
                                    {autoSelected ? null : <img height={'40px'} width={'50px'} src={arrow}/>}
                                </div>
                                {autoSelected ? fakerStatus : <button onClick={AutoFill} className='btn btn-primary' style={{color:'white', fontSize: '9px', width:'150px', marginLeft:'-40%', marginBottom:'-2px'}}>
                                    auto with faker
                                </button>}
                                
                            </div>
        </>
    )
}

function AuthenticationForm({id}){

    const indecies = {
        0: <Login_Form/>,
        1: <SignUp_Form/>
    } 

    return (
        <div id="wholeAuthWindow">
            
            <div className="page-wrapper bg-gra-01 p-t-180 p-b-100 font-poppins">
                <div className="wrapper wrapper--w780">
                    <div className="card card-3">
                        <div className="card-heading"></div>
                        <div className="card-body">
                            <a style={{float:'right', marginRight:'35px'}} href={`../${id == 1 ? 'login' : 'register'}`}>{id == 1 ? 'Login' : 'Sign Up'} ?</a>
                            {indecies[id]}
                            <br/>
                            <SocialAuth callBack={SendBack_register}/>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthenticationForm;