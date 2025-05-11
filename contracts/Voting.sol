// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structure to hold candidate details
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    
    // Store Candidates
    mapping(uint => Candidate) public candidates;
    
    // Candidates Count
    uint public candidatesCount;
    
    // Election status
    enum ElectionStatus { NotStarted, Started, Ended }
    ElectionStatus public status;

    // Events
    event ElectionStarted();
    event ElectionEnded();
    event VoteCast(address indexed voter, uint candidateId);

    constructor() {
        status = ElectionStatus.NotStarted;
        addCandidate("CONGRESS");
        addCandidate("BJP");
        addCandidate("JDS");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function startElection() public {
        require(status == ElectionStatus.NotStarted, "Election already started or ended");
        status = ElectionStatus.Started;
        emit ElectionStarted();
    }

    function endElection() public {
        require(status == ElectionStatus.Started, "Election not started");
        status = ElectionStatus.Ended;
        emit ElectionEnded();
    }

    function vote(uint _candidateId) public {
        require(status == ElectionStatus.Started, "Election not active");
        require(!voters[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        
        emit VoteCast(msg.sender, _candidateId);
    }

    function getResults() public view returns (string[] memory, uint[] memory) {
        string[] memory names = new string[](candidatesCount);
        uint[] memory votes = new uint[](candidatesCount);
        
        for (uint i = 1; i <= candidatesCount; i++) {
            names[i-1] = candidates[i].name;
            votes[i-1] = candidates[i].voteCount;
        }
        
        return (names, votes);
    }
}