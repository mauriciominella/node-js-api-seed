import service from '../services/population';

export async function compute (req, res) {
  let query;

  if (req.query) {
    query = req.query;
  }

  res
    .status(200)
    .send(
      await service(req.container.cradle).compute(query)
    );
}
