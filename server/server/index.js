const express = require('express');
const cors = require('cors');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } = require("firebase/firestore");

const app = express();
app.use(cors());
app.use(express.json());

const firebaseConfig = {
    apiKey: "AIzaSyAMmL_Ox1gDt5mC_om8G44hCH8Rwq2SmVA",
    authDomain: "reading-dairy.firebaseapp.com",
    projectId: "reading-dairy",
    storageBucket: "reading-dairy.firebasestorage.app",
    messagingSenderId: "392334952892",
    appId: "1:392334952892:web:4c273b1ee58f8ffb68c3b9"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const PORT = 5000;

app.get('/api/books/:userId', async (req, res) => {
    try {
        const q = query(collection(db, 'books'), where('userId', '==', req.params.userId));
        const snap = await getDocs(q);
        res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/books', async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, 'books'), req.body);
        res.status(201).json({ id: docRef.id, ...req.body });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        await deleteDoc(doc(db, 'books', req.params.id));
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        await updateDoc(doc(db, 'books', req.params.id), req.body);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
    console.log(`🚀 СЕРВЕР ЗАПУЩЕНО НА ПОРТУ ${PORT}`);
});