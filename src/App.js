import React, { Component } from 'react';
import logo from './logo.svg';
import styled from 'styled-components';
import * as firebase from 'firebase';
import JoinMeeting from './JoinMeeting';
import { orange } from './colors';
import * as firebaseUtils from './firebaseUtils';
import ThatsEnoughButton from './ThatsEnoughButton';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  height: 100vh;
`;

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

class App extends Component {

  state = {
    meetingId: null,
  };

  db = firebase.database();

  handleMeetingJoined = ({ meetingId }) => {
    this.setState({ meetingId });
  }

  renderJoinMeeting() {
    if (!this.state.meetingId) {
      return <JoinMeeting onMeetingJoined={this.handleMeetingJoined}/>
    }
  }

  renderThatsEnoughButton() {
    return <ThatsEnoughButton meetingId={this.state.meetingId} />
  }

  render() {
    return (
      <AppContainer>
        <StyledHeader>That's Enough.</StyledHeader>
        <AppBodyContainer>
          {
            this.state.meetingId
              ? this.renderThatsEnoughButton()
              : this.renderJoinMeeting()
          }
        </AppBodyContainer>
      </AppContainer>
    );
  }
}

export default App;
