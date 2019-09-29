import React from "react";
import {Avatar, Chip} from "@material-ui/core";

interface ClientIconProps {
    clientName: string,
}

const knownClientNames = [
    "artemis",
    "harmony",
    "lighthouse",
    "lodestar",
    "nimbus",
    "prysm",
    "pyspec",
    "shasper",
    "trinity",
    "yeeth",
    "zrnt",
];

export const ClientIcon: React.FunctionComponent<ClientIconProps> = ({clientName}) => (
    <img alt="#" src={"/icons/" + (knownClientNames.indexOf(clientName) < 0 ? "unknown.png" : clientName + ".png")} className="client-icon" style={{width: "100%"}}/>);
