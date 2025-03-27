import { JSX } from "react";
import Map from "../components/Map";
import '../styles.css';

export default function MapPage(): JSX.Element {
    return (
        <main>
            <div style={{ paddingTop: "150px" }}> 
                <Map/>
            </div>
        </main>
    );
  }
  