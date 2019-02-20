const router          = express.Router();
const Driver          = require('../route-handler/driver');
const Token           = require('../lib/token');
const validate        = require('../validation/driver')

router.use(express.json());

router.post('/signup',validate.validateDriver,Token.hashPassword,Driver.signup);

router.post('/login',validate.validateLogin,Driver.login);

router.delete('/delete',Token.accessToken,Driver.deleteDriver);

router.put('/update',validate.validateUpdatedCustomer,Token.accessToken,Driver.updateDriver);

router.get('/bookings',Token.accessToken,Driver.showDriverBookings);

router.post('/set/status',Token.accessToken,Driver.setStatus);

module.exports = router;