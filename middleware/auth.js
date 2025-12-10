const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        // If HTML request, redirect to login
        if (req.accepts('html')) {
            return res.redirect("/login");
        }
        return res.status(401).json({ message: "Access denied. Login first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key-for-testing');
        req.user = decoded;        // { id: "...", email: "...", username: "..." }
        next();
    } catch (err) {
        // If HTML request, redirect to login
        if (req.accepts('html')) {
            return res.redirect("/login");
        }
        return res.status(400).json({ message: "Invalid token." });
    }
};
