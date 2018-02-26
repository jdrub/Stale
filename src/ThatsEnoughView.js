import { deleteCookie } from './cookie';
import { MEETING_ID_COOKIE } from './constants';
import { salmon, orange, lightGrey } from './colors';
import * as  firebaseUtils from './firebaseUtils.js';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import PotatoChips from './images/potato_chips.svg';

const DownVoteButton = styled.img`
    width: 22vh;
    padding: 10px;
    border-style: solid;
    border-width: 5px;
    border-color: #FF8552;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 40px;

    transition: transform .5s ease-in-out;
    transform: rotate(${p => p.rotation || 180}deg);

    :hover {
        transform: rotate(${p => p.rotation || 360}deg);
    }
`;

const LeaveMeetingButton = styled.button`
    border: none;
    background-color: rgba(255,255,255,0);
    border-width: 2px;
    border-style: solid;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 17px;
    color: ${lightGrey};
    border-radius: 3px;
    margin-top: 10px;

    :hover {
        background-color: ${lightGrey};
        border-color: ${lightGrey};
        color: ${salmon};
    }
`;

const DownVoteSubmitted = styled.div`
    font-size: 2em;
    color: ${salmon};
    text-align: center;
    height: 40vw;
    width: 90vw;
    max-width: 500px;
    max-height: 223px;
    text-decoration: underline;
`;

const MoveOnText = styled.div`
    color: ${salmon};
    font-size: 3em;
    width: 100%;
    text-align: center;
`;

const MeetingText = styled.span`
    color: ${lightGrey};
`

const MeetingId = styled.div`
    font-family: Arial Black, Arial Bold, Gadget, sans-serif;
    font-size: 20px;
    color: ${salmon};
`;

const MembersText = styled.span`
    color: ${lightGrey};
`;

const MeetingMembers = styled.div`
    font-family: Arial Black, Arial Bold, Gadget, sans-serif;
    font-size: 20px;
    color: ${salmon};
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

    handleDownVoteClick = () => {
        this.setState({ canDownVote: false })
        firebaseUtils.downVote({
            db: this.db,
            meetingId: this.props.meetingId,
            onSuccess: () => {},
            onFailure: () => { this.setState({ canDownVote: true }); console.log('failed to downvote'); },
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

    renderDownVoteButton() {
        const rotation = this.state.canDownVote ? undefined : 720;
        return (
            <div>
                <DownVoteButton src={PotatoChips} onClick={this.handleDownVoteClick} rotation={rotation} />
            </div>
        );
    }

    render() {
        return(
            <div>
                <div>
                    <MeetingId>
                        <MeetingText>Meeting </MeetingText>{this.props.meetingId}
                    </MeetingId>
                    <MeetingMembers>
                        <MembersText>Members </MembersText>{this.state.memberCount}
                    </MeetingMembers>
                    <LeaveMeetingButton onClick={this.handleLeaveMeetingButtonClick}>Leave</LeaveMeetingButton>
                </div>
                {!this.state.shouldMoveOn
                    ? this.renderDownVoteButton()
                    : (<DownVoteSubmitted>Enough is Enough.</DownVoteSubmitted>)}
                {this.maybeRenderMoveOnMessage()}
            </div>
        );
    }
}

ThatsEnoughView.propTypes = {
    meetingId: PropTypes.string.isRequired,
};

export default ThatsEnoughView;