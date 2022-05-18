import React, { useState, useRef, useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { Input } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import "./Settings.css";

const Settings = () => {
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const [profileNFTs, setProfileNFTs] = useState([]);
  const [selectedPFP, setSelectedPFP] = useState();
  const [file, setFile] = useState(defaultImgs[1]);
  const [fileIPFS, setFileIPFS] = useState();
  const { isAuthenticated, account, Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const inputFile = useRef(null);

  useEffect(() => {
    const resolveLink = (url) => {
      if (!url || !url.includes("ipfs://")) {
        return url;
      }
      return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
    };
    const getNFTs = async () => {
      const options = {
        chain: "mumbai",
        address: account,
      };
      const mumbaiNFTs = await Web3Api.account.getNFTs(options);
      const images = mumbaiNFTs.result.map((e) => {
        return resolveLink(JSON.parse(e.metadata)?.image);
      });
      setProfileNFTs(images);
    };
    getNFTs();
  }, [isAuthenticated, account]);

  const handleBannerClick = () => {
    inputFile.current.click();
  };

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    setFile(URL.createObjectURL(img));
    setFileIPFS(img);
  };

  const handleSaveClick = async () => {
    const User = Moralis.Object.extend("_User");
    const query = new Moralis.Query(User);
    const myDetails = await query.first();
    if (bio) {
      myDetails.set("bio", bio);
    }
    if (username) {
      myDetails.set("username", username);
    }
    if (selectedPFP) {
      myDetails.set("pfp", selectedPFP);
    }
    if (fileIPFS) {
      const data = fileIPFS;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      myDetails.set("banner", file.ipfs());
    }
    await myDetails.save();
    window.location.reload();
  };

  return (
    <>
      <div className="pageIdentify">Settings</div>
      <div className="settingsPage">
        <Input
          name="NameChange"
          label="Name"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          name="BioChange"
          label="Bio"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="pfp">
          Profile Image (Your NFTs)
          <div className="pfpOptions">
            {profileNFTs.map((e, i) => {
              return (
                <>
                  <img
                    key={i}
                    src={e}
                    className={
                      selectedPFP === e ? "pfpOptionSelected" : "pfpOption"
                    }
                    onClick={() => {
                      setSelectedPFP(profileNFTs[i]);
                    }}
                  />
                </>
              );
            })}
          </div>
        </div>
        <div className="pfp">
          Profile Banner
          <div className="pfpOptions">
            <img src={file} className="banner" onClick={handleBannerClick} />
            <input
              ref={inputFile}
              name="file"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="save" onClick={handleSaveClick}>
          Save
        </div>
      </div>
    </>
  );
};

export default Settings;
