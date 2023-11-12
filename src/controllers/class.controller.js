var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const db = require("../models");
const User = db.user;
const Educator = db.educator;
const Class = db.class;

exports.getAllStudentByClassID = async (req, res) => {

    try {
        console.log(req.params.class_id);
        const _class = await Class.findOne({
            _id: req.params.class_id,
        })

        console.log(_class);
        if (!_class) {
            return res.status(404).send({ message: "Class Not found." });
        }

        return res.status(200).send(_class.student_ids);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.updateClassDetails = async (req, res) => {

    try {
        console.log(req.body);
        const { class_id, user_id } = req.body;

        const _class = await Class.findOne({
            _id: class_id,
            educator_ids: { $in: user_id }
        })

        console.log(_class);
        if (!_class) {
            return res.status(404).send({ message: "Class not found." });
        }

        // const temp_educator = {
        //     country: req.body.country,
        //     grade: req.body.grade,
        //     subject_ids: [...req.body.subject_ids, ...educator.subject_ids],
        //     description: req.body.description,
        //     profile_image_ref: req.body.profile_image_ref?req.body.profile_image_ref:educator.profile_image_ref ,
        // }
        // console.log(temp_educator);

        //  await educator.updateOne(
        //     temp_educator, {
        //     new: true,
        //     runValidators: true
        // });

        return res.status(200).send({ message: "class updated successfully!" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.createClass = async (req, res) => {

    try {
        console.log(req.body);

        const { topic, user_id, subject_ids, keywords, grade,   plan_type, class_type, sub_description,price , date_time, description,
        images, videos,documents  } = req.body;

        const _class = new Class({
            topic,
            educator_ids: [user_id],
            subject_ids: subject_ids,
            keywords: keywords,

            grade: grade,

            plan_type: plan_type,
            class_type: class_type,
            price: price,
            sub_description: sub_description,
            date_time: date_time,

            description: description,
            //question_ids

            images: images,
            videos: videos,
            documents: documents
        })

        console.log(_class);
        await _class.save();
        return res.status(200).send({ message: "class created successfully!" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


exports.addAnnouncement = async (req, res) => {

    try {
        console.log(req.body);
        const { class_id, user_id, announcement } = req.body;

        //todo: validate the announcement

        const _class = await Class.findOne({
            _id: class_id,
            educator_ids: { $in: user_id }
        })

        if (!_class) {
            return res.status(404).send({ message: "Class not found." });
        }

        const temp_class = {
            announcements:  [..._class.announcements, announcement],
        }
        console.log(temp_class);

         await _class.updateOne(
            temp_class, {
            new: true,
            runValidators: true
        });

        return res.status(200).send({ message: "announcement add successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
};


exports.addResource= async (req, res) => {

    try {
        console.log(req.body);
        const { class_id, user_id, resource } = req.body;

        //todo: validate the resource

        const _class = await Class.findOne({
            _id: class_id,
            educator_ids: { $in: user_id }
        })

        if (!_class) {
            return res.status(404).send({ message: "Class not found." });
        }

        const temp_class = {
            resources:  [..._class.resources, resource],
        }
        console.log(temp_class);

         await _class.updateOne(
            temp_class, {
            new: true,
            runValidators: true
        });

        return res.status(200).send({ message: "announcement add successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
};

// get all details of a class by id
exports.getClassDetailsById = async (req, res) => {
    try {
        const { class_id } = req.params;

        const _class = await Class.findById(class_id);

        if (!_class) {
            return res.status(404).send({ message: "Class not found." });
        }

        return res.status(200).send(_class);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
};
