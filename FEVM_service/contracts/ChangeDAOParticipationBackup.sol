// SPDX-License-Identifier: MIT
// Specifies the version of Solidity, using semantic versioning.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#pragma
pragma solidity ^0.8.7;


contract ChangeDAOParticipationBackup {

    uint256 counter = 0;
    mapping(uint256 => Proposal[]) participation;

    struct Proposal {
        address promoter;
        string name;
        string description;
        string uri;
    }

    function getProposalsByParticipationId(uint256 id) public view returns(Proposal[] memory) {
        return participation[id];
    }


    function backupParticipation(string memory name, string memory description, string memory uri) public {
        participation[counter++].push(
            Proposal(msg.sender, name, description, uri)
        );
    }
}