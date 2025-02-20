import Header from "pages/Components/header";
import MKBox from "components/MKBox"
import CenteredFooter from "examples/Footers/CenteredFooter";
import footerRoutes from "footer.routes";import "./error.css";

function Error() {
    return (<>
        <Header />
        <p className="error-information">The requested page can't be found.</p>
        <MKBox pt={7} px={1} mt={6}>
            <CenteredFooter content={footerRoutes} />
        </MKBox>
        </>
    )
}

export default Error;