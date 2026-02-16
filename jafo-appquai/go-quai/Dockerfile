# Build stage: clone and build go-quai (mainnet)
FROM golang:1.23-alpine AS builder
RUN apk --no-cache add make gcc musl-dev git
WORKDIR /app

# Clone go-quai and build (use main for latest; or replace with a release tag)
ARG GO_QUAI_REV=main
RUN git clone --depth 1 --branch "$GO_QUAI_REV" https://github.com/dominant-strategies/go-quai . \
  || (git clone https://github.com/dominant-strategies/go-quai . && git checkout "$GO_QUAI_REV")

# Optional: apply same protocol_params change as official Dockerfile (for local/tests)
RUN if [ -f params/protocol_params.go ]; then \
  sed -i 's/TimeToStartTx[[:space:]]*uint64[[:space:]]*=[[:space:]]*15 \* BlocksPerDay/TimeToStartTx uint64 = 0/' params/protocol_params.go || true; \
  fi

RUN go mod download
RUN make go-quai

# Runtime stage
FROM alpine:latest
RUN apk update && apk add --no-cache \
  ca-certificates \
  curl \
  jq

WORKDIR /root

COPY --from=builder /app/build/bin/go-quai ./build/bin/go-quai
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./build/bin/go-quai ./entrypoint.sh

# RPC/WS ports (documented) + Stratum SHA-256 + API
EXPOSE 3333 3336 8001 8002 8003 8004 8200 8201 8202 8220 8221 8222 8240 8241 8242 9001 9002 9003 9004 9200 9201 9202 9220 9221 9222 9240 9241 9242

ENV DATA_DIR=/data
ENV CONFIG_DIR=/config

ENTRYPOINT ["./entrypoint.sh"]
