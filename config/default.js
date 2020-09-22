module.exports = 
    {
        "mongoURI": process.env.mongoURI.replace(/"/g,""),
        "jwtSecret": process.env.jwtSecret.replace(/"/g,"")
    }      
;