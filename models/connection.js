const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    connectionName : {type: String, required: [true, 'Connection Name is required']},
    connectionTopic: {type: String,required: [true, 'Connection Topic is required'] },
    details:{type: String,required: [true, 'Details are required'],
      minLength: [5, 'the details should have at least 5 characters']},
    date: { type: String, required: [true, 'Date is required']},
    startTime: {type: String, required: [true, 'Start Time is required'] },
    endTime: {type: String, required: [true, 'End Time is required']},
    hostName: {type: String, required: [true, 'Host Name is required']},
    author: {type: Schema.Types.ObjectId, ref: 'User' },
    location: {type: String, required: [true, 'Location is required']},
    imageUrl: {type: String, required: [true, 'Image URL is required'],
      minLength: [10, 'the Image URL should have at least 10 characters']
      } 
    },
    {timestamps: true}
    );


connectionSchema.statics.getTopics= function(connections) {
    const connectionTopic = [];
  for (let i = 0; i < connections.length; i++){
      if (!connectionTopic.includes(connections[i].connectionTopic)){
        connectionTopic.push(connections[i].connectionTopic);
      }
    
  }
  return connectionTopic;
}


module.exports = mongoose.model('connection', connectionSchema);