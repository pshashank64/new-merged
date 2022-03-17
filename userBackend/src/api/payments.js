var express = require('express');
var router = express.Router();
const Razorpay = require('razorpay')
const PaymentDetail =  require('../model/paymentModel');
const CourseModel = require("../model/courseModel");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const auth = require("../../../ecomBackend/src/auth/auth");

// Create an instance of Razorpay
let razorPayInstance = new Razorpay({
	key_id: process.env.PUBLIC_KEY,
	key_secret: process.env.PRIVATE_KEY
})

/**
 * Checkout Page
 * 
 */
router.post('/order/:courseId',auth, function(req, res, next) {
	let ID = JSON.stringify(req.user._id)
	let cID = JSON.stringify(req.params.courseId);
	params = {
		amount: req.body.amount * 100,
		currency: "INR",
		receipt: nanoid(),
		notes: {
			user: ID,
			course: cID
		},
		payment_capture: "1"
	}
	razorPayInstance.orders.create(params)
	.then(async (response) => {
		const razorpayKeyId = process.env.PUBLIC_KEY
		// Save orderId and other payment details
		let UserIDobj = JSON.parse(response.notes.user);
		let CourseIDobj = JSON.parse(response.notes.course);
		const paymentDetail = new PaymentDetail({
			userId: UserIDobj,
			courseId: CourseIDobj,
			orderId: response.id,
			receiptId: response.receipt,
			amount: response.amount/100,
			currency: response.currency,
			status: response.status
		});
		try {
			// Render Order Confirmation page if saved succesfully
			await paymentDetail.save()
			res.status(200).json({
				"message": "Order created!",
				"razorpayKeyId": razorpayKeyId,
				"paymentDetail": paymentDetail
			})
		} catch (err) {
			// Throw err if failed to save
			if (err){
				res.status(401).json({
					"message": "Unable to save the order data!"
				})
			};
		}
	}).catch((err) => {
		// Throw err if failed to create order
		if (err){
			res.status(401).json({
				"message": "Unable to craete an order!"
			})
		};
	})
});

/**
 * Verify Payment
 * 
 */
router.post('/verify',auth, async function(req, res, next) {
	let ID = req.user._id
	body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
	let crypto = require("crypto");
	let expectedSignature = crypto.createHmac('sha256', process.env.PRIVATE_KEY)
							.update(body.toString())
							.digest('hex');

	// Compare the signatures
	if(expectedSignature === req.body.razorpay_signature) {
		// if same, then find the previosuly stored record using orderId,
		// and update paymentId and signature, and set status to paid.
		await PaymentDetail.findOneAndUpdate(
			{ orderId: req.body.razorpay_order_id },
			{
				paymentId: req.body.razorpay_payment_id,
				signature: req.body.razorpay_signature,
				status: "paid"
			},
			{ new: true },
			function(err, doc) {
				// Throw er if failed to save
				if(err){
					res.status(401).json({
						message: "failed to save the data after verifying payment"
					});
				}else{
					CourseModel.findOneAndUpdate(
						{courseId: req.body.courseId},
						{
							$push: {
								"enrolledUsers.$.student": ID
							}
						}, (err) => {
							if(err){
								res.status(401).json({
									"message": "Unabe to update the course schema to add a student!"
								});
							}
						}
					)
				}
				res.status(200).json({
					"titile": "Success in making payment!",
					"paymentDetail": doc
				})
			}
		);
	} else {
		res.status(401).json({
			"status": "Failed payment verification!"
		})
	}
});

module.exports = router;