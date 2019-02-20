/**
 * Routes related to Customer are in this file.
 */
const router            = express.Router();
const Customer          = require('../route-handler/customer');
const Token             = require('../lib/token');
const validator         = require('../validation/customer');

router.use(express.json());

router.post('/signup',validator.validateCustomer,Token.hashPassword,Customer.signup);

router.post('/login',validator.validateLogin,Customer.login);

router.get('/showAll',Token.accessToken,Customer.showAllCustomers);

router.delete('/delete',Token.accessToken,Customer.deleteCustomer);

router.put('/update',validator.validateUpdatedCustomer,Token.accessToken,Customer.updateCustomer)

router.get('/bookings',Token.accessToken,Customer.showCustomerBookings)


module.exports = router;