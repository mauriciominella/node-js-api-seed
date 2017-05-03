import { InternalServerError } from 'meaning-error';

export default function addNewCountryJob ({ mongoContext, queueContext, countriesService }) {
  return {
    addCountryFromCode: addCountryFromCode.bind(this, { mongoContext, queueContext, countriesService }),
  };
}

export async function addCountryFromCode ({ mongoContext, queueContext, countriesService }, message) {
  if (message.source !== 'code') {
    return { status: 'not_executed' };
  }

  let result;

  try {
    result = await countriesService.add(message.data);
  } catch (err) {
    throw new InternalServerError(`error adding country from code ${message.data}`);
  }

  return { status: 'executed', result };
}
