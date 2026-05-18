const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./backend/.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("backend/public"));

let products = [
    { id:1, name:"Laptop", price:50000 },
    { id:2, name:"Headphone", price:2000 },
    { id:3, name:"Keyboard", price:1500 }
];

let cart = [];

app.get("/api/products",(req,res)=>{
    res.json(products);
});

app.post("/api/cart",(req,res)=>{
    const product = products.find(
        p=>p.id===req.body.id
    );

    cart.push(product);

    res.json({
        message:"Added to cart"
    });
});

app.get("/api/cart",(req,res)=>{
    res.json(cart);
});
app.post("/api/checkout", (req, res) => {
    const { address, paymentMode } = req.body;

    if (!address) {
        return res.status(400).json({ message: "Address required" });
    }

    if (!paymentMode) {
        return res.status(400).json({ message: "Payment mode required" });
    }

    if (cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    cart = [];

    res.json({ message: "Order placed successfully" });
});
let profile = {
    name: "Shiny",
    address: "Trichy"
};

let tickets = [];

app.post("/api/profile", (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ message: "Profile details required" });
    }

    profile.name = name;
    profile.address = address;

    res.json({ message: "Profile updated", profile });
});

app.post("/api/support", (req, res) => {
    const { issue } = req.body;

    if (!issue) {
        return res.status(400).json({ message: "Issue required" });
    }

    tickets.push({
        id: tickets.length + 1,
        issue,
        status: "Open"
    });

    res.json({ message: "Support ticket created" });
});

app.listen(PORT,()=>{
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});