const mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/playground")
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.error("Error while connecting to db.", err.message));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/ * To use regex
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true, // convert incoming data to lowercase before saving in db.
    // uppercase: true,
    trim: true, // this will remove any padding in the string.
  },
  author: { type: String, required: true },
  // Custom validator
  tags: {
    type: Array,
    // Sync Validator
    // validate: {
    //   validator: function (v) {
    //     return v && v.length > 0;
    //   },
    //   message: "A Course should have atleast one tag.",
    // },

    // Async validator
    validate: {
      isAsync: true,
      validator: function (v) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Do Async work here
            // TODO: handle case if value is empty string.This will not validate that case.
            const result = v && v.length > 0;
            resolve(result);
          }, 500);
        });
      },
      message: "A Course should have atleast one tag.",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v), // when get value this will round price value
    set: (v) => Math.round(v), // when saving data this will round value.
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "fastapi Course",
    author: "Azhar Iqbal",
    category: "web",
    tags: ["frontend"],
    isPublished: true,
    price: 10.5,
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

createCourse();
