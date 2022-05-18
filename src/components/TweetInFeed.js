import React, { useState, useRef, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Icon } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import "./TweetInFeed.css";

const TweetInFeed = ({ profile }) => {
  const [tweets, setTweets] = useState();
  const { account, Moralis } = useMoralis();

  useEffect(() => {
    const getTweets = async () => {
      try {
        const Tweets = Moralis.Object.extend("Tweets");
        const query = new Moralis.Query(Tweets);
        if (profile) {
          query.equalTo("walletAddress", account);
        }
        const results = await query.find();
        setTweets(results);
      } catch (error) {
        console.error(error);
      }
    };
    getTweets();
  }, [profile]);

  return (
    <>
      {tweets
        ?.map((e) => {
          return (
            <>
              <div className="feedTweet">
                <img
                  src={e.attributes.pfp ? e.attributes.pfp : defaultImgs[0]}
                  className="profilePic"
                ></img>
                <div className="completeTweet">
                  <div className="who">
                    {e.attributes.username.slice(0, 6)}
                    <div className="accWhen">
                      {`${e.attributes.walletAddress.slice(
                        0,
                        4
                      )}...${e.attributes.walletAddress.slice(
                        38
                      )} * ${e.attributes.createdAt.toLocaleString("en-us", {
                        month: "short",
                      })} ${e.attributes.createdAt.toLocaleString("en-us", {
                        day: "numeric",
                      })}`}
                    </div>
                  </div>
                  <div className="tweetContent">
                    {e.attributes.text}
                    {e.attributes.image && (
                      <img src={e.attributes.image} className="tweetImg"></img>
                    )}
                  </div>
                  <div className="interactions">
                    <div className="interactionNums">
                      <Icon svg="messageCircle" size={20} fill="#3f3f3f" />
                    </div>
                    <div className="interactionNums">
                      <Icon svg="star" size={20} fill="#3f3f3f" />
                    </div>
                    <div className="interactionNums">
                      <Icon svg="matic" size={20} fill="#3f3f3f" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })
        .reverse()}
    </>
  );
};

export default TweetInFeed;
