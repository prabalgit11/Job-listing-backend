const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();


const userController = require("./controllers/userController");
const jobsController = require("./controllers/jobsController");

app.get('/', (req, res) => {
    res.send(' Backend working')
});

app.post('/user/register', async (req, res) => {
    const { register } = userController;
    const result = await register(req.body);
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }

});


app.post('/user/login', async (req, res) => {
    const { login } = userController;
    const result = await login(req.body);
    if (result.success) {
        res.send({
            success: 'pass',
            token: result.token
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});

app.post('/job/add', async (req, res) => {

    const { companyName,
        jobPosition,
        jobType,
        jobLocation,
        jobDescription,
        addLogoURL,
        monthlySalary,
        remoteOnsite,
        aboutCompany,
        skillsRequired, } = req.body;

    const { addJob } = jobsController;

    const result = await addJob({
        token,
        companyName,
        jobPosition,
        jobType,
        jobLocation,
        jobDescription,
        addLogoURL,
        monthlySalary,
        remoteOnsite,
        aboutCompany,
        skillsRequired,
    });
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});



app.patch('/job/update/:id', async (req, res) => {
    const jobId = req.params.id;

    const {
        companyName,
        jobPosition,
        jobType,
        jobLocation,
        jobDescription,
        addLogoURL,
        monthlySalary,
        remoteOnsite,
        aboutCompany,
        skillsRequired } = req.body.jobupdate;

    const { updateJob } = jobsController;

    const result = await updateJob({
        jobId,
        companyName,
        jobPosition,
        jobType,
        jobLocation,
        jobDescription,
        addLogoURL,
        monthlySalary,
        remoteOnsite,
        aboutCompany,
        skillsRequired,
    });
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});

app.get('/job/alljobs', async (req, res) => {
    const { skills, searchTerm } = req.query;
    const { getAllJobs } = jobsController;

    const result = await getAllJobs(skills, searchTerm);
    if (result.success) {
        res.send({
            success: 'pass',
            data: result.data
        });
    }
    else {
        res.send({
            success: 'fail',
            message: result.message
        });
    }
});

app.get('job/jobs/:id', async (req, res) => {
    const jobId = req.params.id;
    const { getOneJob } = jobsController;
    const result = await getOneJob({ jobId });
    if (result.success) {
        res.send({
            success: 'pass',
            message: result.message
        })
    } else {
        res.send({
            success: 'fail',
            message: result.message
        })
    }
})


app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("Server is running on http://localhost:3000"))
        .catch((error) => console.log(error))

});
