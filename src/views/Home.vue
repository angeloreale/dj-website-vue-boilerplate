<template lang="pug">
  main
    .hp
      section.hp__logo
        img(:src='logoImage')

      section.hp__socials
        a(:href='instagramURL', target='_blank', rel='noreferrer noopener')
          img(src='../assets/instagram.svg')
        a(:href='soundcloudURL', target='_blank', rel='noreferrer noopener')
          img(src='../assets/soundcloud.svg')
        a(:href='spotifyURL', target='_blank', rel='noreferrer noopener')
          img(src='../assets/spotify.svg')
        a(:href='youtubeURL', target='_blank', rel='noreferrer noopener')
          img(src='../assets/youtube.svg')

      section.hp__live.hp__box(v-if="liveStreaming && liveStreaming.data && liveStreaming.data.length > 0")
        h1.hp__live__title.hp__box__title="Now Live"
        div(style="position:relative;padding-top:56.25%;")
          iframe(:src="twitchEmbedURL",  frameborder="0", scrolling="no", allowfullscreen="true", style="position:absolute;top:0;left:0;width:100%;height:100%;")

      section.hp__about.hp__box
        h1.hp__about__title.hp__box__title="About"
          p.hp__about__text.hp__box__text="{{aboutCopy}}"

      section.hp__sounds.hp__box
        h1.hp__sounds__title.hp__box__title="Latest Sounds"
        iframe(width="100%", height="450", scrolling="no", frameborder="no", allow="autoplay", :src="soundcloudEmbedURL")

      section.hp_streams.hp__box(v-if="!liveStreaming && !liveStreaming.data || liveStreaming.data.length === 0")
        h1.hp__live__title.hp__box__title="Latest Streams"
        div(style="position:relative;padding-top:56.25%;")
          iframe(:src="youtubeEmbedURL", frameborder="0", allowfullscreen, style="position:absolute;top:0;left:0;width:100%;height:100%;")

      section.hp__insta.hp__box(v-if="instagramData && instagramData.length > 0")
        h1.hp__insta__title.hp__box__title="Instagram"
        .hp__insta__grid
          .hp__insta__grid__image--container(v-for="image in instagramData")
            a.hp__insta__grid__image--link(:href="image.link", target="_blank", rel="noreferrer noopener")
              .hp__insta__grid__image--overlay
                .hp__insta__grid__image--overlay--text="{{image.text}}"
              img.hp__insta__grid__image(:src="image.image")

      section.hp__bookings.hp__box(v-if="bookingsData.length > 0")
        h1.hp__bookings__title.hp__box__title="Next Dates"
        .hp__bookings__year(v-for="year in bookingsData")="{{Object.keys(year)[0]}}"
          a.hp__bookings__item(v-for="booking in year[Object.keys(year)[0]]", target="_blank", rel="noreferrer noopener", :href="booking.link", :is="booking.link?'a':'span'")
            span.hp__bookings__item__date="{{parsedDate(booking.date)}}"
            span.hp__bookings__item__details
              span.hp__bookings__item__details__country="({{booking.country}} -"
              span.hp__bookings__item__details__city="  {{booking.city}})"
              span.hp__bookings__item__details__project=" - {{booking.project}}"
              span.hp__bookings__item__details__project=" - {{booking.format}}"

      section.hp__contact.hp__box
        h1.hp__contact__title.hp__box__title="Bookings"
        img.hp__contact__details(:src="contactImage" alt="Contact details")
    .hp__bg
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data: function () {
    return {
      sessionToken: String
    }
  },
  computed: {
    // data fetching
    bookingsData () {
      return this.$store.state.bookingsData
    },
    liveStreaming () {
      return this.$store.state.liveStreaming
    },
    instagramData () {
      return this.$store.state.instagram
    },

    // images
    logoImage () {
      return require(`../assets/${process.env.VUE_APP_IMAGE_LOGO}`)
    },
    contactImage () {
      return require(`../assets/${process.env.VUE_APP_IMAGE_CONTACT}`)
    },

    // social links + user specific info
    instagramURL () {
      return `https://instagram.com/${process.env.VUE_APP_INSTAGRAM_HANDLE}`
    },
    soundcloudURL () {
      return `https://soundcloud.com/${process.env.VUE_APP_SOUNDCLOUD_USER}`
    },
    spotifyURL () {
      return process.env.VUE_APP_SPOTIFY_LINK
    },
    youtubeURL () {
      return process.env.VUE_APP_YOUTUBE_LINK
    },
    twitchEmbedURL () {
      return `https://player.twitch.tv/?channel=${process.env.VUE_APP_TWITCH_USER}`
    },
    aboutCopy () {
      return process.env.VUE_APP_ABOUT
    },
    soundcloudEmbedURL () {
      return process.env.VUE_APP_SOUNDCLOUD_EMBED
    },
    youtubeEmbedURL () {
      return process.env.VUE_APP_YOUTUBE_EMBED
    }
  },
  mounted () {
    this.$store.dispatch('fetchBookingsData')
    this.$store.dispatch('fetchLiveStreamingData')
    this.$store.dispatch('fetchInstagramData')
    setInterval(() => {
      this.$store.dispatch('fetchLiveStreamingData')
    }, 5000)
  },
  methods: {
    parsedDate (date) {
      let month = date.substr(5, 2)
      let day = date.substr(8, 2)
      let parsed = `${day}/${month}`
      return parsed
    }
  }
}
</script>

<style lang="scss">
.hp {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 960px;
  margin: 0 auto;

  &__bg {
    background-image: url('../assets/#{$HP_BG}');
    background-size: cover;
    background-position: center center;
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    z-index: -1;
    position: fixed;
  }

  &__logo {
    margin-top: 10em;
    max-height: 300px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    img  {
      max-width: 100%;
    }

    @include sm {
      margin-top: 3em;
    }

  }

  &__socials {
    display: flex;
    justify-content: center;
    a {
      margin: 0 1em;
      width: 50px;
      height: 50px;
      background-color: #f9f9f9;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 60%;
      }
    }
  }

  a {
    text-decoration: none !important;
  }

  &__box {
    background-color: #f9f9f9;
    width: 100%;
    box-sizing: border-box;
    margin: 5em auto;
    font-family: $font-main;
    padding: 3em;
    letter-spacing: 4px;
    @include sm {
      font-size: 12px;
    }

    &__title {
      margin-bottom: 2em;
    }

    &__text {
      font-size: 16px;
      line-height: 32px;
      font-weight: normal;
    }
  }

  &__bookings {
    &__year {
      margin: 2em 0;
      display: block;
    }

    &__item {
      padding: 1.5em 0;
      display: flex;
      &__date {
        background-color: #333333;
        padding: 1em;
        color: #f9f9f9;
        font-weight: 900;
        letter-spacing: 4px;
        margin-right: 1em;
        min-width: 8em;
        display: flex;
        align-items: center;
        justify-content: center;

        @include sm {
          min-width: 4em;
        }
      }

      &__details {
        color: #333333;
        padding: 1em;
        font-weight: 900;
        letter-spacing: 2px;
        transition: all .8s;
        text-align: left;
        line-height: 2em;

        &:hover {
          color: #f3f3f3;
          background-color: #333333;
          transition: all .8s;
        }
      }
    }
  }

  &__contact {
    &__details {
      max-width: 350px;
      width: 100%;
    }
  }

  &__insta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &__grid {
      display: grid;
      grid-template-columns: minmax(50px, 33%) minmax(50px, 33%) minmax(50px, 33%);
      grid-gap: 20px;
      &__image {
        width: 100%;
        height: auto;
        &--container {
          max-height: 100%;
          max-width: 100%;
          overflow: hidden;
          position: relative;
        }
        &--overlay {
          opacity: 0;
          transition: all .8s;
          z-index: 1;
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          &--text {
            padding: 2em;

            @include sm {
              display: none;
            }
          }

          &:hover {
            opacity: .6;
            background-color: #333333;
            color: #f9f9f9;
            transition: all .8s;
          }
        }
      }
    }
  }
}
</style>
