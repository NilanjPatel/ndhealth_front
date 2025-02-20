// import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import routes from "routes";
// import { useState } from "react";
// import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import logoCT from "nd_health/assets/images/logo.svg";
import "./header.css"

export default function Header(){
    /*
    return (<>
        <DefaultNavbar
        routes={routes}
        action={{
            type: "external", route: "/join", label: "Start Improving Your Practice Today", color: "info",
        }}
        sticky
        fontWeight={"bold"}
        icon={logoCT}
        />
    </>
    );*/

    // const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="navbar">
            <b className="logo-container">
                <a className="logo" href="/">
                    <img className="nd-health" alt="ND Health" src={logoCT} height="55" />
                </a>
            </b>
            {/*<div className="navigation-container">*/}
            {/*    <a href="/join">*/}
            {/*        <button className="join-button">Start Improving Your Practice Today</button>*/}
            {/*    </a>*/}
            {/*</div>*/}
            {/*<div className="navigation-container">*/}
            {/*    <a className="login-nav" href="/login">*/}
            {/*    <FontAwesomeIcon icon={faSignIn}></FontAwesomeIcon>&nbsp;*/}
            {/*        Login*/}
            {/*    </a>*/}
            {/*</div>*/}
            <div className="navigation-container">
                <button className="icon">
                    <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
                </button>
            </div>
        </div>
    );
}