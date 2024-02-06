const { Kafka} = require ('kafkajs');

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'soal-svc-client',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  });

  const producer = kafka.producer();

exports.createTask = async (message) => {
    try{
        await producer.connect();
      
        await producer.send({
          topic: 'create-task',
          messages: [
            { value: JSON.stringify(message) },
          ],
        });
      
        await producer.disconnect();
    } catch (err) {
      console.error('[create Task] Error connecting to Kafka:', err);
    }
  };

  exports.updateTask = async (message) => {
    try{
        await producer.connect();
      
        await producer.send({
          topic: 'update-task',
          messages: [
            { value: JSON.stringify(message) },
          ],
        });
      
        await producer.disconnect();
    } catch (err) {
      console.error('[create Task] Error connecting to Kafka:', err);
    }
  };

// Handle SIGTERM signal to gracefully close the consumer on process termination
process.on('SIGTERM', async () => {
    await producer.disconnect();
    process.exit(0);
  });