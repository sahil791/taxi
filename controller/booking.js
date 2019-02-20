/**
 * Routes related to booking are in this file.
 */
const router           = express.Router();
const Booking          = require('../route-handler/booking');
const Token            = require('../lib/token');
const validator         = require('../validation/booking');

router.use(express.json());


// customer token
router.post('/create',validator.validateBooking,Token.accessToken,Booking.createBooking);

 // admin token
router.get('/show',Token.accessToken,Booking.showBookings);

module.exports = router;