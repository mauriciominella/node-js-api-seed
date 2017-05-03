describe('Population API', () => {
  describe('compute', async () => {
    before(async () => {
      await mongo.collection('cities').insertOne(data.singleCity);
    });

    after(async () => {
      await mongo.collection('cities').drop();
    });

    it('response schema', async (done) => {
      try {
        const schema = Joi.object().keys({
          cityName: Joi.string(),
          radiusInKm: Joi.number(),
          population: Joi.number(),
          numberOfCities: Joi.number(),
        });

        const response = await request.get('/population/compute?cityName=Single%20City&radiusInKm=0');
        joiAssert(response.body, schema);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('should return a BadRequestError when cityName is not informed', async (done) => {
      try {
        const response = await request.get('/population/compute?radiusInKm=0');
        expect(response.body).to.have.property('error_name', 'BadRequestError');
        expect(response.status).to.be.equal(400);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('should return a BadRequestError when radiusInKm is not informed', async (done) => {
      try {
        const response = await request.get('/population/compute?cityName=Mumbai');
        expect(response.body).to.have.property('error_name', 'BadRequestError');
        expect(response.status).to.be.equal(400);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('should return not found when city does not exist', async (done) => {
      try {
        const response = await request.get('/population/compute?cityName=Mumbai&radiusInKm=30');
        expect(response.body).to.not.have.property('error_name', 'BadRequestError');
        expect(response.status).to.be.equal(404);
        done();
      } catch (e) {
        done(e);
      }
    });

    it('should return its own population when radius is 0', async (done) => {
      try {
        const response = await request.get('/population/compute?cityName=Single%20City&radiusInKm=0');
        expect(response.body).to.not.have.property('population', 200);
        expect(response.status).to.be.equal(200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
