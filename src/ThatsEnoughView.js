import { deleteCookie } from './cookie';
import { MEETING_ID_COOKIE } from './constants';
import { red } from './colors';
import * as  firebaseUtils from './firebaseUtils.js';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

const DownVoteButton = styled.button`
    border-radius: 5px;
    font-size: 2em;
    cursor: pointer;

    background-color: ${red};
    color: white;

    height: 40vw;
    width: 90vw;
    max-width: 500px;
    max-height: 223px;

    :hover {
        background-color: white;
        color: ${red};
    }
`;

const LeaveMeetingButton = styled.button`
    border-radius: 5px;
    font-size: 2em;
    cursor: pointer;

    background-color: ${red};
    color: white;

    height: 40vw;
    width: 90vw;
    max-width: 500px;
    max-height: 223px;
    margin: 10px;

    :hover {
        background-color: white;
        color: ${red};
    }
`;

const DownVoteSubmitted = styled.div`
    font-size: 2em;
    color: ${red};
    text-align: center;
    height: 40vw;
    width: 90vw;
    max-width: 500px;
    max-height: 223px;
    text-decoration: underline;
`;

const MoveOnText = styled.div`
    color: ${red};
    font-size: 3em;
    width: 100%;
    text-align: center;
`;

const canVibrate = () => "vibrate" in navigator || "mozVibrate" in navigator;

class ThatsEnoughView extends Component {

    state = {
        canDownVote: true,
        shouldMoveOn: false,
        memberCount: 1,
    };

    db = firebase.database();

    componentDidMount() {
        if (canVibrate() && !("vibrate" in navigator)) {
            navigator.vibrate = navigator.mozVibrate;
        }

        firebaseUtils.listenForDownVoteAlert({
            db: this.db,
            meetingId: this.props.meetingId,
            thresholdDownVotePercentage: 50,
            onAlert: this.handleDownVoteAlert,
        });

        firebaseUtils.listenForMemberCount({
            db: this.db,
            meetingId: this.props.meetingId,
            onMemberCountUpdated: (memberCount) => this.setState({ memberCount }),
        });
    }

    handleDownVoteAlert = () => {
        this.setState({ shouldMoveOn: true });

        if (canVibrate()) {
            navigator.vibrate([1000, 500, 1000]);
        }
        
        setTimeout(() => firebaseUtils.resetDownVotes({
            db: this.db,
            meetingId: this.props.meetingId,
            onSuccess: () => this.setState({ canDownVote: true, shouldMoveOn: false }),
            onFailure: () => console.log('failed to reset downvotes'),
        }), 5000);
    }

    handleClick = () => {
        firebaseUtils.downVote({
            db: this.db,
            meetingId: this.props.meetingId,
            onSuccess: () => this.setState({ canDownVote: false }),
            onFailure: () => console.log('failed to downvote')
        });
    }

    handleLeaveMeetingButtonClick = () => {
        const onMemberDecrementSuccess = () => {
            deleteCookie(MEETING_ID_COOKIE);
            window.location.reload(false);
        };

        firebaseUtils.decrementMemberCount({
            db: this.db,
            meetingId: this.props.meetingId,
            onSuccess: onMemberDecrementSuccess,
            onFailure: () => console.log('failed to decrement member count'),
        })
    }

    maybeRenderMoveOnMessage() {
        if (this.state.shouldMoveOn) {
            return <MoveOnText>The meeting has voted to move on</MoveOnText>
        }
    }

    render() {
        return(
            <div>
                {this.state.canDownVote && !this.state.shouldMoveOn
                    ? (<DownVoteButton onClick={this.handleClick}>Let's Move On, Please.</DownVoteButton>)
                    : (<DownVoteSubmitted>Enough is Enough.</DownVoteSubmitted>)}
                {this.maybeRenderMoveOnMessage()}
                <LeaveMeetingButton onClick={this.handleLeaveMeetingButtonClick}>Leave Meeting</LeaveMeetingButton>
                <div>members: {this.state.memberCount}</div>
            </div>
        );
    }
}

ThatsEnoughView.propTypes = {
    meetingId: PropTypes.string.isRequired,
};

export default ThatsEnoughView;