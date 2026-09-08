//src/linkManager.js
const fs = require("fs");
const path = require("path");

const linksFile = path.join(__dirname, "../data/links.json");

function readLinks() {
    if (!fs.existsSync(linksFile)) {
        return [];
    }

    const data = fs.readFileSync(linksFile, "utf-8");

    try {
        return JSON.parse(data);
    } catch (error) {
        throw new Error("Invalid links.json file");
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

    const resetLinks = links.map((link) => ({
        ...link,
        status: "available",
        usedAt: null
    }));

    saveLinks(resetLinks);

    return resetLinks;
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