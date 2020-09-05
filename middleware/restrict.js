const jwt = require("jsonwebtoken")

function restrict(department) {
	// use a scale, since admins should still be able to access basic endpoints
	const departments = ["admin", "sales", "marketing"]

	return async (req, res, next) => {
		const authError = {
			message: "Invalid credentials",
		}

		try {
			// token is coming from the client's cookie jar, in the "Cookie" header
			const token = req.cookies.token
			if (!token) {
				return res.status(401).json(authError)
			}

			// decode the token, re-sign the payload, and check if signature is valid
			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json(authError)
				}

				// make sure the user's role is above or the same as the required role
				if (department && departments.indexOf(decoded.userDepartment) < departments.indexOf(department)) {
					return res.status(403).json({
						message: "Wrong department, you shall not pass",
					})
				}

				// we know the user is authorized at this point,
				// make the token's payload available to other middleware functions
				req.token = decoded

				next()
			})
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict;