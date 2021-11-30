module.exports = (req: any, res: any, next: any) => {
    /*if (req.userConnected.roles.includes('administrator')) {
        next();
    } else {
        res.status(401).json({
            error: "You haven't authorization to access"
        });
    }*/
    console.log("verif Token Paertie")
    const fetch = require('node-fetch');
    try {
        const token = req.headers.authorization.split(' ')[1];

        fetch(`http://localhost:7512/api/user/auth`, {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((fetc:any) => {
            if (fetc.status === 400) {
                res.status(401).json({
                    error: "Token Invalid"
                });
            }
            else {
                next();
            }
        });
    } catch {
        res.status(401).json({
            error: "Token Invalid"
        });
    }
};