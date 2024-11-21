const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

app.post("/v1/write-sheet", async (req, res) => {
  const { name, lastName, phonenumber, birthday } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1dJ3dEhx3SDTsmfwpE7eVUE52zVJ0b1rDPWFH2KI5VoY";
  
  // Write row(s) to spreadsheet
  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "recopilacion!A:D",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [ name, lastName, phonenumber, birthday ],
      ],
    },
  }, (err, info) => {
    if (err) {
      res.status(500).json({ ok: false, msg: err.toString() });
    } else {
      res.status(200).json({ ok: true, msg: "Se escribio correctamente" });
    }
  });
});

app.listen(1337, () => console.log("running on 1337"));
