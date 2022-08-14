FROM node
RUN mkdir -p /opt/dice-game-api
WORKDIR /opt/dice-game-api
COPY . .
RUN yarn install --production
# todo Remove later for production
RUN wget https://github.com/vim/vim/archive/master.zip && \
apt install unzip && \ 
unzip master.zip && \
cd vim-master && \
cd src/ && \
./configure && \
make && \
make install && \
echo "alias vi=vim" >> ~/.bashrc && \
cd /opt/dice-game-api/  
EXPOSE 3000