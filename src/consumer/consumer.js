module.exports = async ({ client, config_consumer, topic, slack }) => {
  const consumer = await client.consumer(config_consumer);

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { package, version } = JSON.parse(message.value.toString());

      const text = `:package: ${package}@${version} released\n<https://www.npmjs.com/package/${package}/v/${version}|Check it out on NPM>`;

      await slack.send({
        text,
        username: 'Package bot',
      });
    },
  });

  return consumer;
};
