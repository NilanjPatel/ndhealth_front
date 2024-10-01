import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import logoCT from "nd_health/assets/images/ND(1).png";

export default function Header(){
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
    );
}