const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {   
      question: String,
      answers: [String]
    },
    {
      timestamps: true,
    }
  );
  const Question = mongoose.model('Question', questionSchema);
  
  createQuestion = async() => {
    
    for(let i = 0; i < 8; i++){
        let question= `question${i}`
        let answers = [`answer${i}`, `answer${i}`, `answer${i}`]
        await Question.create({question, answers})
        console.log(question, answers)
    }

  }

//   createQuestion()

  module.exports = Question;