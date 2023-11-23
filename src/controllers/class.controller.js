var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const s3 = require("aws-sdk");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const db = require("../models");
const User = db.user;
const Educator = db.educator;
const Class = db.class;

const accessKeyId = process.env.NEXT_PUBLIC_AWS_S3_ACCESS_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY;
const region = process.env.NEXT_PUBLIC_AWS_S3_REGION;
const Bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

exports.getAllStudentByClassID = async (req, res) => {
  try {
    console.log(req.params.class_id);
    const _class = await Class.findOne({
      _id: req.params.class_id,
    });
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
      educator_ids: { $in: user_id },
    });

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
    const {
      topic,
      user_id,
      subject_ids,
      keywords,
      grade,
      plan_type,
      class_type,
      sub_description,
      price,
      date_time,
      description,
      images,
      videos,
      documents,
    } = req.body;

    const count = await db.class.countDocuments();
    console.log(subject_ids);
    if (count) {
      const _class = new Class({
        classNo: count + 1,
        topic,
        educator_ids: [user_id],
        subject_Id: [subject_ids],
        keywords: keywords,
        grade: parseInt(grade),
        plan_type: plan_type,
        class_type: class_type,
        price: price,
        sub_description: sub_description,
        date_time: date_time,

        description: description,
        images: images,
        videos: videos,
        documents: documents,
      });
      console.log(_class);
      const saveClass = await _class.save();
      return res.status(200).json({ classId: saveClass._id });
    } else {
      const _class = new Class({
        classNo: 1,
        topic,
        educator_ids: [user_id],
        subject_id: subject_ids,
        keywords: keywords,
        grade: parseInt(grade),
        plan_type: plan_type,
        class_type: class_type,
        price: price,
        sub_description: sub_description,
        date_time: date_time,

        description: description,
        images: images,
        videos: videos,
        documents: documents,
      });
      console.log(_class);
      const saveClass = await _class.save();
      return res.status(200).json({ classId: saveClass._id });
    }
  } catch (error) {
    console.log(error);
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
      educator_ids: { $in: user_id },
    });

    if (!_class) {
      return res.status(404).send({ message: "Class not found." });
    }

    const temp_class = {
      announcements: [..._class.announcements, announcement],
    };
    console.log(temp_class);

    await _class.updateOne(temp_class, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send({ message: "announcement add successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

exports.addResource = async (req, res) => {
  try {
    console.log(req.body);
    const { class_id, user_id, resource } = req.body;

    //todo: validate the resource

    const _class = await Class.findOne({
      _id: class_id,
      educator_ids: { $in: user_id },
    });

    if (!_class) {
      return res.status(404).send({ message: "Class not found." });
    }

    const temp_class = {
      resources: [..._class.resources, resource],
    };
    console.log(temp_class);

    await _class.updateOne(temp_class, {
      new: true,
      runValidators: true,
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

    const _class = await Class.findById(class_id)
      .populate("subject_Id")
      .populate("educator_ids")

    if (!_class) {
      return res.status(404).send({ message: "Class not found." });
    }

    return res.status(200).send(_class);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

exports.enrollStudents = async (req, res) => {
  const { classId, studentId, date_time } = req.body;

  console.log(req.body);
  try {
    if (!classId || !studentId) throw new Error("Invalid Ids");
    const existClass = await db.class.findById(classId);
    if (!existClass) throw new Error("Invalid Class Id");
    const existStudent = await db.user.findById(studentId);
    if (!existStudent) throw new Error("Invalid User");
    const student = await db.student.findOne({ user_id: studentId });
    const enrollDetails = {
      student_id: studentId,
      dateTime: date_time,
      planType: existClass.plan_type,
      classType: existClass.class_type,
    };

    const saveClassDetails = {
      class_id: classId,
      dateTime: date_time,
      planType: existClass.plan_type,
      classType: existClass.class_type,
    };

    existClass.student_ids.push(enrollDetails);
    student.class_ids.push(saveClassDetails);
    await existClass.save();
    await student.save();

    return res.status(201).json("updated");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

//search Api
exports.getAllClasses = async (req, res) => {
  const classes = await db.class.find().populate("educator_ids").populate('subject_Id');

  return res.status(200).json({ classes: classes });
};

async function uploadFileToS3(file, fileName, courseId) {
  console.log(fileName);
  const directoryPath = `educators/courses/images/`;
  const Key = `${directoryPath}${Date.now()}${fileName}`;
  const url = await new Upload({
    client: new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    }),

    params: {
      // ACL: "public-read",
      Bucket,
      Key: Key,
      Body: file,
      ContentType: "image/jpg/jpeg/pdf",
    },
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false, // optional manually handle dropped parts
  })
    .done()
    .then((data) => {
      return data.Location;
    })
    .catch((err) => {
      return err;
    });
  return url;
}

async function s3Uploader(imageData, courseId) {
  try {
    const file = imageData;
    console.log(file);
    const fileName = await uploadFileToS3(
      imageData.buffer,
      imageData.originalname,
      courseId
    );

    return fileName;
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

exports.uploadS3 = async (req, res) => {
  try {
    const imageArra = [];
    const courseId = req.body.courseId;
    const files = req.files;
    const fileLength = files.length;
    console.log(files);
    if (!files && !courseId) {
      return res
        .status(400)
        .json({ success: false, error: "File is required" });
    }

    const fileUploadPromises = files.map(async (file) => {
      const result = await s3Uploader(file, courseId);
      imageArra.push(result);
      console.log(result);
      if (fileLength === imageArra.length) return true;
    });

    const uploadResults = await Promise.all(fileUploadPromises);

    if (uploadResults) {
      const excistClass = await db.class.findById(courseId);
      imageArra.map((upladedUrl) => {
        excistClass.images.push(upladedUrl);
      });
      await excistClass.save();
      return res.status(200).json({ status: true });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
