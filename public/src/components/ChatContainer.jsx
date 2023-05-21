import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Messages from "./Messages"
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat,currentUser }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const asyncFn = async () => {
        const response = await axios.post(recieveMessageRoute, {
          from: currentUser.userid,
          to: currentChat.userid,
        });
        setMessages(response.data);
      };
      asyncFn();
    }, [currentChat]);

    const handleSendMessage = async (msg)=>{
        await axios.post(sendMessageRoute,{
          from: currentUser.userid,
          to: currentChat.userid,
          message: msg,
        })
    };
    return (
        <>
        {currentChat &&(
            <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${currentChat.avatar}`} alt="avatar" />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
            </div>
            <div className="chat-messages">
              {messages?.map((message)=>{
                  return (
                    <div>
                      <div
                        className={`message ${
                          message.fromSelf ? "sended":"received"
                        }`} >
                          <div className="content">
                            <p>{message.message}</p>
                          </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <ChatInput handleSendMessage={handleSendMessage}/>
        </Container>)}
        </>
    );
}

const Container = styled.div`
  padding-top: 1rem;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages{
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    .message{
      display: flex;
      align-items: center;
      .content{
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      }
    }
    .sended{
      justify-content: flex-end;
    }
  }
`;
