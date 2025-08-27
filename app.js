'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { User } = require('./models');
const { comparePassword } = require('./helpers/bcrypts');
const { generateToken } = require('./helpers/jwt');
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan Password wajib diisi' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !comparePassword(password, user.password)) {
            return res.status(401).json({ message: 'Email atau Password salah' });
        }

        const access_token = generateToken({ id: user.id, email: user.email, role: user.role });

        res.status(200).json({
            access_token,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        next(err);
    }
});

app.post('/google-login', async (req, res) => {
    try {
        const { tokenId } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({ email, password: "google_auth", role: "staff" });
        }

        const access_token = generateToken({ id: user.id, email: user.email, role: user.role });

        res.status(200).json({ access_token, email: user.email, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login dengan Google gagal" });
    }
});

app.use((err, req, res, next) => {
    console.error("Internal error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});