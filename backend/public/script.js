document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "shiny" && password === "test123") {
        document.getElementById("loginMsg").innerText = "Login successful";
        await loadProducts();
    } else {
        document.getElementById("loginMsg").innerText = "Invalid credentials";
    }
});

async function loadProducts() {
    const res = await fetch("/api/products");
    const products = await res.json();

    document.getElementById("products").innerHTML = products.map(p => `
        <div>
            ${p.name} - ₹${p.price}
            <button onclick="addToCart(${p.id})">Add</button>
        </div>
    `).join("");
}

async function addToCart(id) {
    await fetch("/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    });

    await viewCart();
}

async function viewCart() {
    const res = await fetch("/api/cart");
    const cart = await res.json();

    document.getElementById("cart").innerHTML = cart.map(c => `
        <div>${c.name}</div>
    `).join("");
}
document.getElementById("checkoutBtn").addEventListener("click", async () => {
    const address = document.getElementById("address").value;
    const paymentMode = document.getElementById("paymentMode").value;

    const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ address, paymentMode })
    });

    const data = await res.json();

    document.getElementById("checkoutMsg").innerText = data.message;
});
document.getElementById("profileBtn").addEventListener("click", async () => {
    const name = document.getElementById("profileName").value;
    const address = document.getElementById("profileAddress").value;

    const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, address })
    });

    const data = await res.json();

    document.getElementById("profileMsg").innerText = data.message;
});

document.getElementById("supportBtn").addEventListener("click", async () => {
    const issue = document.getElementById("issue").value;

    const res = await fetch("/api/support", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ issue })
    });

    const data = await res.json();

    document.getElementById("supportMsg").innerText = data.message;
});