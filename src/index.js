const path = require('path')
const express = require('express')
const hbs = require('hbs')

require('./db/mongoose')

//Define paths for Express config
const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
//const partialsPath = path.join(__dirname, '../templates/partials')

var exhbs = require('express-handlebars');
app.engine('hbs', exhbs.engine({
    helpers: require(publicDirectoryPath+"/js/helpers.js").helpers,
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: path.join(__dirname, '../templates/views/'),  //  path to your layouts
    partialsDir: path.join(__dirname, '../templates/partials'), //  path to your partials
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
}))

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
//hbs.registerPartials(partialsPath)




//Setup static directory to save
app.use(express.static(publicDirectoryPath))

const usersRouter = require('./routers/users')
const pageRouter = require('./routers/pages')

app.use(express.json())
app.use(usersRouter)
app.use(pageRouter)

app.listen(port, () => {
    console.log('Server is up on port' + port)
})