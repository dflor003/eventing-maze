FROM node:5.3

# Environment variables
ENV EVTMAZE_PORT "3001"

# Copy over to its destination
COPY . /opt/event-maze

# Setup the project
WORKDIR /opt/event-maze
RUN npm run setup

# Main command
EXPOSE 3001
CMD npm start