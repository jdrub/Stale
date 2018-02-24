import { getCookie, setCookie } from './cookie';
import { MEETING_ID_COOKIE } from './constants';
import { orange } from './colors';
import * as firebase from 'firebase';
import JoinMeeting from './JoinMeeting';
import React, { Component } from 'react';
import styled from 'styled-components';
import ThatsEnoughView from './ThatsEnoughView';

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

class App extends Component {

  state = {
    meetingId: null,
  };

  db = firebase.database();

  componentDidMount() {
    this.setState({ meetingId: getCookie(MEETING_ID_COOKIE) });
  }

  handleMeetingJoined = ({ meetingId }) => {
    setCookie(MEETING_ID_COOKIE, meetingId);
    this.setState({ meetingId });
  }

  renderJoinMeeting() {
    if (!this.state.meetingId) {
      return <JoinMeeting onMeetingJoined={this.handleMeetingJoined}/>
    }
  }

  renderThatsEnoughView() {
    return <ThatsEnoughView meetingId={this.state.meetingId} />
  }

  render() {
    return (
      <AppContainer>
        <StyledHeader>That's Enough.</StyledHeader>
        <AppBodyContainer>
          {
            this.state.meetingId
              ? this.renderThatsEnoughView()
              : this.renderJoinMeeting()
          }
        </AppBodyContainer>
      </AppContainer>
    );
  }
}

export default App;
