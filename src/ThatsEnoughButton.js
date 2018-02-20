import React, { Component } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { red } from './colors';
import PropTypes from 'prop-types';
import * as  firebaseUtils from './firebaseUtils.js';

const BigButton = styled.button`
    border-radius: 5px;
    font-size: 2em;
    cursor: pointer;

    background-color: ${red};
    color: white;

    height: 40vw;
    width: 90vw;
    max-width: 500px;
    max-height: 223px;
`;

const DownVoteSubmitted = styled.div`
    font-size: 2em;
    color: ${red};
    text-align: center;
    height: 40vw;
    width: 90vw;
    max-width: 500px;
    max-height: 223px;
`;

class ThatsEnoughButton extends Component {

    state = {
        canDownVote: true,
    };

    handleClick = () => {
        firebaseUtils.downVoteMeeting({
            db: firebase.database(),
            meetingId: this.props.meetingId,
            onSuccess: () => this.setState({ canDownVote: false }),
            onFailure: () => console.log('failed to downvote')
        });
    }

    render() {
        return this.state.canDownVote
            ? (<BigButton onClick={this.handleClick}>Let's Move On, Please.</BigButton>)
            : (<DownVoteSubmitted>Enough is Enough.</DownVoteSubmitted>);
    }
}

ThatsEnoughButton.propTypes = {
    meetingId: PropTypes.string.isRequired,
};

export default ThatsEnoughButton;