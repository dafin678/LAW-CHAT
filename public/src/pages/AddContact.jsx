import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { contactsRoute, userHost, registerRoute } from "../utils/APIRoutes";

export default function AddContact() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "" });
  const [currentUser, setCurrentUser] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    const asyncFn = async () =>{
        if (!localStorage.getItem("authToken")){
          navigate("/login");
        } else{
          const data = await axios.get(`${registerRoute}`);
          setCurrentUser(data.data);
        }
    };
    asyncFn();
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username } = values;
    if (username === "") {
      toast.error("Username is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username } = values;
      let contactUsername = null;
      let contactId = null;
      try {
        const response = await axios.get(`${userHost}/users/name/${username}`);
        contactUsername = response.data.username;
        contactId = response.data.userid;
      } catch (error) {
        toast.error(error.response.data.detail, toastOptions);
      }
      if (contactId !== null) {
        if (contactUsername == currentUser.username) {
          toast.error("Cant add yourself to contact", toastOptions);
        } else {
          try {
            const response = await axios.post(`${contactsRoute}/${currentUser.username}`, {
              "user_id": currentUser.userid,
              "contact": contactUsername,
              "contact_id": contactId
            });
            navigate("/");
          } catch (error) {
            toast.error(error.response.data.message, toastOptions);
          }
        }    
      }  
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Add Contact</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <button type="submit">Add Contact</button>
          <span>
            <Link to="/">Chat</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
