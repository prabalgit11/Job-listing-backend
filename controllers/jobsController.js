const JobListing = require("../models/jobListingModel");

const addJob = async (req, res) => {
    try {
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
            skillsRequired,
        } = req.body;


        if (
            !companyName ||
            !jobPosition ||
            !jobDescription ||
            !jobType ||
            !aboutCompany ||
            !monthlySalary ||
            !remoteOnsite ||
            !addLogoURL ||
            !skillsRequired
        ) {
            return res.send({
                status: 'fail',
                message: "Please provide all required fields"
            });
        }


        const updatedJobLocation = jobLocation === "" ? "Remote" : jobLocation;

        const updatedLogoURL = req.body.addLogoURL
            ? req.body.addLogoURL
            : "https://eu.ui-avatars.com/api/?name=John+Doe&size=250";


        const newJobListing = new JobListing({
            companyName,
            addLogoURL: updatedLogoURL,
            jobPosition,
            jobType,
            jobLocation: updatedJobLocation,
            jobDescription,
            monthlySalary,
            remoteOnsite,
            aboutCompany,
            skillsRequired,
        });

        await newJobListing.save();

        res.send({
            status: 'pass',
            message: "Job listing created successfully"
        });
    } catch (error) {
        res.send({
            status: 'fail',
            message: 'Job listing is not created'
        });
    }
};

const updateJob = async (req, res) => {
    try {
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
            skillsRequired,
        } = req.body;


        if (
            !companyName ||
            !jobPosition ||
            !jobType ||
            !jobDescription ||
            !addLogoURL ||
            !skillsRequired ||
            !aboutCompany ||
            !monthlySalary ||
            !remoteOnsite
        ) {
            return res.send({
                status: 'fail',
                message: "Please provide all required fields"
            });
        }

        const updatedJobLocation = jobLocation === "" ? "Remote" : jobLocation;

        const updatedLogoURL = req.body.addLogoURL
            ? req.body.addLogoURL
            : "https://eu.ui-avatars.com/api/?name=John+Doe&size=250";


        const jobListing = await JobListing.findById(jobId);

        if (!jobListing) {
            return res.send({
                status: 'fail',
                message: "Job listing not found"
            });
        }


        jobListing.companyName = companyName;
        jobListing.jobType = jobType;
        jobListing.jobPosition = jobPosition;
        jobListing.jobLocation = updatedJobLocation;
        jobListing.jobDescription = jobDescription;
        jobListing.addLogoURL = updatedLogoURL;
        jobListing.monthlySalary = monthlySalary;
        jobListing.remoteOnsite = remoteOnsite;
        jobListing.aboutCompany = aboutCompany;
        jobListing.skillsRequired = skillsRequired;

        await jobListing.save();
        res.send({
            status: 'pass',
            message: "Job listing updated successfully"
        });
    } catch (error) {
        res.send({
            status: 'fail',
            message: "Job listing is not updated successfully"
        });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const { skills, searchTerm } = req.query;

        const filter = {};
        if (skills) filter.skillsRequired = { $in: skills.split(",") };
        if (searchTerm) filter.jobPosition = new RegExp(searchTerm, "i");


        const jobListings = await JobListing.find(filter);

        res.send({
            status: 'pass',
            message: 'All jobs fatch successfully',
            jobListings
        });
    } catch (error) {
        res.send({
            status: 'fail',
            message: 'All jobs are not fatch successfully'
        });
    }
};

const getOneJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;


        const jobListing = await JobListing.findById(jobId);

        if (!jobListing) {
            return res.send({
                status: 'fail',
                message: "Job listing not found"
            });
        }

        res.send({
            jobListing
        });
    } catch (error) {
        res.send({
            status: 'fail',
            message: error.message
        });
    }
};

module.exports = {
    addJob,
    updateJob,
    getOneJob,
    getAllJobs,
}