const express = require('express')
const router = express.Router()

const jobCtrl = require('../controllers/jobs')

router.get('/',jobCtrl.getAllJobs)
router.post('/',jobCtrl.createJob)
router.get('/:id',jobCtrl.getJob)
router.patch('/:id',jobCtrl.updateJob)
router.delete('/:id',jobCtrl.deleteJob)

module.exports = router