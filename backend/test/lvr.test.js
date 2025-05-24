const { expect } = require('chai');
const request = require('supertest');
const app = require('../index'); // (You'll need to export your Express app from index.js)

describe('LVR Endpoint', () => {
  it('should calculate LVR correctly (using estimated property value)', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: 500000,
        cashOutAmount: 50000,
        estimatedPropertyValue: 700000,
        propertyValuationPhysical: undefined
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('lvr');
        expect(res.body.lvr).to.be.closeTo(0.785714, 0.0001); // (500000 + 50000) / 700000 = 0.785714
        done();
      });
  });

  it('should calculate LVR correctly (using physical valuation if provided)', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: 500000,
        cashOutAmount: 50000,
        estimatedPropertyValue: 700000,
        propertyValuationPhysical: 650000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('lvr');
        expect(res.body.lvr).to.be.closeTo(0.846153, 0.0001); // (500000 + 50000) / 650000 = 0.846153
        done();
      });
  });

  it('should return 400 if loanAmount is out of range', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: 1000, // (below minimum)
        cashOutAmount: 0,
        estimatedPropertyValue: 700000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('Validate Endpoint', () => {
  it('should return valid: true for valid input', (done) => {
    request(app)
      .post('/api/validate')
      .send({
        loanAmount: 100000,
        cashOutAmount: 0,
        estimatedPropertyValue: 200000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ valid: true });
        done();
      });
  });

  it('should return 400 for invalid loanAmount', (done) => {
    request(app)
      .post('/api/validate')
      .send({
        loanAmount: 1000, // invalid
        cashOutAmount: 0,
        estimatedPropertyValue: 200000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 400 for missing estimatedPropertyValue', (done) => {
    request(app)
      .post('/api/validate')
      .send({
        loanAmount: 100000,
        cashOutAmount: 0
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 400 for cashOutAmount above allowed max', (done) => {
    request(app)
      .post('/api/validate')
      .send({
        loanAmount: 100000,
        cashOutAmount: 200000, // too high for property value
        estimatedPropertyValue: 200000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('LVR Endpoint - Additional Cases', () => {
  it('should work with minimum allowed values', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: 80000,
        cashOutAmount: 0,
        estimatedPropertyValue: 100000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.lvr).to.be.closeTo(0.8, 0.0001);
        done();
      });
  });

  it('should work with maximum allowed values', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: 2000000,
        cashOutAmount: 0,
        estimatedPropertyValue: 2500000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.lvr).to.be.closeTo(0.8, 0.0001);
        done();
      });
  });

  it('should work with missing optional fields', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: 100000,
        estimatedPropertyValue: 200000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.lvr).to.be.closeTo(0.5, 0.0001);
        done();
      });
  });

  it('should return 400 for string loanAmount', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: "notanumber",
        cashOutAmount: 0,
        estimatedPropertyValue: 200000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 400 for property value zero', (done) => {
    request(app)
      .post('/api/lvr')
      .send({
        loanAmount: 100000,
        cashOutAmount: 0,
        estimatedPropertyValue: 0
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('Validate Endpoint - Additional Cases', () => {
  it('should return 400 for negative cashOutAmount', (done) => {
    request(app)
      .post('/api/validate')
      .send({
        loanAmount: 100000,
        cashOutAmount: -1,
        estimatedPropertyValue: 200000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return 400 for propertyValuationPhysical as string', (done) => {
    request(app)
      .post('/api/validate')
      .send({
        loanAmount: 100000,
        cashOutAmount: 0,
        estimatedPropertyValue: 200000,
        propertyValuationPhysical: "notanumber"
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return valid: true for all fields present and valid', (done) => {
    request(app)
      .post('/api/validate')
      .send({
        loanAmount: 100000,
        cashOutAmount: 10000,
        estimatedPropertyValue: 200000,
        propertyValuationPhysical: 210000
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ valid: true });
        done();
      });
  });
});