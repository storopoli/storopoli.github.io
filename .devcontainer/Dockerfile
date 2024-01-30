FROM cgr.dev/chainguard/wolfi-base

# Install the required packages
RUN apk update && apk add build-base git openssh go-1.20 hugo

# Get all the submodules
RUN git submodule update --init --recursive

EXPOSE 1313

USER nonroot
