var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const db = require("../models");
const User = db.user;
const Educator = db.educator;
const ChatMsg = db.chat_msg;
const Class = db.class;

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User
            .find()
            .select(["_id", "first_name", "last_name", "email", "role"])
        console.log(users);

        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

//get all users related to student enrolled classes
exports.getContactsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        //check if user exists
        const user = await User.find({ "_id": userId });
        if (!user) return res.status(404).send({ message: "User Not found." });

        //get all classes that student is enrolled in and get all
        const classes = await Class
            .find({
                $or: [
                    { student_ids: { $in: [userId] } },
                    { educator_ids: { $in: [userId] } }
                ]
            })
            .select(["educator_ids", "student_ids"]);

        //extracting student Ids and educator Ids and creating a contact list
        const studentContactList = classes.reduce((acc, curr) => {
            //concatenating student_ids from each object to the accumulator array
            acc = acc.concat(curr.student_ids.map(id => id.toString()), curr.educator_ids.map(id => id.toString()));
            return acc;
        }, []);

        //removing duplicates using Set
        const uniqueStudentContactList = [...new Set(studentContactList)];
        console.log(uniqueStudentContactList);

        //get all users that are in the contact list
        const contacts = await User
            .find({ "_id": { $in: uniqueStudentContactList } })
            .select(["_id", "first_name", "last_name", "email", "role"]);

        return res.status(200).send(contacts);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

//get messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.body;

        //get all msgs that contains sender and receiver ids in users array in chatMsg model
        const messages = await ChatMsg
            .find({ users: { $all: [sender, receiver] } })
            .populate("sender", "first_name last_name")
            .populate("receiver", "first_name last_name")
            .sort({ timestamp: 1 });

        return res.status(200).send(messages);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
