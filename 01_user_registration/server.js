import app from "./src/app.js"; // import needs the .js , require statement do not mandates it
// import is newer , adding .js is better because it reduces confusion and conflicts
import connectDB from "./src/config/database.js"


// fix for "type":"module"
import dns from "dns"
dns.setServers(["1.1.1.1","8.8.8.8"])

connectDB();

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})