// src/linkManager.js

const fs = require("fs");
const path = require("path");

const linksFile = path.join(__dirname, "./links.json");

function readLinks() {
    if (!fs.existsSync(linksFile)) {
        throw new Error(`links.json not found: ${linksFile}`);
    }

    try {
        const data = fs.readFileSync(linksFile, "utf-8");
        const links = JSON.parse(data);

        if (!Array.isArray(links)) {
            throw new Error("links.json must contain an array");
        }

        return links;
    } catch (error) {
        throw new Error(`Failed to read links.json: ${error.message}`);
    }
}

function saveLinks(links) {
    fs.writeFileSync(
        linksFile,
        JSON.stringify(links, null, 2),
        "utf-8"
    );
}

function getNextLink() {
    const links = readLinks();

    const availableLink = links.find(
        (link) => link.status === "available"
    );

    if (!availableLink) {
        return null;
    }

    availableLink.status = "used";
    availableLink.usedAt = new Date().toISOString();

    saveLinks(links);

    return availableLink;
}

function resetLinks() {
    const links = readLinks();

    const reset = links.map((link) => ({
        ...link,
        status: "available",
        usedAt: null
    }));

    saveLinks(reset);

    return reset;
}

function getStatus() {
    const links = readLinks();

    const available = links.filter(
        (link) => link.status === "available"
    ).length;

    const used = links.filter(
        (link) => link.status === "used"
    ).length;

    return {
        total: links.length,
        available,
        used
    };
}

module.exports = {
    getNextLink,
    resetLinks,
    getStatus
};