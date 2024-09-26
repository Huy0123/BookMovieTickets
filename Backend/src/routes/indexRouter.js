
const Users = require('./UserRouter.js')
function route(app){
    app.use('/v1',Users)
   
}

module.exports = route;
