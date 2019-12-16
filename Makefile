# Build configuration
APPLICATION_NAME = loftly-core
export APPLICATION_NAME

# Get branch name
CURRENT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD | awk '{ sub("/", "-"); print }')

# Get today's date
DATE_TODAY = $(shell date +%F.%H%M%S)

# Construct Docker image tag
DEFAULT_IMAGE_TAG = 794167933507.dkr.ecr.us-west-2.amazonaws.com/$(APPLICATION_NAME):$(CURRENT_BRANCH)-$(DATE_TODAY)
export DEFAULT_IMAGE_TAG

check-tag:
	@echo $(DEFAULT_IMAGE_TAG)

docker-image-build:
	@docker build --no-cache -t $(DEFAULT_IMAGE_TAG) .
	@echo "$(DEFAULT_IMAGE_TAG)" > .lastimage

docker-image: docker-image-build
	@docker push `cat .lastimage`