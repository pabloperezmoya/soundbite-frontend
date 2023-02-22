import React, { useEffect, useState } from "react";

import {userLogin, userRegister} from "../API/userApi";

import LoaderAnimation from "../LoaderAnimation"

import './styles.css'

function RegisterForm({
  executeCondition,
  userData, 
  setUserData, 
  setLogged,
  setWantToRegister
  // loading,
  // setLoading
}
){
  if (executeCondition == false){
    return null
  }

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);

  const [inputChecked, setInputChecked] = useState(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email !== "" && name !=="" && password !== "" && password.length >= 6){
      console.log("Have input")
      setInputChecked(true);
    }else{
      setInputChecked(false);
    }

  }, [email, password])

  const submitRegister = () => {
    console.log("ON SUBMIT REGISTER")
    // Check if passwords match
    setLoading(true)
    if (password !== passwordConfirm){
      setLoading(false)
      setError(true)
      setInfo("Passwords don't match")
      return
    }

    // Password must be at least 6 characters long
    if (password.length < 6){
      setLoading(false)
      setError(true)
      setInfo("Password must be at least 6 characters long")
      return
    }

    // Check if all fields are filled
    if (email === "" || password === "" || name === ""){
      setLoading(false)
      setError(true)
      setInfo("Please fill all the fields")
      return
    }
    
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("name", name);

    userRegister(data)
    .then(res => {
      console.log(res)
      if (res.status === 201) {
        setLogged(true)
        setWantToRegister(false)
        setUserData(res.data) // Addind user data to the state
        localStorage.setItem('user_data', JSON.stringify(res.data));
        
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      // Verify on 500 error (server error)
      // if (err.response.status >= 500){
      //   setInfo("💀 Server error 💀")
      // }
      // // Verify on 422 error (email is not valid)
      // if (err.response.status == 422){
      //   setInfo("Email is not valid")
      // }
      // // Verify on 409 error (email already registered)
      // if (err.response.status == 409){
      //   setInfo("Email is already registered")
      // }
      setLogged(false)
      setLoading(false)
      setError(true)
    })

  }

  return (
    <div className="register-form-container">
      <div className="form-title-container">
        <h2>Register</h2>
      </div>
      <div
        className={error==true? "form-info--enabled" : "form-info--disabled"}
      >
        {error && (loading==false) && <p className="error">{info}</p>}
      </div>
      <form action="">
        <div className={error && email === "" ? "form-section invalid":"form-section"}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" onChange={e=>setEmail(e.target.value)}/>
        </div>

        <div className={error && name === "" ? "form-section invalid":"form-section"}>
          <label htmlFor="name">Name</label>
          <input type="name" name="name" onChange={e=>setName(e.target.value)}/>
        </div>

        <div className={error && password === "" ? "form-section invalid":"form-section"}>
          <label htmlFor="passwd">Password</label>
          <input type="password" name="password" id="passwd" onChange={e=>setPassword(e.target.value)}/>
        </div>

        <div className={error && passwordConfirm === "" ? "form-section invalid":"form-section"}>
          <label htmlFor="passwd-verify">Confirm Password</label>
          <input type="password" name="password" id="passwd-verify" onChange={e=>setPasswordConfirm(e.target.value)}/>
        </div>

        <div className="form-section button-container">
          <button 
            className={(inputChecked==true && error==false)? "form-button active" : "form-button disabled"}
            type="button" 
            onClick={()=>submitRegister()}
            >{loading ? <LoaderAnimation/> : "Signup"}</button>
        </div>
      </form>
    </div>
  )
}

function LoginForm({
  // error, 
  // setError, 
  executeCondition,
  userData, 
  setUserData, 
  setLogged,
  // loading,
  // setLoading
}){
  
  if (executeCondition == false){
    return null
  }
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);
  const [inputChecked, setInputChecked] = useState(false)

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email !== "" && password !== "" && password.length >= 6){
      console.log("Have input")
      setInputChecked(true);
    }else{
      setInputChecked(false);
    }

  }, [email, password])

  const submitLogin = () => {
    // Check if inputs are empty
    if (email === "" || password === ""){
      setError(true)
      setInfo("You must fill all the fields")
      setInputChecked(true);
      return
    }


    console.log("HERE")

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    setLoading(true)
    console.log("HERE")
    userLogin(data)
    .then(res => {
      if (res.status === 200) {
        setLogged(true)

        setUserData(res.data) // Addind user data to the state
        localStorage.setItem('user_data', JSON.stringify(res.data));
        
        setLoading(false)
      }
    })
    .catch(err => {
      if (err.code === "ERR_NETWORK"){
        console.log("Network error")
        setInfo("Network error💀")
      }else{
        if (err.response.status >= 500){
          console.log("Server error")
          setInfo("Server error💀")
        }else{
          setInfo("Email or password is incorrect")
        }
      }
      setLogged(false)
      setError(true)
      setLoading(false)
    })
  }

  
  return (
    <div className="login-form-container">
      <div className="form-title-container">
        <h2>Sign-In</h2>
      </div>
      <div
        className={error==true? "form-info--enabled" : "form-info--disabled"}
      >
        {error && (loading==false) && <p className="error">{info}</p>}
      </div>
      
      <form className="form-container">
        <div className={error && email === "" ? "form-section invalid":"form-section"}>
          <label htmlFor="email">Email</label>
          <input type="email" value={email} name="email" id="email" onChange={(e)=>setEmail(e.target.value)}/>
        </div>

        <div className={error && password === "" ? "form-section invalid":"form-section"}>
          <label htmlFor="password">Password</label>
          <input type="password" value={password} name="password" id="password" onChange={(e)=>setPassword(e.target.value)}/>
        </div>

        <div className="form-section button-container">
          <button 
            //disabled={inputChecked? false : true} //Maybe add this later
            className={(inputChecked==true && error==false)? "form-button active" : "form-button disabled"}
            type="button"
            onClick={() => submitLogin()}
            >{loading ? <LoaderAnimation/> : "Login"}</button>
        </div>
      </form>
    </div>
  )
}

export { LoginForm, RegisterForm };