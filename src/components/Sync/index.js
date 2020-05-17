import React from "react";
import { getAvionDBCollection } from "../../utils";
import { useHistory } from "react-router-dom";
import Loader from "../../assets/loading.gif";
const multiAddr = window.location.search.split("=").pop();
const options = multiAddr === "" ? null : { multiAddr: multiAddr };

export default function Sync() {
  const history = useHistory();
  getAvionDBCollection(options, (data) => {
    console.log("-----SYNCED-----");
    history.push("/");
  });

  return (
    <div>
      <br />
      <br />
      <br />
      <div className="d-flex justify-content-center">
        <img src={Loader} width="140px" />
        <h4>Syncing...</h4>
      </div>
    </div>
  );
}
