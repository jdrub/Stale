import React, { Component } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { orange } from './colors';
import PropTypes from 'prop-types';
import * as  firebaseUtils from './firebaseUtils.js';

const InputContainer = styled.div`
 display: block;
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

class JoinMeeting extends Component {

    state = {
        meetingId: null,
    };

    handlemeetingIdChange = (e) => {
        this.setState({ meetingId: e.target.value });
    }

    handleSubmitClick = () => {
        firebaseUtils.incrementMeetingMemberCount({
            db: firebase.database(),
            meetingId: this.state.meetingId,
            onSuccess: () => this.props.onMeetingJoined({ meetingId: this.state.meetingId }),
            onFailure: () => console.log('failure'),
        });
    }

    render() {
        return (
            <div>
                <InputContainer>
                    <StyledInput onChange={this.handlemeetingIdChange} placeholder="meeting code"/>
                    <SubmitButton onClick={this.handleSubmitClick}>submit</SubmitButton>
                </InputContainer>
            </div>
        );
    }
}

JoinMeeting.propTypes = {
    onMeetingJoined: PropTypes.func.isRequired,
};

export default JoinMeeting;