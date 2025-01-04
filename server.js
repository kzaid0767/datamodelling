import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 8082 || process.env.PORT;
const uri = "mongodb+srv://kzaid0767:Reometry123$@cluster0.8d1aj.mongodb.net/users-db";

const connectToDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
}

connectToDB();

//addres schema
const addressSchema = new mongoose.Schema(
    {
        street: String,
        city: String,
        state: String,
        zipCode: Number,
    },
    { timestamps: true }
);

//user schema
const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        address: addressSchema, //embedded document
    },
    { timestamps: true }
);

//compile user schema
const User = mongoose.model("User", userSchema);

const createUser = async () => {
    try {
        const user = await User.create({
            name: "Kassim Zaid",
            email: "7l2Xf@example.com",
            address: {
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zipCode: 10001,
            },
        });
        console.log(user);
    } catch (error) {
        console.log(error);
    }
}

//array of subdocuments

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: Number,
});

const classSchema = new mongoose.Schema({
    name: String,
    students: [studentSchema],
});


//compile class schema
const Class = mongoose.model("Class", classSchema);

const createClass = async () => {
    try {
        const class1 = await Class.create({
            name: "Math Class",
            students: [
                { name: "Alice", age: 12, grade: 9 },
                { name: "Bob", age: 13, grade: 10 },
            ],
        });
        console.log(class1);
    } catch (error) {
        console.log(error);
    }
}

//data referencing
const courseSchema = new mongoose.Schema({
    name: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model("Course", courseSchema);

const createCourse = async () => {
    try {    
        const course = await Course.create({
            name: "Math Course",
            students: [User._id],
        });
        console.log(course);
    } catch (error) {
        console.log(error);
    }
}


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})