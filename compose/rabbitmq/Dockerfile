FROM rabbitmq:3.13.5-alpine

ADD ./certs /etc/rabbitmq/certs
#ADD ./conf/rabbitmq.conf /etc/rabbitmq/rabbitmq.conf

COPY ./rabbitmq.conf /etc/rabbitmq/rabbitmq.conf

# Change ownership to rabbitmq user
RUN chown rabbitmq:rabbitmq /etc/rabbitmq/rabbitmq.conf


