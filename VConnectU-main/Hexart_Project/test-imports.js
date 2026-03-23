
try {
    console.log("Importing bcryptjs...");
    require("bcryptjs");
    console.log("bcryptjs success");

    console.log("Importing jose...");
    require("jose");
    console.log("jose success");

    console.log("Importing @prisma/client...");
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    console.log("PrismaClient success");
} catch (e) {
    console.error("Import error:", e);
}
