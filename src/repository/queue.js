export default function queue ({ queueContext }) {
  return {
    send: send.bind(this, { queueContext }),
  };
}

function send ({ queueContext }, queueName, message) {
  return new Promise((resolve, reject) => {
    queueContext.sendMessage({ qname: queueName, message: JSON.stringify(message) }, (err, resp) => {
      if (err) {
        return reject(err);
      }
      return resolve(resp);
    });
  });
}
