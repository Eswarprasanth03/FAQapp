const chai = require('chai');
const expect = chai.expect;
const request = require('supertest'); // To make API requests

const app = require('../app'); // Assuming your app is exported from a file named app.js

describe('FAQ API', () => {
  it('should create a new FAQ', async () => {
    const response = await request(app)
      .post('/api/faqs')
      .send({
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine.',
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('question');
    expect(response.body).to.have.property('answer');
  });

  it('should get FAQs with language support', async () => {
    const response = await request(app).get('/api/faqs?lang=en');
    
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body[0]).to.have.property('question');
  });
});
