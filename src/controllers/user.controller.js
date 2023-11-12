var bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;
// const Educator = db.educator;

exports.updateUserPassword = async (req, res) => {
    try {
        const { user_id, old_password, new_password } = req.body;

        // Find the user by user_id
        const user = await User.findOne({ _id: user_id });
        console.log(user);

        if (!user) {
            return res.status(404).send({ message: "user Not found." });
        }

        // Check if the old password matches
        const passwordIsValid = bcrypt.compareSync(
            old_password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid old Password!" });
        }

        // Update the password
        user.password = bcrypt.hashSync(new_password, 8);
        await user.save();

        return res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.getEnum = async (req, res) => {

    try {
        console.log(req.body.enum_name);
        const enum_name = req.body.enum_name;
        if (enum_name === "country") {
            console.log(db.COUNTRIES);
            return res.status(200).send({ enum: db.COUNTRIES });
        }
        else if (enum_name === "grade") {
            return res.status(200).send({ enum: db.GRADES });
        }

        return res.status(400).send("enum name not found");
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
