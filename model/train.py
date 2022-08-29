import json
import os

# from torch._C import dtype
from model import BotModel
from nltk_utils import bag_of_words, tokenize, stem

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

def seed_everything(seed):
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True

seed_everything(42)

class ChatBotDataset(Dataset):
    def __init__(self, X_TRAIN, Y_TRAIN):
        self.num_samples = len(X_TRAIN)
        self.X = X_TRAIN
        self.y = Y_TRAIN

    def __getitem__(self, idx):
        return (self.X[idx], self.y[idx])

    def __len__(self):
        return self.num_samples

class train_my_bot(object):
    BATCH_SIZE = None
    LR = None
    N_EPOCHS = None
    HIDDEN_DIM = None
    N_LAYERS = None
    OUTPUT_DIM = None
    INPUT_DIM = None
    model = None
    X_TRAIN = None
    Y_TRAIN = None

    def initialize_hyperparams(bot, params):
        # with open(param_file, 'r') as f:
            # params = json.load(f)

        bot.BATCH_SIZE = params["BatchSize"]
        bot.LR = params["LearningRate"]
        bot.N_EPOCHS = params["NumberOfEpochs"]
        bot.HIDDEN_DIM = params["NeuronsInHiddenLayer"]
        bot.N_LAYERS = params["DepthOfModel"]
        bot.OUTPUT_DIM = len(bot.tags)
        bot.INPUT_DIM = len(bot.X_TRAIN[0])
        if bot.model==None:
            bot.model = BotModel(bot.INPUT_DIM, bot.HIDDEN_DIM, bot.OUTPUT_DIM, bot.N_LAYERS)
        print("Model Loaded")
        return bot.model

    def prepare_data(bot, data_file):
        # with open(data_file, 'r') as f:
            # train_file = json.load(f)
        word_dict = []
        tags = []
        label = []
        for tag in data_file:
            # tag = info['tag']
            tags.append(tag)
            for pattern in data_file[tag]['patterns']:
                words = tokenize(pattern)
                word_dict.extend(words)
                label.append((words, tag))
        remove_chars = ['?', '!', '.']
        word_dict = sorted(set([stem(word) for word in word_dict if word not in remove_chars]))
        tags = sorted(set(tags))
        # print(tags)
        X_train = []
        Y_train = []
        # print(label)
        for pattern, tag in label:
            # print(pattern, tag)
            # print('-'*100)
            bow = bag_of_words(pattern, word_dict)
            
            X_train.append(bow)
            Y_train.append(tags.index(tag))

        X_train = np.array(X_train)
        Y_train = np.array(Y_train)
        # print(X_train)
        # print(Y_train)
        return (X_train, Y_train, tags, word_dict)

    
    def train(bot, userID, data, param):
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        

        bot.X_TRAIN, bot.Y_TRAIN, bot.tags, word_dict = bot.prepare_data(data)
        dataset = ChatBotDataset(bot.X_TRAIN, bot.Y_TRAIN)
        
        bot.model = bot.initialize_hyperparams(param).to(device)
        # print(bot.BATCH_SIZE,'************************************************')
        train_loader = DataLoader(dataset, batch_size=bot.BATCH_SIZE, shuffle=True)

        criterion = nn.CrossEntropyLoss()
        
        optimizer = torch.optim.Adam(bot.model.parameters(), lr=bot.LR, weight_decay=0.01)
        # scheduler = torch.optim.lr_scheduler.CyclicLR(optimizer, LR, 1e-3)

        avg_loss = 0
        count = 0
        print('starting training')
        torch.autograd.set_detect_anomaly(True)
        for epoch in range(bot.N_EPOCHS):
            for word, label in train_loader:
                optimizer.zero_grad()
                word = word.to(device)
                label = label.to(device, dtype=torch.long)

                output = bot.model(word)

                # print(label.shape)
                # print(word.shape)
                # print(output.shape)
                # print(label)
                loss = criterion(output, label)
                optimizer.zero_grad()

                loss.backward(retain_graph = True)
                optimizer.step()
                # scheduler.step()
                avg_loss += loss.item()
                count +=1

            if (epoch+1)%100==0:
                print(f'Epoch {epoch+1}/{bot.N_EPOCHS} \t Average loss={avg_loss/count:.4f}')
        print(f'Final Average loss:{avg_loss/count:.4f} \t Final loss:{loss.item():.4f}')

        save_model = {"model_state": bot.model.state_dict(),
                        "Input Dim": bot.INPUT_DIM,
                        "Output Dim": bot.OUTPUT_DIM,
                        "Word Dictionary": word_dict,
                        "Tags": bot.tags,
                        "Final Loss": loss.item()}

        torch.save(save_model, "Model Weights/"+userID+".pth")