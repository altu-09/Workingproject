document.addEventListener('DOMContentLoaded', () => {
  const voteForm = document.getElementById('voteForm');
  const voteMessage = document.getElementById('voteMessage');
  const resultsList = document.getElementById('resultsList');
  const resetBtn = document.getElementById('resetBtn');
  const startElectionBtn = document.getElementById('startElectionBtn');
  const endElectionBtn = document.getElementById('endElectionBtn');
  const adminMessage = document.getElementById('adminMessage');
  const ledger = document.getElementById('ledger');

  // LocalStorage keys
  const voteKey = 'votes';
  const electionStatusKey = 'electionStatus';
  const votedUsersKey = 'votedUsers';
  const currentUserKey = 'currentUser';

  // Initialize data
  let votes = JSON.parse(localStorage.getItem(voteKey)) || {
    CONGRESS: 0,
    BJP: 0,
    JDS: 0
  };

  let electionStatus = localStorage.getItem(electionStatusKey) || 'not_started';
  let votedUsers = JSON.parse(localStorage.getItem(votedUsersKey)) || [];
  const currentUser = JSON.parse(localStorage.getItem(currentUserKey));

  // Check if user is logged in
  if (!currentUser && voteForm) {
    voteMessage.textContent = 'Please login first to vote.';
    voteForm.style.display = 'none';
  }

  function saveVotes() {
    localStorage.setItem(voteKey, JSON.stringify(votes));
  }

  function saveVotedUsers() {
    localStorage.setItem(votedUsersKey, JSON.stringify(votedUsers));
  }

  function updateElectionStatus(status) {
    electionStatus = status;
    localStorage.setItem(electionStatusKey, status);
  }

  function updateResults() {
    if (resultsList) {
      resultsList.innerHTML = '';
      for (let [candidate, count] of Object.entries(votes)) {
        const li = document.createElement('li');
        li.textContent = `${candidate}: ${count} votes`;
        resultsList.appendChild(li);
      }
    }
  }

  function updateLedger() {
    if (ledger) {
      ledger.innerHTML = '';
      for (let [candidate, count] of Object.entries(votes)) {
        const li = document.createElement('li');
        li.textContent = `${new Date().toLocaleString()}: ${candidate} has ${count} total votes.`;
        ledger.appendChild(li);
      }
    }
  }

  if (voteForm && currentUser) {
    // Check if current user has already voted
    if (votedUsers.includes(currentUser.username)) {
      voteMessage.textContent = 'You have already voted. Each user can only vote once.';
      voteForm.style.display = 'none';
    }

    voteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (electionStatus !== 'started') {
        voteMessage.textContent = 'Election is not active. Please wait for it to start.';
        return;
      }

      // Double-check if user has already voted (in case they bypassed UI check)
      if (votedUsers.includes(currentUser.username)) {
        voteMessage.textContent = 'You have already voted. Each user can only vote once.';
        return;
      }

      const selected = voteForm.candidate.value;
      if (selected) {
        // Record the vote
        votes[selected] += 1;
        saveVotes();

        // Mark user as voted
        votedUsers.push(currentUser.username);
        saveVotedUsers();

        voteMessage.textContent = `Thank you for voting for ${selected}!`;
        voteForm.style.display = 'none'; // Hide form after voting
        updateResults();
        updateLedger();
      } else {
        voteMessage.textContent = 'Please select a candidate to vote.';
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      votes = { CONGRESS: 0, BJP: 0, JDS: 0 };
      votedUsers = [];
      saveVotes();
      saveVotedUsers();
      updateElectionStatus('not_started');
      adminMessage.textContent = 'All votes have been reset, voter records cleared, and election status set to not started.';
      updateResults();
      updateLedger();
    });
  }

  if (startElectionBtn) {
    startElectionBtn.addEventListener('click', () => {
      updateElectionStatus('started');
      adminMessage.textContent = 'Election has started.';
    });
  }

  if (endElectionBtn) {
    endElectionBtn.addEventListener('click', () => {
      updateElectionStatus('ended');
      adminMessage.textContent = 'Election has ended.';
    });
  }

  updateResults();
  updateLedger();
});