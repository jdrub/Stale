export function incrementMemberCount(options) {
    updateMeeting({ ...options, meetingOperation: incrementMemberCountOperation });
}

export function decrementMemberCount(options) {
    updateMeeting({ ...options, meetingOperation: decrementMemberCountOperation });
}

export function resetDownVotes(options) {
    updateMeeting({ ...options, meetingOperation: resetDownVotesOperation });
}

export function downVote(options) {
    updateMeeting({ ...options, meetingOperation: downVoteMeetingOperation });
}

export function createMeeting({
    db,
    meetingId,
    onSuccess,
    onFailure,
}) {
    const meetingsRef = db.ref('meetings');
    meetingsRef.transaction(function(meetings) {
        if (meetings) {
            if (!meetings[meetingId]) {
                meetings[meetingId] = {
                    memberCount: 0,
                    downVotes: 0,
                };
            }
        }
        return meetings;
    }).then(onSuccess, onFailure);
}

export function listenForDownVoteAlert({
    db,
    meetingId,
    thresholdDownVotePercentage,
    onAlert,
}) {
    const meetingRef = db.ref(`meetings/${meetingId}`);
    meetingRef.on('value', (meetingSnapshot) => {
        const { downVotes, memberCount } = meetingSnapshot.val();
        if (downVotes * 100 / memberCount >= thresholdDownVotePercentage) {
            onAlert();
        }
    });
}

function incrementMemberCountOperation(meeting) {
    if (meeting) {
        meeting.memberCount = (meeting.memberCount || 0) + 1;
    }
    return meeting;
}

function decrementMemberCountOperation(meeting) {
    if (meeting) {
        meeting.memberCount = (meeting.memberCount || 1) - 1;
    }
    return meeting;
}

function resetDownVotesOperation(meeting) {
    if (meeting) {
        meeting.downVotes = 0;
    }
    return meeting;
}

function downVoteMeetingOperation(meeting) {
    if (meeting) {
        meeting.downVotes = (meeting.downVotes || 0) + 1;
    }
    return meeting;
}

function updateMeeting({
    db,
    meetingId,
    onSuccess,
    onFailure,
    meetingOperation,
}) {
    const meetingRef = db.ref('meetings/' + meetingId);
    meetingRef.transaction(meetingOperation).then(onSuccess, onFailure);
}