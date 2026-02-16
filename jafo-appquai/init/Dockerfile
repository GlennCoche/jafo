FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY init.sh /init.sh
RUN chmod +x /init.sh
ENTRYPOINT ["/init.sh"]
