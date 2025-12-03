const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// HOME PAGE – LIST NOTES
app.get("/", (req, res) => {
  fs.readdir("./notes/", (err, files) => {

    res.render("index", { notes: files });
  });
});

// CREATE NOTE
app.post("/create", (req, res) => {
  const { title, description } = req.body;

  let fileName = title.trim().split(" ").join("_") + ".txt";

  fs.writeFile(`./notes/${fileName}`, description, (err) => {
    
    return res.redirect("/");
  });
});

// READ NOTE PAGE
app.get("/first/:fileName", (req, res) => {
  const { fileName } = req.params;
  const title = fileName.replace(".txt", "").split("_").join(" ");

  fs.readFile(`./notes/${fileName}`, "utf-8", (err, data) => {
   

    res.render("first", {
      data: {
        title: title,
        description: data,
        fileName: fileName
      },
    });
  });
});

// EDIT PAGE
app.get("/edit/:fileName", (req, res) => {
  const { fileName } = req.params;
  const title = fileName.replace(".txt", "").split("_").join(" ");

  fs.readFile(`./notes/${fileName}`, "utf-8", (err, data) => {
    

    res.render("edit", {
      data: {
        fileName: fileName,
        title: title,
        description: data,
      },
    });
  });
});

// UPDATE NOTE (Title + Description)
app.post("/update/:fileName", (req, res) => {
  const oldFileName = req.params.fileName;
  const { title, description } = req.body;

  // new filename (if title changed)
  const newFileName = title.trim().split(" ").join("_") + ".txt";

  // update description first
  fs.writeFile(`./notes/${oldFileName}`, description, (err) => {
    

    // if title changed → rename file
    if (oldFileName !== newFileName) {
      fs.rename(`./notes/${oldFileName}`, `./notes/${newFileName}`, (err) => {
        
        return res.redirect(`/first/${newFileName}`);
      });
    } else {
      return res.redirect(`/first/${oldFileName}`);
    }
  });
});

// DELETE NOTE
app.get("/delete/:fileName", (req, res) => {
  const { fileName } = req.params;

  fs.unlink(`./notes/${fileName}`, (err) => {
   
    return res.redirect("/");
  });
});

// START SERVER
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
