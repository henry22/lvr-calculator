const { expect } = require('chai');
const request = require('supertest');
const app = require('../index'); // (You’ll need to export your Express app from index.js)

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