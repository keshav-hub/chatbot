from flask import Flask, render_template, request, jsonify
from werkzeug.datastructures import Accept
from infer import talk_my_bot
from train import train_my_bot

app = Flask(__name__)
chatbot = talk_my_bot()
trainbot = train_my_bot()

# @app.route('/', methods=["GET"])
# def home():
#     return render_template("home.html")

@app.route('/train', methods=['POST'])
def training():
    id = request.get_json().get("id")
    data = request.get_json().get("data")
    hyperparams = request.get_json().get("hyperparams")
    print(id)
    # print(type(hyperparams['BatchSize']))
    # try:     
    trainbot.train( id, data, hyperparams)
    return "Training Finished....Model Saved Successfully!"
    # except:
    #     return "failed"

@app.route('/instantiate', methods=["POST"])
def instantiate():
    id= request.get_json().get("id")
    hyperparams = request.get_json().get("hyperparams")
    dataset = request.get_json().get("data")
    print(id)
    try:
        chatbot.prepare_to_chat(id, dataset, hyperparams)
        return "Model Loaded Succefully!"
    except:
        return "failed"

@app.route('/predict', methods=["POST"])
def predict():
    msg = request.get_json().get("message")
    print(msg, type(msg))
    reply = chatbot.chat(msg)
    text = jsonify({"response": reply})
    print(text)
    return text

if __name__ == "__main__":
    app.run(debug=True)