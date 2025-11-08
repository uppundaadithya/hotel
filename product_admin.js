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

// Get references to the form and message element
const productForm = document.getElementById('productForm');
const messageElement = document.getElementById('message');

// Get a reference to the 'products' collection in Firestore
const productsCollectionRef = collection(db, 'products');

/**
 * Handles the form submission to add a new product to Firestore.
 * @param {Event} e The submit event.
 */
const handleProductSubmission = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Clear previous messages
    messageElement.textContent = 'Saving product...';
    messageElement.style.color = '#2b6cb0'; // Primary color for loading

    // 1. Gather data from form inputs
    const productName = document.getElementById('productName').value.trim();
    const productType = document.getElementById('producttype').value;
    // Parse price as a number, using parseFloat for currency
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productDescription = document.getElementById('productDescription').value.trim();
    const productImage = document.getElementById('productImage').value.trim();

    // Basic client-side validation for required fields
    if (!productName || !productType || isNaN(productPrice) || productPrice <= 0 || !productDescription) {
        messageElement.textContent = 'Please fill out all required fields (Name, Type, valid Price, Description).';
        messageElement.style.color = 'red';
        return;
    }

    // 2. Create the product data object
    const newProductData = {
        name: productName,
        type: productType,
        price: productPrice,
        description: productDescription,
        // Only include imageUrl if it's not empty, otherwise Firebase will store an empty string.
        imageUrl: productImage || '',
        createdAt: serverTimestamp(), // Use Firestore's server timestamp
        isAvailable: true // Assuming a new product is available by default
    };

    // 3. Add the document to the Firestore collection
    try {
        const docRef = await addDoc(productsCollectionRef, newProductData);

        // 4. Success feedback
        messageElement.textContent = `Success! Product "${productName}" added with ID: ${docRef.id}`;
        messageElement.style.color = 'green';

        // Optional: Clear the form after successful submission
        productForm.reset();
        // Reset the message after a short delay
        setTimeout(() => {
            messageElement.textContent = '';
        }, 5000);

    } catch (error) {
        // 5. Error handling
        console.error("Error adding document: ", error);
        messageElement.textContent = `Error adding product: ${error.message}`;
        messageElement.style.color = 'red';
    }
};

// 6. Attach the event listener to the form
productForm.addEventListener('submit', handleProductSubmission);