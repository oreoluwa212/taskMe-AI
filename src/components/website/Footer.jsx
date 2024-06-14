import React from "react";

function Footer() {
  return (
    <div className="bg-secondary text-white px-[10%] mt-5 w-full py-10">
      <div className="container mx-auto flex lgss:flex-row flex-col justify-between items-start px-6">
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-semibold mb-2">TaskMe</h2>
          <p>Helping you boost your productivity level.</p>
        </div>
        <div className="flex lgss:w-[30%] w-full mt-5 justify-between">
          <div>
            <ul className="flex flex-col gap-4">
              <li>Home</li>
              <li>About</li>
              <li>Features</li>
            </ul>
          </div>
            <ul className="flex flex-col gap-4">
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
            </ul>
          <div>
            <ul className="flex flex-col gap-4">
              <li>Instagram</li>
              <li>Twitter</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-10">
        © 2024 TaskMe. All Rights Reserved.
      </div>
    </div>
  );
}

export default Footer;