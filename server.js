const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Endpoint to handle service submissions
app.post('/api/services', (req, res) => {
    const serviceData = req.body;

    // Load or create a new workbook
    let workbook;
    const filePath = './services.xlsx';

    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
    } else {
        workbook = xlsx.utils.book_new();
    }

    // Determine the sheet name based on the service type
    const sheetName = serviceData.serviceType;

    // Create a new sheet if it doesn't exist
    if (!workbook.Sheets[sheetName]) {
        workbook.Sheets[sheetName] = xlsx.utils.aoa_to_sheet([['Owner Name', 'Service Name', 'Location', 'Phone Number', 'Details', 'Features']]);
    }

    // Append the new data to the existing sheet
    const newRow = [
        serviceData.ownerName,
        serviceData.serviceName,
        serviceData.location,
        serviceData.phoneNumber,
        serviceData.details,
        serviceData.features.join(', ')
    ];

    const existingData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    existingData.push(newRow);
    workbook.Sheets[sheetName] = xlsx.utils.aoa_to_sheet(existingData);

    // Write the updated workbook to file
    xlsx.writeFile(workbook, filePath);

    res.json({ message: 'Service added successfully!' });
});

// Root route to handle the home page (GET /)
app.get('/', (req, res) => {
    res.send('Welcome to the HomeBuddy API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
