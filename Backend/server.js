const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables
const stripe = require('stripe')(process.env.STRIPE);
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const { Readable } = require('stream');

const app = express();
const PORT = 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
});

// Set up multer for file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Define a route to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const fileStream = Readable.from(req.file.buffer);

  const params = {
    Bucket: 'alltruckrecycling',
    Key: req.file.originalname,
    Body: fileStream,
    ContentType: req.file.mimetype, // Ensure the correct content type is set
    ACL: 'public-read'
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params: params,
    });

    await upload.done();
    console.log('File uploaded successfully');
    res.status(200).send('File uploaded');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to upload file');
  }
});


// Define Schema and Model for items
const itemSchema = new mongoose.Schema({
  name: String,
  partNumber: String,
  carYear: Number,
  carModel: String,
  carMake: String,
  description: String,
  price: Number,
  imageUrl: String,
});

const Item = mongoose.model("Item", itemSchema);

// Define Schema and Model for car search
const carSearchSchema = new mongoose.Schema({
  make: String,
  models: Array,
});

const CarSearch = mongoose.model("CarSearch", carSearchSchema);

// Define Schema and Model for user
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {type: Boolean, default:false}
});

const User = mongoose.model('User', userSchema);

// Define Schema and Model for solditems
const soldSchema = new mongoose.Schema({
  itemsArray: {type: Array, required: true},
  address: {type: String, required: true},
  email: { type: String, required: true },
  shipped: {type:Boolean, default:false}
});

const Sold = mongoose.model('Sold', soldSchema);


// API Routes for items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findOne({ _id: id });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/items", async (req, res) => {
  const { name, carYear, carModel, partNumber, carMake, description, price, imageUrl } = req.body;
  try {
    const newItem = await Item.create({
      name,
      partNumber,
      carYear: parseInt(carYear),
      carModel,
      carMake,
      description,
      price: parseFloat(price),
      imageUrl
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, carYear, carModel, partNumber, carMake, description, price, imageUrl } = req.body;
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: id },
      { name, carYear, carModel, partNumber, carMake, description, price, imageUrl },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findOneAndDelete({ _id: req.params.id });
    res.json('Part deleted.');
  } catch (error) {
    console.error(error);
    res.status(400).json('Error: ' + error);
  }
});

// API Routes for car search
app.get("/api/carsearch", async (req, res) => {
  try {
    const cars = await CarSearch.find();
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// API Route to get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
app.post("/api/users", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document and save it to the database
    const newUser = await User.create({
      email,
      password: hashedPassword
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Compare the password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if(user.isAdmin){
      const token = jwt.sign(
        {
          email: user.email
        },
        process.env.JWT_SECRET
      )
      return res.json({status: 'ok', user: token});
    }
    return res.json({status: 'ok'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// API Route to add a new make
app.post("/api/carsearch/makes", async (req, res) => {
  const { make, models } = req.body;
  try {
    // Check if the make already exists
    const existingMake = await CarSearch.findOne({ make });
    if (existingMake) {
      return res.status(400).json({ error: "Make already exists" });
    }

    // Create a new make
    const newMake = new CarSearch({ make, models });
    await newMake.save();
    res.status(201).json(newMake);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



// API Route to delete a make
app.delete("/api/carsearch/:makes", async (req, res) => {
  const { make } = req.params;
  try {
    const deletedMake = await CarSearch.findOneAndDelete({ make });
    if (!deletedMake) {
      return res.status(404).json({ error: "Make not found" });
    }
    res.status(200).json({ message: `Make "${make}" deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/api/authenticate', (req, res) => {
  const { token } = req.body;

  try {
    // Decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // If decoding is successful, token is valid
    res.json({ success: true, message: 'Authentication successful', decodedToken });
  } catch (error) {
    // If decoding fails, token is invalid
    res.status(401).json({ success: false, message: 'Authentication failed', error: error.message });
  }
});

// API Route to add a new model to an existing make
app.post("/api/carsearch/:make/models", async (req, res) => {
  const { make } = req.params;
  const { model } = req.body;
  try {
    // Find the document corresponding to the specified make
    const carSearch = await CarSearch.findOne({ make });
    if (!carSearch) {
      return res.status(404).json({ error: "Make not found" });
    }
    
    // Add the new model to the models array
    carSearch.models.push(model);
    
    // Save the updated document back to the database
    await carSearch.save();
    
    res.status(201).json(carSearch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// API Route to delete a model from an existing make
app.delete("/api/carsearch/:make/models/:model", async (req, res) => {
  const { make, model } = req.params;
  try {
    // Find the document corresponding to the specified make
    const carSearch = await CarSearch.findOne({ make });
    if (!carSearch) {
      return res.status(404).json({ error: "Make not found" });
    }

    // Remove the model from the models array
    carSearch.models = carSearch.models.filter(m => m !== model);

    // Save the updated document back to the database
    await carSearch.save();

    res.status(200).json({ message: `Model "${model}" deleted successfully from ${make}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.use(express.static(path.join(__dirname, 'client/build')));

// API endpoints
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { products } = req.body;

    // Prepare the line items for the checkout session
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${product.carYear} ${product.carMake} ${product.carModel} ${product.name}`,
          description: product.description,
          // Add more details here as required by your product data
        },
        unit_amount: Math.round(product.price * 100), // Convert price to cents
      },
      quantity: 1, // Assuming each item has quantity 1
    }));

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://alltruckrecycling.onrender.com/?success=true', // Redirect URL after successful payment
      cancel_url: 'https://alltruckrecycling.onrender.com/?canceled=true', // Redirect URL if payment is canceled
    });

    res.json({ id: session.id }); // Return the session ID to the client
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


app.post('/api/solditems', async (req, res) => {
  try {
    const { itemsArray, address, email } = req.body;

    // Create a new sold item document
    const soldItem = new Sold({
      itemsArray,
      address,
      email
    });

    // Save the document to the database
    await soldItem.save();

    res.status(201).json({ message: 'Sold items saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving sold items' });
  }
});
// Define route to fetch all sales
app.get('/api/sold', async (req, res) => {
  try {
    const sales = await Sold.find(); // Retrieve all sales from the database
    res.json(sales); // Send the sales data as JSON response
  } catch (error) {
    console.error('Error fetching sales: er', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/api/sold/:id', async (req, res) => {
  const saleId = req.params.id;
  const { shipped } = req.body;

  try {
    const updatedSale = await Sold.findByIdAndUpdate(saleId, { shipped }, { new: true });
    if (!updatedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    return res.status(200).json(updatedSale);
  } catch (error) {
    console.error('Error updating sale:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/checkParts', async (req, res) => {
  const { cartItems } = req.body;

  try {
    const availableParts = await Item.find({ _id: { $in: cartItems.map(item => item._id) } });
    
    res.json({ availableParts });
  } catch (error) {
    console.error('Error checking parts availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
