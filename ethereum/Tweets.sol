// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Tweets {
    uint256 private counter;
    struct tweet {
        uint256 tweetID;
        address user;
        string text;
        string image;
    }
    mapping(uint256 => tweet) tweets;
    address public owner;
    event NewTweet (
        uint256 tweetID,
        address user,
        string text,
        string image
    );

    constructor() {
        counter = 0;
        owner = msg.sender;
    }

    function getTweet(uint256 tweetID) public view returns (address, string memory, string memory) {
        require(tweetID < counter, "No such tweet");
        tweet storage t = tweets[tweetID];
        return(t.user, t.text, t.image);
    }

    function addTweet(string memory text, string memory image) public payable {
        require(msg.value == (0.1 ether), "Please submit 0.1 MATIC");
        tweet storage t = tweets[counter];
        t.tweetID = counter;
        t.user = msg.sender;
        t.text = text;
        t.image = image;
        emit NewTweet(counter, msg.sender, text, image);
        counter++;
        payable(owner).transfer(msg.value);
    }
}
