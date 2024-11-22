const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET Endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// POST Endpoint
app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid 'data' format. It should be an array.",
      });
    }

    // Filter numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => /^[a-zA-Z]+$/.test(item));

    // Find the highest lowercase alphabet
    const lowerCaseAlphabets = alphabets.filter((item) => /^[a-z]$/.test(item));
    const highestLowercaseAlphabet = lowerCaseAlphabets.length
      ? [lowerCaseAlphabets.sort().reverse()[0]]
      : [];

    // Check if there are any prime numbers
    const isPrime = (num) => {
      if (num < 2) return false;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
      }
      return true;
    };

    const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

    // File handling
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = null;

    if (file_b64) {
      try {
        const fileBuffer = Buffer.from(file_b64, "base64");
        fileSizeKb = (fileBuffer.length / 1024).toFixed(2); // Convert size to KB
        fileMimeType = "application/octet-stream"; // Default MIME type
        fileValid = true;
      } catch {
        fileValid = false;
      }
    }

    // User information (Replace with your logic)
    const userId = "john_doe_17091999"; // Example
    const email = "john@xyz.com";
    const rollNumber = "ABCD123";

    // Response
    res.status(200).json({
      is_success: true,
      user_id: userId,
      email: email,
      roll_number: rollNumber,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      is_prime_found: isPrimeFound,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb,
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      message: "Server Error",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
