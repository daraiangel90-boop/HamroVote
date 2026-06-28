// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Voting
 * @dev Simple voting contract for HamroVote
 */
contract Voting {
    // ========== STRUCTS ==========

    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint256 votedCandidateId;
    }

    // ========== STATE VARIABLES ==========

    address public admin;
    Candidate[] public candidates;
    mapping(address => Voter) public voters;
    bool public votingOpen;
    uint256 public totalVotes;

    // ========== EVENTS ==========

    event VoteCast(address indexed voter, uint256 candidateId);
    event VotingOpened();
    event VotingClosed();

    // ========== CONSTRUCTOR ==========

    constructor(string[] memory _names, string[] memory _parties) {
        admin = msg.sender;

        // Add candidates
        for (uint i = 0; i < _names.length; i++) {
            candidates.push(
                Candidate({
                    id: i,
                    name: _names[i],
                    party: _parties[i],
                    voteCount: 0
                })
            );
        }

        votingOpen = true;
        emit VotingOpened();
    }

    // ========== MODIFIERS ==========

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier votingIsOpen() {
        require(votingOpen, "Voting is closed");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "Already voted");
        _;
    }

    // ========== FUNCTIONS ==========

    function vote(uint256 _candidateId) external votingIsOpen hasNotVoted {
        require(_candidateId < candidates.length, "Invalid candidate");

        voters[msg.sender] = Voter({
            hasVoted: true,
            votedCandidateId: _candidateId
        });

        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoteCount(
        uint256 _candidateId
    ) external view returns (uint256) {
        require(_candidateId < candidates.length, "Invalid candidate");
        return candidates[_candidateId].voteCount;
    }

    function hasVoted(address _voter) external view returns (bool) {
        return voters[_voter].hasVoted;
    }

    function isVotingOpen() external view returns (bool) {
        return votingOpen;
    }

    function closeVoting() external onlyAdmin {
        require(votingOpen, "Already closed");
        votingOpen = false;
        emit VotingClosed();
    }

    function openVoting() external onlyAdmin {
        require(!votingOpen, "Already open");
        votingOpen = true;
        emit VotingOpened();
    }

    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }

    function getWinner() external view onlyAdmin returns (Candidate memory) {
        require(totalVotes > 0, "No votes cast");

        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }

        return candidates[winnerIndex];
    }
}
