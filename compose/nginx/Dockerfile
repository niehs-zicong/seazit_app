FROM nginx:1.25.5-alpine

RUN apk --no-cache upgrade && \
    # Install curl without specifying the version
    apk add --no-cache curl

# Add SSL certificates and .htpasswd file
ADD ./ssl /etc/nginx/ssl
ADD ./conf/.htpasswd /etc/nginx/.htpasswd
ADD ./conf/nginx.conf /etc/nginx/nginx.conf