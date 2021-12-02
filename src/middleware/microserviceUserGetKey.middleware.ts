module.exports = (req: any, res: any, next: any) => {
    const fetch = require('node-fetch');

    fetch("http://micro-service-user:3000/api/user/getkey", {
        method: "GET"
    }).then((fetc:any) => {
        if (fetc.status === 404 || fetc.status === 500) {
            res.status(401).json({
                error: "Data is not good"
            });
        }
        else {
            next();
        }
    }).catch(()=>{
        res.status(401).json({
            error: "Data is not good"
        });
    });
};