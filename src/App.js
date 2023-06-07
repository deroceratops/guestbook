import "./App.css";
import { useState, useEffect, useRef } from "react";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";
import Messages from "./components/Messages";
import scid from "./scid.js";

function App() {
  const deroBridgeApiRef = useRef();
  const deroBridgeApi = deroBridgeApiRef.current;
  const [bridgeInitText, setBridgeInitText] = useState("");
  const [message, setMessage] = useState("");
  const [mascotImageLink, setMascotImageLink] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);

  useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi();
      const deroBridgeApi = deroBridgeApiRef.current;
      const [err] = await to(deroBridgeApi.init());
      if (err) {
        setBridgeInitText("Failed to connect to extension");
      } else {
        setBridgeInitText("Connected to extension");
      }
    };
    window.addEventListener("load", load);
    return () => {
      window.removeEventListener("load", load);
    };
  }, []);

  useEffect(() => {
    if (bridgeInitText === "Connected to extension") {
      GetMascotImageLink();
    }
  });

  const saveMessage = async (e) => {
    e.preventDefault();

    if (message === "") {
      return;
    }

    const [err, res] = await to(
      deroBridgeApi.wallet("start-transfer", {
        ringsize: 2,
        scid,
        sc_rpc: [
          {
            name: "entrypoint",
            datatype: "S",
            value: "AddMessage",
          },
          {
            name: "message",
            datatype: "S",
            value: message,
          },
        ],
      })
    );

    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }

    setMessage("");
  };

  const GetMessages = async () => {
    const [err, res] = await to(
      deroBridgeApi.daemon("get-sc", {
        scid,
        variables: true,
      })
    );

    if (err) {
      console.log(err);
    } else {
      const stringKeys = res.data.result.stringkeys;
      const messageCount = stringKeys.messageCount;
      const tempMessageArray = [];
      for (let i = 0; i < messageCount; i++) {
        tempMessageArray.push(hex2a(stringKeys["message_" + i]));
      }
      setMessagesToDisplay(tempMessageArray.reverse());
    }
  };

  const GetMascotImageLink = async () => {
    const [err, res] = await to(
      deroBridgeApi.daemon("get-sc", {
        scid,
        variables: true,
      })
    );

    if (err) {
      console.log(err);
    } else {
      const mascotImageLink = res.data.result.stringkeys.mascotImageLink;
      setMascotImageLink(mascotImageLink);
    }
  };

  function hex2a(hex) {
    if (!hex) {
      return;
    }
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Guestbook</h1>
        <img src={hex2a(mascotImageLink)} alt="mascot" id="mascot"></img>
        <p>{bridgeInitText}</p>
        <form>
          <input
            type="text"
            value={message}
            placeholder="Enter message"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <input type="submit" value="Save message" onClick={saveMessage} />
        </form>
        <button onClick={GetMessages}>Get messages</button>
        <Messages messages={messagesToDisplay} />
      </header>
    </div>
  );
}

export default App;
