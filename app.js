express               = require('express');
const app             = express();
const admin           = require('./controller/admin.js');
const customer        = require('./controller/customer.js');
const driver          = require('./controller/driver');
const booking         = require('./controller/booking');

const mongo           = require('./services/mongo-handler')

const swaggerUI       = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
app.use(express.json());

app.use('/admin',admin);
app.use('/customer',customer);
app.use('/driver',driver);
app.use('/booking',booking);


app.listen(3000, () => {
    mongo.init();
});