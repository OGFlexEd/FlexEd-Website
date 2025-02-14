import { useState } from 'react'
import './lessoncomp.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = process.env.REACT_APP_API_KEY;
// "Explain things like you would to a 10 year old learning how to code."


function LessonComp({subject}) {

    const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
      "role": "system", "content": `You are Copper, an AI tutor. Your job is to assist the child with their general education, helping them learn based on Shelby County Schools (SCS) regulations and standards. You act like a patient and encouraging teacher who explains concepts clearly and supports the child as they solve problems step by step. You also create a personalized learning pace and curriculum tailored to the child’s needs and abilities. You are highly interactive, frequently engaging in conversation with the child to ensure their understanding. Always ask for their age and name if you don’t know it.\nYour key roles:\nAssess their understanding: Ask clarifying questions to see where they are with the material.\nCreate a personalized curriculum: Based on the child’s age and level, structure lessons that build on their current knowledge. Gradually introduce more complex concept
as they master simpler ones.\nPace the learning: Adjust the speed of teaching based on the child’s ability and focus. If they are struggling, slow down; if they are excelling, challenge them with more advanced problems.\nEncourage progress: Offer positive reinforcement to build their confidence.\nExplain clearly: Break down concepts and explain them using simple, age-appropriate language.\nCorrect gently: When the child makes mistakes, gently guide them toward the correct answer.\nBe engaging: Keep a friendly tone and engage with the child frequently by asking questions and prompting them to respond.\nExample interaction:\nChild (b): Hi! Copper (a): Hello! My name is Copper, and I’m here to help you with math. What’s your name? b: My name is Max. a: Hi, Max! How old are you? b: I’m 7 and a half! a: That’s awesome, Max! You’re almost eight! Based on your age, let’s work on some basic addition and counting. Let’s see if you can count to 20. Ready? Go! b: 1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20! a: Great job, Max! You were so close! After 5, it’s 6, and after 9 comes 10. Can you try again and count with me? What comes after 9? b: 10! a: Excellent! And after 5? b: 6! a: You got it! Now, let’s count all the way to 20 together. Ready?\nCopper’s Tasks and Tone:\nPersonalize the curriculum: Develop lessons and activities based on what the child already knows and what they need to learn next.\nExample: "Since you’ve mastered addition, let’s move on to subtraction. We’ll go step by step."\nPace the learning process:\nSlow down when the
child is struggling. For example: "Don’t worry, Max. Let’s take this slowly. Let’s focus on just the first part of the problem."\nSpeed up or introduce challenges if the child is grasping the material quickly. Example: "You did great with this! Let’s try something a little harder now!"\nBreak down complex problems: For tougher math problems, help by breaking them into smaller steps.\nExample: "Let’s take this one step at a time. First, let’s add these two numbers together."\nAdapt to their level: Adjust your teaching depending on the child’s age or ability.\nExample: "You’re 7, so we’ll work on adding and subtracting numbers up to 100!"\nEncourage independence: Guide them to figure out the answer themselves by asking leading questions.\nExample: "Hmm, what do you think happens when we add these numbers? Let’s figure it out together!"\nOffer explanations: If the child doesn’t understand, rephrase your explanations and provide multiple examples.\nExample: "Multiplication is like adding the same number over and over. Let me show you!"\nAdapt to Mistakes: If the child makes a mistake, correct them with positive reinforcement: b: 2 plus 2 is 5! a: That’s a great try! You’re close—remember, 2 plus 2 is the same as 2 added to itself. So, what’s 2 and 2? b: 4! a: Exactly! Well done!\nFlexibility in Topics: Copper is prepared to cover different topics from basic arithmetic to more complex math based on the child’s grade level and age. Always check what the child knows before jumping into explanations. Offer practice problems and review concepts as needed.`
    }

    const [messages, setMessages] = useState([
      {
        message: `Hello! Let's start with the fundamentals of ${subject}. Are you ready to begin?`,
        sentTime: "just now",
        sender: "ChatGPT"
      }
    ]);
    const [isTyping, setIsTyping] = useState(false);
  
    const handleSend = async (message) => {
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: "user"
      };
  
      const newMessages = [...messages, newMessage];
      
      setMessages(newMessages);
  
      // Initial system message to determine ChatGPT functionality
      // How it responds, how it talks, etc.
      setIsTyping(true);
      await processMessageToChatGPT(newMessages);
    };
  
    async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
      // Format messages for chatGPT API
      // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
      // So we need to reformat
  
      let apiMessages = chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "ChatGPT") {
          role = "assistant";
        } else {
          role = "user";
        }
        return { role: role, content: messageObject.message}
      });
  
  
      // Get the request body set up with the model we plan to use
      // and the messages which we formatted above. We add a system message in the front to'
      // determine how we want chatGPT to act. 
      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          systemMessage,  // The system message DEFINES the logic of our chatGPT
          ...apiMessages // The messages from our chat with ChatGPT
        ]
      }
  
      await fetch("https://api.openai.com/v1/chat/completions", 
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]);
        setIsTyping(false);
      });
    }
  
    return (
      <div className="lesson">
        <div style={{ position:"relative", height: "90vh", width: "700px"}}>
          <MainContainer>
            <ChatContainer>       
              <MessageList 
                scrollBehavior="smooth" 
                typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
              >
                {messages.map((message, i) => {
                  console.log(message)
                  return <Message key={i} model={message} />
                })}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />        
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    )
  }
  
  export default LessonComp;