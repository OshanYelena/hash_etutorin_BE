var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const db = require("../models");
const User = db.user;
const Educator = db.educator;
const BankDetail = db.bank_detail;
const Classes = db.class;

exports.getEducatorById = async (req, res) => {
  try {
    console.log(req.params.user_id);
    const educator = await Educator.findOne({
      user_id: req.params.user_id,
    }).populate("user_id").populate("subject_ids");

    console.log(educator);
    if (!educator) {
      return res.status(404).send({ message: "Educator Not found." });
    }

    return res.status(200).send(educator);
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error.message });
  }
};

exports.updateEducatorBasicDetails = async (req, res) => {
  try {
    const {
      user_id,
      country,
      grades,
      subject_ids,
      description,
      profile_image_ref,
    } = req.body;
    console.log(user_id);

    const educator = await Educator.findOne({
      user_id: user_id,
    });

    if (!educator) {
      return res.status(404).send({ message: "Educator not found." });
    }

    const temp_educator = {
      country: country,
      grades: [...grades, ...educator.grades],
      subject_ids: [...subject_ids, ...educator.subject_ids],
      description: description,
      profile_image_ref: profile_image_ref
        ? profile_image_ref
        : educator.profile_image_ref,
    };
    console.log(temp_educator);

    await educator.updateOne(temp_educator, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send({ message: "Educator updated successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

exports.updateEducatorBankDetails = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    console.log(req.params.user_id);

    const educator = await Educator.findOne({
      user_id: req.body.user_id,
    });
    console.log(educator);
    if (!educator) {
      return res.status(404).send({ message: "Educator not foud." });
    }

    const { bank_name, branch_name, account_number, account_holder_name } =
      req.body;

    //create bank detail and save
    const bankDetail = new BankDetail({
      bank_name: bank_name,
      branch_name: branch_name,
      account_number: account_number,
      account_holder_name: account_holder_name,
    });

    //transaction start
    session.startTransaction();
    const temp_bankDetail = await bankDetail.save({ session });
    console.log(temp_bankDetail);
    //add bank detail id to educator bank detail array
    educator.bank_details_ids.push(temp_bankDetail._id);
    await educator.save({ session });

    //transaction end
    await session.commitTransaction();

    return res
      .status(200)
      .send({ message: "Educator bank details updated successfully!" });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).send({ message: error.message });
  }
};

exports.updateEducatorAdditionalDetails = async (req, res) => {
  try {
    const educator = await Educator.findOne({
      user_id: req.body.user_id,
    });

    console.log(educator);
    if (!educator) {
      return res.status(404).send({ message: "educator not found." });
    }
    const temp_educator = {
      facebook_link: req.body.facebook_link,
      linkedin_link: req.body.linkedin_link,
      cv_ref: req.body.cv_ref,
    };
    console.log(temp_educator);

    await educator.updateOne(temp_educator, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send({ message: "Educator updated successfully!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.getAllCoursesByEducatorId = async (req, res) => {
  const userId = req.header("userId");
  console.log(userId);
  try {
    if (!userId) throw new Error("Invalid userId");

    const educator = await db.educator.findOne({user_id: userId});
    if (!educator) throw new Error("Invalid user Id");
    const classes = await Classes.find({educator_ids: userId}).populate("subject_Id");

    return res.status(200).json({ classes: classes });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
