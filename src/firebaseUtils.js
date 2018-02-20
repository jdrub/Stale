export function incrementMeetingMemberCount(options) {
    updateMeeting({ ...options, meetingOperation: incrementMemberCountOperation });
}

export function decrementMeetingMemberCount(options) {
    updateMeeting({ ...options, meetingOperation: decrementMemberCountOperation });
}

export function resetMeetingDownVotes(options) {
    updateMeeting({ ...options, meetingOperation: resetDownVotesOperation });
}

export function downVoteMeeting(options) {
    updateMeeting({ ...options, meetingOperation: downVoteMeetingOperation });
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