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

export async function addAsync (req, res) {
  let countryCode;

  if (req.params && req.params.countryCode) {
    countryCode = req.params.countryCode;
  }

  return res
    .status(200)
    .send(
      await service(req.container.cradle).addAsync(countryCode)
    );
}
