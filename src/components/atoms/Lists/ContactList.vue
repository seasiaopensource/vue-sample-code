<template lang="html">
  <ul class="contact-list">
    <li
      v-for="(list, key) in lists"
      :key="key"
      class="contact-list__element">
      <headline-text
        :name="list.title"
        size="h4"
        fontWeight="regular" />
      <p
        v-if="list.identifier === 'website'"
        v-html="fetchLink(list)"/>
      <nl2br
        v-else
        :text="list.content"
        tag="p" />
    </li>
  </ul>
</template>
<script>
import Nl2br from 'vue-nl2br'
import Anchorme from 'anchorme'
import sanitizeHtml from 'sanitize-html'
export default {
  components: {
    Nl2br
  },
  props: {
    lists: {
      type: Array
    }
  },
  methods: {
    fetchLink (list) {
      return sanitizeHtml(
        Anchorme(list.content, {
          attributes: [{
            'name': 'target',
            'value': '_blank'
          }]
        }),
        {
          allowedTags: [ 'a' ],
          allowedAttributes: {
            'a': [ 'href', 'target' ]
          }
        }
      )
    }
  }
}
</script>
<style lang="sass" scoped>
.contact-list
  margin: 0
  padding: 0
  list-style: none

  &__element
    border-top: 1px solid $color-border
    padding: $box-padding

    +xs\-
      padding: $box-padding-xs
    p
      margin: 0
      /deep/ a
        color: $font-regular-color
        &:hover
          text-decoration: underline

</style>
