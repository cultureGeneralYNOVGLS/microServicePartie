module.exports = (req: any, res: any, next: any) => {
    console.log(12, 'start');
    console.log("verif Token Partie")
    const fetch = require('node-fetch');
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(13, token);

        fetch(`http://micro-service-user:3000/api/user/auth`, {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((fetc:any) => {
            console.log(14, fetc.status);
            if (fetc.status === 400) {
                res.status(401).json({
                    error: "Token Invalid"
                });
            }
            else {
                next();
            }
        })
        .catch(() => {
            console.log(15, 'error');
            res.status(401).json({
                error: "Token Invalid"
            });
          });
    } catch {
        console.log(16, 'error');
        res.status(401).json({
            error: "Token Invalid"
        });
    }
};