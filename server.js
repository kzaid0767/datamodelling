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

//Blogpost schema and comment schema to model one to many relationship
const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const commentSchema = new mongoose.Schema({
    content: String,
    blogPost: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" },
});

const Comment = mongoose.model("Comment", commentSchema);
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

const createBlogPost = async () => {
    try {
        const blogPost = await BlogPost.create({
            title: "My Blog Post",
            content: "This is my blog post.",
            
        });
        console.log(blogPost);
    } catch (error) {
        console.log(error);
    }
}

const createComment = async () => {
    //1.find blogpost
    const blogPost = await BlogPost.findById('677929d6497f96ceb58f3f9c');
    //2.create comment
    const comment = await Comment.create({
        content: "This is a socond comment.",
        blogPost: blogPost._id,
    })
    //3.add comment to blogpost
    blogPost.comments.push(comment._id);
    //4.save blogpost
    await blogPost.save();
    console.log(comment);
}

//Many to many relationship team and sponsors
const teamSchema = new mongoose.Schema({
    name: String,
    sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sponsor" }],
});

const sponsorSchema = new mongoose.Schema({
    name: String,
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
});

const Team = mongoose.model("Team", teamSchema);
const Sponsor = mongoose.model("Sponsor", sponsorSchema);

const createTeam = async () => {
    try {
        const team = await Team.create({
            name: "Simba SC",
        });
        console.log(team);
    } catch (error) {
        console.log(error);
    }
}

const createSponsor = async () => {
    const team = await Team.findById('677933f7b44f08bf23a0de0f');
    const sponsor = await Sponsor.create({
        name: "Nike",
        teams: [team._id],
    })
    team.sponsors.push(sponsor._id);
    await team.save();
    console.log(sponsor);
}

const addSponsorToTeam = async () => {
    const team = await Team.findById('677933f7b44f08bf23a0de0f');
    const sponsor = await Sponsor.findById('67793603faf8ed96669b1d5b');
    team.sponsors.push(sponsor._id);
    await team.save();
    console.log(team);
}



const addTeamToSponsor = async () => {
    const team = await Team.findById('677933c659ad5d80c0da9559');
    const sponsor = await Sponsor.findById('6779367cb88b868473a1e461');
    sponsor.teams.push(team._id);
    await sponsor.save();
    console.log(sponsor);
}

addTeamToSponsor()

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

/* 
1. one to one relationship - can be by using embedded document or referencing
2. one to many relationship
3. many to many relationship
*/