import torch
import torch.nn as nn

def init_weights(m):
        if isinstance(m, nn.Linear):
            torch.nn.init.xavier_uniform_(m.weight)
            m.bias.data.fill_(0.01)

class BotModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, num_layers):
        super(BotModel, self).__init__()
        self.num_layers = num_layers
        self.input_layer = nn.Sequential(nn.Linear(input_dim, hidden_dim), nn.LeakyReLU())
        if num_layers!=0:
            layers = [nn.Linear(hidden_dim, hidden_dim) if (i)%2==0 else nn.LeakyReLU() for i in range(num_layers)]
            self.hidden_layer = nn.ModuleList(layers)

            for f in self.hidden_layer:
                f.apply(init_weights)

        self.final_layer = nn.Linear(hidden_dim, output_dim)
        self.input_layer.apply(init_weights)

        self.final_layer.apply(init_weights)

    def forward(self, x):
        y = self.input_layer(x)
        if self.num_layers!=0:
            for f in self.hidden_layer:
                y = f(y)
        y = self.final_layer(y)
        # y = self.final_layer(y)
        return y

class RNNModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, n_layers, output_dim):
        super(RNNModel, self).__init__()

        self.hidden_dim = hidden_dim
        self.n_layers = n_layers
        if(n_layers<3):
            n_layers=3

        self.block1 = nn.RNN(input_dim, hidden_dim, int(n_layers/3), batch_first=True)
        self.block2 = nn.RNN(hidden_dim, hidden_dim*2, int(n_layers/3), batch_first=True)
        self.block3 = nn.RNN(hidden_dim*2, hidden_dim, int(n_layers/3), batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        batch_size = x.size(0)
        h0 = torch.zeros(self.n_layers, batch_size, self.hidden_dim)
        print(h0.shape)
        y1, h1 = self.block1(x, h0)
        y2, h2 = self.block2(y1, h1)
        y3, _ = self.block3(y2, h2)
        y3 = y3.contiguous().view(-1, self.hidden_dim)
        y = self.fc(y3)

        return y