// backend/routes/election.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getResults,
  createDemoElection,
  recordVote
} = require('../controllers/electionController');
const { syncVotes } = require('../controllers/syncController');

router.get('/results', protect, getResults);
router.post('/create-demo', protect, createDemoElection);
router.post('/record-vote', protect, recordVote);
router.post('/sync-votes', protect, syncVotes);

module.exports = router;