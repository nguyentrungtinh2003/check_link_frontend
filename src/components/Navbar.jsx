import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-primary bg-primary shadow-sm fixed-top">
      <div className="container">
        <a className="navbar-brand fw-bold fs-4 text-white" href="/">
          URL Checker
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
