
var crypto = require('crypto');

exports.tagAnswer = function (answer, user_id, callback = () => { }) {
    // ignore Q25 of "want to continue?"
    if (answer["Question_ID"] === 25)
        return;
    Questions.getDailyByID(answer["Question_ID"], function (err, question) {
        if (question === undefined || question === null) {
            constant.logger.log({
                meta: "00",
                level: 'error',
                username: user_id,
                function: "tagAnswer",
                message: "The question type is unknown"
            });
            callback();
            return;
        }

        let type = question.Type;
        let concept_name = constant.Qid_to_conceptName[answer["Question_ID"]];

        switch (type) {
            case "Multiple":
            case "MultiplePicture":
            case "Picture":
            case "Single":
                let answerArr = answer["Answers_ID"].map(function (answer_id) {
                    for (let i = 0, len = question.Choices.length; i < len; i++) {
                        if (question.Choices[i].ID === answer_id) {
                            return question.Choices[i].Answer;
                        }
                    }
                });
                var counter = 0;
                var valid_time = new Date();
                answerArr.forEach(function (answer_value) {
                    // should be counter of seconds and enter the valid time with counter++
                    let t = new Date(valid_time.getTime() + counter * 60000);
                    concepts.addRawData(constant.PRIMITIVE_PREFIX + concept_name, user_id,
                        t, t, -1, -1, answer_value, callback);
                    counter++;
                });
                break;

            case "Range":
            case "RangeFace":
            case "RangeFace_inv":
                let the_answer = answer["Answers_ID"][0].toString();
                let t = new Date();
                concepts.addRawData(constant.PRIMITIVE_PREFIX + concept_name, user_id,
                    t, t, -1, -1, the_answer, callback);
                break;
            case "Instruction":
                break;
            default:
                constant.logger.log({
                    level: 'error',
                    message: 'What time is the testing at?'
                });
        }
    });
};

exports.tagPain = function (pain_level, user_id, callback = () => { }) {
    concepts.addRawData(constant.PAIN_PREFIX, user_id,
        new Date(), new Date(), -1, -1, pain_level, callback);
};

exports.preProcessing = function () {
    throw "not implemented yet";
};
exports.hashElement = function (element) {
    return crypto.createHash('sha256').update(element).digest('base64');
};


var getMessage = function (projectId = 30, patientsIdArr, concept, contextFlag = 9) {
    let patients = "";
    for (let i = 0; i < patientsIdArr.length - 1; i++) {
        patients += patientsIdArr[i] + ","
    }
    patients += patientsIdArr[patientsIdArr.length - 1];
    return '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<s:Header />' +
        '<s:Body>' +
        '<CalculateAbstractionsInBatch xmlns="http://tempuri.org/">' +
        '<projectID>' + projectId + '</projectID>' +
        '<entityIds>' + patients + '</entityIds>' +
        '<concepts>' + concept + '</concepts>' +
        '<necessaryContexts />' +
        '<contextFlag>' + contextFlag + '</contextFlag>' +
        '</CalculateAbstractionsInBatch>' +
        '</s:Body>' +
        '</s:Envelope>';
};


calcAllConcepts = exports.calcAllConcepts = function () {
    console.log("senity");
    var BasicHttpBinding = require('wcf.js').BasicHttpBinding
        , Proxy = require('wcf.js').Proxy
        , binding = new BasicHttpBinding()
        , proxy = new Proxy(binding, "http://medinfo2.ise.bgu.ac.il/MediatorNewTAK/DataDrivenAPI/DataDrivenAPI.svc")
        , message = getMessage(30, [1, 2], 200, 9);

    proxy.send(message, "http://tempuri.org/IQueryDrivenAPI/CalculateAbstractionsInBatch", function (response, ctx) {
        console.log(response)
    });
};








