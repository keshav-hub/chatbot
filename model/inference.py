import random
import json

import torch
import torch.nn as nn
from nltk_utils import tokenize, bag_of_words
from model import BotModel

with open('Dataset\intent.json', 'r') as f:
    train_file = json.load(f)
with open('hyperparams.json', 'r') as f:
    params = json.load(f)
saved_weights = "Model Weights/weight1.pth"
weight = torch.load(saved_weights)

INPUT_DIM = weight["Input Dim"]
OUTPUT_DIM = weight["Output Dim"]
HIDDEN_DIM = params["NeuronsInHiddenLayer"]
N_LAYERS = params["DepthOfModel"]
word_dict = weight["Word Dictionary"]
tags = weight["Tags"]
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = BotModel(INPUT_DIM, HIDDEN_DIM, OUTPUT_DIM, N_LAYERS).to(device)
model.load_state_dict(weight["model_state"])
model.eval()

intentions = train_file['intents']
for intent in intentions:
    if intent["tag"] == "goodbye":
        bye_response = intent["responses"]
        break
default_choice = ["I apologize, but I don't understand your request.",
                    "I'm sorry my AI does not recognize that request.",
                    "I don't understand.",
                    "Please try your request again.",
                    "Pardon?",
                    "That's new for me.",
                    "I'm sorry but I'm still learning."]

print("Say 'bye' to exit:")
break_loop = False
while True:
    query = input('You: ')
    if query=='bye':
        print(f'J.A.R.V.I.S: {random.choice(bye_response)}')
        break

    x = tokenize(query)
    x = bag_of_words(x, word_dict)
    x = x.reshape(1, x.shape[0])
    x = torch.from_numpy(x)

    output = model(x)
    _, idx = torch.max(output, dim=1)
    tag = tags[idx.item()]

    prob = torch.softmax(output, dim=1)
    prob = prob[0][idx.item()]
    if prob>0.77:
        for intent in intentions:
            if tag==intent["tag"]:
                print(f'J.A.R.V.I.S: {random.choice(intent["responses"])}')
                if tag == "goodbye":
                    break_loop = True
                    break
    else:
        print(f'J.A.R.V.I.S: {random.choice(default_choice)}')

    if break_loop:
        break
