module.exports = (req: any, res: any, next: any) => {
    console.log(7, 'start');
    
    const fetch = require('node-fetch');
    console.log(8, 'start');

    fetch("http://micro-service-user:3000/api/user/getkey", {
        method: "GET"
    }).then((fetc:any) => {
        console.log(9, fetc.status);
        if (fetc.status === 404 || fetc.status === 500) {
            res.status(401).json({
                error: "Data is not good"
            });
        }
        else {
            console.log(10, fetc.status);
            next();
        }
    }).catch(()=>{
        console.log(11, 'error');
        res.status(401).json({
            error: "Data is not good"
        });
    });
};