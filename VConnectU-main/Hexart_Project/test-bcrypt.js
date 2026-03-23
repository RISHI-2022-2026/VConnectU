
try {
    console.log("Resolving bcryptjs...");
    const path = require.resolve("bcryptjs");
    console.log("Resolved to:", path);

    console.log("Requiring bcryptjs...");
    const bcrypt = require("bcryptjs");
    console.log("Success! Version:", bcrypt.version);
} catch (e) {
    console.error("FAILED:");
    console.error(e.code);
    console.error(e.message);
    console.error(e.stack);
}
