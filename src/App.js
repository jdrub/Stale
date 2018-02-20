import React, { Component } from 'react';
import logo from './logo.svg';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  height: 100vh;
`;


const orange = '#ff9224';
const StyledHeader = styled.div`
  width: 100%;
  background-color: ${orange};
  color: white;
  height: 80px;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppBodyContainer = styled.div`
  flex-grow: 1;
  margin: 20px auto;
`;

const MeetingInputText = styled.div`
  font-size: 1.5em;
  color: black;
  margin: 0 auto;
`;

const StyledInput = styled.input`
  border-style: solid;
  border-width: 1px;
  height: 30px;
  border-radius: 2px;
  margin-right: 10px;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  width: 60px;
  height: 30px;
  border-style: solid;
  border-width: 1px;
  background-color: white;
  border-radius: 3px;
  display: inline-block;
  box-sizing: border-box;
  color: black;
  cursor: pointer;

  :hover {
    background-color: ${orange};
    color: white;
  }
`;

const InputContainer = styled.div`
 display: block;
`;

class App extends Component {

  state = {
    meetingCode: null,
  };

  handleSubmitClick() {
    console.log('hello');
  }

  maybeRenderMeetingInput() {
    if (!this.state.meetingCode) {
      return (
        <div>
          <InputContainer>
            <StyledInput placeholder="meeting code"/>
            <SubmitButton onClick={this.handleSubmitClick}>submit</SubmitButton>
          </InputContainer>
        </div>
      );
    }
  }
  render() {
    return (
      <AppContainer>
        <StyledHeader>That's Enough.</StyledHeader>
        <AppBodyContainer>
          {this.maybeRenderMeetingInput()}
        </AppBodyContainer>
      </AppContainer>
    );
  }
}

export default App;
