import service from '../services/countries';

export async function add (req, res) {
  let countryCode;

  if (req.params && req.params.countryCode) {
    countryCode = req.params.countryCode;
  }

  res
    .status(200)
    .send(
      await service(req.container.cradle).add(countryCode)
    );
}
