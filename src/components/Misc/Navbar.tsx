import { Navbar, Nav } from "react-bootstrap";
import Cookies from "js-cookie";

function NavigationBar() {
  // Retrieve username from cookies
  const username = Cookies.get("username");
  const admin = Cookies.get("admin");
  const displayName = username ? `Welcome ${username}` : "Welcome Guest";

  return (
    <div>
      <Navbar bg="dark" variant="dark" style={{ padding: 0 }}>
        {/* Navbar Brand */}
        <Navbar.Brand href="/" style={{ border: "1px" }}>
          <img
            src="/HoTResDB_Logo_resize.PNG" // Adjust the path as needed
            alt="HoTResDB Logo"
            style={{
              width: "200px",
              height: "80px",
              margin: "0px 0px 0px 0",
            }}
          />
        </Navbar.Brand>

        {/* Navigation Links */}
        <Nav className="mr-auto">
          <Nav.Link href="Queries">RNASeq Search</Nav.Link>
          <Nav.Link href="Nanostring">Nanostring Search</Nav.Link>
          <Nav.Link href="DataStats">Data Statistics</Nav.Link>
          <Nav.Link href="Help">FAQ</Nav.Link>
          <Nav.Link href="Contributors">Contributors</Nav.Link>
          {admin === "Yes" && <Nav.Link href="/admin">Admin Panel</Nav.Link>}
        </Nav>

        {/* Welcome message and Login/Register buttons */}
        <div className="ml-auto d-flex align-items-center">
          <a href="Login" className="button-link">
            <button type="button" id="login_button">
              Login
            </button>
          </a>
          <a href="Register" className="button-link">
            <button type="button" id="register_button">
              Register
            </button>
          </a>
          <span
            className="text-light mr-3"
            style={{
              marginLeft: "200px", // Adjust the left padding
              fontSize: "1.25rem", // Increase the font size (1.25rem is 20px)
            }}
          >
            {displayName}
          </span>
        </div>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
