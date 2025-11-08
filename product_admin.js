// ================== FIREBASE IMPORTS ==================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ================== FIREBASE CONFIG (Use the same config as script.js) ==================
const firebaseConfig = {
    apiKey: "AIzaSyD5OukBUIVrRMLibXc_Mpvt61Ptx77kV1w",
    authDomain: "hotel-ac881.firebaseapp.com",
    projectId: "hotel-ac881",
    storageBucket: "hotel-ac881.firebasestorage.app",
    messagingSenderId: "350463392977",
    appId: "1:350463392977:web:667d7f7601cbea8a5059f0",
    measurementId: "G-0ZHBQRN5GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================== DOM ELEMENTS ==================
const form = document.getElementById('productForm');
const messageElement = document.getElementById('message');

// ================== FORM SUBMISSION HANDLER ==================
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageElement.textContent = "Saving product...";

    const name = document.getElementById('productName').value.trim();
    const type = document.getElementById('producttype').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);

    const description = document.getElementById('productDescription').value.trim();
    const image = document.getElementById('productImage').value.trim();

    if (!name || isNaN(price) || price <= 0 || !description) {
        messageElement.textContent = "❌ Please fill in all required fields correctly.";
        return;
    }

    const newProduct = {
        name: name,
        type: type,
        price: price,
        description: description,
        image: image || "", // Optional image URL
        createdAt: serverTimestamp()
    };

    try {
        // Add the new product document to the 'products' collection
        const docRef = await addDoc(collection(db, "products"), newProduct);
        
        messageElement.textContent = `✅ Product added successfully! ID: ${docRef.id}`;
        
        // Reset the form after success
        form.reset(); 

    } catch (error) {
        console.error("Error adding document: ", error);
        messageElement.textContent = "❌ Error adding product. Check console for details.";
    }
});