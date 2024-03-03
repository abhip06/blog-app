import { app } from "./app";
import connectDB from "./db";

const PORT = process.env.PORT || 8080;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\nServer running on http://localhost:${PORT}`);
            process.on('warning', e => console.warn("\n\nWARNING: ", e.stack));
        });
    }).catch((err) => {
        console.log("\nMongoDB Connection Failed!! ERROR: ", err);
    });