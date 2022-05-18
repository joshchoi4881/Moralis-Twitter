import React, { useState, useRef } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { TextArea, Icon } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import TweetInFeed from "../components/TweetInFeed";
import ABI from "../utils/Tweets.json";
import "./Home.css";

const REACT_APP_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const Home = () => {
  const [text, setText] = useState();
  const [file, setFile] = useState();
  const [fileIPFS, setFileIPFS] = useState();
  const { Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const user = Moralis.User.current();
  const inputFile = useRef(null);

  const handleImageClick = () => {
    inputFile.current.click();
  };

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    setFile(URL.createObjectURL(img));
    setFileIPFS(img);
  };

  const handleTweetClick = async () => {
    if (!text) {
      return;
    }
    const Tweets = Moralis.Object.extend("Tweets");
    const tweet = new Tweets();
    tweet.set("username", user.attributes.username);
    tweet.set("walletAddress", user.attributes.ethAddress);
    tweet.set("pfp", user.attributes.pfp);
    tweet.set("text", text);
    if (fileIPFS) {
      const data = fileIPFS;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      tweet.set("image", file.ipfs());
    }
    await tweet.save();
    window.location.reload();
  };

  const handleMaticClick = async () => {
    if (!text) {
      return;
    }
    let image = "";
    if (fileIPFS) {
      const data = fileIPFS;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      image = file.ipfs();
    }
    let options = {
      contractAddress: REACT_APP_CONTRACT_ADDRESS,
      functionName: "addTweet",
      abi: ABI,
      params: {
        text: text,
        image: image,
      },
      msgValue: Moralis.Units.ETH(0.1),
    };
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        handleTweetClick();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <>
      <div className="pageIdentify">Home</div>
      <div className="mainContent">
        <div className="profileTweet">
          <img
            src={user.attributes.pfp ? user.attributes.pfp : defaultImgs[0]}
            className="profilePic"
          ></img>
          <div className="tweetBox">
            <TextArea
              type="text"
              name="tweetTxtArea"
              label=""
              value="gm..."
              width="95%"
              onChange={(e) => setText(e.target.value)}
            ></TextArea>
            {file && <img src={file} className="tweetImg"></img>}
            <div className="imgOrTweet">
              <div className="imgDiv" onClick={handleImageClick}>
                <input
                  ref={inputFile}
                  type="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <Icon svg="image" size={20} fill="#1DA1F2"></Icon>
              </div>
              <div className="tweetOptions">
                <div className="tweet" onClick={handleTweetClick}>
                  Tweet
                </div>
                <div
                  style={{ backgroundColor: "#8247e5" }}
                  className="tweet"
                  onClick={handleMaticClick}
                >
                  <Icon svg="matic" size={20} fill="#fff"></Icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TweetInFeed profile={false} />
      </div>
    </>
  );
};

export default Home;
