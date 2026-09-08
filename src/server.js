const express = require("express");
const {
    getNextLink,
    resetLinks,
    getStatus
} = require("./linkManager");

const app = express();

const PORT = process.env.PORT || 3000;

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
        console.error(error);

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
        console.error(error);

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
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get status"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Smart Link Server running on http://localhost:${PORT}`);
});

