import './globalStyles.css';
import { getCookie, setCookie } from './cookie';
import { MEETING_ID_COOKIE } from './constants';
import { mint, orange } from './colors';
import * as firebase from 'firebase';
import JoinMeeting from './JoinMeeting';
import React, { Component } from 'react';
import styled from 'styled-components';
import ThatsEnoughView from './ThatsEnoughView';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-flow: column;
  height: 100vh;
`;

const StaleHeader = styled.div`
  font-family: Arial Black, Arial Bold, Gadget, sans-serif;
  color: ${mint};
  font-size: 80px;
  margin-top: 9%;
  margin-left: 9%;
  text-shadow: -1px 0 ${mint}, 0 1px ${mint}, 1px 0 ${mint}, 0 -1px ${mint};
`;

const AppBodyContainer = styled.div`
  flex-grow: 1;
  margin-left: 9%;
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
        <StaleHeader>Stale</StaleHeader>
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
