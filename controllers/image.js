const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 48d7983110e448a2a47f6aa43ff7b988");

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
        user_app_id: {
          "user_id": "clarifai",
          "app_id": "main"
        },
        model_id: "face-detection",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }
        res.json(response)
    }
);
}


const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json("Unable to get entries");
    });
};

module.exports = {
  handleImage,
  handleApiCall
};
