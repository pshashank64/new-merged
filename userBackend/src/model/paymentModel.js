const mongoose = require('mongoose');

const paymentDetailsSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Courses"
	},
	orderId: {
		type: String,
		required: true
	},
	receiptId: {
		type: String
	},
	paymentId: {
		type: String,
	},
	signature: {
		type: String,
	},
	amount: {
		type: Number
	},
	currency: {
		type: String
	},
	status: {
		type: String
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('PaymentDetail', paymentDetailsSchema)