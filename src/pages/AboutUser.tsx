import { JSX } from "react";
import UserData from "../components/UserData";

export default function AboutUser(): JSX.Element {

  return (
    <div>
      <div style={{ paddingTop: "150px" }}> 
        <UserData  />
      </div>
    </div>
  );
};
