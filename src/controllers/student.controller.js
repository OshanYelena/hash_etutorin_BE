const db = require("../models");
const mongoose = require('mongoose');
const User = db.user;
const Student = db.student;
const Class = db.class;

exports.getStudentById = async (req, res) => {

    try {
        console.log(req.params.user_id);
        const student = await Student.findOne({
            user_id: req.params.user_id,
        }).populate('user_id')

        console.log(student);
        if(!student){
            return res.status(404).send({ message: "Student Not found." });
        }

        return res.status(200).send(student);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

//update country, grade, subject, description
exports.updateStudentBasicDetails =async (req, res) => {

    try {
        const { user_id, country, grade, subject_ids, description,profile_image_ref } = req.body;

        const student = await Student.findOne({
            user_id: user_id,
        })

        console.log(student);
        if(!student){
            return res.status(404).send({ message: "Student not found." });
        }
        const temp_student = {
            country:country,
            grade: grade,
            subject_ids: [...subject_ids, ...student.subject_ids],
            description: description,
            profile_image_ref: profile_image_ref?profile_image_ref:student.profile_image_ref 
        }
        console.log(temp_student);

        await student.updateOne(
            temp_student, {
            new: true,
            runValidators: true
        });

        return res.status(200).send({ message: "Student updated successfully!" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

//get all classes by student id
exports.getAllClassesByStudentId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const userIdObj = new mongoose.Types.ObjectId(user_id);

        const _classes = await db.student.findOne({user_id: user_id}).populate('class_ids')


        // const _classes = await Class
        // .find({ student_ids: { $in: [userIdObj] } })
        // .select("-student_ids -resources -announcements -description -keywords  -price -sub_description -images -videos -documents")
        // .populate('educator_ids', 'first_name last_name email')

        if (!_classes) {
            return res.status(404).send({ message: "Classes not found." });
        }

        console.log(_classes);

        return res.status(200).json(_classes);
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
};
