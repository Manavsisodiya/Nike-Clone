const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const nodemailer = require("nodemailer");
const User = require("./models/User"); 
const Razorpay = require("razorpay");
const crypto = require("crypto");


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); 

mongoose.connect("mongodb://localhost:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});





app.get("/dashboard/summary", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("Orders");

    
    const orders = await ordersCollection.find().toArray();

    
    const totalRevenue = orders
      .map(order => {
        if (!order.totalAmount) return 0; // Handle missing values

        // Remove currency symbol & commas, then parse as float
        const cleanedAmount = order.totalAmount.replace(/[₹,]/g, "").trim();
        const amount = parseFloat(cleanedAmount);

        console.log(`Order ID: ${order._id}, Raw: ${order.totalAmount}, Cleaned: ${cleanedAmount}, Parsed: ${amount}`); // Debugging

        return isNaN(amount) ? 0 : amount;
      })
      .reduce((sum, amount) => sum + amount, 0);

    const totalOrders = orders.length;

    res.json({ totalRevenue, totalOrders });
  } catch (err) {
    console.error("Error in /dashboard/summary:", err);
    res.status(500).json({ error: "Failed to retrieve summary", details: err.message });
  }
});




app.get("/dashboard/monthly-revenue", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("Orders");

    const pipeline = [
      {
        $project: {
          month: { $month: "$orderDate" }, // Extract month from orderDate
          totalAmount: {
            $toDouble: {
              $replaceAll: { input: { $replaceAll: { input: "$totalAmount", find: "₹", replacement: "" } }, find: ",", replacement: "" }
            }
          }
        }
      },
      {
        $group: {
          _id: "$month",
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const revenueData = await ordersCollection.aggregate(pipeline).toArray();

    const formattedData = revenueData.map(entry => ({
      name: new Date(0, entry._id - 1).toLocaleString("default", { month: "short" }),
      revenue: entry.revenue
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Error in /dashboard/monthly-revenue:", err);
    res.status(500).json({ error: "Failed to fetch monthly revenue", details: err.message });
  }
});




app.get("/dashboard/top-sales", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("Orders");

    const orderData = await ordersCollection.find().toArray();
    let productSales = {};

    orderData.forEach((order) => {
      order.products.forEach((product) => {
        if (!productSales[product.name]) productSales[product.name] = 0;
        productSales[product.name] += product.quantity;
      });
    });

    const sortedSales = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json(sortedSales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get("/dashboard/recent-orders", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("Orders");

    // Retrieve the 5 most recent orders
    const orderData = await ordersCollection.find().sort({ orderDate: -1 }).limit(5).toArray();

    res.json(orderData);
  } catch (err) {
    console.error("Error fetching recent orders:", err);
    res.status(500).json({ error: "Failed to retrieve recent orders", details: err.message });
  }
});
app.post("/orders", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("Orders");

    // If orderDate is not provided, set it to now
    const orderData = {
      ...req.body,
      orderDate: req.body.orderDate ? new Date(req.body.orderDate) : new Date()
    };

    const result = await ordersCollection.insertOne(orderData);
    res.status(201).json({ message: "Order placed successfully!", orderId: result.insertedId });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to place order", details: err.message });
  }
});

  
  app.get("/orders", async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const ordersCollection = db.collection("Orders");
  
      const orders = await ordersCollection.find().toArray();
  
      res.json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to retrieve orders", details: err.message });
    }
  });
  



//Razorpay code starts
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Create an order //Payment code
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount*100, // Razorpay expects the amount in paisa (e.g., 1000 paisa = ₹10)
      currency: "INR",
      receipt: "order_rcptid_" + Math.random(),
      payment_capture: 1, // Automatically capture payment
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);
    
    // Log the order object to see what is returned
    console.log("Order Created: ", order);

    res.json(order); // Send order details to frontend
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
});



// Verify payment

app.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create the expected signature using Razorpay's secret key
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Log both expected and received signatures for debugging
    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      // Signature matches, payment is valid
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      // Signature mismatch, payment failed
      res.status(400).json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Error verifying payment" });
  }
});




let otpStore = {}; // Temporary storage for OTPs

// Configure email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your app password (not your email password)
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP API
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: true, existingUser: true, message: 'User exists,Please Enter Your Password' })
    }
    else {
      const otp = generateOTP();
      const expiresAt = Date.now() + 5 * 60 * 1000; //expires after 5 minutes 
      otpStore[email] = { otp, expiresAt }; // Store OTP temporarily

      const mailOptions = {
        from: `"Nike Support" <${process.env.EMAIL}>`,  // Use a recognizable sender name
        to: email,
        subject: "Here's your one-time code",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h2 style="color: #333;">Your Nike Member profile code</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <hr></hr>
        <h1 style="background: #f8f8f8; padding: 10px; display: inline-block; border-radius: 5px;">
        ${otp}
        </h1>
        <hr></hr>
        <p style="color: #f8f8f8;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        <p style="color: #828080;"> if you've already recieved this code or don't need it any more,ignore this email.</p>
        <p>Best regards, <br> Nike Support Team</p>
      </div>
    `,
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "OTP sent successfully", otp });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});
const bcrypt = require("bcrypt");
// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, userOtp, firstName, surname, password, preference, dob } = req.body;
  const storedOtpData = otpStore[email];

  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: "OTP expired or not found" });
  }

  const { otp, expiresAt } = storedOtpData;

  if (Date.now() > expiresAt) {
    delete otpStore[email]; // Remove expired OTP
    return res.status(400).json({ success: false, message: "OTP has expired" });
  }

  if (otp != userOtp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Set isAdmin to true only for a specific email
    const isAdmin = email === "admin@example.com"; // <-- Replace with your actual admin email

    const newUser = new User({
      firstName,
      surname,
      email,
      password: hashedPassword,
      preference,
      dob,
      isAdmin, // <-- Added field
    });

    await newUser.save();
    delete otpStore[email]; // Remove OTP after successful verification

    res.json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Error storing user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const user2 = user.firstName;
    const isAdmin = user.isAdmin || false;

    res.json({ success: true, message: "Login successful", user2, isAdmin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


const favoriteSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: String,
  category: String,
  image: String,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

app.post("/favorites", async (req, res) => {
  const { productId, name, price, category, image } = req.body;

  try {
    // Check if the product is already in favorites
    const existingFavorite = await Favorite.findOne({ productId });

    if (existingFavorite) {
      return res.status(400).json({ message: "Item already in favorites" });
    }

    const newFavorite = new Favorite({ productId, name, price, category, image });
    await newFavorite.save();

    res.status(201).json({ message: "Added to favorites", favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ message: "Error adding to favorites", error });
  }
});

app.get("/favorites", async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error });
  }
});

app.delete("/favorites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Favorite.findByIdAndDelete(id);
    res.json({ message: "Item removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from favorites", error });
  }
});
 


//Define Cart Schema
const cartSchema = new mongoose.Schema({
  productId: String,
  name: String,
  category: String,
  price: String,
  image: String,
  quantity: { type: Number, default: 1 },
  size: { type: Number, default: 8 }
});

const Cart = mongoose.model("Cart", cartSchema);

// Get Cart Items
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

app.post("/cart", async (req, res) => {
  const { productId, name, category, price, image, quantity = 1, size = 8 } = req.body; // Ensure quantity has a default value

  try {
    const cartItem = new Cart({ productId, name, category, price, image, quantity, size }); // Use `Cart`, not `CartModel`
    await cartItem.save();
    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
});

app.put("/cart/:id", async (req, res) => {
  try {
    const { size } = req.body;
    const updatedCartItem = await Cart.findByIdAndUpdate(req.params.id, { size }, { new: true });

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedCartItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating size", error });
  }
})



// Remove Item from Cart
app.delete("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
});
//clear whole cart
// Clear all cart items (for current user if needed)
app.delete("/clear-cart", async (req, res) => {
  try {
    await Cart.deleteMany({}); // or filter by user if you store it
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

// Clear all favorite items (for current user if needed)
app.delete("/clear-favorites", async (req, res) => {
  try {
    await Favorite.deleteMany({}); // or filter by user
    res.status(200).json({ message: "Favorites cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing favorites" });
  }
});







// Define Banner Schema (New Collection)
const bannerSchema = new mongoose.Schema({
  title: String,
  image: String, // Store banner image path
});

const Banner = mongoose.model("Banner", bannerSchema);

// Define Kidsproduct Schema
const kidsproductSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Kidsproduct = mongoose.model("Kidsproduct", kidsproductSchema);


// Define Jordan Schema
const jordanSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Jordan = mongoose.model("Jordan", jordanSchema);

// Define Skateboard Schema
const skateboardSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Skateboard = mongoose.model("Skateboard", skateboardSchema);

// Define Running Schema
const RunningSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Running = mongoose.model("Running", RunningSchema);

// Define Football Schema
const FootballSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Football = mongoose.model("Football", FootballSchema);


// Define Football Schema
const BasketballSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Basketball = mongoose.model("Basketball", BasketballSchema);


// Configure Multer for image upload (same as before)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Define Men Schema (New Collection)
const menSchema = new mongoose.Schema({
  title: String,
  image: String, // Store banner image path
});

const Men = mongoose.model("Men", menSchema);

// Define Women Schema (New Collection)
const womenSchema = new mongoose.Schema({
  title: String,
  image: String, // Store banner image path
});

const Women = mongoose.model("Women", womenSchema);

// Define Kids Schema (New Collection)
const kidsSchema = new mongoose.Schema({
  title: String,
  image: String, // Store banner image path
});

const Kids = mongoose.model("Kids", kidsSchema);


// Define Training Schema
const trainingSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Training = mongoose.model("Training", trainingSchema);

// Define Tennis Schema
const TennisSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Tennis = mongoose.model("Tennis", TennisSchema);

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  offer: String,
  newshoe: String,
  image: String, // Store image path
});

const Product = mongoose.model("Product", productSchema);


// Get all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a new banner with image
app.post("/upload-banner", upload.single("image"), async (req, res) => {
  const newBanner = new Banner({
    title: req.body.title,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newBanner.save();
  res.json({ message: "Banner added!", banner: newBanner });
});

// Get all banners
app.get("/banners", async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
});


// Upload image and add jordan
app.post("/upload-jordan", upload.single("image"), async (req, res) => {
  const newJordan = new Jordan({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newJordan.save();
  res.json({ message: "Product added!", jordan: newJordan });
});

// Get all jordan
app.get("/jordan", async (req, res) => {
  const jordan = await Jordan.find();
  res.json(jordan);
});


// Upload image and add Kidsproduct
app.post("/upload-kidsproduct", upload.single("image"), async (req, res) => {
  const newKidsproduct = new Kidsproduct({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newKidsproduct.save();
  res.json({ message: "Product added!", kidsproduct: newKidsproduct });
});

// Get all kidsproducts
app.get("/kidsproduct", async (req, res) => {
  const kidsproduct = await Kidsproduct.find();
  res.json(kidsproduct);
});


// Upload image and add running
app.post("/upload-running", upload.single("image"), async (req, res) => {
  const newRunning = new Running({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newRunning.save();
  res.json({ message: "Product added!", Running: newRunning });
});

// Get all Running
app.get("/running", async (req, res) => {
  const running = await Running.find();
  res.json(running);
});


// Upload image and add football
app.post("/upload-football", upload.single("image"), async (req, res) => {
  const newFootball = new Football({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newFootball.save();
  res.json({ message: "Product added!", Football: newFootball });
});

// Get all football
app.get("/football", async (req, res) => {
  const football = await Football.find();
  res.json(football);
});


// Upload image and add football
app.post("/upload-basketball", upload.single("image"), async (req, res) => {
  const newBasketball = new Basketball({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newBasketball.save();
  res.json({ message: "Product added!", Basketball: newBasketball });
});

// Get all football
app.get("/basketball", async (req, res) => {
  const basketball = await Basketball.find();
  res.json(basketball);
});


//for deletebutoon in admin
const modelMap = {
  products: Product,
  jordan: Jordan,
  running: Running,
  football: Football,
  basketball: Basketball,
  skateboard: Skateboard,
  tennis: Tennis,
  training: Training,
};
app.delete("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  const Model = modelMap[collection];

  if (!Model) {
    return res.status(400).json({ error: "Invalid collection name" });
  }

  try {
    await Model.findByIdAndDelete(id);
    res.json({ message: `${collection} product deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
});

//for editbutton in admin
app.put("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  const updatedData = req.body;
  const Model = modelMap[collection];

  if (!Model) {
    return res.status(400).json({ error: "Invalid collection name" });
  }

  try {
    const updatedProduct = await Model.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
});




// Add a new Men with image
app.post("/upload-men", upload.single("image"), async (req, res) => {
  const newMen = new Men({
    title: req.body.title,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newMen.save();
  res.json({ message: "Banner added!", Men: newMen });
});

// Get all Men
app.get("/men", async (req, res) => {
  const men = await Men.find();
  res.json(men);
});

// Upload image and add Training
app.post("/upload-training", upload.single("image"), async (req, res) => {
  const newTraining = new Training({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newTraining.save();
  res.json({ message: "Product added!", Training: newTraining });
});

// Get all Tennis
app.get("/training", async (req, res) => {
  const training = await Training.find();
  res.json(training);
});

// Upload image and add Tennis
app.post("/upload-tennis", upload.single("image"), async (req, res) => {
  const newTennis = new Tennis({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newTennis.save();
  res.json({ message: "Product added!", Tennis: newTennis });
});

// Get all Tennis
app.get("/tennis", async (req, res) => {
  const tennis = await Tennis.find();
  res.json(tennis);
});

// Upload image and add skateboard
app.post("/upload-skateboard", upload.single("image"), async (req, res) => {
  const newSkateboard = new Skateboard({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newSkateboard.save();
  res.json({ message: "Product added!", Skateboard: newSkateboard });
});

// Get all skateboard
app.get("/skateboard", async (req, res) => {
  const skateboard = await Skateboard.find();
  res.json(skateboard);
});

// Add a new Women with image
app.post("/upload-Women", upload.single("image"), async (req, res) => {
  const newWomen = new Women({
    title: req.body.title,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newWomen.save();
  res.json({ message: "Banner added!", Women: newWomen });
});

// Get all Women
app.get("/women", async (req, res) => {
  const women = await Women.find();
  res.json(women);
});

// Add a new Kids with image
app.post("/upload-Kids", upload.single("image"), async (req, res) => {
  const newKids = new Kids({
    title: req.body.title,
    image: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  await newKids.save();
  res.json({ message: "Banner added!", Kids: newKids });
});

// Get all Kids
app.get("/kids", async (req, res) => {
  const kids = await Kids.find();
  res.json(kids);
});


// Upload image and add product
app.post("/upload-products", upload.single("image"), async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,  
    offer: req.body.offer,
    newshoe: req.body.newshoe,
    image: `http://localhost:5000/upload/${req.file.filename}`,
  });

  await newProduct.save();
  res.json({ message: "Product added!", Product: newProduct });
});

app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // Case-insensitive search

    const products = await Product.find({ name: regex });
    const jordans = await Jordan.find({ name: regex });
    const runningShoes = await Running.find({ name: regex });
    const footballShoes = await Football.find({ name: regex });
    const basketballShoes = await Basketball.find({ name: regex });
    const trainingShoes = await Training.find({ name: regex });
    const tennisShoes = await Tennis.find({ name: regex });

    const allResults = [
      ...products,
      ...jordans,
      ...runningShoes,
      ...footballShoes,
      ...basketballShoes,
      ...trainingShoes,
      ...tennisShoes,
    ];

    res.json(allResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error performing search" });
  }
});


//filtered search results..
const categories = ["basketball", "running", "jordan", "football", "training", "skateboard", "tennis"];

// Dynamic category routes
categories.forEach(category => {
    app.get(`/${category}`, async (req, res) => {
        try {
            const query = req.query.q;
            let products;

            if (query) {
                products = await Product.find({
                    category: category, 
                    name: { $regex: query, $options: "i" } // Case-insensitive search
                });
            } else {
                products = await Product.find({ category: category });
            }

            res.json(products);
        } catch (error) {
            console.error(`Error fetching ${category} products:`, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');

// Serve static frontend
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
