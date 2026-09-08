const express = require("express");
const cors = require("cors");

const {
    getNextLink,
    resetLinks,
    getStatus
} = require("./linkManager");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Link Server is running"
    });
});

app.get("/api/link", (req, res) => {
    try {
        const link = getNextLink();

        if (!link) {
            return res.status(410).json({
                success: false,
                message: "No links available"
            });
        }

        return res.json({
            success: true,
            link: link.url,
            id: link.id
        });
    } catch (error) {
        console.error("Link error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get link"
        });
    }
});

app.post("/api/link/reset", (req, res) => {
    try {
        const links = resetLinks();

        return res.json({
            success: true,
            message: "All links have been reset",
            total: links.length
        });
    } catch (error) {
        console.error("Reset error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reset links"
        });
    }
});

app.get("/api/link/status", (req, res) => {
    try {
        const status = getStatus();

        return res.json({
            success: true,
            ...status
        });
    } catch (error) {
        console.error("Status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get status"
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Smart Link Server running on http://127.0.0.1:${PORT}`);
});