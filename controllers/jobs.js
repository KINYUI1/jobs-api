const {StatusCodes}= require('http-status-codes')
const Job = require('../models/Job')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJobs = async(req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userId})
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getJob = async (req,res)=>{
    const {id:jobId} = req.params
    const userId = req.user.userId
    const job = await Job.findOne({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({msg:'get job',job})
}

const createJob = async (req,res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const deleteJob = async (req,res)=>{
    const {id:jobId} = req.params
    const userId = req.user.userId
    const job = await Job.findOneAndDelete({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({msg:'job deleted',job})
}

const updateJob = async (req,res)=>{
    const {id:jobId} = req.params
    const userId = req.user.userId
    const {company,position} = req.body
    if(company ==="" || position === ""){
        throw new BadRequestError('Company or podsition cannot be empty')
    }
    const job = await Job.findOneAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({msg:'job updated',job})
}

module.exports = {getAllJobs,getJob,createJob,deleteJob,updateJob}