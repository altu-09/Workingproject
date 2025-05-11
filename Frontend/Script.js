document.addEventListener('DOMContentLoaded', () => {
  const voteForm = document.getElementById('voteForm');
  const voteMessage = document.getElementById('voteMessage');
  const resultsList = document.getElementById('resultsList');
  const resetBtn = document.getElementById('resetBtn');
  const startElectionBtn = document.getElementById('startElectionBtn');
  const endElectionBtn = document.getElementById('endElectionBtn');
  const adminMessage = document.getElementById('adminMessage');
  const ledger = document.getElementById('ledger');

  const voteKey = 'votes';
  const electionStatusKey = 'electionStatus';

  let votes = JSON.parse(localStorage.getItem(voteKey)) || {
    CONGRESS: 0,
    BJP: 0,
    JDS: 0
  };

  let electionStatus = localStorage.getItem(electionStatusKey) || 'not_started';

  function saveVotes() {
    localStorage.setItem(voteKey, JSON.stringify(votes));
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

  if (voteForm) {
    voteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (electionStatus !== 'started') {
        voteMessage.textContent = 'Election is not active. Please wait for it to start.';
        return;
      }
      const selected = voteForm.candidate.value;
      if (selected) {
        votes[selected] += 1;
        saveVotes();
        voteMessage.textContent = `Thank you for voting for ${onlyone}!`;
        voteForm.reset();
      } else {
        voteMessage.textContent = 'Please select a candidate to vote.';
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      votes = { CONGRESS: 0, BJP: 0, JDS: 0 };
      saveVotes();
      updateElectionStatus('not_started');
      adminMessage.textContent = 'All votes have been reset and election status set to not started.';
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
