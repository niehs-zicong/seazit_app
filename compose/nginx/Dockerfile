FROM nginx:1.25.5-alpine

RUN apk --no-cache upgrade && \
    apk add --no-cache curl = 8.9.0
    
ADD ./ssl /etc/nginx/ssl
ADD ./conf/.htpasswd /etc/nginx/.htpasswd
ADD ./conf/nginx.conf /etc/nginx/nginx.conf


