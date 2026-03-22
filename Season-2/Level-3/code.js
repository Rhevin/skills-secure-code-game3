// Welcome to Secure Code Game Season-2/Level-3!

// Follow the instructions below to get started:

// 1. test.js is passing but the code here is vulnerable
// 2. Review the code. Can you spot the bugs(s)?
// 3. Fix the code.js but ensure that test.js passes
// 4. Run hack.js and if passing then CONGRATS!
// 5. If stuck then read the hint
// 6. Compare your solution with solution.js

const express = require("express");
const bodyParser = require("body-parser");
const { DOMParser } = require("@xmldom/xmldom");
const multer = require("multer");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ type: "application/xml" }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/ufo/upload", upload.single("file"), (req, res) => {
  return res.status(501).send("Not Implemented.");
  // We don't need this feature/endpoint, it's a backdoor!
  // Removing this prevents an attacker to perform a Remote Code Execution
  // by uploading a file with a .admin extension that is then executed on the server.
  // The best code is less code. If you don't need something, don't include it.
});

app.post("/ufo", (req, res) => {
  const contentType = req.headers["content-type"];

  if (contentType === "application/json") {
    console.log("Received JSON data:", req.body);
    res.status(200).json({ ufo: "Received JSON data from an unknown planet." });
  } else if (contentType === "application/xml") {
    try {
      const parser = new DOMParser({ onError: () => {} });
      const xmlDoc = parser.parseFromString(req.body, "text/xml");

      console.log("Received XML data from XMLon:", req.body);

      const extractedContent = [];
      const root = xmlDoc.documentElement;

      for (let i = 0; i < root.childNodes.length; i++) {
        const node = root.childNodes[i];
        if (node.nodeType === 1) {
          extractedContent.push(node.textContent);
        }
      }

      res
        .status(200)
        .set("Content-Type", "text/plain")
        .send(extractedContent.join(" "));
    } catch (error) {
      console.error("XML parsing or validation error");
      res.status(400).send("Invalid XML");
    }
  } else {
    res.status(405).send("Unsupported content type");
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;