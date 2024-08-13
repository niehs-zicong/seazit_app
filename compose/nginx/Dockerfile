FROM nginx:1.25.5-alpine

RUN apk --no-cache upgrade && \
    if ! apk info -e curl=8.9.0-r0; then \
        apk add --no-cache curl=8.9.0; \
    else \
        echo "curl 8.9.0 is already installed"; \
    fi

ADD ./ssl /etc/nginx/ssl
ADD ./conf/.htpasswd /etc/nginx/.htpasswd
ADD ./conf/nginx.conf /etc/nginx/nginx.conf

