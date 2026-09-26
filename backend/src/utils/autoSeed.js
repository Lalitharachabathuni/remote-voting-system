const mongoose = require('mongoose');
const Constituency = require('../models/Constituency');
const Party = require('../models/Party');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const User = require('../models/User');
const VoterProfile = require('../models/VoterProfile');
const RemoteVotingRequest = require('../models/RemoteVotingRequest');
const AuditService = require('../services/audit.service');

/**
 * Automatically seeds initial elections, constituencies, candidates and accounts
 * if the database is newly created or empty.
 */
const autoSeedIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return;
    }
    const count = await Constituency.countDocuments();
    if (count > 0) {
      console.log(`[AutoSeed] Database already initialized with ${count} constituencies.`);
      return;
    }

    console.log('[AutoSeed] Empty database detected. Auto-populating initial civic data...');

    // 1. Create Constituencies
    const vizag = await Constituency.create({
      name: 'Visakhapatnam Parliamentary Constituency',
      code: 'PC-AP-04',
      state: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      type: 'PARLIAMENTARY',
      totalElectors: 1820000
    });

    const blrSouth = await Constituency.create({
      name: 'Bengaluru South Parliamentary Constituency',
      code: 'PC-KA-26',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      type: 'PARLIAMENTARY',
      totalElectors: 2150000
    });

    const hyd = await Constituency.create({
      name: 'Hyderabad Parliamentary Constituency',
      code: 'PC-TS-09',
      state: 'Telangana',
      district: 'Hyderabad',
      type: 'PARLIAMENTARY',
      totalElectors: 1940000
    });

    // 2. Create Parties
    const parties = await Party.create([
      {
        name: 'National Democratic Alliance',
        abbreviation: 'NDA',
        symbol: 'Lotus',
        color: '#F97316',
        description: 'Centrist national democratic alliance focusing on infrastructure and digital governance.'
      },
      {
        name: 'United Progressive Front',
        abbreviation: 'UPF',
        symbol: 'Hand',
        color: '#2563EB',
        description: 'Coalition focusing on social welfare, healthcare access, and student opportunities.'
      },
      {
        name: 'Progressive Citizens Coalition',
        abbreviation: 'PCC',
        symbol: 'Bicycle',
        color: '#10B981',
        description: 'Urban governance and sustainable municipal development reform.'
      },
      {
        name: 'Independent Alliance',
        abbreviation: 'IND',
        symbol: 'Torch',
        color: '#8B5CF6',
        description: 'Independent civic leadership and academic transparency.'
      }
    ]);

    // 3. Create Candidates
    await Candidate.create([
      {
        fullName: 'Dr. Ramesh Varma',
        party: parties[0]._id,
        constituency: vizag._id,
        age: 52,
        education: 'Ph.D. in Public Policy, IIT Madras',
        manifestoSummary: 'Expanding industrial tech corridors, smart coastal urban transit, and green port infrastructure.'
      },
      {
        fullName: 'Ananya Sharma',
        party: parties[1]._id,
        constituency: vizag._id,
        age: 44,
        education: 'M.S. in Environmental Economics',
        manifestoSummary: 'Universal digital healthcare clinics, municipal clean energy, and vocational youth training.'
      },
      {
        fullName: 'K. Srikanth Reddy',
        party: parties[2]._id,
        constituency: vizag._id,
        age: 39,
        education: 'B.Tech & MBA, IIM Bangalore',
        manifestoSummary: 'Startups empowerment, public transport modernization, and educational scholarships for displaced youth.'
      },
      {
        fullName: 'Prof. Meenakshi Sundaram',
        party: parties[3]._id,
        constituency: vizag._id,
        age: 58,
        education: 'D.Sc. in Maritime Engineering',
        manifestoSummary: 'Civic transparency, decentralized municipal budgeting, and citizen audit boards.'
      },
      {
        fullName: 'Arjun Venkatesh',
        party: parties[0]._id,
        constituency: blrSouth._id,
        age: 46,
        education: 'B.E. Computer Science, IISc',
        manifestoSummary: 'Metro expansion, AI-driven traffic management, and cyber security hubs.'
      },
      {
        fullName: 'Deepa Rao',
        party: parties[1]._id,
        constituency: blrSouth._id,
        age: 42,
        education: 'LL.M., National Law School',
        manifestoSummary: 'Lake restoration, citizen welfare funds, and affordable public housing.'
      }
    ]);

    // 4. Create Elections
    const mainElection = await Election.create({
      title: 'National Parliamentary General Elections 2026',
      code: 'GEN-ELEC-2026',
      description: 'Nationwide remote digital voting demonstration election enabling eligible remote voters to cast encrypted anonymous ballots.',
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      constituencies: [vizag._id, blrSouth._id, hyd._id],
      remoteVotingEnabled: true,
      remoteRegistrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    });

    // 5. Create Demo Accounts
    const demoVoter = await User.create({
      email: 'voter@voteremote.org',
      password: 'Voter@2026',
      fullName: 'Vikram Aditya Rao',
      phone: '+919876543210',
      dateOfBirth: new Date('1997-08-15'),
      role: 'VOTER',
      accountStatus: 'ACTIVE'
    });

    await VoterProfile.create({
      userId: demoVoter._id,
      syntheticVoterId: 'VID-2026-X89K2Q',
      registeredConstituency: vizag._id,
      registeredState: 'Andhra Pradesh',
      registeredDistrict: 'Visakhapatnam',
      currentCity: 'Bengaluru',
      currentState: 'Karnataka',
      currentPincode: '560100',
      occupation: 'Senior Software Engineer (Relocated for Work)',
      verificationStatus: 'VERIFIED'
    });

    await RemoteVotingRequest.create({
      voter: demoVoter._id,
      election: mainElection._id,
      constituency: vizag._id,
      currentCity: 'Bengaluru',
      currentState: 'Karnataka',
      reason: 'Relocated to Bengaluru for IT employment, away from registered home constituency.',
      status: 'APPROVED',
      hasVoted: false
    });

    await User.create({
      email: 'admin@voteremote.org',
      password: 'Admin@2026',
      fullName: 'Smt. Radhika Krishnan',
      phone: '+919811223344',
      dateOfBirth: new Date('1980-03-12'),
      role: 'ADMIN',
      accountStatus: 'ACTIVE'
    });

    await User.create({
      email: 'officer@voteremote.org',
      password: 'Officer@2026',
      fullName: 'K. Narayana Murthy',
      phone: '+919833445566',
      dateOfBirth: new Date('1985-11-20'),
      role: 'ELECTION_OFFICER',
      accountStatus: 'ACTIVE'
    });

    await AuditService.logEvent({
      action: 'SYSTEM_AUTO_INITIALIZED',
      actorRole: 'SYSTEM',
      actorId: 'STARTUP_DAEMON',
      details: {
        election: mainElection.code,
        seededConstituencies: 3
      },
      ipAddress: '127.0.0.1'
    });

    console.log('[AutoSeed] Production database successfully initialized with constituencies, candidates, and elections.');
  } catch (err) {
    console.error('[AutoSeed Error]', err.message);
  }
};

module.exports = autoSeedIfEmpty;
