var express = require("express")
const app = express();

var bodyParser = require('body-parser');

const DataRecord = require("./core/DataRecord")
const routes = module.parent.require("./config/routes")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function createResponse(err, data){
    return `{"status":"${err ? "BAD" : "OK"}","message":"${err ? err : ""}","values":${ JSON.stringify(data) }}`;
}

function fetchResource(req, res){
    const resourceString = req.params.resource;

    var re = new RegExp('/api/(.*)/');
    var r  = req.path.match(re);
    var resourcePath = r ? `/${r[1]}/` : ""
    
    const resourceJSON = routes.resources.find(element => ((element["name"] === resourceString) && ( (element["path"] ? element["path"] : "") === resourcePath) ) )
    
    if (resourceJSON == null){
        res.send( createResponse("Resource Not Found", null));
        return null;
    }

    return resourceJSON["module"];
}

app.get(['/api/*/:resource','/api/:resource'], (req, res)=>{
    //res.send( createResponse(null, "Yes It works") );
    //console.log("Routes: " + routes)
    resource = fetchResource(req, res)

    if (resource == null){ return }

    dr = new DataRecord(req, (err, result)=>{
        res.send( createResponse(err, result) );
    })

    if (resource.index){
        resource.index(dr)
    } else {

        
        if (req.query.id){ dr.where(`id = ${req.query.id}`) }
        
        
        dr.runSelect((err, result)=>{
            dr.render(err, result.rows);
        })
    }
})



// const routes = module.parent.require("./config/routes")

// const DataRecord = require("./core/DataRecord")
// module.exports.dbconfig = module.parent.require("./db/dbconfig.json");
// var bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// function createResponse(err, data){
//     return `{"status":"${err ? "BAD" : "OK"}","message":"${err ? err : ""}","values":${ JSON.stringify(data) }}`;
// }


// CREATE
app.post(['/api/*/:resource','/api/:resource'], (req, res)=>{
    // const resourceString = req.params.resource;
    // const resource = routes.resources.find(element => element["name"] == resourceString)["module"]
    resource = fetchResource(req, res)

    if (resource == null){ return }

    dr = new DataRecord(req, (err, result)=>{
        res.send( createResponse(err, result) );
    })

    if (resource.create){
        resource.create(dr)
    } else {

        dr.columns(`${Object.keys(req.body).join(",")}`)
        
        var vals = Object.keys(req.body).map(x => req.body[x]).join(",")

        dr.runInsert(vals,(err, result)=>{
            dr.render(err, result.rows);
        })
    }
    
})




// app.get(['/api/*/:resource','/api/:resource'], (req, res)=>{
    
//     resource = fetchResource(req, res)
//     if (resource == null){ return }

//     dr = new DataRecord(req, (err, result)=>{
//         res.send( createResponse(err, result) );
//     })

//     if (resource.index){
//         resource.index(dr)
//     } else {

        
//         if (req.query.id){ dr.where(`id = ${req.query.id}`) }
        
        
//         dr.runSelect((err, result)=>{
//             dr.render(err, result.rows);
//         })
//     }
// })

// PATCH
app.patch(['/api/*/:resource','/api/:resource'], (req, res)=>{
    // const resourceString = req.params.resource;
    // const resource = routes.resources.find(element => element["name"] == resourceString)["module"]
    resource = fetchResource(req, res)

    if (resource == null){ return }

    dr = new DataRecord(req, (err, result)=>{
        res.send( createResponse(err, result) );
    })

    if (resource.update){
        resource.update(dr)
    } else {

        dr.columns(`${Object.keys(req.body).map((e)=>{ return `${e} = ${req.body[e]}` }).join(",")}`)
        dr.where(`id = ${req.params.id}`)

        dr.runUpdate((err, result)=>{
            dr.render(err, result.rows);
        })
    }
    
})

// DELETE
app.delete('/api/:resource/:id', (req, res)=>{
    const resourceString = req.params.resource;
    const resource = routes.resources.find(element => element["name"] == resourceString)["module"]

    dr = new DataRecord(req, (err, result)=>{
        res.send( createResponse(err, result) );
    })

    if (resource.update){
        resource.update(dr)
    } else {

        dr.where(`id = ${req.params.id}`)
        
        dr.runDelete((err, result)=>{
            dr.render(err, result.rows);
        })
    }
    
})


// module.exports.startServer = () => {
//     console.log("Starting Server")
//     app.listen(3000, ()=>{ console.log("Listening to port 3000") })
// }

// switch (process.argv[2]){
//     case "server":
//     case "s":
        // console.log("Starting Server")
        // app.listen(3000, ()=>{ console.log("Listening to port 3000") })
//         break;
//     case "generate":
//     case "g":
//         console.log("generate Resource: " + process.argv[3])
//         for (var i = 4; i < process.argv.length; i++){
//             console.log("Props: " + process.argv[i])
//         }
//         // process.argv.forEach((e)=>{
            
//         // })
//         break;
//     case "db:up":
//         dbManager.migrateDB("up");
//         break;
//     case "db:down":
//         dbManager.migrateDB("down");
//         break;
//     default:
//         console.log("Command not found")
//         break;
// }





// ========================================================================================== //
// var express = require("express")
// const app = express();

// const routes = module.parent.require("./config/routes")

// const DataRecord = require("./core/DataRecord")
// module.exports.dbconfig = module.parent.require("./db/dbconfig.json");
// var bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// function createResponse(err, data){
//     return `{"status":"${err ? "BAD" : "OK"}","message":"${err ? err : ""}","values":${ JSON.stringify(data) }}`;
// }


// // CREATE
// app.post('/api/:resource', (req, res)=>{
//     const resourceString = req.params.resource;
//     const resource = routes.resources.find(element => element["name"] == resourceString)["module"]

//     dr = new DataRecord(req, (err, result)=>{
//         res.send( createResponse(err, result) );
//     })

//     if (resource.create){
//         resource.create(dr)
//     } else {

//         dr.columns(`${Object.keys(req.body).join(",")}`)
        
//         var vals = Object.keys(req.body).map(x => req.body[x]).join(",")

//         dr.runInsert(vals,(err, result)=>{
//             dr.render(err, result.rows);
//         })
//     }
    
// })


// function fetchResource(req, res){
//     const resourceString = req.params.resource;

//     var re = new RegExp('/api/(.*)/');
//     var r  = req.path.match(re);
//     var resourcePath = r ? `/${r[1]}/` : ""
    
//     const resourceJSON = routes.resources.find(element => ((element["name"] === resourceString) && ( (element["path"] ? element["path"] : "") === resourcePath) ) )
    
//     if (resourceJSON == null){
//         res.send( createResponse("Resource Not Found", null));
//         return null;
//     }

//     return resourceJSON["module"];
// }

// app.get(['/api/*/:resource','/api/:resource'], (req, res)=>{
    
//     resource = fetchResource(req, res)
//     if (resource == null){ return }

//     dr = new DataRecord(req, (err, result)=>{
//         res.send( createResponse(err, result) );
//     })

//     if (resource.index){
//         resource.index(dr)
//     } else {

        
//         if (req.query.id){ dr.where(`id = ${req.query.id}`) }
        
        
//         dr.runSelect((err, result)=>{
//             dr.render(err, result.rows);
//         })
//     }
// })

// // PATCH
// app.patch('/api/:resource/:id', (req, res)=>{
//     const resourceString = req.params.resource;
//     const resource = routes.resources.find(element => element["name"] == resourceString)["module"]

//     dr = new DataRecord(req, (err, result)=>{
//         res.send( createResponse(err, result) );
//     })

//     if (resource.update){
//         resource.update(dr)
//     } else {

//         dr.columns(`${Object.keys(req.body).map((e)=>{ return `${e} = ${req.body[e]}` }).join(",")}`)
//         dr.where(`id = ${req.params.id}`)

//         dr.runUpdate((err, result)=>{
//             dr.render(err, result.rows);
//         })
//     }
    
// })

// // DELETE
// app.delete('/api/:resource/:id', (req, res)=>{
//     const resourceString = req.params.resource;
//     const resource = routes.resources.find(element => element["name"] == resourceString)["module"]

//     dr = new DataRecord(req, (err, result)=>{
//         res.send( createResponse(err, result) );
//     })

//     if (resource.update){
//         resource.update(dr)
//     } else {

//         dr.where(`id = ${req.params.id}`)
        
//         dr.runDelete((err, result)=>{
//             dr.render(err, result.rows);
//         })
//     }
    
// })


// module.exports.startServer = () => {
//     console.log("Starting Server")
//     app.listen(3000, ()=>{ console.log("Listening to port 3000") })
// }

// switch (process.argv[2]){
//     case "server":
//     case "s":
//         console.log("Starting Server")
//         app.listen(3000, ()=>{ console.log("Listening to port 3000") })
//         break;
//     case "generate":
//     case "g":
//         console.log("generate Resource: " + process.argv[3])
//         for (var i = 4; i < process.argv.length; i++){
//             console.log("Props: " + process.argv[i])
//         }
//         // process.argv.forEach((e)=>{
            
//         // })
//         break;
//     case "db:up":
//         dbManager.migrateDB("up");
//         break;
//     case "db:down":
//         dbManager.migrateDB("down");
//         break;
//     default:
//         console.log("Command not found")
//         break;
// }

module.exports.start = ()=>{
    console.log("Starting Server")
    app.listen(3000, ()=>{ console.log("Listening to port 3000") })
}