const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8080; 
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "data.json");


app.get("/data", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});


app.get('/data/:id', (req, res) => {
  const id = req.params.id; 
  
  try {
    const data = fs.readFileSync(filePath, 'utf8'); 
    const jsonData = JSON.parse(data);
    const item = jsonData.find(item => item._id === id); 

    if (item) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(item));
    } else {
      res.status(404).send('Item not found');
    }
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.post("/data", (req, res) => {
  const newData = req.body; 
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
      return;
    }

    const jsonData = JSON.parse(data);
    jsonData.push(newData);

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
      }

      res.status(201).json({ status: 201, message: "Data added successfully" });
    });
  });
});

app.put("/data/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const index = jsonData.findIndex((item) => item._id == id);

      if (index !== -1) {
        
        if (jsonData[index].status === "Think") {
          jsonData[index].status = "pending";
        } else if (jsonData[index].status === "pending") {
          jsonData[index].status = "Done";
        }

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error("Error writing file:", err);
            res.status(500).json({status_code:500, message: "Internal Server Error" });
            return;
          }

          res.status(200).json({status_code:200, message: "Status updated successfully" });
        });
      } else {
        res.status(404).json({status_code:404, message: "Item not found" });
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.status(500).json({status_code:500, message: "Internal Server Error" });
    }
  });
});


app.delete("/data/:id", (req, res) => {
  const id = req.params.id;
  console.log(req)
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);
    const index = jsonData.findIndex((item) => item._id == id);

    if (index !== -1) {
      jsonData.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error("Error writing file:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.status(200).send("Data deleted successfully");
      });
    } else {
      res.status(404).send("Item not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
