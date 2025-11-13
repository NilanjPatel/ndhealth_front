import Header from "pages/Components/header";
import MKBox from "components/MKBox"
import DefaultFooter from "examples/Footers/DefaultFooter";
import footerRoutes from "footer.routes";import "./error.css";

function Error() {
    return (<>
        <Header />
        <p className="error-information">The requested page can't be found.</p>
        <MKBox pt={7} px={1} mt={6}>
            <DefaultFooter content={footerRoutes} />
        </MKBox>
        </>
    )
}

export default Error;