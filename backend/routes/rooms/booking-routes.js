const router = require('express').Router({ mergeParams: true});
const bodyParser = require('body-parser');
const RoomBooking = require('../../models/roomBooking-model');
const { param, body, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

//Level 0: Get an array of approved roomBookings' start-end intervals, within a specified range for a particular room
router.get('/:start-:end', [
    param('roomId').exists(),
    param('start').exists().isInt().toInt(),
    param('end').exists().isInt().toInt()
    ], (req, res) => {
        //Check for input errors
        const {roomId,start,end} = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else if (start > end) {
            res.status(422).json({ValueError: "start > end"});
        } else {         
            RoomBooking.find({
                approved: true, 
                roomId: roomId, 
                start: {"$lte": end},
                end: {"$gte": start},
            }, (err, resp) => {
                if (err) {
                    res.status(500).send("Database Error");
                } else {
                    const response = [];
                    resp.forEach((doc) => {
                        response.push({
                            startDate: doc.start.getTime(),
                            endDate: doc.end.getTime()
                        });
                    });
                    res.send(response);
                }
            });
        }
});

//Level 0: Create a new bookingRequest
router.post('/', jsonParser, [
    body('description').exists(),
    body('start').exists(),
    body('end').exists(),
    ], (req, res) => {
        //Check for input errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else {
            const newBookingRequest = {
                roomId: req.params.roomId,
                description: req.body.description,
                createdBy: req.user.userId,
                start: req.body.start,
                end: req.body.end,
                approved: false
            };
            new RoomBooking(newBookingRequest).save()
            .then((result, error) => {
                if (error) {
                    res.sendStatus(500);
                } else {
                    res.send(result);
                };
            });
        }
});

module.exports = router;