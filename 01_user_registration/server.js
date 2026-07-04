import app from "./src/app.js"; // import needs the .js , require statement do not mandates it
// import is newer , adding .js is better because it reduces confusion and conflicts


app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})