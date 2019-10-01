import React from "react";
import {Avatar, Chip} from "@material-ui/core";
import {clientNames} from "../api";

interface ClientIconProps {
    clientName: string,
}

export const ClientIcon: React.FunctionComponent<ClientIconProps> = ({clientName}) => (
    <img alt="#" src={"/icons/" + (clientNames.indexOf(clientName) < 0 ? "unknown.png" : clientName + ".png")} className="client-icon" style={{width: "100%"}}/>);
