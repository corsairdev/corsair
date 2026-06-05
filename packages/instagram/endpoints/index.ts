import * as Profile from "./profile";
import * as Media from "./media";
import * as Image from "./image";
import * as Reel from "./reel";
import * as Publish from "./publish_content"
import * as Video from "./video";
import * as Carousel from "./carousel"

export const ProfileEndpoints = {
    GetFacebookUser: Profile.facebookProfile,
    GetFacebookPages: Profile.getFacebookPages,
    GetInstagramUser: Profile.getInstagramUser,
    insights: Profile.insights
}

export const MediaEndpoints = {
    list: Media.list,
    get: Media.get,
    status: Media.status,
    insights: Media.insights,
}

export const ImageEndpoints = {
    post: Image.post,
    story: Image.story,
}

export const ReelEndpoints = {
    post: Reel.post,
}

export const PublishEndpoints = {
    publish: Publish.publish,
}

export const VideoEndponts = {
    story: Video.story,
    createCarouselContainer: Video.createCarouselContainer,
}

export const CarouselEndpoints = {
    post: Carousel.post,
}