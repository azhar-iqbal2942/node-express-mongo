const mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/playground")
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.error("Error while connecting to db.", err.message));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "fastapi Course",
    author: "Azhar Iqbal",
    tags: ["angular", "frontend"],
    isPublished: true,
    price: 20,
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  /**
   * MongoDB Comparision Operator
   * eq (equal)
   * ne (not equal)
   * gt (greater than)
   * gte (greater than or equal to)
   * lt (less than)
   * lte (less than or equal to)
   * in
   * nin (not in)
   *
   */
  const pageNumber = 2;
  const pageSize = 10;
  const courses = await Course

    // Comparison
    // .find({ author: "Azhar Iqbal" })
    // .find({ price: { $in: [10, 17, 25] } })
    // find({ price: { $gte: 10, $lte: 20 } })

    // logical operators
    // .or([{ name: "fastapi Course" }, { price: { $eq: 10 } }])
    // .and([{ author: "Azhar Iqbal" }, { price: { $eq: 10 } }])

    // Regex
    // .find({ author: /^Azhar/ }) // starts with
    // .find({ author: /Iqbal$/i }) // ends with (i will make comparison case in-sensitive)
    // .find({ author: /.*Azhar.*/ }) // contains

    // Pagination
    .find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ price: -1 })
    .count();
  // .limit(10)
  // .select({ name: 1, tags: 1, price: 1 }); // to get specified fields

  console.log(courses);
}

async function updateCourseTwoSteps(id) {
  /**
   * Query First Approach
   * In this way first we get course object if need to check any validation
   * and then update the document.
   */
  const course = await Course.findById(id);
  if (!course) return;

  course.isPublished = false;
  course.author = "New Author";
  // Second way to update instead of setting value we can update as object
  //   course.set({
  //     isPublished: false,
  //     author: "New Author",
  //   });
  const result = await course.save();
  console.log(result);
}

async function updateCoursedirectly(id) {
  /**
   With this approach we can update multiple documents in one go.
   Or we can update a specific one.
   */
  // This will update document and return stats not course object.
  //   const result = await Course.updateOne(
  //     { _id: id },
  //     {
  //       $set: {
  //         author: "Azhar",
  //         isPublished: true,
  //       },
  //     }
  //   );

  // To get update course document in return
  const course = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        author: "New Author",
        isPublished: false,
      },
    },
    { new: true }
  );

  console.log(course);
}

async function removeCourse(id) {
  // This will return stats(how many docs affected)
  //   const result = await Course.deleteOne({ _id: id });
  // To delete and return a course
  const course = await Course.findByIdAndDelete(id);
  console.log(course);
}

/*
Driver Code
*/
// getCourses();
// createCourse();
// updateCourseTwoSteps("6439a364cf18879e7cadd9f2");
// updateCoursedirectly("6439a364cf18879e7cadd9f2");
// removeCourse("6439a37c7a11951b34223395");
